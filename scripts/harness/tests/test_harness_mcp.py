
"""Integration tests for the MCP adapter argument transport."""

import sys
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
