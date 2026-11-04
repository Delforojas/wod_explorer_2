"""Read-only commit validation with all mutations confined to temporary repos."""
import json
from pathlib import Path
import subprocess
import sys
import unittest
import test_create_commit as creation_tests
import test_pre_commit_check as pre_tests


class CheckCommitTests(unittest.TestCase):
    git = creation_tests.CreateCommitTests.git
    snapshot = creation_tests.CreateCommitTests.snapshot
    review = creation_tests.CreateCommitTests.review
    stage = creation_tests.CreateCommitTests.stage
    prepare = creation_tests.CreateCommitTests.prepare
    check = creation_tests.CreateCommitTests.check
    create = creation_tests.CreateCommitTests.create
    hook = creation_tests.CreateCommitTests.hook

    def setUp(self):
        creation_tests.CreateCommitTests.setUp(self)
        self.creation = self.create()
        self.assertEqual(self.creation['status'], 'PASS', self.creation)

    def verify(self):
        (self.root / 'creation.json').write_text(json.dumps({'commit_creation_evidence': self.creation}))
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(pre_tests.SCRIPT), 'check-commit',
                                  '--issue', '75', '--workflow-id', 'workflow-test',
                                  '--message-file', str(self.root / 'message.txt'),
                                  '--pre-commit-json', str(self.root / 'pre.json'),
                                  '--authorization-json', str(self.root / 'authorization.json'),
                                  '--creation-json', str(self.root / 'creation.json'),
                                  *[arg for name in ('evidence', 'staging', 'policy', 'manifest')
                                    for arg in ('--' + name + '-json', str(self.root / (name + '.json')))]],
                                  cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(before, self.snapshot(), 'check-commit modified repository bytes')
        e = json.loads(process.stdout)['commit_check_evidence']
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        return e

    def test_valid_commit(self):
        e = self.verify()
        self.assertEqual(e['status'], 'PASS', e)
        self.assertEqual(e['commit_sha'], self.creation['commit_sha'])

    def test_repeated_checks_are_read_only(self):
        self.assertEqual(self.verify()['status'], 'PASS')
        self.assertEqual(self.verify()['status'], 'PASS')

    def test_wrong_branch_blocks(self):
        self.git('checkout', '-b', 'feat/076-other')
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_head_advanced_blocks(self):
        (self.repo / 'later.txt').write_text('later')
        self.git('add', 'later.txt')
        self.git('commit', '-m', 'Later (#75)')
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_missing_commit_blocks(self):
        self.creation['commit_sha'] = '0' * 40
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_creation_block_cannot_be_accepted(self):
        self.creation['status'] = 'BLOCK'
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_no_creation_claim_blocks(self):
        self.creation['commit_created'] = False
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_wrong_workflow_blocks(self):
        self.creation['workflow_id'] = 'other'
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_wrong_parent_blocks(self):
        self.creation['before_head'] = '0' * 40
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_wrong_tree_blocks(self):
        self.creation['approved_tree'] = '0' * 40
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_wrong_patch_blocks(self):
        self.creation['staged_diff_sha256'] = '0' * 64
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_wrong_message_blocks(self):
        self.creation['message'] = 'unapproved (#75)'
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_tampered_candidate_manifest_blocks(self):
        self.manifest['candidate_paths'].append('outside.txt')
        (self.root / 'manifest.json').write_text(json.dumps(self.manifest))
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_tampered_pre_commit_evidence_blocks(self):
        self.pre['staged_diff_sha256'] = '0' * 64
        (self.root / 'pre.json').write_text(json.dumps({'pre_commit_evidence': self.pre}))
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_local_changes_are_preserved(self):
        (self.repo / 'opencode.json').write_text('protected local')
        (self.repo / 'new-local.txt').write_text('local work')
        self.assertEqual(self.verify()['status'], 'PASS')

    def test_historical_base_survives_remote_reference_advance(self):
        self.git('update-ref', 'refs/remotes/origin/main', self.creation['commit_sha'])
        self.assertEqual(self.verify()['status'], 'PASS')

    def test_amended_commit_cannot_replace_workflow_commit(self):
        self.git('commit', '--amend', '-m', 'Changed message (#75)')
        self.assertEqual(self.verify()['status'], 'BLOCK')

    def test_empty_commit_is_rejected_even_with_relabelled_hash(self):
        before = self.creation['commit_sha']
        self.git('commit', '--allow-empty', '-m', self.message.strip())
        self.creation['before_head'] = before
        self.creation['commit_sha'] = self.git('rev-parse', 'HEAD').decode().strip()
        self.assertEqual(self.verify()['status'], 'BLOCK')
