
#!/usr/bin/env python3
"""OpenCode MCP adapter for the in-memory workflow controller.

One controller per MCP server process.
No protected evidence is written to intermediate files.
"""

import os
import hashlib
import subprocess
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
from session_snapshot import SnapshotError, new_snapshot_id, read_snapshot, write_snapshot

mcp = FastMCP("wod-harness")

_controller: WorkflowController | None = None

RUNTIME_MODULES = (
    'harness_mcp.py',
    'evidence_manager.py',
    'workflow_controller.py',
    'sdd_manager.py',
    'git_policy.py',
    'verification_runner.py',
    'session_snapshot.py',
)

SNAPSHOT_KEY_ENV = 'HARNESS_SNAPSHOT_HMAC_KEY'


def _runtime_fingerprint():
    modules = {}
    for name in RUNTIME_MODULES:
        path = HARNESS_DIR / name
        modules[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    return {'modules': modules, 'sha256': hashlib.sha256(
        ''.join(name + ':' + digest for name, digest in sorted(modules.items())).encode()
    ).hexdigest()}


LOADED_RUNTIME = _runtime_fingerprint()


def _runtime_status():
    disk = _runtime_fingerprint()
    return {'loaded': LOADED_RUNTIME, 'disk': disk, 'matches': LOADED_RUNTIME == disk}


def _git_context():
    env = {**os.environ, 'GIT_OPTIONAL_LOCKS': '0', 'GIT_TERMINAL_PROMPT': '0'}
    def read(*arguments):
        result = subprocess.run(['git', '-C', str(REPOSITORY_ROOT), *arguments],
                                capture_output=True, env=env, timeout=20)
        if result.returncode:
            raise EvidenceError('Cannot observe Git context for snapshot restoration')
        return os.fsdecode(result.stdout).strip()
    # Snapshots are private harness state, not Issue work, and must not make
    # their own restoration fail by appearing as untracked repository files.
    status = read('status', '--porcelain=v1', '--untracked-files=all', '--',
                  ':(exclude).harness-snapshots')
    return {'head': read('rev-parse', '--verify', 'HEAD'),
            'branch': read('branch', '--show-current'),
            'status_sha256': hashlib.sha256(status.encode()).hexdigest()}


def _require_current_runtime(allow_diagnostic=False):
    status = _runtime_status()
    if not status['matches'] and not allow_diagnostic:
        raise EvidenceError('Harness runtime differs from code on disk; restart before mutable operations')
    return status


def _snapshot_key():
    value = os.environ.get(SNAPSHOT_KEY_ENV)
    if value is None:
        raise EvidenceError(f'{SNAPSHOT_KEY_ENV} must be configured outside the repository')
    key = value.encode('utf-8')
    if len(key) < 32:
        raise EvidenceError(f'{SNAPSHOT_KEY_ENV} must contain at least 32 bytes')
    return key


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

    _require_current_runtime()

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
            "runtime": _runtime_status(),
        }

    return {**_controller.snapshot(), "runtime": _runtime_status()}


@mcp.tool()
def harness_snapshot() -> dict:
    """Persist the active session atomically after runtime and Git validation."""
    try:
        _require_current_runtime()
        controller = _current_controller()
        snapshot_id = new_snapshot_id()
        event = {'phase': controller.phase, 'status': 'SNAPSHOT_WRITTEN',
                 'snapshot_id': snapshot_id}
        controller.history.append(event)
        try:
            path = write_snapshot(
                controller.evidence.repository,
                controller.evidence.issue,
                controller.evidence.workflow_id,
                LOADED_RUNTIME,
                _git_context(),
                controller.persistent_state(),
                _snapshot_key(),
                snapshot_id=snapshot_id,
            )
        except Exception:
            controller.history.pop()
            raise
        return {'status': 'PASS', 'path': str(path), 'snapshot_id': snapshot_id,
                'runtime': _runtime_status()}
    except (EvidenceError, SnapshotError, OSError, subprocess.TimeoutExpired) as exc:
        return {'status': 'BLOCK', 'error': str(exc)}


@mcp.tool()
def harness_restore(issue: int, workflow_id: str, snapshot_id: str) -> dict:
    """Restore exactly one compatible snapshot only when no session is active."""
    global _controller
    try:
        _require_current_runtime()
        if _controller is not None:
            raise EvidenceError('An active workflow cannot be replaced by a restore')
        path = snapshot_path(issue, workflow_id, snapshot_id)
        payload = read_snapshot(path, REPOSITORY_ROOT, issue, workflow_id,
                                LOADED_RUNTIME, _git_context(), _snapshot_key())
        controller = WorkflowController.from_persistent_state(payload['state'])
        controller.restored('scripts/harness/harness_mcp.py restore')
        _controller = controller
        return {'status': 'PASS', 'workflow': controller.snapshot()['workflow'],
                'runtime': _runtime_status()}
    except (EvidenceError, SnapshotError, OSError, subprocess.TimeoutExpired) as exc:
        return {'status': 'BLOCK', 'error': str(exc)}


def snapshot_path(issue: int, workflow_id: str, snapshot_id: str) -> Path:
    if not snapshot_id or any(character not in '0123456789abcdef' for character in snapshot_id):
        raise EvidenceError('Snapshot identifier is invalid')
    digest = hashlib.sha256(workflow_id.encode('utf-8')).hexdigest()[:16]
    return REPOSITORY_ROOT / '.harness-snapshots' / f'issue-{issue:03d}-{digest}-{snapshot_id}.json'


@mcp.tool()
def harness_call(
    operation: str,
    arguments: dict[str, Any] | None = None,
) -> dict:
    """Run a supported WorkflowController operation.

    Valid operations:
    snapshot, advance, record_external, record_static,
    decide_guard, notify, invoke, enter_repair, recover,
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

        _require_current_runtime(allow_diagnostic=operation in ('snapshot', 'export_static'))

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
