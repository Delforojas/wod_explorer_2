
"""Integration tests for the MCP adapter argument transport."""

from datetime import datetime, timezone
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

    def test_record_static_validation_error_does_not_block_the_workflow(self):
        """Issue #209: a malformed record_static call must not permanently BLOCK the controller."""
        controller = WorkflowController(
            issue=209,
            repository=harness_mcp.REPOSITORY_ROOT,
            workflow_id="mcp-validation-test",
        )
        controller.phase = 1
        harness_mcp._controller = controller

        observed_at = datetime.now(timezone.utc).isoformat()

        with patch.object(
            harness_mcp.Path, "cwd", return_value=harness_mcp.REPOSITORY_ROOT
        ):
            response = harness_mcp.harness_call(
                operation="record_static",
                arguments={
                    "key": "context",
                    "payload": {"path": "AGENTS.md", "sha256": "a"},
                    "kind": "context_item",
                    "source": "approved context",
                    "observed_at": observed_at,
                },
            )

        self.assertEqual(response["status"], "BLOCK")
        self.assertEqual(response["workflow_status"], "RUNNING")
        self.assertEqual(controller.status, "RUNNING")
        self.assertEqual(controller.phase, 1)

        with patch.object(
            harness_mcp.Path, "cwd", return_value=harness_mcp.REPOSITORY_ROOT
        ):
            retry = harness_mcp.harness_call(
                operation="record_static",
                arguments={
                    "key": "issue_identity",
                    "payload": {
                        "number": 209,
                        "title": "Test",
                        "url": "https://github.com/x/y/issues/209",
                        "repository_full_name": "x/y",
                    },
                    "kind": "issue_identity",
                    "source": "github-mcp",
                    "observed_at": observed_at,
                },
            )

        self.assertEqual(retry["status"], "PASS")
        self.assertEqual(controller.status, "RUNNING")

    def test_record_static_unsupported_fields_does_not_block_the_workflow(self):
        controller = WorkflowController(
            issue=209,
            repository=harness_mcp.REPOSITORY_ROOT,
            workflow_id="mcp-validation-test-2",
        )
        controller.phase = 1
        harness_mcp._controller = controller

        observed_at = datetime.now(timezone.utc).isoformat()

        with patch.object(
            harness_mcp.Path, "cwd", return_value=harness_mcp.REPOSITORY_ROOT
        ):
            response = harness_mcp.harness_call(
                operation="record_static",
                arguments={
                    "key": "approved_scope",
                    "payload": {
                        "description": "Fix validation errors",
                        "acceptance_criteria": [],
                        "constraints": [],
                        "approved_by": "user",
                    },
                    "kind": "issue_identity",
                    "source": "github-mcp",
                    "observed_at": observed_at,
                },
            )

        self.assertEqual(response["status"], "BLOCK")
        self.assertEqual(response["workflow_status"], "RUNNING")
        self.assertEqual(controller.status, "RUNNING")

        with patch.object(
            harness_mcp.Path, "cwd", return_value=harness_mcp.REPOSITORY_ROOT
        ):
            retry = harness_mcp.harness_call(
                operation="record_static",
                arguments={
                    "key": "approved_scope",
                    "payload": {
                        "description": "Fix validation errors",
                        "acceptance_criteria": [],
                        "constraints": [],
                        "approved_by": "user",
                    },
                    "kind": "approved_scope",
                    "source": "github-mcp",
                    "observed_at": observed_at,
                },
            )

        self.assertEqual(retry["status"], "PASS")
        self.assertEqual(controller.status, "RUNNING")

    def test_a_real_guard_failure_still_blocks_the_workflow(self):
        """A real guard-decision failure (not a record_static validation error) must still BLOCK."""
        controller = WorkflowController(
            issue=209,
            repository=harness_mcp.REPOSITORY_ROOT,
            workflow_id="mcp-guard-test",
        )
        controller.phase = 1
        harness_mcp._controller = controller

        with patch.object(
            harness_mcp.Path, "cwd", return_value=harness_mcp.REPOSITORY_ROOT
        ):
            response = harness_mcp.harness_call(
                operation="decide_guard",
                arguments={
                    "name": "issue",
                    "status": "PASS",
                    "source": "wrong-source.md",
                    "references": [],
                    "reason": "looks fine",
                },
            )

        self.assertEqual(response["status"], "BLOCK")
        self.assertEqual(response["workflow_status"], "BLOCKED")
        self.assertEqual(controller.status, "BLOCKED")
