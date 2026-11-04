"""Commit creation tests operate exclusively in temporary repositories."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import unittest
import test_pre_commit_check as pre_tests


class CreateCommitTests(unittest.TestCase):
    git = pre_tests.PreCommitCheckTests.git
    snapshot = pre_tests.PreCommitCheckTests.snapshot
    review = pre_tests.PreCommitCheckTests.review
    stage = pre_tests.PreCommitCheckTests.stage
    prepare = pre_tests.PreCommitCheckTests.prepare
    check = pre_tests.PreCommitCheckTests.check

    def setUp(self):
        pre_tests.PreCommitCheckTests.setUp(self)
        self.prepare()
        self.pre = self.check()
        self.assertEqual(self.pre['status'], 'PASS')
        self.root = Path(self.tmp.name)
        self.message = 'feat: approved Issue work (#75)\n'
        self.authorization = {'status': 'APPROVED', 'issue': 75, 'workflow_id': 'workflow-test',
                              'pre_commit_evidence_sha256': pre_tests.digest(self.pre),
                              'message_sha256': hashlib.sha256(self.message.encode()).hexdigest()}

    def create(self):
        (self.root / 'pre.json').write_text(json.dumps({'pre_commit_evidence': self.pre}))
        (self.root / 'authorization.json').write_text(json.dumps(self.authorization))
        (self.root / 'message.txt').write_text(self.message)
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(pre_tests.SCRIPT), 'create-commit',
                                  '--issue', '75', '--workflow-id', 'workflow-test',
                                  '--message-file', str(self.root / 'message.txt'),
                                  '--pre-commit-json', str(self.root / 'pre.json'),
                                  '--authorization-json', str(self.root / 'authorization.json'),
                                  *[arg for name in ('evidence', 'staging', 'policy', 'manifest')
                                    for arg in ('--' + name + '-json', str(self.root / (name + '.json')))]],
                                  cwd=self.repo, capture_output=True, text=True)
        e = json.loads(process.stdout)['commit_creation_evidence']
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        if not e['commit_attempted']:
            self.assertEqual(before, self.snapshot())
        return e

    def hook(self, name, content):
        path = self.repo / '.git/hooks' / name
        path.write_text('#!/bin/sh\n' + content)
        path.chmod(0o755)

    def test_creates_exactly_one_commit(self):
        before = self.git('rev-parse', 'HEAD').decode().strip()
        e = self.create()
        self.assertEqual(e['status'], 'PASS', e)
        self.assertTrue(e['commit_created'])
        self.assertEqual(self.git('rev-list', '--count', before + '..HEAD').strip(), b'1')
        self.assertEqual(self.git('rev-parse', 'HEAD^').decode().strip(), before)
        self.assertFalse(self.git('diff', '--cached'))

    def test_missing_authorization_blocks(self):
        self.authorization['status'] = 'BLOCK'
        self.assertFalse(self.create()['commit_attempted'])

    def test_other_workflow_blocks(self):
        self.authorization['workflow_id'] = 'other'
        self.assertFalse(self.create()['commit_attempted'])

    def test_changed_message_blocks(self):
        self.message = 'different (#75)\n'
        self.assertFalse(self.create()['commit_attempted'])

    def test_missing_issue_reference_blocks(self):
        self.message = 'untraceable\n'
        self.authorization['message_sha256'] = hashlib.sha256(self.message.encode()).hexdigest()
        self.assertFalse(self.create()['commit_attempted'])

    def test_stale_staging_blocks(self):
        (self.repo / 'old.txt').write_text('unapproved')
        self.git('add', 'old.txt')
        self.assertFalse(self.create()['commit_attempted'])

    def test_wrong_branch_blocks(self):
        self.git('checkout', '-b', 'feat/076-other')
        self.assertFalse(self.create()['commit_attempted'])

    def test_failed_hook_stops_without_retry(self):
        before = self.git('rev-parse', 'HEAD')
        self.hook('pre-commit', 'exit 1\n')
        e = self.create()
        self.assertEqual(e['status'], 'BLOCK')
        self.assertTrue(e['commit_attempted'])
        self.assertFalse(e['commit_created'])
        self.assertEqual(self.git('rev-parse', 'HEAD'), before)
        self.assertTrue(self.git('diff', '--cached'))

    def test_hook_altered_commit_is_reported_without_rewrite(self):
        self.hook('pre-commit', "echo accidental > accidental.txt\ngit add accidental.txt\n")
        e = self.create()
        self.assertEqual(e['status'], 'BLOCK')
        self.assertTrue(e['commit_created'])
        self.assertTrue(e['manual_intervention_required'])
        self.assertEqual(self.git('rev-parse', 'HEAD').decode().strip(), e['commit_sha'])
        self.assertIn('accidental.txt', self.git('show', '--format=', '--name-only', 'HEAD').decode())

    def test_hook_modified_message_is_reported(self):
        self.hook('commit-msg', 'echo "changed (#75)" > "$1"\n')
        e = self.create()
        self.assertEqual(e['status'], 'BLOCK')
        self.assertTrue(e['commit_created'])

    def test_pending_merge_blocks(self):
        (self.repo / '.git/MERGE_HEAD').write_text(self.pre['head_sha'] + '\n')
        self.assertFalse(self.create()['commit_attempted'])

    def test_preserves_unrelated_local_work(self):
        (self.repo / 'opencode.json').write_text('protected local')
        (self.repo / 'untracked.txt').write_text('untracked local')
        # New local state requires fresh approval of pre-commit evidence.
        self.pre = self.check()
        self.authorization['pre_commit_evidence_sha256'] = pre_tests.digest(self.pre)
        e = self.create()
        self.assertEqual(e['status'], 'PASS', e)
        self.assertEqual((self.repo / 'opencode.json').read_text(), 'protected local')
        self.assertEqual((self.repo / 'untracked.txt').read_text(), 'untracked local')

    def test_rerun_cannot_create_duplicate(self):
        self.assertEqual(self.create()['status'], 'PASS')
        head = self.git('rev-parse', 'HEAD')
        e = self.create()
        self.assertFalse(e['commit_attempted'])
        self.assertEqual(self.git('rev-parse', 'HEAD'), head)
