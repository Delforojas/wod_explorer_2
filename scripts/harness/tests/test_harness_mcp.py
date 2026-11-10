
"""Integration tests for the MCP adapter argument transport."""

import sys
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))

import harness_mcp
from workflow_controller import WorkflowController


class HarnessMCPTests(unittest.TestCase):

    def tearDown(self):
        harness_mcp._controller = None

    def test_in_memory_policy_transport(self):
        issue = 197

        policy = {
            "policy": "standard-main",
            "base_branch": "main",
            "base_ref": "origin/main",
            "base_remote_ref": "refs/heads/main",
            "base_sha": "a" * 40,
            "pr_target": "main",
            "pr_target_ref": "refs/heads/main",
        }

        controller = WorkflowController(
            issue=issue,
            repository=harness_mcp.REPOSITORY_ROOT,
            workflow_id="mcp-integration-test",
        )
        controller.phase = 3

        harness_mcp._controller = controller

        expected = {
            "base_validation_evidence": {
                "status": "PASS",
                "base_sha": policy["base_sha"],
            }
        }

        with patch.object(
            harness_mcp,
            "perform",
            return_value=expected,
        ) as mock_perform:
            with patch.object(
                harness_mcp.Path,
                "cwd",
                return_value=harness_mcp.REPOSITORY_ROOT,
            ):
                response = harness_mcp.harness_call(
                    operation="invoke",
                    arguments={
                        "operation": "git_policy.validate_base",
                        "arguments": {
                            "issue": issue,
                            "policy_path": policy,
                        },
                    },
                )

        self.assertEqual(response["status"], "PASS")
        self.assertEqual(response["result"], expected)

        forwarded = mock_perform.call_args.args[1]

        self.assertEqual(
            forwarded["arguments"]["arguments"]["policy_path"],
            policy,
        )

    def test_snapshot_and_restore_require_a_process_boundary(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            subprocess.run(['git', 'init', '-b', 'main'], cwd=repo, check=True,
                           capture_output=True)
            subprocess.run(['git', 'config', 'user.email', 'test@example.invalid'], cwd=repo,
                           check=True, capture_output=True)
            subprocess.run(['git', 'config', 'user.name', 'Test'], cwd=repo,
                           check=True, capture_output=True)
            (repo / 'baseline.txt').write_text('baseline\n')
            subprocess.run(['git', 'add', 'baseline.txt'], cwd=repo, check=True,
                           capture_output=True)
            subprocess.run(['git', 'commit', '-m', 'Baseline'], cwd=repo, check=True,
                           capture_output=True)

            controller = WorkflowController(189, repo, 'restore-test')
            controller.phase = 4
            controller.evidence.record('sdd_validation_evidence', {
                'source': 'test', 'phase': 4, 'issue': 189, 'repository': str(repo),
                'workflow_id': 'restore-test', 'status': 'PASS',
                'observed_at': '2026-11-10T00:00:00+00:00',
            })

            with patch.object(harness_mcp, 'REPOSITORY_ROOT', repo):
                with patch.dict(os.environ, {
                    harness_mcp.SNAPSHOT_KEY_ENV: 'test-key-that-is-at-least-thirty-two-bytes-long',
                }):
                    harness_mcp._controller = controller
                    written = harness_mcp.harness_snapshot()
                    self.assertEqual(written['status'], 'PASS', written)

                    blocked = harness_mcp.harness_restore(189, 'restore-test', written['snapshot_id'])
                    self.assertEqual(blocked['status'], 'BLOCK')

                    harness_mcp._controller = None
                    restored = harness_mcp.harness_restore(189, 'restore-test', written['snapshot_id'])

            self.assertEqual(restored['status'], 'PASS', restored)
            self.assertEqual(harness_mcp._controller.phase, 4)
            self.assertFalse(harness_mcp._controller.evidence.mutable['sdd_validation_evidence']['valid'])

    def test_mutable_operations_reject_runtime_mismatch(self):
        with patch.object(harness_mcp, '_runtime_status', return_value={'matches': False}):
            with self.assertRaisesRegex(Exception, 'runtime differs'):
                harness_mcp._require_current_runtime()
