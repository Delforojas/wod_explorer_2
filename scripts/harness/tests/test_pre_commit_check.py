"""Final pre-commit checks use temporary repositories and verify byte preservation."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import unittest
import test_prepare_staging as staging_tests

SCRIPT = staging_tests.SCRIPT


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'),
                                     ensure_ascii=True).encode()).hexdigest()


class PreCommitCheckTests(unittest.TestCase):
    git = staging_tests.PrepareStagingTests.git
    snapshot = staging_tests.PrepareStagingTests.snapshot
    review = staging_tests.PrepareStagingTests.review
    stage = staging_tests.PrepareStagingTests.stage

    def setUp(self):
        staging_tests.PrepareStagingTests.setUp(self)
        self.base = self.git('rev-parse', 'HEAD').decode().strip()

    def prepare(self, with_commit=False):
        commits = []
        if with_commit:
            (self.repo / 'range.txt').write_text('Issue work')
            self.git('add', 'range.txt')
            self.git('commit', '-m', 'feat: issue 75')
            commits.append(self.git('rev-parse', 'HEAD').decode().strip())
        (self.repo / 'old.txt').write_text('approved')
        staging = self.stage(['old.txt'])
        self.assertEqual(staging['status'], 'PASS', staging)
        policy = {'policy': 'standard-main', 'base_ref': 'origin/main',
                  'base_remote_ref': 'refs/heads/main', 'base_sha': self.base,
                  'pr_target': 'main', 'pr_target_ref': 'refs/heads/main'}
        patch = self.git('diff', '--cached', self.base, '--binary', '--full-index',
                         '--no-ext-diff', '--no-textconv', '--no-relative')
        manifest = {'status': 'PASS', 'issue': 75, 'repository': str(self.repo),
                    'branch': staging['branch'], 'head_sha': staging['head_sha'],
                    'base_sha': self.base, 'approved_commits': commits,
                    'candidate_paths': ['old.txt'] + (['range.txt'] if commits else []),
                    'unrelated_paths': [], 'policy_sha256': digest(policy),
                    'staging_evidence_sha256': digest(staging),
                    'candidate_diff_sha256': hashlib.sha256(patch).hexdigest()}
        self.policy = policy
        self.manifest = manifest
        self.staging = staging

    def check(self):
        root = Path(self.tmp.name)
        for name, value in [('policy', self.policy), ('manifest', self.manifest),
                            ('staging', {'staging_preparation_evidence': self.staging})]:
            (root / (name + '.json')).write_text(json.dumps(value))
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(SCRIPT), 'pre-commit-check', '--issue', '75',
                                  '--evidence-json', str(root / 'evidence.json'),
                                  '--staging-json', str(root / 'staging.json'),
                                  '--policy-json', str(root / 'policy.json'),
                                  '--manifest-json', str(root / 'manifest.json')],
                                  cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(before, self.snapshot(), 'Check modified repository bytes')
        e = json.loads(process.stdout)['pre_commit_evidence']
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        return e

    def test_valid_staging(self):
        self.prepare()
        self.assertEqual(self.check()['status'], 'PASS')

    def test_valid_approved_range(self):
        self.prepare(True)
        self.assertEqual(self.check()['status'], 'PASS')

    def test_empty_staging_fails(self):
        self.prepare()
        self.git('reset', 'HEAD', '--', 'old.txt')
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_changed_staged_content_fails(self):
        self.prepare()
        (self.repo / 'old.txt').write_text('unapproved')
        self.git('add', 'old.txt')
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_wrong_branch_fails(self):
        self.prepare()
        self.git('checkout', '-b', 'feat/076-other')
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_unknown_commit_fails(self):
        self.prepare(True)
        self.manifest['approved_commits'] = []
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_wrong_candidate_patch_fails(self):
        self.prepare()
        self.manifest['candidate_diff_sha256'] = '0' * 64
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_unrelated_path_fails(self):
        self.prepare()
        self.manifest['unrelated_paths'] = ['old.txt']
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_missing_candidate_path_fails(self):
        self.prepare(True)
        self.manifest['candidate_paths'] = ['old.txt']
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_modified_sdd_fails(self):
        self.prepare()
        (self.repo / 'tasks.md').write_text('later tasks')
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_unrelated_unstaged_is_allowed(self):
        self.prepare()
        (self.repo / 'opencode.json').write_text('local only')
        self.assertEqual(self.check()['status'], 'PASS')

    def test_remote_advance_preserves_historical_base(self):
        self.prepare(True)
        self.git('update-ref', 'refs/remotes/origin/main', self.staging['head_sha'])
        self.assertEqual(self.check()['status'], 'PASS')

    def test_policy_chain_tampering_fails(self):
        self.prepare()
        self.policy['pr_target'] = 'other'
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_malformed_manifest_fails_as_json(self):
        self.prepare()
        self.manifest = []
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_protected_path_in_approved_range_fails(self):
        (self.repo / 'opencode.json').write_text('must stay local')
        self.git('add', 'opencode.json')
        self.git('commit', '-m', 'Unexpected protected change')
        self.prepare()
        self.manifest['approved_commits'] = self.git('rev-list', '--reverse', self.base + '..HEAD').decode().splitlines()
        self.manifest['candidate_paths'].append('opencode.json')
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_cancelled_range_paths_cannot_be_hidden(self):
        (self.repo / 'cancelled.txt').write_text('outside scope')
        self.git('add', 'cancelled.txt')
        self.git('commit', '-m', 'Add')
        self.git('rm', 'cancelled.txt')
        self.git('commit', '-m', 'Remove')
        self.prepare()
        self.manifest['approved_commits'] = self.git('rev-list', '--reverse', self.base + '..HEAD').decode().splitlines()
        self.assertEqual(self.check()['status'], 'FAIL')

    def test_nonancestor_base_fails(self):
        self.prepare()
        # A sibling root commit exists locally but is not an ancestor of HEAD.
        tree = self.git('rev-parse', 'HEAD^{tree}').decode().strip()
        other = self.git('commit-tree', tree, '-m', 'Other root').decode().strip()
        self.policy['base_sha'] = other
        self.manifest['base_sha'] = other
        self.manifest['policy_sha256'] = digest(self.policy)
        self.assertEqual(self.check()['status'], 'FAIL')
