"""Phase-11 observations are read-only and tests mutate only temporary repos."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import unittest
import test_check_commit as check_tests
import test_create_commit as creation_tests
import test_pre_commit_check as pre_tests


class PostCheckCommitTests(unittest.TestCase):
    git = check_tests.CheckCommitTests.git
    snapshot = check_tests.CheckCommitTests.snapshot
    def review(self, *args, **kwargs):
        if getattr(self, 'protect_existing', False) and not args:
            args = ('--baseline-json', str(Path(self.tmp.name) / 'phase3.json'))
        return check_tests.CheckCommitTests.review(self, *args, **kwargs)

    stage = check_tests.CheckCommitTests.stage
    check = check_tests.CheckCommitTests.check
    create = check_tests.CheckCommitTests.create
    verify = check_tests.CheckCommitTests.verify

    def prepare(self, with_commit=False):
        if getattr(self, 'protect_existing', False):
            (self.repo / 'existing-local.txt').write_text('preexisting local work')
            baseline = {'status': 'complete', 'issue': 75,
                        'git': {'repository_root': str(self.repo)},
                        'preexisting_protected_changes': [
                            {'path': 'existing-local.txt', 'original_path': None,
                             'index_status': '?', 'worktree_status': '?',
                             'untracked': True, 'ignored': False}]}
            (Path(self.tmp.name) / 'phase3.json').write_text(json.dumps({'branch_evidence': baseline}))
        pre_tests.PreCommitCheckTests.prepare(self, with_commit)
        self.policy['base_branch'] = 'main'
        self.manifest['policy_sha256'] = pre_tests.digest(self.policy)
        if getattr(self, 'legacy_evidence', False):
            path = Path(self.tmp.name) / 'evidence.json'
            prior = json.loads(path.read_text())
            prior['pre_stage_evidence'].pop('protected_baselines')
            path.write_text(json.dumps(prior))
            self.staging['evidence_sha256'] = pre_tests.digest(prior['pre_stage_evidence'])
            self.manifest['staging_evidence_sha256'] = pre_tests.digest(self.staging)

    def setUp(self):
        creation_tests.CreateCommitTests.setUp(self)
        self.creation = self.create()
        self.assertEqual(self.creation['status'], 'PASS', self.creation)
        self.accepted = self.verify()
        self.assertEqual(self.accepted['status'], 'PASS', self.accepted)
        self.guard = {'status': 'PASS', 'issue': 75, 'workflow_id': 'workflow-test',
                      'repository': str(self.repo), 'branch': self.accepted['branch'],
                      'commit_sha': self.accepted['commit_sha'], 'message': self.accepted['message'],
                      'commit_check_evidence_sha256': pre_tests.digest(self.accepted)}

    def post(self):
        for name, value in [('check', {'commit_check_evidence': self.accepted}), ('commit-guard', self.guard)]:
            (self.root / (name + '.json')).write_text(json.dumps(value))
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(pre_tests.SCRIPT), 'post-check-commit',
                                  '--issue', '75', '--workflow-id', 'workflow-test',
                                  *[arg for name in ('evidence', 'staging', 'policy', 'creation', 'check', 'commit-guard')
                                    for arg in ('--' + name + '-json', str(self.root / (name + '.json')))]],
                                  cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(before, self.snapshot(), 'Phase 11 wrote repository bytes')
        e = json.loads(process.stdout)['post_commit_evidence']
        self.assertEqual(process.returncode, 0 if e['status'] == 'complete' else 1)
        return e

    def test_complete_observation(self):
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        self.assertEqual(e['phase'], 'post-commit')
        self.assertEqual(e['head'], self.creation['commit_sha'])
        self.assertEqual(len(e['range']['commits']), 1)
        self.assertEqual(e['range']['files'][0]['path'], 'old.txt')
        opencode = next(p for p in e['protected_paths'] if p['path'] == 'opencode.json')
        self.assertTrue(opencode['unchanged_from_precommit'])
        commands = e['source']['commands']
        self.assertEqual(len(commands), len({tuple(command) for command in commands}))
        self.assertEqual(sum('status' in command for command in commands), 1)

    def test_untracked_is_never_omitted(self):
        (self.repo / 'new\n local.txt').write_text('new')
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        for field in ('pending_manifest', 'unstaged_manifest'):
            self.assertTrue(any(x['path'] == 'new\n local.txt' and x['status'] == '??'
                                for x in e['git_state'][field]))

    def test_staged_rename_and_unstaged_delete(self):
        self.git('mv', 'delete.txt', 'renamed\n local.txt')
        (self.repo / 'spec.md').unlink()
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        rename = e['git_state']['staged_manifest'][0]
        self.assertEqual(rename['status'], 'R100')
        self.assertEqual(rename['original_path'], 'delete.txt')
        self.assertEqual(rename['path'], 'renamed\n local.txt')
        self.assertTrue(any(x['status'] == 'D' for x in e['git_state']['unstaged_manifest']))

    def test_changed_protected_content_is_observed_not_approved(self):
        (self.repo / 'opencode.json').write_text('changed')
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        item = next(p for p in e['protected_paths'] if p['path'] == 'opencode.json')
        self.assertFalse(item['unchanged_from_precommit'])
        self.assertFalse(item['in_range'])
        self.assertNotIn('PASS', e['status'])

    def test_missing_historical_snapshot_is_incomplete(self):
        self.legacy_evidence = True
        self.setUp()
        e = self.post()
        self.assertEqual(e['status'], 'incomplete', e)
        self.assertTrue(any('historical protected fingerprint' in error for error in e['errors']))

    def test_missing_base_policy_is_incomplete(self):
        (self.root / 'policy.json').write_text('{}')
        self.assertEqual(self.post()['status'], 'incomplete')

    def test_missing_guard_approval_is_incomplete(self):
        self.guard['status'] = 'BLOCK'
        self.assertEqual(self.post()['status'], 'incomplete')

    def test_head_mismatch_is_contradictory(self):
        self.git('commit', '--allow-empty', '-m', 'Later (#75)')
        self.assertEqual(self.post()['status'], 'contradictory')

    def test_message_mismatch_is_contradictory(self):
        self.guard['message'] = 'different'
        self.assertEqual(self.post()['status'], 'contradictory')

    def test_historical_base_does_not_follow_origin(self):
        self.git('update-ref', 'refs/remotes/origin/main', self.creation['commit_sha'])
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        self.assertEqual(e['base']['base_sha'], self.base)
        self.assertTrue(e['base']['immutable'])

    def test_missing_explicit_base_branch_is_incomplete(self):
        path = self.root / 'policy.json'
        policy = json.loads(path.read_text())
        policy.pop('base_branch')
        path.write_text(json.dumps(policy))
        self.assertEqual(self.post()['status'], 'incomplete')

    def test_merge_keeps_each_parent_manifest(self):
        branch = self.git('branch', '--show-current').decode().strip()
        self.git('checkout', '-b', 'side')
        (self.repo / 'side.txt').write_text('side')
        self.git('add', 'side.txt')
        self.git('commit', '-m', 'Side (#75)')
        self.git('checkout', branch)
        (self.repo / 'branch.txt').write_text('branch')
        self.git('add', 'branch.txt')
        self.git('commit', '-m', 'Branch (#75)')
        self.git('merge', '--no-ff', 'side', '-m', 'Merge (#75)')
        e = self.post()
        self.assertEqual(e['status'], 'contradictory')
        merge = e['range']['commits'][-1]
        self.assertEqual(len(merge['parents']), 2)
        self.assertEqual(len(merge['parent_manifests']), 2)
        self.assertTrue(all(parent['files'] for parent in merge['parent_manifests']))
        self.assertEqual({x['path'] for x in merge['manifest']}, {'side.txt', 'branch.txt'})

    def test_cancelled_protected_changes_remain_in_range_inventory(self):
        (self.repo / 'opencode.json').write_text('temporary protected edit')
        self.git('add', 'opencode.json')
        self.git('commit', '-m', 'Temporary (#75)')
        self.git('checkout', self.creation['commit_sha'], '--', 'opencode.json')
        self.git('commit', '-m', 'Restore (#75)')
        e = self.post()
        self.assertEqual(e['status'], 'contradictory')
        item = next(p for p in e['protected_paths'] if p['path'] == 'opencode.json')
        self.assertTrue(item['in_range'])
        self.assertTrue(item['unchanged_from_precommit'])
        self.assertFalse(any(x['path'] == 'opencode.json' for x in e['range']['files']))

    def test_renamed_protected_path_is_detected(self):
        self.git('mv', 'opencode.json', 'moved.json')
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        item = next(p for p in e['protected_paths'] if p['path'] == 'opencode.json')
        self.assertTrue(item['staged'])
        self.assertFalse(item['unchanged_from_precommit'])

    def test_canonical_policy_mismatch_is_contradictory(self):
        path = self.root / 'policy.json'
        policy = json.loads(path.read_text())
        policy['base_ref'] = 'origin/other'
        path.write_text(json.dumps(policy))
        self.assertEqual(self.post()['status'], 'contradictory')

    def test_every_preexisting_protected_path_is_preserved(self):
        self.protect_existing = True
        self.setUp()
        e = self.post()
        self.assertEqual(e['status'], 'complete', e)
        protected = {item['path']: item for item in e['protected_paths']}
        self.assertIn('opencode.json', protected)
        self.assertTrue(protected['existing-local.txt']['preexisting'])
        self.assertTrue(protected['existing-local.txt']['unchanged_from_precommit'])
        (self.repo / 'existing-local.txt').write_text('changed externally')
        e = self.post()
        protected = {item['path']: item for item in e['protected_paths']}
        self.assertFalse(protected['existing-local.txt']['unchanged_from_precommit'])

    def test_committed_rename_keeps_score_and_both_paths(self):
        self.git('mv', 'delete.txt', 'range renamed\n.txt')
        self.git('commit', '-m', 'Rename (#75)')
        e = self.post()
        self.assertEqual(e['status'], 'contradictory')
        rename = e['range']['commits'][-1]['manifest'][0]
        self.assertEqual(rename['status'], 'R100')
        self.assertEqual(rename['score'], 100)
        self.assertEqual(rename['original_path'], 'delete.txt')
        self.assertEqual(rename['path'], 'range renamed\n.txt')
