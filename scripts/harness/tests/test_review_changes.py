"""Phase-9 integration tests; all Git writes happen in temporary repositories."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'git_policy.py'
if not SCRIPT.exists():
    SCRIPT = Path(__file__).with_name('git_policy.py')


class ReviewChangesTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name).resolve() / 'repo'
        self.repo.mkdir()
        self.git('init', '-b', 'main')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('config', 'user.name', 'Test')
        for name in ('spec.md', 'plan.md', 'tasks.md', 'old.txt', 'delete.txt', 'opencode.json'):
            (self.repo / name).write_text('- [ ] pending\n')
        self.git('add', '.')
        self.git('commit', '-m', 'Initial')

    def git(self, *args):
        return subprocess.run(['git', *args], cwd=self.repo, check=True,
                              capture_output=True, env={**os.environ, 'GIT_OPTIONAL_LOCKS': '0'}).stdout

    def snapshot(self):
        return {str(p.relative_to(self.repo)): p.read_bytes()
                for p in self.repo.rglob('*') if p.is_file()}

    def review(self, *extra, cwd=None):
        before = self.snapshot()
        result = subprocess.run([sys.executable, str(SCRIPT), 'review-changes',
                                 '--issue', '75', '--spec-path', 'spec.md',
                                 '--plan-path', 'plan.md', '--tasks-path', 'tasks.md',
                                 *extra], cwd=cwd or self.repo, capture_output=True, text=True)
        self.assertEqual(before, self.snapshot(), 'Operation wrote repository bytes')
        evidence = json.loads(result.stdout)['pre_stage_evidence']
        self.assertEqual(result.returncode, 0 if evidence['status'] == 'PASS' else 1)
        return evidence

    def test_clean_and_sdd(self):
        e = self.review()
        self.assertEqual(e['status'], 'PASS')
        self.assertEqual(e['sdd']['tasks']['raw_tasks'], ['- [ ] pending'])
        self.assertEqual(len(e['sdd']['spec']['sha256']), 64)
        self.assertIsNone(e['preexisting_changes'])

    def test_full_inventory_and_protection(self):
        self.git('mv', 'old.txt', 'renamed\n file.txt')
        (self.repo / 'renamed\n file.txt').write_text('unstaged\n')
        (self.repo / 'delete.txt').unlink()
        (self.repo / 'new\n file').write_bytes(b'\x00\xff')
        (self.repo / 'opencode.json').write_text('{}')
        e = self.review()
        self.assertEqual(e['status'], 'PASS')
        manifest = {c['path']: c for c in e['git_state']['manifest']}
        self.assertEqual(manifest['renamed\n file.txt']['states'], ['M', 'R'])
        self.assertEqual(manifest['delete.txt']['states'], ['D'])
        self.assertEqual(manifest['new\n file']['states'], ['A'])
        self.assertTrue(any(c['special_protection'] for c in e['protected_paths']))
        self.assertTrue(e['git_state']['staged_diff'])
        self.assertTrue(e['git_state']['unstaged_diff'])

    def test_missing_sdd_fails(self):
        (self.repo / 'plan.md').unlink()
        self.assertEqual(self.review()['collection_status'], 'incomplete')

    def test_malformed_baseline_fails(self):
        path = Path(self.tmp.name) / 'baseline.json'
        path.write_text('{}')
        self.assertEqual(self.review('--baseline-json', str(path))['status'], 'FAIL')

    def test_baseline_inventory(self):
        path = Path(self.tmp.name) / 'baseline.json'
        entry = {'path': 'opencode.json', 'original_path': None,
                 'index_status': ' ', 'worktree_status': 'M'}
        baseline = {'status': 'complete', 'issue': 75,
                    'git': {'repository_root': str(self.repo)},
                    'preexisting_protected_changes': [entry]}
        path.write_text(json.dumps({'branch_evidence': baseline}))
        e = self.review('--baseline-json', str(path))
        self.assertEqual(e['status'], 'PASS')
        self.assertEqual(e['preexisting_changes'], [entry])
        self.assertEqual(e['protected_paths'][0]['provenance'], 'baseline-only')
        baseline['issue'] = 76
        path.write_text(json.dumps({'branch_evidence': baseline}))
        self.assertEqual(self.review('--baseline-json', str(path))['collection_status'], 'contradictory')

    def test_subdirectory_invocation(self):
        sub = self.repo / 'sub'
        sub.mkdir()
        (self.repo / 'old.txt').write_text('changed')
        self.assertEqual(self.review(cwd=sub)['git_state']['changes'][0]['path'], 'old.txt')

    def test_sdd_escape_fails(self):
        self.assertEqual(self.review('--spec-path', '../outside')['status'], 'FAIL')

    def test_merge_conflict_is_contradictory(self):
        self.git('checkout', '-b', 'other')
        (self.repo / 'old.txt').write_text('other\n')
        self.git('commit', '-am', 'Other')
        self.git('checkout', 'main')
        (self.repo / 'old.txt').write_text('main\n')
        self.git('commit', '-am', 'Main')
        subprocess.run(['git', 'merge', 'other'], cwd=self.repo, capture_output=True)
        self.assertEqual(self.review()['collection_status'], 'contradictory')

    def test_nonrepository_fails_as_json(self):
        self.assertEqual(self.review(cwd=Path(self.tmp.name))['status'], 'FAIL')

    def test_unborn_head_fails(self):
        self.git('checkout', '--orphan', 'empty')
        self.assertEqual(self.review()['status'], 'FAIL')


if __name__ == '__main__':
    unittest.main()
