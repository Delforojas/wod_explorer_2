#!/usr/bin/env python3
"""In-memory development phase controller. Never executes Markdown or publishes.

CLI receives one session/batch on stdin. Library callers retain the object across
turns. Guard decisions/external observations come from the trusted workflow;
this module checks gates, provenance references and freshness, not semantics.
"""
import argparse
from copy import deepcopy
from datetime import datetime, timezone
import importlib
import inspect
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
from evidence_manager import EvidenceManager, EvidenceError, EvidenceValidationError, using_evidence, register_result
from existing_content_validation import NOT_APPLICABLE_PHASES, validate_not_applicable_manifest


GUARDS = {1: 'issue', 2: 'context', 3: 'branch', 4: 'sdd', 5: 'planning',
          6: 'implementation', 7: 'verification', 8: 'verification', 9: 'change-review',
          10: 'commit', 11: 'post-commit', 12: 'github-documentation',
          13: 'final-workflow', 14: 'manual-validation', 15: 'workflow-handoff'}
REQUIRED = {
    1: [('mutable', 'github_issue_observation')], 2: [('static', 'context')],
    3: [('static', 'canonical_base'), ('mutable', 'branch_check_evidence')],
    4: [('mutable', 'sdd_validation_evidence')], 5: [('mutable', 'sdd_validation_evidence')],
    6: [('mutable', 'implementation_evidence'), ('mutable', 'sdd_validation_evidence')],
    7: [('mutable', 'verification_evidence')],
    8: [('mutable', 'repair_evidence'), ('mutable', 'verification_evidence')],
    9: [('mutable', 'pre_stage_evidence'), ('mutable', 'verification_evidence')],
    10: [('mutable', 'commit_creation_evidence'), ('mutable', 'commit_check_evidence')],
    11: [('mutable', 'post_commit_evidence')], 12: [('mutable', 'github_documentation_evidence')],
    13: [('mutable', 'final_check_evidence'), ('mutable', 'verification_evidence'), ('mutable', 'final_verification_evidence')], 14: [('mutable', 'manual_validation_plan')],
    15: [('mutable', 'final_check_evidence'), ('mutable', 'manual_validation_plan')],
}
ALLOWED = {
    3: {'git_policy.inspect', 'git_policy.validate_base', 'git_policy.prepare_branch', 'git_policy.check_branch'},
    4: {'sdd_manager.inspect', 'sdd_manager.prepare'}, 5: {'sdd_manager.inspect'}, 6: {'sdd_manager.inspect'},
    7: {'verification_runner.discover', 'verification_runner.build_selection', 'verification_runner.run_checks'},
    8: {'verification_runner.discover', 'verification_runner.build_selection', 'verification_runner.run_checks',
        'sdd_manager.inspect'},
    9: {'git_policy.review_changes', 'git_policy.propose_preexisting_adoption',
        'git_policy.validate_preexisting_adoption'},
    10: {'git_policy.prepare_staging', 'git_policy.pre_commit_check', 'git_policy.create_commit', 'git_policy.check_commit'},
    11: {'git_policy.post_check_commit'}, 13: {'git_policy.final_check', 'sdd_manager.inspect', 'verification_runner.project_final'},
}
EXTERNAL = {'github_issue_observation', 'implementation_evidence', 'repair_evidence',
             'github_documentation_evidence', 'manual_validation_plan', 'no_change_documentation_evidence'}
COMMIT_STEPS = ['git_policy.prepare_staging', 'git_policy.pre_commit_check',
                'git_policy.create_commit', 'git_policy.check_commit']
COMMIT_INPUTS = ['pre_stage_evidence', 'staging_preparation_evidence', 'pre_commit_evidence', 'commit_creation_evidence']
EXISTING_CONTENT_PROFILE = 'existing-content-validation'


class WorkflowController:
    def __init__(self, issue, repository, workflow_id):
        self.evidence = EvidenceManager(issue, repository, workflow_id)
        if self.evidence.repository is None:
            raise EvidenceError('Controller requires a repository identity')
        self.phase = 0
        self.status = 'RUNNING'
        self.guards = {}
        self.history = []
        self.commit_step = 0
        self.commit_created = False
        self.commit_outcome_unknown = False
        self.repair_cycle = 0
        self.forbidden_action = False
        self.handed_off = False
        self.blockers = {}
        self.profile = 'ordinary'
        self.profile_authorization = None
        self.outcome = None

    def snapshot(self):
        return {'workflow': {'issue': self.evidence.issue, 'repository': self.evidence.repository,
                'workflow_id': self.evidence.workflow_id, 'phase': self.phase, 'status': self.status,
                'history': deepcopy(self.history), 'guards': deepcopy(self.guards),
                'commit_step': self.commit_step, 'commit_created': self.commit_created,
                'commit_outcome_unknown': self.commit_outcome_unknown, 'repair_cycle': self.repair_cycle, 'blockers': deepcopy(self.blockers),
                'manual_validation': 'pending', 'finish_issue': 'not_executed_by_controller',
                'profile': self.profile, 'profile_authorization': deepcopy(self.profile_authorization),
                'outcome': self.outcome},
                **self.evidence.snapshot()}

    def select_profile(self, profile, authorization):
        """Select the opt-in no-change route before the workflow begins."""
        if self.phase != 0 or self.history or self.profile != 'ordinary':
            raise EvidenceError('Profile selection is allowed only before the workflow starts')
        if profile != EXISTING_CONTENT_PROFILE or not isinstance(authorization, dict):
            raise EvidenceError('Unknown or unauthorized workflow profile')
        if (authorization.get('profile') != profile or authorization.get('authorized') is not True
                or authorization.get('source') != 'user' or not str(authorization.get('reason', '')).strip()):
            raise EvidenceError('Existing-content validation requires explicit authorization and reason')
        self.profile = profile
        self.profile_authorization = deepcopy(authorization)
        return {'status': 'PASS', 'profile': profile}

    def record_external(self, key, payload, *, topics=None):
        if key not in EXTERNAL or payload.get('phase') != self.phase:
            raise EvidenceError('External evidence is not allowed for this phase/key')
        expected = {1: {'github_issue_observation'}, 6: {'implementation_evidence'}, 8: {'repair_evidence'},
                    12: {'github_documentation_evidence'}, 14: {'manual_validation_plan', 'no_change_documentation_evidence'}}
        if key not in expected.get(self.phase, set()):
            raise EvidenceError('Cannot inject evidence for a future or unrelated phase')
        if key == 'manual_validation_plan':
            if payload.get('manual_status') != 'pending' or not payload.get('checks') or any(
                check.get('status') != 'pending' for check in payload['checks']
            ):
                raise EvidenceError('Manual validation must remain pending')
        if key == 'no_change_documentation_evidence':
            required = {'outcome': 'NO_CHANGES', 'issue_state': 'open', 'manual_validation': 'pending'}
            if any(payload.get(field) != value for field, value in required.items()) or payload.get('branch') is not None \
                    or payload.get('commit') is not None or payload.get('publication') is not None \
                    or not isinstance(payload.get('summary'), str) or not payload['summary'].strip():
                raise EvidenceError('No-change documentation must truthfully report an open Issue, pending manual validation, and no branch, commit, or publication')
        default_topics = {'github_issue_observation': ['github', 'scope'],
                          'github_documentation_evidence': ['github', 'final', 'scope'],
                          'implementation_evidence': ['working_tree', 'scope'],
                           'repair_evidence': ['working_tree', 'scope'],
                           'manual_validation_plan': ['scope'],
                           'no_change_documentation_evidence': ['final', 'github', 'scope']}
        return self.evidence.record(key, payload, topics=sorted(set(default_topics[key]) | set(topics or [])))

    def record_not_applicable_manifest(self, manifest):
        """Bind every skipped profile operation to already-current evidence before routing."""
        if self.profile != EXISTING_CONTENT_PROFILE or self.phase != 2:
            raise EvidenceError('Non-applicability manifests are only allowed for the selected profile at phase 2')
        valid, error = validate_not_applicable_manifest(manifest)
        if not valid:
            raise EvidenceError(error or 'Invalid non-applicability manifest')
        for item in manifest:
            for reference in item['evidence']:
                self.evidence.resolve(reference, require_verified=True)
        payload = {'source': 'workflow-controller', 'phase': 2, 'issue': self.evidence.issue,
                   'repository': self.evidence.repository, 'workflow_id': self.evidence.workflow_id,
                   'status': 'PASS', 'observed_at': datetime.now(timezone.utc).isoformat(), 'manifest': deepcopy(manifest)}
        return self.evidence.record('existing_content_not_applicable_manifest', payload,
                                    topics=['existing-content', 'scope'])

    def record_static(self, key, payload, kind, source, observed_at, status='PASS', paths=None):
        allowed = {1: {'issue_identity', 'approved_scope'}, 2: {'context_item', 'decisions', 'dependencies'},
                   3: {'canonical_base'}, 4: {'sdd_refs'}, 5: {'sdd_refs', 'decisions'},
                   7: {'verification_history'}, 8: {'verification_history'}, 10: {'accepted_commit'}}
        allowed_kinds = allowed.get(self.phase, set())
        if kind not in allowed_kinds:
            raise EvidenceValidationError(
                'Static evidence kind ' + repr(kind) + ' is not allowed at phase ' + str(self.phase)
                + '. Allowed kinds at this phase: '
                + (', '.join(sorted(allowed_kinds)) if allowed_kinds else 'none'))
        topics = {'context_item': ['instructions'], 'sdd_refs': ['sdd', 'scope'],
                  'verification_history': ['verification', 'scope', 'dependencies'],
                  'canonical_base': ['scope', 'instructions', 'dependencies']}.get(kind, ['scope'])
        return self.evidence.record(key, payload, category='static', kind=kind, source=source,
            phase=self.phase, status=status, observed_at=observed_at,
            topics=topics, paths=paths)

    def decide_guard(self, name, status, source, references, reason):
        if self.forbidden_action or self.handed_off:
            raise EvidenceError('The development session is closed or contains a forbidden action')
        expected_guard = 'existing-content-validation' if self.profile == EXISTING_CONTENT_PROFILE and self.phase == 13 else GUARDS.get(self.phase)
        if name != expected_guard and not (name == 'repair' and self.phase in (7, 8)):
            raise EvidenceError('Guard does not belong to the active phase')
        if (status not in ('PASS', 'BLOCK', 'FAIL', 'NEEDS_APPROVAL') or not reason.strip()
                or source != '.opencode/commands/guardarails/' + name + '.md' or not references):
            raise EvidenceError('Guard decision requires exact source, reason and evidence references')
        for reference in references:
            self.evidence.resolve(reference, require_verified=status == 'PASS' and name != 'repair')
        self.guards[(str(self.phase) + ':' + name)] = {
            'name': name, 'status': status, 'source': source, 'reason': reason,
            'references': deepcopy(references), 'phase': self.phase}
        self.status = 'RUNNING' if status == 'PASS' else 'BLOCKED'
        return deepcopy(self.guards[str(self.phase) + ':' + name])

    def _guard(self, name):
        guard = self.guards.get(str(self.phase) + ':' + name)
        if not guard or guard['status'] != 'PASS':
            raise EvidenceError('Missing passing guard: ' + name)
        for reference in guard['references']:
            self.evidence.resolve(reference, require_verified=name != 'repair')
        return guard

    def notify(self, event, source, paths=None):
        if not source:
            raise EvidenceError('An observed event source is required')
        if event in ('push', 'merge', 'close-issue', 'finish-issue', 'manual-approval'):
            self.forbidden_action = True
            self.status = 'BLOCKED'
            self.history.append({'phase': self.phase, 'status': 'BLOCK', 'forbidden_action': event, 'source': source})
            return {'status': 'BLOCK', 'reason': 'Outside the development workflow: ' + event}
        affected = self.evidence.invalidate(event, source=source, paths=paths)
        if self.handed_off and affected:
            self.status = 'BLOCKED'
        return {'status': 'PASS', 'invalidated': affected}

    def invoke(self, operation, arguments):
        operation = operation.replace('-', '_')
        if self.forbidden_action or self.handed_off:
            raise EvidenceError('Development workflow cannot continue')
        allowed = set(ALLOWED.get(self.phase, set()))
        if self.profile == EXISTING_CONTENT_PROFILE:
            allowed = {
                7: {'verification_runner.discover', 'verification_runner.build_selection', 'verification_runner.run_checks'},
                13: {'existing_content_validation.snapshot', 'existing_content_validation.validate'},
            }.get(self.phase, set())
        if operation not in allowed:
            raise EvidenceError('Operation is not allowed in the active phase')
        if Path.cwd().resolve() != Path(self.evidence.repository):
            raise EvidenceError('Invoke local harness operations from the session repository root')
        arguments = deepcopy(arguments)
        if 'issue' in arguments and arguments['issue'] != self.evidence.issue:
            raise EvidenceError('Operation belongs to another Issue')
        if 'workflow_id' in arguments and arguments['workflow_id'] != self.evidence.workflow_id:
            raise EvidenceError('Operation belongs to another workflow')
        if operation in COMMIT_STEPS:
            self.evidence.get('verification_evidence')
            if operation == 'git_policy.create_commit' and (self.commit_created or self.commit_outcome_unknown):
                raise EvidenceError('Another commit cannot be created after a created or uncertain commit outcome')
            if self.phase != 10 or self.commit_step >= len(COMMIT_STEPS) or COMMIT_STEPS[self.commit_step] != operation:
                raise EvidenceError('Commit operations must run once in the required order')
            self.evidence.get(COMMIT_INPUTS[self.commit_step])
        if operation == 'git_policy.prepare_branch':
            self.evidence.get('branch_evidence')
            self.evidence.get('canonical_base', 'static')
        if operation == 'sdd_manager.prepare':
            self.evidence.get('sdd_inspection_evidence')

            if 'evidence_path' in arguments:
                raise EvidenceError(
                    'sdd_manager.prepare: evidence_path is controller-managed'
                )

            arguments = {
                **arguments,
                'evidence_path': {
                    'evidence_ref': self.evidence.reference(
                        'sdd_inspection_evidence',
                        'mutable'
                    )
                }
            }

        if operation == 'verification_runner.run_checks':
            if arguments.get('phase', 7) != self.phase:
                raise EvidenceError('Runner phase does not match the workflow')
            if self.phase == 7:
                previous = self.evidence.mutable.get('verification_evidence')
                if previous and previous['valid'] and previous['status'] == 'FAIL':
                    raise EvidenceError('Failed verification requires the approved phase-8 repair route')
        if operation == 'existing_content_validation.validate':
            if 'baseline' in arguments or 'verification' in arguments:
                raise EvidenceError('Existing-content baseline and verification evidence are controller-managed')
            arguments = {
                **arguments,
                'baseline': self.evidence.get('existing_content_baseline')['payload'],
                'verification': self.evidence.get('verification_evidence')['payload'],
            }
        module, function = operation.split('.', 1)
        try:
            target = getattr(importlib.import_module(module), function)

            try:
                inspect.signature(target).bind(**arguments)
            except TypeError as error:
                raise EvidenceError(
                    f'{operation}: invalid arguments: {error}'
                ) from error

            with using_evidence(self.evidence):
                result = target(**arguments)

        except (EvidenceError, ValueError, TypeError, KeyError, AttributeError, OSError) as error:
            self.status = 'BLOCKED'
            if operation == 'git_policy.create_commit':
                self.commit_outcome_unknown = True
            self.blockers[operation] = {'phase': self.phase, 'status': 'ERROR', 'error': str(error)}
            self.history.append({'phase': self.phase, 'operation': operation, 'status': 'ERROR', 'error': str(error)})
            raise
        primary = next(iter(result.values()))
        status = primary.get('status')
        if operation == 'git_policy.create_commit':
            if primary.get('commit_created') is True:
                self.commit_created = True
            elif primary.get('commit_attempted') and primary.get('git_returncode') is None:
                self.commit_outcome_unknown = True
        self.history.append({'phase': self.phase, 'operation': operation, 'status': status})
        if status not in ('PASS', 'complete'):
            self.status = 'BLOCKED'
            self.blockers[operation] = {'phase': self.phase, 'status': status}
        else:
            self.blockers.pop(operation, None)
            if operation in COMMIT_STEPS:
                self.commit_step += 1
        return result

    def enter_repair(self):
        if self.forbidden_action or self.phase not in (7, 8):
            raise EvidenceError('Repair is only available after verification failures')
        failure = self.evidence.get('verification_evidence', require_verified=False)
        if failure['status'] not in ('FAIL', 'INCOMPLETE'):
            raise EvidenceError('No failed/incomplete verification to repair')
        guard = self._guard('repair')
        if not any(r['key'] == 'verification_evidence' for r in guard['references']):
            raise EvidenceError('Repair Guard must reference the observed verification failure')
        self.repair_cycle += 1
        self.history.append({'phase': self.phase, 'status': 'REPAIR_AUTHORIZED', 'guard': deepcopy(guard)})
        self.phase, self.status = 8, 'RUNNING'
        return {'status': 'PASS', 'phase': 8, 'repair_cycle': self.repair_cycle}

    def revisit_phase(self, target, reason):
        if (self.forbidden_action or self.handed_off or not isinstance(target, int)
                or target < 1 or target >= self.phase or target == 8 or not reason.strip()):
            raise EvidenceError('Revalidation must explicitly return to an earlier development phase')
        if (self.commit_step >= 3 or self.commit_created or self.commit_outcome_unknown) and target <= 10:
            raise EvidenceError('A real commit already exists; automatic commit/history replay is forbidden')
        self.history.append({'phase': self.phase, 'status': 'REVALIDATION_REQUESTED',
                        'target': target, 'reason': reason})
        self.guards = {key: value for key, value in self.guards.items() if value['phase'] < target}
        if target <= 10:
            self.commit_step = 0
        self.phase, self.status = target, 'RUNNING'
        return {'status': 'PASS', 'phase': target, 'reason': reason}

    def export_static(self, authorized=False):
        return self.evidence.export_static(authorized=authorized)

    def _capture_verified_history(self, guard):
        source = {'guard': guard['source']}
        if self.phase in (4, 5, 6):
            data = self.evidence.get('sdd_validation_evidence')['payload']
            folders = data.get('snapshot', {}).get('directories', [])
            if len(folders) == 1 and all(folders[0].get('files', {}).get(name, {}).get('sha256')
                                          for name in ('spec.md', 'plan.md', 'tasks.md')):
                projected = {'folder': folders[0]['path'],
                             'files': {name: folders[0]['files'][name]['sha256']
                                       for name in ('spec.md', 'plan.md', 'tasks.md')}}
                self.evidence.record('sdd', projected, category='static', kind='sdd_refs',
                    source={**source, 'observation': data['source']}, phase=self.phase, status='PASS',
                    observed_at=data['observed_at'], topics=['sdd', 'scope'])
        elif self.phase in (7, 8):
            data = self.evidence.get('verification_evidence')['payload']
            if data.get('source_fingerprint') and 'reports' in data:
                projected = {'checks': [report['id'] for report in data['reports']],
                    'source_fingerprint': data['source_fingerprint']['sha256'],
                    'content_sha256': data['source_fingerprint'].get('content_sha256'),
                    'logs': {report['id']: report.get('logs', {}) for report in data['reports']},
                    'results': [{key: report[key] for key in ('id', 'status', 'command', 'exit_code', 'duration_seconds')
                                 if key in report} for report in data['reports']]}
                self.evidence.record('verification_history', projected, category='static', kind='verification_history',
                    source={**source, 'observation': data['source']}, phase=self.phase, status='PASS',
                    observed_at=data['observed_at'], topics=['scope', 'instructions', 'dependencies'])
        elif self.phase == 11:
            data = self.evidence.get('post_commit_evidence')['payload']
            if data.get('range') and data.get('last_commit'):
                projected = {'sha': data['last_commit']['sha'], 'message': data['last_commit']['message'],
                    'branch': data['branch'], 'base_sha': data['base']['base_sha'],
                    'commits': data['range']['commits'], 'manifest': data['range']['files']}
                self.evidence.record('accepted_commit', projected, category='static', kind='accepted_commit',
                    source={**source, 'observation': data['source']}, phase=11, status='PASS',
                    observed_at=data['observed_at'], topics=['scope'])

    def advance(self):
        try:
            if self.status == 'BLOCKED' or self.forbidden_action or self.handed_off:
                raise EvidenceError('Workflow cannot advance from a blocked or closed session')
            if any(blocker['phase'] == self.phase for blocker in self.blockers.values()):
                raise EvidenceError('A failed local operation must be resolved by a successful rerun')
            phase_required = REQUIRED.get(self.phase, [])
            if self.profile == EXISTING_CONTENT_PROFILE and self.phase == 2:
                phase_required = [*phase_required, ('mutable', 'existing_content_not_applicable_manifest')]
            if self.profile == EXISTING_CONTENT_PROFILE and self.phase in (13, 14, 15):
                phase_required = [('mutable', 'existing_content_validation_evidence'), ('mutable', 'verification_evidence')]
                if self.phase == 13:
                    phase_required.insert(0, ('mutable', 'existing_content_baseline'))
                if self.phase == 14:
                    phase_required += [('mutable', 'manual_validation_plan'), ('mutable', 'no_change_documentation_evidence')]
                if self.phase == 15:
                    phase_required += [('mutable', 'manual_validation_plan'), ('mutable', 'no_change_documentation_evidence')]
            required = []
            for category, key in phase_required:
                self.evidence.get(key, category)
                required.append(self.evidence.reference(key, category))
            if self.phase:
                guard_name = 'existing-content-validation' if self.profile == EXISTING_CONTENT_PROFILE and self.phase == 13 else GUARDS[self.phase]
                guard = self._guard(guard_name)
                if any(reference not in guard['references'] for reference in required):
                    raise EvidenceError('Guard does not bind every mandatory current evidence entry')
            if self.phase == 3:
                policy = self.evidence.get('canonical_base', 'static')['payload']
                needed = ('policy', 'base_branch', 'base_ref', 'base_remote_ref', 'base_sha',
                          'pr_target', 'pr_target_ref', 'base_remote_sha_initial')
                if any(not policy.get(field) for field in needed):
                    raise EvidenceError('Canonical policy/initial remote SHA evidence is incomplete')
                if policy['base_remote_sha_initial'].lower() != policy['base_sha'].lower():
                    raise EvidenceError('Initial approved remote SHA differs from historical base')
            if self.phase == 6:
                implemented = self.evidence.get('implementation_evidence')['payload']
                sdd = self.evidence.get('sdd_validation_evidence')['payload']
                tasks = sdd['snapshot']['directories'][0]['files']['tasks.md']['tasks']
                if implemented.get('tasks_completed') is not True or not tasks or any(t['status'] != 'completed' for t in tasks):
                    raise EvidenceError('Implementation/tasks are not complete')
            if self.phase == 8 and self.repair_cycle < 1:
                raise EvidenceError('Repair has not been explicitly authorized')
            if self.phase == 10 and self.commit_step != len(COMMIT_STEPS):
                raise EvidenceError('The complete controlled commit sequence is required')
            if self.phase and not (self.profile == EXISTING_CONTENT_PROFILE and self.phase == 13):
                self._capture_verified_history(guard)
            self.history.append({'phase': self.phase, 'status': 'PASS', 'evidence': required})
            if self.profile == EXISTING_CONTENT_PROFILE and self.phase == 2:
                manifest = self.evidence.get('existing_content_not_applicable_manifest')['payload']['manifest']
                for item in sorted(manifest, key=lambda entry: entry['phase']):
                    self.history.append({'phase': item['phase'], 'status': 'NOT_APPLICABLE',
                                         'operation': item['operation'], 'authorization_source': item['authorization_source'],
                                         'reason': item['reason'], 'evidence': deepcopy(item['evidence'])})
                self.phase = 7
            elif self.profile == EXISTING_CONTENT_PROFILE and self.phase == 7:
                self.phase = 13
            elif self.profile == EXISTING_CONTENT_PROFILE and self.phase == 13:
                self.outcome = 'NO_CHANGES'
                self.phase = 14
            elif self.phase == 7:
                self.history.append({'phase': 8, 'status': 'NOT_APPLICABLE', 'reason': 'All applicable verifications passed'})
                self.phase = 9
            elif self.phase == 15:
                self.handed_off = True
                self.status = 'AWAITING_MANUAL_VALIDATION'
            else:
                self.phase += 1
            if self.status != 'AWAITING_MANUAL_VALIDATION':
                self.status = 'RUNNING'
            return {'status': 'PASS', 'phase': self.phase, 'workflow_status': self.status}
        except (EvidenceError, KeyError, TypeError, IndexError) as error:
            if self.status != 'AWAITING_MANUAL_VALIDATION':
                self.status = 'BLOCKED'
            return {'status': 'BLOCK', 'phase': self.phase, 'errors': [str(error)]}



def perform(controller, action):
    operation = action['operation']

    if operation == 'snapshot':
        return controller.snapshot()

    allowed = {
        'advance',
        'record_external',
        'record_static',
        'decide_guard',
        'notify',
        'invoke',
        'enter_repair',
        'export_static',
        'revisit_phase',
        'select_profile',
        'record_not_applicable_manifest',
    }

    if operation not in allowed:
        raise EvidenceError('Unsupported workflow operation')

    arguments = action.get('arguments', {})

    if not isinstance(arguments, dict):
        raise EvidenceError(
            f'{operation}: arguments must be a dictionary'
        )

    method = getattr(controller, operation)

    try:
        inspect.signature(method).bind(**arguments)
    except TypeError as error:
        controller.status = 'BLOCKED'
        raise EvidenceError(
            f'{operation}: invalid arguments: {error}'
        ) from error

    return method(**arguments)


def serve():
    controller = None
    for line in sys.stdin:
        try:
            request = json.loads(line)
            if controller is None:
                if request.get('operation') != 'start':
                    raise EvidenceError('Start a session before submitting actions')
                controller = WorkflowController(request['issue'], request['repository'], request['workflow_id'])
                response = {'status': 'PASS', **controller.snapshot()}
            elif request.get('operation') == 'start':
                raise EvidenceError('Cannot silently replace a running workflow session')
            else:
                result = perform(controller, request)
                if request['operation'] == 'export_static':
                    response = {'status': 'PASS', 'historical_static_summary': result}
                else:
                    response = {'status': 'BLOCK' if controller.status == 'BLOCKED' or (isinstance(result, dict) and result.get('status') == 'BLOCK') else 'PASS',
                                'result': result, **controller.snapshot()}
        except (EvidenceError, ValueError, KeyError, TypeError, AttributeError, IndexError, OSError) as error:
            response = {'status': 'BLOCK', 'errors': [str(error)]}
        print(json.dumps(response, ensure_ascii=True), flush=True)
    return 0


def main():
    parser = argparse.ArgumentParser(description='In-memory development workflow controller')
    parser.add_argument('--serve', action='store_true', help='Keep one JSON-lines session alive until EOF')
    args = parser.parse_args()
    if args.serve:
        return serve()
    try:
        request = json.load(sys.stdin)
        controller = WorkflowController(request['issue'], request['repository'], request['workflow_id'])
        results = []
        for action in request['actions']:
            result = perform(controller, action)
            results.append(result)
            if controller.status == 'BLOCKED' or (isinstance(result, dict) and result.get('status') in ('BLOCK', 'FAIL', 'NEEDS_APPROVAL')):
                break
        if request['actions'] and request['actions'][-1]['operation'] == 'export_static' and len(results) == len(request['actions']):
            response = {'status': 'PASS', 'historical_static_summary': results[-1]}
        else:
            response = {'status': 'BLOCK' if controller.status == 'BLOCKED' else 'PASS',
                        'results': results, **controller.snapshot()}
        blocked = controller.status == 'BLOCKED' or any(isinstance(result, dict) and result.get('status') in ('BLOCK', 'FAIL', 'NEEDS_APPROVAL') for result in results)
        if blocked:
            response['status'] = 'BLOCK'
        code = 1 if blocked else 0
    except (EvidenceError, ValueError, TypeError, KeyError, AttributeError, IndexError, OSError) as error:

        response, code = {'status': 'BLOCK', 'errors': [str(error)]}, 1
    print(json.dumps(response, ensure_ascii=True, indent=2))
    return code


if __name__ == '__main__':
    sys.exit(main())
