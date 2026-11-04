"""All staging and commits in this suite are confined to temporary repositories."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import unittest
import test_review_changes as review_tests
SCRIPT = review_tests.SCRIPT


class PrepareStagingTests(unittest.TestCase):
    git = review_tests.ReviewChangesTests.git
    snapshot = review_tests.ReviewChangesTests.snapshot
    review = review_tests.ReviewChangesTests.review

    def setUp(self):
        review_tests.ReviewChangesTests.setUp(self)
        self.git('checkout', '-b', 'feat/075-example')

    def stage(self, paths, mutate=None):
        evidence = self.review()
        manifest = []
        for path in paths:
            full = self.repo / path
            manifest.append({'path': path, 'mode': '100644' if full.exists() else '0',
                             'sha256': hashlib.sha256(full.read_bytes()).hexdigest() if full.exists() else None})
        approval = {'issue': 75, 'status': 'PASS', 'manifest': manifest,
                    'evidence_sha256': hashlib.sha256(json.dumps(evidence, sort_keys=True,
                        separators=(',', ':'), ensure_ascii=True).encode()).hexdigest()}
        ep = Path(self.tmp.name) / 'evidence.json'
        ap = Path(self.tmp.name) / 'approval.json'
        ep.write_text(json.dumps({'pre_stage_evidence': evidence}))
        ap.write_text(json.dumps(approval))
        if mutate:
            mutate()
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(SCRIPT), 'prepare-staging', '--issue', '75',
                                  '--evidence-json', str(ep), '--approval-json', str(ap)],
                                  cwd=self.repo, capture_output=True, text=True)
        result = json.loads(process.stdout)['staging_preparation_evidence']
        if result['status'] == 'BLOCK':
            self.assertEqual(before, self.snapshot())
        self.assertEqual(process.returncode, 0 if result['status'] == 'PASS' else 1)
        return result

    def test_stage_whole_file_preserves_unrelated(self):
        (self.repo / 'old.txt').write_text('approved')
        (self.repo / 'new.txt').write_text('new')
        (self.repo / 'opencode.json').write_text('protected')
        head = self.git('rev-parse', 'HEAD')
        r = self.stage(['old.txt', 'new.txt'])
        self.assertEqual(r['status'], 'PASS', r)
        self.assertEqual(self.git('rev-parse', 'HEAD'), head)
        self.assertEqual(set(self.git('diff', '--cached', '--name-only').decode().splitlines()), {'old.txt', 'new.txt'})
        self.assertEqual((self.repo / 'opencode.json').read_text(), 'protected')

    def test_stale_content_blocks(self):
        (self.repo / 'old.txt').write_text('approved')
        self.assertEqual(self.stage(['old.txt'], lambda: (self.repo / 'old.txt').write_text('later'))['status'], 'BLOCK')

    def test_unrelated_staging_blocks(self):
        (self.repo / 'old.txt').write_text('approved')
        (self.repo / 'plan.md').write_text('other')
        self.git('add', 'plan.md')
        self.assertEqual(self.stage(['old.txt'])['status'], 'BLOCK')

    def test_protected_blocks(self):
        (self.repo / 'opencode.json').write_text('{}')
        self.assertEqual(self.stage(['opencode.json'])['status'], 'BLOCK')

    def test_delete_and_rename(self):
        self.git('mv', 'old.txt', 'new name.txt')
        (self.repo / 'delete.txt').unlink()
        self.assertEqual(self.stage(['old.txt', 'new name.txt', 'delete.txt'])['status'], 'PASS')

    def test_partial_staging_blocks(self):
        (self.repo / 'old.txt').write_text('first')
        self.git('add', 'old.txt')
        (self.repo / 'old.txt').write_text('mixed')
        self.assertEqual(self.stage(['old.txt'])['status'], 'BLOCK')

    def test_existing_lock_preserved(self):
        (self.repo / 'old.txt').write_text('approved')
        (self.repo / '.git/index.lock').write_text('other process')
        self.assertEqual(self.stage(['old.txt'])['status'], 'BLOCK')
        self.assertEqual((self.repo / '.git/index.lock').read_text(), 'other process')

    def test_matching_existing_staging_is_preserved(self):
        (self.repo / 'old.txt').write_text('approved')
        self.git('add', 'old.txt')
        self.assertEqual(self.stage(['old.txt'])['status'], 'PASS')

    def test_unapproved_rename_source_blocks(self):
        self.git('mv', 'old.txt', 'new.txt')
        self.assertEqual(self.stage(['new.txt'])['status'], 'BLOCK')

    def test_base_branch_blocks(self):
        self.git('checkout', 'main')
        (self.repo / 'old.txt').write_text('approved')
        self.assertEqual(self.stage(['old.txt'])['status'], 'BLOCK')
