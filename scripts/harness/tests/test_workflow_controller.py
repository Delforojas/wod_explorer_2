"""Controller gates and in-memory transport. No real workflow/Git writes."""
from contextlib import chdir
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch


HARNESS = Path(__file__).resolve().parents[1]
if not (HARNESS / 'workflow_controller.py').exists():
    HARNESS = Path(__file__).parent
sys.path.insert(0, str(HARNESS))
sys.dont_write_bytecode = True
from workflow_controller import WorkflowController, GUARDS, REQUIRED, perform
from evidence_manager import EvidenceError, EvidenceValidationError, managed_operation


class WorkflowControllerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name).resolve()
        self.c = WorkflowController(75, self.repo, 'wf')

    def payload(self, status='PASS', **extra):
        return {'source': 'test-observer', 'phase': self.c.phase, 'issue': 75, 'repository': str(self.repo),
                'workflow_id': 'wf', 'status': status, 'observed_at': datetime.now(timezone.utc).isoformat(), **extra}

    def record(self, key, status='PASS', **extra):
        if key in ('pre_stage_evidence', 'final_check_evidence') and 'verification_evidence' not in self.c.evidence.mutable:
            self.c.evidence.record('verification_evidence', self.payload('PASS'))
        return self.c.evidence.record(key, self.payload(status, **extra))

    def guard(self, name=None, status='PASS', references=None):
        name = name or GUARDS[self.c.phase]
        if references is None:
            references = [self.c.evidence.reference(key, category) for category, key in REQUIRED.get(self.c.phase, [])]
        return self.c.decide_guard(name, status, '.opencode/commands/guardarails/' + name + '.md', references, 'Observed and reviewed')

    def seed_phase(self):
        for category, key in REQUIRED.get(self.c.phase, []):
            if category == 'static':
                data = {'base_sha': 'a' * 40, 'policy':'standard-main','base_branch':'main',
                        'base_ref':'origin/main','base_remote_ref':'refs/heads/main','pr_target':'main',
                        'pr_target_ref':'refs/heads/main','base_remote_sha_initial':'a'*40} if key == 'canonical_base' else {'path': 'AGENTS.md', 'sha256': 'a'}
                self.c.record_static(key, data, 'canonical_base' if key == 'canonical_base' else 'context_item', 'approved context', observed_at=datetime.now(timezone.utc).isoformat())
            elif key == 'sdd_validation_evidence':
                self.record(key, snapshot={'directories': [{'files': {'tasks.md': {'tasks': [{'status': 'completed'}]}}}]})
            elif key == 'implementation_evidence':
                self.record(key, tasks_completed=True)
            elif key == 'manual_validation_plan':
                self.record(key, manual_status='pending', checks=[{'status': 'pending'}])
            else:
                self.record(key)

    def test_start_and_missing_guard_block(self):
        self.assertEqual(self.c.advance()['phase'], 1)
        self.record('github_issue_observation')
        self.assertEqual(self.c.advance()['status'], 'BLOCK')
        self.assertEqual(self.c.phase, 1)

    def test_cannot_supply_future_guard(self):
        with self.assertRaises(EvidenceError):
            self.c.decide_guard('commit', 'PASS', 'source', [], 'not valid here')

    def test_guard_pass_cannot_override_failed_local_evidence(self):
        self.c.phase = 7
        reference = self.record('verification_evidence', 'FAIL')
        with self.assertRaises(EvidenceError):
            self.guard(references=[reference])
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_guard_requires_exact_source_and_references(self):
        self.c.phase = 1
        reference = self.record('github_issue_observation')
        with self.assertRaises(EvidenceError):
            self.c.decide_guard('issue', 'PASS', 'made-up', [reference], 'reason')
        with self.assertRaises(EvidenceError):
            self.c.decide_guard('issue', 'PASS', '.opencode/commands/guardarails/issue.md', [], 'reason')

    def test_guard_cannot_reference_only_unrelated_success(self):
        self.c.phase = 1
        self.record('github_issue_observation')
        other = self.record('other')
        self.guard(references=[other])
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_stale_guard_is_rejected(self):
        self.c.phase = 9
        self.record('pre_stage_evidence')
        self.guard()
        self.c.notify('file-change', 'edit')
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_successful_verification_skips_only_conditional_repair(self):
        self.c.phase = 7
        self.record('verification_evidence')
        self.guard()
        self.assertEqual(self.c.advance()['phase'], 9)
        self.assertEqual(self.c.history[-1]['status'], 'NOT_APPLICABLE')

    def test_failure_requires_explicit_repair_guard(self):
        self.c.phase = 7
        failed = self.record('verification_evidence', 'FAIL')
        with self.assertRaises(EvidenceError):
            self.c.enter_repair()
        self.guard('repair', references=[failed])
        self.assertEqual(self.c.enter_repair()['phase'], 8)
        self.assertEqual(self.c.repair_cycle, 1)
        self.record('repair_evidence')
        self.record('verification_evidence')
        self.guard()
        self.assertEqual(self.c.advance()['phase'], 9)

    def test_repair_cannot_run_after_success(self):
        self.c.phase = 7
        self.record('verification_evidence')
        with self.assertRaises(EvidenceError):
            self.c.enter_repair()

    def test_manual_plan_cannot_approve_manual_validation(self):
        self.c.phase = 14
        with self.assertRaises(EvidenceError):
            self.c.record_external('manual_validation_plan', self.payload(manual_status='approved', checks=[{'status': 'approved'}]))

    def test_forbidden_action_permanently_blocks_development_session(self):
        self.assertEqual(self.c.notify('push', 'observed external action')['status'], 'BLOCK')
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_completed_earlier_phase_remains_historical(self):
        self.c.phase = 9
        self.record('pre_stage_evidence')
        self.guard()
        self.assertEqual(self.c.advance()['phase'], 10)
        self.c.notify('staging-change', 'controlled staging')
        self.assertEqual(self.c.history[-1]['phase'], 9)
        self.assertEqual(self.c.history[-1]['status'], 'PASS')
        with self.assertRaises(EvidenceError):
            self.c.evidence.get('pre_stage_evidence')

    def test_invoke_cannot_execute_an_operation_from_another_phase(self):
        self.c.phase = 4
        with self.assertRaises(EvidenceError):
            self.c.invoke('git_policy.create_commit', {})

    def test_commit_sequence_cannot_be_skipped_or_repeated(self):
        self.c.phase = 10
        self.record('pre_stage_evidence')
        with self.assertRaises(EvidenceError), chdir(self.repo):
            self.c.invoke('git_policy.create_commit', {'issue': 75})
        keys = ['staging_preparation_evidence', 'pre_commit_evidence', 'commit_creation_evidence', 'commit_check_evidence']
        names = ['prepare_staging', 'pre_commit_check', 'create_commit', 'check_commit']
        module = SimpleNamespace()
        for name, key in zip(names, keys):
            def factory(key):
                @managed_operation
                def operation(issue):
                    extra = {}
                    if key == 'commit_creation_evidence':
                        extra.update(commit_attempted=True, commit_created=True, commit_sha='b'*40, git_returncode=0,
                                     checks={'unrelated_local_work_preserved':True})
                    if key == 'commit_check_evidence':
                        extra.update(commit_sha='b'*40, message='feat (#75)', branch='feat/075-test', base_sha='a'*40, commit_paths=['file'])
                    return {key: self.payload(**extra)}
                return operation
            setattr(module, name, factory(key))
        with patch('workflow_controller.importlib.import_module', return_value=module), chdir(self.repo):
            for name in names:
                self.c.invoke('git_policy.' + name, {'issue': 75})
            with self.assertRaises(EvidenceError):
                self.c.invoke('git_policy.check_commit', {'issue': 75})
        self.guard()
        self.assertEqual(self.c.advance()['phase'], 11)

    def test_incomplete_task_state_prevents_implementation_completion(self):
        self.c.phase = 6
        self.record('implementation_evidence', tasks_completed=True)
        self.record('sdd_validation_evidence', snapshot={'directories': [{'files': {'tasks.md': {'tasks': [{'status': 'pending'}]}}}]})
        self.guard()
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_guard_can_be_replaced_only_with_current_evidence(self):
        self.c.phase = 1
        ref = self.record('github_issue_observation')
        self.guard(status='BLOCK', references=[ref])
        self.assertEqual(self.c.advance()['status'], 'BLOCK')
        self.guard(references=[ref])
        self.assertEqual(self.c.advance()['phase'], 2)

    def test_handoff_is_manual_pending_not_issue_completion(self):
        self.c.phase = 15
        self.record('final_check_evidence')
        self.record('manual_validation_plan', manual_status='pending', checks=[{'status':'pending'}])
        self.guard()
        e = self.c.advance()
        self.assertEqual(e['workflow_status'], 'AWAITING_MANUAL_VALIDATION')
        self.assertEqual(self.c.snapshot()['workflow']['manual_validation'], 'pending')
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_json_lines_session_retains_memory_without_files(self):
        requests = [{'operation':'start','issue':75,'repository':str(self.repo),'workflow_id':'wf'},
                    {'operation':'advance'}, {'operation':'snapshot'}]
        before = list(self.repo.iterdir())
        process = subprocess.run([sys.executable,str(HARNESS/'workflow_controller.py'),'--serve'],
                                 input='\n'.join(json.dumps(r) for r in requests)+'\n', cwd=self.repo, capture_output=True,text=True)
        self.assertEqual(process.returncode, 0, process.stderr)
        responses = [json.loads(line) for line in process.stdout.splitlines()]
        self.assertEqual(responses[-1]['workflow']['phase'], 1)
        self.assertEqual(before, list(self.repo.iterdir()))

    def test_json_server_cannot_silently_replace_session(self):
        start = {'operation':'start','issue':75,'repository':str(self.repo),'workflow_id':'wf'}
        process = subprocess.run([sys.executable,str(HARNESS/'workflow_controller.py'),'--serve'],
                                 input=json.dumps(start)+'\n'+json.dumps(start)+'\n', cwd=self.repo,capture_output=True,text=True)
        self.assertEqual(json.loads(process.stdout.splitlines()[-1])['status'], 'BLOCK')

    def test_revisit_revalidates_guards_without_rewriting_history(self):
        self.c.phase = 14
        self.c.commit_step = 4
        self.record('final_check_evidence')
        self.c.notify('github-change', 'documentation changed')
        result = self.c.revisit_phase(13, 'Refresh final GitHub documentation evidence')
        self.assertEqual(result['phase'], 13)
        self.assertEqual(self.c.commit_step, 4)
        self.assertEqual(self.c.advance()['status'], 'BLOCK')
        with self.assertRaises(EvidenceError):
            self.c.revisit_phase(3, 'Do not recreate the existing commit')

    def test_handoff_cannot_be_reopened_by_reapproving_guard(self):
        self.c.phase = 15
        self.record('final_check_evidence')
        self.record('manual_validation_plan', manual_status='pending', checks=[{'status':'pending'}])
        self.guard()
        self.c.advance()
        with self.assertRaises(EvidenceError):
            self.guard()
        self.assertEqual(self.c.advance()['status'], 'BLOCK')
        self.assertEqual(self.c.status, 'AWAITING_MANUAL_VALIDATION')

    def test_failed_optional_operation_cannot_be_hidden_by_guard_pass(self):
        self.c.phase = 3
        self.seed_phase()
        @managed_operation
        def observe(issue):
            return {'branch_evidence': self.payload('BLOCK')}
        module = SimpleNamespace(inspect=observe)
        with patch('workflow_controller.importlib.import_module', return_value=module), chdir(self.repo):
            self.c.invoke('git_policy.inspect', {'issue':75})
        self.guard()
        self.assertEqual(self.c.advance()['status'], 'BLOCK')

    def test_commit_created_despite_block_cannot_be_hidden_by_restarting(self):
        self.c.phase = 10
        self.c.commit_step = 2
        self.record('pre_commit_evidence')
        self.record('verification_evidence')
        @managed_operation
        def create(issue):
            return {'commit_creation_evidence': self.payload('BLOCK', commit_attempted=True,
                commit_created=True, commit_sha='b'*40, git_returncode=0)}
        with patch('workflow_controller.importlib.import_module', return_value=SimpleNamespace(create_commit=create)), chdir(self.repo):
            self.c.invoke('git_policy.create_commit', {'issue':75})
        self.assertTrue(self.c.commit_created)
        with self.assertRaises(EvidenceError):
            self.c.revisit_phase(9, 'Must not create a second commit to hide the first')

    def test_precommit_revalidation_resets_sequence_only_before_commit_exists(self):
        self.c.phase = 10
        self.c.commit_step = 2
        self.c.revisit_phase(9, 'Refresh review and controlled staging')
        self.assertEqual(self.c.commit_step, 0)

    def test_full_synthetic_gate_sequence_ends_at_manual_handoff(self):
        self.assertEqual(self.c.advance()['phase'], 1)
        phases = []
        while not self.c.handed_off:
            phases.append(self.c.phase)
            self.seed_phase()
            if self.c.phase == 10:
                self.c.commit_step = 4  # Local operation ordering is exercised separately.
                self.c.commit_created = True
            self.guard()
            result = self.c.advance()
            self.assertEqual(result['status'], 'PASS', result)
        self.assertEqual(phases, [1,2,3,4,5,6,7,9,10,11,12,13,14,15])
        self.assertEqual(self.c.status, 'AWAITING_MANUAL_VALIDATION')
        self.assertFalse(self.c.forbidden_action)

    def test_incomplete_canonical_policy_cannot_pass_branch_gate(self):
        self.c.phase = 3
        self.c.record_static('canonical_base', {'base_sha':'a'*40}, 'canonical_base', 'observed historical SHA only', observed_at=datetime.now(timezone.utc).isoformat())
        self.record('branch_check_evidence')
        self.guard()
        result = self.c.advance()
        self.assertEqual(result['status'], 'BLOCK')
        self.assertIn('incomplete', result['errors'][0])

    def test_new_source_changes_require_fresh_verification_before_staging(self):
        self.c.phase = 9
        self.record('pre_stage_evidence')
        self.c.notify('file-change', 'implementation edited after tests')
        self.c.evidence.record('pre_stage_evidence', self.payload())
        self.assertEqual(self.c.advance()['status'], 'BLOCK')
        with self.assertRaises(EvidenceError):
            self.guard()

    def test_record_external_rejects_unexpected_source(self):
        self.c.phase = 1

        action = {
            'operation': 'record_external',
            'arguments': {
                'key': 'github_issue_observation',
                'payload': self.payload(),
                'source': 'github',
            },
        }

        with self.assertRaisesRegex(EvidenceError, 'invalid arguments'):
            perform(self.c, action)

        self.assertEqual(self.c.status, 'BLOCKED')
        self.assertNotIn(
            'github_issue_observation',
            self.c.evidence.mutable,
        )

    def test_git_inspect_rejects_unexpected_workflow_id(self):
        self.c.phase = 3
        executed = []

        def fake_inspect(issue, policy_path=None):
            executed.append(issue)
            return {'branch_evidence': {'status': 'PASS'}}

        with (
            chdir(self.repo),
            patch(
                'workflow_controller.importlib.import_module',
                return_value=SimpleNamespace(inspect=fake_inspect),
            ),
        ):
            with self.assertRaisesRegex(EvidenceError, 'invalid arguments'):
                self.c.invoke(
                    'git_policy.inspect',
                    {
                        'issue': 75,
                        'workflow_id': 'wf',
                    },
                )
                self.assertEqual(executed, [])
                self.assertIn('git_policy.inspect', self.c.blockers)

    def test_phase1_external_github_repository_identity(self):
        self.c.phase = 1

        payload = self.payload(
            repository_full_name="Delforojas/wod_explorer_2",
            number=75,
            title="Test Issue",
        )

        reference = self.c.record_external(
            "github_issue_observation",
            payload,
        )

        entry = self.c.evidence.resolve(reference)

        self.assertEqual(
            entry["payload"]["repository_full_name"],
            "Delforojas/wod_explorer_2",
        )

    def test_phase1_static_issue_identity_contract(self):
        self.c.phase = 1

        identity = {
            "number": 75,
            "title": "Test Issue",
            "url": "https://github.com/Delforojas/wod_explorer_2/issues/75",
            "repository_full_name": "Delforojas/wod_explorer_2",
        }

        reference = self.c.record_static(
            key="issue_identity",
            payload=identity,
            kind="issue_identity",
            source="github-mcp",
            observed_at=datetime.now(timezone.utc).isoformat(),
        )

        entry = self.c.evidence.resolve(reference)

        self.assertEqual(entry["payload"], identity)

        with self.assertRaises(EvidenceError):
            self.c.record_static(
                key="invalid_issue_identity",
                payload={**identity, "repository": str(self.repo)},
                kind="issue_identity",
                source="github-mcp",
                observed_at=datetime.now(timezone.utc).isoformat(),
            )

    def test_record_static_kind_not_allowed_at_phase_is_recoverable(self):
        self.c.phase = 1
        self.c.status = 'RUNNING'

        with self.assertRaisesRegex(EvidenceValidationError, 'Allowed kinds at this phase'):
            self.c.record_static(
                key='context',
                payload={'path': 'AGENTS.md', 'sha256': 'a'},
                kind='context_item',
                source='approved context',
                observed_at=datetime.now(timezone.utc).isoformat(),
            )

        self.assertEqual(self.c.phase, 1)
        self.assertEqual(self.c.status, 'RUNNING')

        reference = self.c.record_static(
            key='issue_identity',
            payload={'number': 75, 'title': 'Test Issue', 'url': 'https://github.com/x/y/issues/75',
                     'repository_full_name': 'x/y'},
            kind='issue_identity',
            source='github-mcp',
            observed_at=datetime.now(timezone.utc).isoformat(),
        )
        self.assertEqual(self.c.evidence.resolve(reference)['payload']['number'], 75)

    def test_record_static_unsupported_fields_is_recoverable(self):
        self.c.phase = 1
        self.c.status = 'RUNNING'

        with self.assertRaisesRegex(EvidenceValidationError, 'unsupported fields'):
            self.c.record_static(
                key='approved_scope',
                payload={'description': 'Fix validation errors', 'acceptance_criteria': [], 'constraints': [],
                          'approved_by': 'user'},
                kind='issue_identity',
                source='github-mcp',
                observed_at=datetime.now(timezone.utc).isoformat(),
            )

        self.assertEqual(self.c.phase, 1)
        self.assertEqual(self.c.status, 'RUNNING')

        reference = self.c.record_static(
            key='approved_scope',
            payload={'description': 'Fix validation errors', 'acceptance_criteria': [], 'constraints': [],
                      'approved_by': 'user'},
            kind='approved_scope',
            source='github-mcp',
            observed_at=datetime.now(timezone.utc).isoformat(),
        )
        self.assertEqual(self.c.evidence.resolve(reference)['payload']['approved_by'], 'user')

    def test_initial_transition_from_phase_zero_to_one(self):
        self.assertEqual(self.c.phase, 0)
        self.assertEqual(self.c.status, "RUNNING")

        result = self.c.advance()

        self.assertEqual(result["status"], "PASS")
        self.assertEqual(result["phase"], 1)
        self.assertEqual(self.c.phase, 1)
        self.assertEqual(self.c.status, "RUNNING")