from datetime import datetime, timezone
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))
from workflow_audit import AuditError, normalize_github_observation, validate_action_log
from workflow_controller import ActionAudit
import verification_runner


class WorkflowAuditTests(unittest.TestCase):
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

    def test_controller_owned_audit_starts_with_a_continuous_valid_log(self):
        audit = ActionAudit('wf')
        audit.record('advance', 'PASS')
        audit.record('create-commit', 'PASS', commit_sha='a' * 40)
        audit.record('github-documentation', 'PASS', comment_id=123)
        self.assertEqual(validate_action_log(audit.payload(), 'wf')['workflow_id'], 'wf')

    def test_remote_reference_check_blocks_when_the_observation_changes(self):
        with mock.patch.object(ActionAudit, '_remote_refs', side_effect=[('a refs/heads/main',), ('b refs/heads/main',)]):
            audit = ActionAudit('wf')
            self.assertFalse(audit.check_remote_refs())
        self.assertEqual(audit.payload()['events'][-1]['remote_refs_unchanged'], False)

    def test_final_projection_binds_runner_manifest_to_committed_tree(self):
        with tempfile.TemporaryDirectory() as temp:
            root = (Path(temp) / 'repo').resolve()
            root.mkdir()
            for args in (('init', '-b', 'feat/075-test'), ('config', 'user.email', 'test@example.invalid'),
                         ('config', 'user.name', 'Test')):
                subprocess.run(['git', *args], cwd=root, check=True, capture_output=True)
            (root / 'work.txt').write_text('before\n')
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=root, check=True, capture_output=True)
            (root / 'work.txt').write_text('verified\n')
            manifest = Path(temp) / 'source-manifest.json'
            source = verification_runner.fingerprint(root, manifest)
            subprocess.run(['git', 'add', 'work.txt'], cwd=root, check=True, capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'feat: verified work (#75)'], cwd=root, check=True, capture_output=True)
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
                result = verification_runner.project_final(75, 'wf', {'verification_evidence': verification},
                    {'post_commit_evidence': post}, {'files': {'spec.md': 'a' * 64, 'plan.md': 'b' * 64, 'tasks.md': 'c' * 64}})
            finally:
                os.chdir(old_cwd)
            self.assertEqual(result['final_verification_evidence']['status'], 'PASS', result)
            verification['source_manifest']['sha256'] = '0' * 64
            old_cwd = Path.cwd()
            try:
                os.chdir(root)
                rejected = verification_runner.project_final(75, 'wf', {'verification_evidence': verification},
                    {'post_commit_evidence': post}, {'files': {'spec.md': 'a' * 64, 'plan.md': 'b' * 64, 'tasks.md': 'c' * 64}})
            finally:
                os.chdir(old_cwd)
            self.assertEqual(rejected['final_verification_evidence']['status'], 'BLOCK')
