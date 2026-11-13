"""Full final-check CLI with temporary Git repos and explicit mocked MCP receipts.

No test talks to GitHub or changes the real repository's staging or history.
"""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys
import unittest
import test_post_check_commit as post_tests
import test_pre_commit_check as pre_tests
import test_prepare_staging as staging_tests


class FinalCheckTests(unittest.TestCase):
    git = post_tests.PostCheckCommitTests.git
    snapshot = post_tests.PostCheckCommitTests.snapshot
    stage = post_tests.PostCheckCommitTests.stage
    check = post_tests.PostCheckCommitTests.check
    create = post_tests.PostCheckCommitTests.create
    verify = post_tests.PostCheckCommitTests.verify
    observe = post_tests.PostCheckCommitTests.post
    def prepare(self, with_commit=False):
        post_tests.PostCheckCommitTests.prepare(self, with_commit)
        if getattr(self, 'use_dependency', False):
            self.policy.update(policy='approved-dependency', base_branch='feat/074-dependency',
                               base_ref='origin/feat/074-dependency',
                               base_remote_ref='refs/heads/feat/074-dependency',
                               dependency_approval={'approved': True, 'approved_by': 'workflow-user',
                                                    'reason': 'Explicitly approved dependency'},
                               dependency_commits=[self.base])
            self.manifest['policy_sha256'] = pre_tests.digest(self.policy)

    def review(self, *args, **kwargs):
        return pre_tests.PreCommitCheckTests.review(self, '--spec-path', 'specs/075-feature/spec.md',
                '--plan-path', 'specs/075-feature/plan.md', '--tasks-path', 'specs/075-feature/tasks.md',
                *args, **kwargs)

    def setUp(self):
        staging_tests.PrepareStagingTests.setUp(self)
        folder = self.repo / 'specs/075-feature'
        folder.mkdir(parents=True)
        for name, content in [('spec.md', '# Feature\nAC1: accepted behavior\n'),
                              ('plan.md', '# Plan\nImplement the behavior.\n'),
                              ('tasks.md', '# Tasks\n- [x] T1: Implement and test behavior\n')]:
            (folder / name).write_text(content)
        self.git('add', 'specs')
        self.git('commit', '-m', 'Initial SDD')
        self.base = self.git('rev-parse', 'HEAD').decode().strip()
        self.git('remote', 'add', 'origin', 'https://github.com/example/wod-explorer-2.git')
        self.prepare()
        self.pre = self.check()
        self.assertEqual(self.pre['status'], 'PASS', self.pre)
        self.root = Path(self.tmp.name)
        self.message = 'feat: approved work (#75)\n'
        self.authorization = {'status': 'APPROVED', 'issue': 75, 'workflow_id': 'workflow-test',
                              'pre_commit_evidence_sha256': pre_tests.digest(self.pre),
                              'message_sha256': hashlib.sha256(self.message.encode()).hexdigest()}
        self.creation = self.create()
        self.assertEqual(self.creation['status'], 'PASS', self.creation)
        self.accepted = self.verify()
        self.assertEqual(self.accepted['status'], 'PASS', self.accepted)
        self.guard = {'status': 'PASS', 'issue': 75, 'workflow_id': 'workflow-test',
                      'repository': str(self.repo), 'branch': self.accepted['branch'],
                      'commit_sha': self.accepted['commit_sha'], 'message': self.accepted['message'],
                      'commit_check_evidence_sha256': pre_tests.digest(self.accepted)}
        self.refresh_context()

    def refresh_context(self):
        self.post_evidence = self.observe()
        self.assertEqual(self.post_evidence['status'], 'complete', self.post_evidence)
        post = self.post_evidence
        files = {name: hashlib.sha256((self.repo / 'specs/075-feature' / name).read_bytes()).hexdigest()
                 for name in ('spec.md', 'plan.md', 'tasks.md')}
        tree = self.git('rev-parse', 'HEAD^{tree}').decode().strip()
        now = datetime.now(timezone.utc).isoformat()
        summary = {'source': 'workflow-session', 'issue': 75, 'workflow_id': 'workflow-test',
                   'scope_approved': True, 'decisions_and_dependencies_approved': True,
                   'mutable_observations_are_current': False,
                   'commit': {'sha': post['head'], 'message': post['last_commit']['message'], 'branch': post['branch']},
                   'base_policy': self.policy, 'initial_remote_sha': self.base,
                   'sdd': {'folder': 'specs/075-feature', 'files': files},
                   'verification_ids': ['unit'], 'range': post['range']}
        body = 'Implementation: ' + post['last_commit']['message'] + '\n```json\n' + json.dumps(summary, indent=2) + '\n```\nManual validation pending: Check the user flow.'
        self.context = {'status': 'PASS', 'invalidated': False, 'issue': 75, 'workflow_id': 'workflow-test',
            'observed_at': now, 'repository': str(self.repo), 'branch': post['branch'], 'head_sha': post['head'],
            'post_commit_evidence_sha256': pre_tests.digest(post),
            'post_commit_guard': {'status': 'PASS', 'source': 'post-commit-guard', 'evidence_sha256': pre_tests.digest(post)},
            'base_approval': {'status': 'PASS', 'source': 'phase-3-policy-approval', 'policy': self.policy, 'initial_remote_sha': self.base},
            'unrelated_changes': [{'path': c['path'], 'classification': 'unrelated', 'source': 'change-review', 'justification': 'Preserve separate local work'}
                                  for c in post['git_state']['working_tree']['interpreted']],
            'sdd': {'status': 'PASS', 'source': 'approved-sdd', 'content_approved': True, 'slug_matches_issue': True,
                    'folder': 'specs/075-feature', 'files': files,
                    'acceptance_inventory_complete': True, 'required_criteria': ['AC1'],
                    'acceptance_criteria': [{'id': 'AC1', 'covered': True, 'source': 'acceptance-review',
                                             'implemented_tasks': ['T1'], 'verification_ids': ['unit']}]},
            'verifications': {'status': 'PASS', 'source': 'verification-runner', 'inventory_complete': True,
                              'tree_sha': tree, 'sdd_files': files, 'required': ['unit'],
                              'reports': [{'id': 'unit', 'applicable': True, 'source': 'unit-test-report',
                                           'tree_sha': tree, 'status': 'PASS', 'exit_code': 0, 'command': ['test-command']}]},
            'github': {'source': 'github-mcp', 'invalidated': False, 'observed_at': now,
                       'repository': 'example/wod-explorer-2', 'number': 75, 'state': 'open',
                       'issue_url': 'https://github.com/example/wod-explorer-2/issues/75',
                       'comments': [{'id': 123, 'body': body}]},
            'documentation': {'status': 'PASS', 'source': 'github-documentation-guard', 'comment_id': 123,
                              'body_sha256': hashlib.sha256(body.encode()).hexdigest(), 'static_summary': summary},
            'actions': {'source': 'workflow-action-log', 'complete': True, 'coverage': 'entire-workflow',
                        'workflow_id': 'workflow-test', 'events': [
                            {'sequence': 1, 'operation': 'issue-start'},
                            {'sequence': 2, 'operation': 'create-commit', 'status': 'PASS', 'commit_sha': post['head']},
                            {'sequence': 3, 'operation': 'github-documentation', 'status': 'PASS', 'comment_id': 123}]},
            'manual_validation': {'status': 'pending', 'source': 'manual-validation-plan',
                                  'checks': [{'id': 'M1', 'description': 'Check the user flow', 'status': 'pending'}]},
            'finish_issue_status': 'pending'}

    def final(self):
        (self.root / 'post.json').write_text(json.dumps({'post_commit_evidence': self.post_evidence}))
        (self.root / 'context.json').write_text(json.dumps(self.context))
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(pre_tests.SCRIPT), 'final-check', '--issue', '75',
                                  '--workflow-id', 'workflow-test', '--post-json', str(self.root / 'post.json'),
                                  '--context-json', str(self.root / 'context.json')],
                                  cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(before, self.snapshot(), 'final-check wrote repository bytes')
        e = json.loads(process.stdout)['final_check_evidence']
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        return e

    def test_valid_handoff(self):
        e = self.final()
        self.assertEqual(e['status'], 'PASS', e)
        self.assertTrue(e['ready_for_manual_validation'])

    def test_closed_issue_fails(self):
        self.context['github']['state'] = 'closed'
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_missing_github_evidence_fails(self):
        self.context.pop('github')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_diagnostic_inventory_lists_checks_and_failures_for_missing_audit(self):
        self.context.pop('actions')
        evidence = self.final()
        self.assertTrue(evidence['checks'])
        self.assertTrue(evidence['failures'])
        self.assertEqual(evidence['failures'][0]['condition'], "'actions'")

    def test_no_push_cannot_be_inferred_from_git(self):
        self.context.pop('actions')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_recorded_push_fails(self):
        self.context['actions']['events'].append({'sequence': 4, 'operation': 'push'})
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_finish_execution_fails(self):
        self.context['actions']['events'].append({'sequence': 4, 'operation': 'finish-issue'})
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_manual_approval_fails(self):
        self.context['manual_validation']['status'] = 'approved'
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_failed_verification_fails(self):
        self.context['verifications']['reports'][0]['exit_code'] = 1
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_verification_of_other_tree_fails(self):
        self.context['verifications']['tree_sha'] = '0' * 40
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_uncovered_acceptance_criterion_fails(self):
        self.context['sdd']['acceptance_criteria'][0]['covered'] = False
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_duplicate_sdd_folder_fails(self):
        (self.repo / 'specs/75-another').mkdir()
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_untracked_after_observation_invalidates_it(self):
        (self.repo / 'pending.txt').write_text('unclassified')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_classified_unrelated_work_is_preserved(self):
        (self.repo / 'local.txt').write_text('unrelated')
        self.refresh_context()
        e = self.final()
        self.assertEqual(e['status'], 'PASS', e)
        (self.repo / 'local.txt').write_text('later edit with same status')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_unclassified_pending_work_fails(self):
        (self.repo / 'local.txt').write_text('unrelated')
        self.refresh_context()
        self.context['unrelated_changes'] = []
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_protected_content_change_fails(self):
        (self.repo / 'opencode.json').write_text('changed')
        self.refresh_context()
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_head_changed_fails(self):
        self.git('commit', '--allow-empty', '-m', 'Later (#75)')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_missing_manual_plan_fails(self):
        self.context['manual_validation']['checks'] = []
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_documentation_content_changed_fails(self):
        self.context['github']['comments'][0]['body'] += '\nChanged'
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_incomplete_action_log_fails(self):
        self.context['actions']['complete'] = False
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_historical_remote_reference_can_advance(self):
        self.git('update-ref', 'refs/remotes/origin/main', self.post_evidence['head'])
        self.refresh_context()
        self.assertEqual(self.final()['status'], 'PASS')

    def test_unknown_audit_action_cannot_hide_a_push(self):
        self.context['actions']['events'].append({'sequence': 4, 'operation': 'git push origin HEAD'})
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_incomplete_required_verification_inventory_fails(self):
        self.context['verifications']['required'].append('integration')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_missing_acceptance_criterion_fails(self):
        self.context['sdd']['required_criteria'].append('AC2')
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_pending_task_is_rejected(self):
        (self.repo / 'specs/075-feature/tasks.md').write_text('- [ ] T1: Still pending\n')
        self.refresh_context()
        e = self.final()
        self.assertEqual(e['status'], 'FAIL')
        self.assertIn('all_concrete_tasks_completed', e['errors'])

    def test_empty_sdd_file_is_rejected(self):
        (self.repo / 'specs/075-feature/plan.md').write_text('')
        self.refresh_context()
        e = self.final()
        self.assertEqual(e['status'], 'FAIL')
        self.assertIn('nonempty_sdd_content', e['errors'])

    def test_older_github_snapshot_is_rejected(self):
        self.context['github']['observed_at'] = '2000-01-01T00:00:00+00:00'
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_no_applicable_automatic_verifications_needs_explicit_reason(self):
        verification = self.context['verifications']
        verification['required'] = []
        verification['reports'] = []
        verification['not_applicable_reason'] = 'Approved applicability review: manual verification only'
        self.context['sdd']['acceptance_criteria'][0]['verification_ids'] = []
        self.context['documentation']['static_summary']['verification_ids'] = []
        summary = self.context['documentation']['static_summary']
        body = 'Implementation: ' + self.post_evidence['last_commit']['message'] + '\n```json\n' + json.dumps(summary, indent=2) + '\n```\nCheck the user flow'
        self.context['github']['comments'][0]['body'] = body
        self.context['documentation']['body_sha256'] = hashlib.sha256(body.encode()).hexdigest()
        e = self.final()
        self.assertEqual(e['status'], 'PASS', e)
        verification['not_applicable_reason'] = ''
        self.assertEqual(self.final()['status'], 'FAIL')

    def test_complete_approved_dependency_is_accepted(self):
        self.use_dependency = True
        self.setUp()
        e = self.final()
        self.assertEqual(e['status'], 'PASS', e)

    def test_ref_mutation_requires_a_new_observation(self):
        self.git('branch', 'another-branch')
        e = self.final()
        self.assertEqual(e['status'], 'FAIL')
        self.assertIn('post_commit_refs_not_invalidated', e['errors'])

    def test_immutable_range_queries_are_not_repeated(self):
        e = self.final()
        self.assertEqual(e['status'], 'PASS', e)
        commands = e['source']['commands']
        self.assertFalse(any(token in ('log', 'show', 'rev-list', 'diff-tree', 'merge-base')
                             for command in commands for token in command))
