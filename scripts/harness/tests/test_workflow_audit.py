from datetime import datetime, timezone
import json
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest

HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))
from workflow_audit import AuditError, normalize_github_observation, validate_action_log
import verification_runner


class WorkflowAuditTests(unittest.TestCase):
    def project_final(self, root, source, manifest):
        head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
        verification = {'status': 'PASS', 'issue': 75, 'workflow_id': 'wf', 'repository': str(root),
                        'source_fingerprint': source,
                        'source_manifest': {'path': str(manifest), 'sha256': verification_runner.file_digest(manifest)},
                        'reports': [{'id': 'unit', 'status': 'PASS', 'exit_code': 0,
                                     'evidence_valid': True, 'command': ['true']}]}
        post = {'status': 'complete', 'issue': 75, 'workflow_id': 'wf', 'repository': str(root),
                'head': head, 'last_commit': {'sha': head}}
        old_cwd = Path.cwd()
        try:
            os.chdir(root)
            return verification_runner.project_final(75, 'wf', {'verification_evidence': verification},
                {'post_commit_evidence': post},
                {'files': {'spec.md': 'a' * 64, 'plan.md': 'b' * 64, 'tasks.md': 'c' * 64}})
        finally:
            os.chdir(old_cwd)

    def new_repo(self, root):
        root.mkdir()
        for args in (('init', '-b', 'feat/075-test'), ('config', 'user.email', 'test@example.invalid'),
                     ('config', 'user.name', 'Test')):
            subprocess.run(['git', *args], cwd=root, check=True, capture_output=True)

    def test_normalizes_explicit_mocked_github_observation(self):
        value = {'source': 'github-mcp', 'repository': 'owner/repo', 'number': 75, 'state': 'open',
                 'issue_url': 'https://github.com/owner/repo/issues/75',
                 'observed_at': datetime.now(timezone.utc).isoformat(), 'comments': [{'id': 1, 'body': 'ok'}]}
        self.assertEqual(normalize_github_observation(value), value)

    def test_rejects_unverified_github_source(self):
        value = {'source': 'caller', 'repository': 'owner/repo', 'number': 75, 'state': 'open',
                 'issue_url': 'https://github.com/owner/repo/issues/75', 'observed_at': datetime.now(timezone.utc).isoformat(), 'comments': []}
        with self.assertRaises(AuditError):
            normalize_github_observation(value)

    def test_rejects_incomplete_or_external_action_audit(self):
        value = {'source': 'workflow-action-log', 'complete': True, 'coverage': 'entire-workflow', 'workflow_id': 'wf',
                 'events': [{'sequence': 1, 'operation': 'issue-start'}, {'sequence': 2, 'operation': 'push'}]}
        with self.assertRaises(AuditError):
            validate_action_log(value, 'wf')

    def test_final_projection_binds_runner_manifest_to_committed_tree(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            self.new_repo(root)
            (root / 'work.txt').write_text('before\n')
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            (root / 'work.txt').write_text('verified\n')
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'feat: verified work (#75)'], cwd=root, check=True, capture_output=True)
            result = self.project_final(root, source, manifest)
            self.assertEqual(result['final_verification_evidence']['status'], 'PASS', result)
            manifest.write_text('{}')
            rejected = self.project_final(root, source, manifest)
            self.assertEqual(rejected['final_verification_evidence']['status'], 'BLOCK')

    def test_final_projection_accepts_crlf_checkout_without_semantic_change(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            self.new_repo(root)
            (root / '.gitattributes').write_text('*.txt text eol=crlf\n')
            (root / 'work.txt').write_text('verified\n')
            subprocess.run(['git', 'add', '.gitattributes', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'rm', '--cached', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'reset', '--hard', 'HEAD'], cwd=root, check=True, capture_output=True)
            self.assertEqual((root / 'work.txt').read_bytes(), b'verified\r\n')
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            subprocess.run(['git', 'commit', '--allow-empty', '-m', 'Verification commit'], cwd=root, check=True,
                           capture_output=True)
            result = self.project_final(root, source, manifest)
            self.assertEqual(result['final_verification_evidence']['status'], 'PASS', result)

    def test_final_projection_accepts_lf_modified_before_commit(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            self.new_repo(root)
            (root / '.gitattributes').write_text('*.txt text eol=lf\n')
            (root / 'work.txt').write_text('before\n')
            subprocess.run(['git', 'add', '.gitattributes', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            (root / 'work.txt').write_text('verified\n')
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Verified'], cwd=root, check=True, capture_output=True)
            result = self.project_final(root, source, manifest)
            self.assertEqual(result['final_verification_evidence']['status'], 'PASS', result)

    def test_final_projection_blocks_semantic_content_change(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            self.new_repo(root)
            (root / 'work.txt').write_text('before\n')
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            (root / 'work.txt').write_text('verified\n')
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            (root / 'work.txt').write_text('tampered\n')
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Tampered'], cwd=root, check=True, capture_output=True)
            result = self.project_final(root, source, manifest)
            self.assertEqual(result['final_verification_evidence']['status'], 'BLOCK', result)

    def test_final_projection_blocks_missing_canonical_content_evidence(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            self.new_repo(root)
            (root / 'work.txt').write_text('verified\n')
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            data = json.loads(manifest.read_text())
            data['files']['work.txt'].pop('git_blob_oid')
            manifest.write_text(json.dumps(data))
            source['sha256'] = verification_runner.digest(data)
            subprocess.run(['git', 'commit', '--allow-empty', '-m', 'Verification commit'], cwd=root, check=True,
                           capture_output=True)
            result = self.project_final(root, source, manifest)
            error = result['final_verification_evidence']['errors'][0]
            self.assertIn('lacks canonical Git content evidence', error)
