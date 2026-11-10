
#!/usr/bin/env python3
"""OpenCode MCP adapter for the in-memory workflow controller.

One controller per MCP server process.
No protected evidence is written to intermediate files.
"""

import os
import sys
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

HARNESS_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = HARNESS_DIR.parent.parent.resolve()

sys.dont_write_bytecode = True
sys.path.insert(0, str(HARNESS_DIR))

from evidence_manager import EvidenceError
from workflow_controller import WorkflowController, perform

mcp = FastMCP("wod-harness")

_controller: WorkflowController | None = None


def _current_controller() -> WorkflowController:
    if _controller is None:
        raise EvidenceError(
            "No active workflow. Call harness_start first."
        )
    return _controller


def _result_status(result: Any) -> str:
    if isinstance(result, dict):
        if result.get("status") in (
            "BLOCK",
            "FAIL",
            "INCOMPLETE",
            "NEEDS_APPROVAL",
        ):
            return "BLOCK"
    return "PASS"


@mcp.tool()
def harness_start(issue: int, workflow_id: str) -> dict:
    """Start one in-memory workflow for the repository and Issue.

    Rejects attempts to replace an existing controller.
    """
    global _controller

    if _controller is not None:
        return {
            "status": "BLOCK",
            "error": "A workflow is already active.",
            "workflow": _controller.snapshot()["workflow"],
        }

    if issue < 1 or not workflow_id.strip():
        return {
            "status": "BLOCK",
            "error": "A valid Issue and workflow_id are required.",
        }

    if Path.cwd().resolve() != REPOSITORY_ROOT:
        return {
            "status": "BLOCK",
            "error": "Start MCP from the repository root.",
        }

    try:
        _controller = WorkflowController(
            issue=issue,
            repository=str(REPOSITORY_ROOT),
            workflow_id=workflow_id,
        )
        return {
            "status": "PASS",
            "workflow": _controller.snapshot()["workflow"],
        }
    except (EvidenceError, ValueError, TypeError) as exc:
        return {"status": "BLOCK", "error": str(exc)}


@mcp.tool()
def harness_status() -> dict:
    """Read the current in-memory workflow state."""
    if _controller is None:
        return {
            "status": "NOT_STARTED",
            "repository": str(REPOSITORY_ROOT),
        }

    return _controller.snapshot()


@mcp.tool()
def harness_call(
    operation: str,
    arguments: dict[str, Any] | None = None,
) -> dict:
    """Run a supported WorkflowController operation.

    Valid operations:
    snapshot, advance, record_external, record_static,
    decide_guard, notify, invoke, enter_repair,
    export_static, revisit_phase.

    Controller guardrails and phase restrictions remain authoritative.
    """
    try:
        controller = _current_controller()

        if Path.cwd().resolve() != REPOSITORY_ROOT:
            raise EvidenceError(
                "MCP working directory differs from repository root."
            )

        if operation == "start":
            raise EvidenceError(
                "Use harness_start. Session replacement is forbidden."
            )

        result = perform(
            controller,
            {
                "operation": operation,
                "arguments": arguments or {},
            },
        )

        return {
            "status": (
                "BLOCK"
                if controller.status == "BLOCKED"
                or _result_status(result) == "BLOCK"
                else "PASS"
            ),
            "result": result,
            "phase": controller.phase,
            "workflow_status": controller.status,
        }


    except (
        EvidenceError,
        ValueError,
        TypeError,
        KeyError,
        AttributeError,
        IndexError,
        OSError,
    ) as exc:
        if _controller is not None:
            _controller.status = "BLOCKED"

        return {
            "status": "BLOCK",
            "error": str(exc),
            "phase": _controller.phase if _controller is not None else None,
            "workflow_status": (
                _controller.status if _controller is not None else "NOT_STARTED"
            ),
        }



if __name__ == "__main__":
    os.chdir(REPOSITORY_ROOT)
    mcp.run(transport="stdio")
