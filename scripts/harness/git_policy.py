
#!/usr/bin/env python3
"""
Hybrid Issue Harness — Git Policy

Phase 3: Branch inspection.

The `inspect` operation is read-only:
- It does not create or switch branches.
- It does not stage files.
- It does not commit, push, stash, rebase or fetch.
- It does not select the canonical base policy.

It returns one structured `branch_evidence` observation.
"""

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys

from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SOURCE = "scripts/harness/git_policy.py inspect"

REQUIRED_POLICY_FIELDS = (
    "policy",
    "base_ref",
    "base_remote_ref",
    "base_sha",
    "pr_target",
    "pr_target_ref",
)


class GitError(Exception):
    """A required Git operation failed."""


sys.dont_write_bytecode = True
from evidence_manager import managed_operation, read_json, read_message_bytes

def run_git(
    *arguments: str,
    check: bool = True,
    timeout: int = 20,
) -> subprocess.CompletedProcess:
    """
    Execute a Git command without allowing optional Git locks
    or interactive credential prompts.
    """
    environment = os.environ.copy()
    environment["GIT_OPTIONAL_LOCKS"] = "0"
    environment["GIT_TERMINAL_PROMPT"] = "0"
    environment["GIT_PAGER"] = "cat"

    try:
        result = subprocess.run(
            ["git", *arguments],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=environment,
            timeout=timeout,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        raise GitError(
            f"Git command timed out: git {' '.join(arguments)}"
        ) from error
    except OSError as error:
        raise GitError(str(error)) from error

    if check and result.returncode != 0:
        message = result.stderr.decode(
            "utf-8", errors="replace"
        ).strip()

        raise GitError(
            f"git {' '.join(arguments)} failed: {message}"
        )

    return result


def decode(value: bytes) -> str:
    """Decode Git output without losing undecodable bytes."""
    return value.decode("utf-8", errors="surrogateescape")


def git_text(*arguments: str) -> str:
    return decode(run_git(*arguments).stdout).strip()


def git_optional(*arguments: str) -> str | None:
    result = run_git(*arguments, check=False)

    if result.returncode != 0:
        return None

    return decode(result.stdout).strip()


def read_status(raw: bytes | None = None) -> list[dict[str, Any]]:
    """
    Parse porcelain v1 -z.

    For renamed/copied paths in -z mode, Git returns:
      XY destination NUL source NUL

    Other entries return:
      XY path NUL
    """
    if raw is None:
        raw = run_git(
            "status", "--porcelain=v1", "-z", "-uall",
        ).stdout

    if raw and not raw.endswith(b"\0"):
        raise GitError("Truncated git status output")
    items = raw.split(b"\0")

    if items and items[-1] == b"":
        items.pop()

    changes = []
    position = 0

    while position < len(items):
        entry = items[position]
        position += 1

        if len(entry) < 4 or entry[2:3] != b" ":
            raise GitError("Malformed git status output")

        index_status = chr(entry[0])
        worktree_status = chr(entry[1])
        path = decode(entry[3:])

        original_path = None

        if "R" in (index_status, worktree_status) or \
           "C" in (index_status, worktree_status):

            if position >= len(items):
                raise GitError(
                    "Missing original path in rename/copy entry"
                )

            original_path = decode(items[position])
            if not original_path:
                raise GitError("Empty original rename/copy path")
            position += 1

        changes.append({
            "path": path,
            "original_path": original_path,
            "index_status": index_status,
            "worktree_status": worktree_status,
            "untracked": (
                index_status == "?"
                and worktree_status == "?"
            ),
            "ignored": (
                index_status == "!"
                and worktree_status == "!"
            ),
        })

    return changes


def classify_changes(
    changes: list[dict[str, Any]],
) -> dict[str, list[dict[str, Any]]]:
    """Separate index, working-tree and untracked states."""
    staged = []
    unstaged = []
    untracked = []

    for change in changes:
        if change["untracked"]:
            untracked.append(change)
            continue

        if change["index_status"] not in (" ", "?", "!"):
            staged.append(change)

        if change["worktree_status"] not in (" ", "?", "!"):
            unstaged.append(change)

    return {
        "staged": staged,
        "unstaged": unstaged,
        "untracked": untracked,
    }


def read_local_branches() -> list[str]:
    output = git_text(
        "branch",
        "--list",
        "--format=%(refname:short)",
    )

    return output.splitlines() if output else []


def find_issue_branches(
    branches: list[str],
    issue: int,
) -> list[str]:
    """
    Match the Issue number as a distinct branch segment.

    Examples for Issue 75:
      feat/075-auth      -> match
      issue-75           -> match
      feat/175-auth      -> no match
    """
    pattern = re.compile(
        rf"(?:^|[/_-])0*{issue}(?=$|[/_-])"
    )

    return [
        branch
        for branch in branches
        if pattern.search(branch)
    ]


def remote_sha(remote_ref: str) -> str | None:
    """
    Read an exact reference from origin without fetching.

    No SHA is invented if the remote cannot be queried.
    """
    output = git_optional(
        "ls-remote",
        "--exit-code",
        "origin",
        remote_ref,
    )

    if not output:
        return None

    for line in output.splitlines():
        parts = line.split()

        if len(parts) == 2 and parts[1] == remote_ref:
            return parts[0]

    return None


def load_policy(
    policy_path: str | None,
) -> dict[str, Any] | None:
    """
    Load an explicitly supplied, previously approved policy.

    This function does not select or approve a policy.
    """
    if policy_path is None:
        return None

    try:
        policy = read_json(policy_path)
    except (OSError, ValueError) as error:
        raise GitError(
            f"Cannot read canonical policy: {error}"
        ) from error

    if not isinstance(policy, dict):
        raise GitError(
            "Canonical policy must be a JSON object"
        )

    missing = [
        field
        for field in REQUIRED_POLICY_FIELDS
        if not isinstance(policy.get(field), str)
        or not policy[field].strip()
    ]

    if missing:
        raise GitError(
            "Canonical policy missing fields: "
            + ", ".join(missing)
        )

    if policy["policy"] not in (
        "standard-main",
        "approved-dependency",
    ):
        raise GitError("Unknown canonical base policy")

    if not re.fullmatch(
        r"[0-9a-fA-F]{40}",
        policy["base_sha"],
    ):
        raise GitError("Canonical base_sha is not a SHA-1")

    return policy


def protected_changes(
    changes: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Capture every preexisting local change.

    All changes are initially protected from automatic
    staging or overwrite; opencode.json is highlighted.
    """
    protected = []

    for change in changes:
        paths = [
            change["path"],
            change["original_path"],
        ]

        special = any(
            path is not None
            and (
                path == "opencode.json"
                or path.endswith("/opencode.json")
            )
            for path in paths
        )

        protected.append({
            **change,
            "protected": True,
            "special_protection": special,
        })

    return protected


@managed_operation
def inspect(
    issue: int,
    policy_path: str | None = None,
) -> dict[str, Any]:
    """Produce one read-only branch_evidence observation."""
    observed_at = datetime.now(timezone.utc).isoformat()

    evidence: dict[str, Any] = {
        "source": SOURCE,
        "phase": 3,
        "issue": issue,
        "observed_at": observed_at,
        "status": "incomplete",
        "errors": [],
        "git": {},
        "canonical_base": None,
        "base_candidate": None,
        "preexisting_protected_changes": [],
        "invalidated_by": [
            "git-state-change",
            "remote-ref-change",
            "working-tree-change",
            "canonical-policy-change",
        ],
    }

    errors: list[str] = evidence["errors"]

    try:
        repository_root = git_text(
            "rev-parse",
            "--show-toplevel",
        )

        active_branch = git_text(
            "branch",
            "--show-current",
        )

        head = git_optional("rev-parse", "HEAD")

        changes = read_status()
        classified = classify_changes(changes)

        branches = read_local_branches()
        related = find_issue_branches(branches, issue)

        unstaged_diff = git_text(
            "diff",
            "--no-ext-diff",
            "--no-textconv",
        )

        staged_diff = git_text(
            "diff",
            "--cached",
            "--no-ext-diff",
            "--no-textconv",
        )

        evidence["git"] = {
            "repository_root": repository_root,
            "active_branch": active_branch,
            "detached_head": active_branch == "",
            "head": head,
            "working_tree_clean": not changes,
            "changes": changes,
            **classified,
            "unstaged_diff": unstaged_diff,
            "staged_diff": staged_diff,
            "local_branches": branches,
            "issue_branches": related,
        }

        evidence["preexisting_protected_changes"] = (
            protected_changes(changes)
        )

    except GitError as error:
        errors.append(str(error))
        return {"branch_evidence": evidence}

    try:
        policy = load_policy(policy_path)

        if policy is None:
            candidate_sha = remote_sha(
                "refs/heads/main"
            )

            evidence["base_candidate"] = {
                "base_ref": "origin/main",
                "base_remote_ref": "refs/heads/main",
                "base_remote_sha_latest": candidate_sha,
            }

            if candidate_sha is None:
                errors.append(
                    "Cannot verify origin/main remote SHA"
                )

        else:
            base_ref = policy["base_ref"]
            base_remote_ref = policy["base_remote_ref"]
            pr_target_ref = policy["pr_target_ref"]

            base_remote_latest = remote_sha(
                base_remote_ref
            )

            target_remote_latest = remote_sha(
                pr_target_ref
            )

            local_base_sha = git_optional(
                "rev-parse",
                "--verify",
                base_ref + "^{commit}",
            )

            evidence["canonical_base"] = {
                **policy,
                "local_base_sha": local_base_sha,
                "base_remote_sha_latest": (
                    base_remote_latest
                ),
                "pr_target_sha_latest": (
                    target_remote_latest
                ),
            }

            if base_remote_latest is None:
                errors.append(
                    "Cannot verify canonical remote base"
                )

            if target_remote_latest is None:
                errors.append(
                    "Cannot verify remote PR target"
                )

            if local_base_sha is None:
                errors.append(
                    "Cannot resolve local base_ref"
                )

    except GitError as error:
        errors.append(str(error))

    evidence["status"] = (
        "complete" if not errors else "incomplete"
    )

    return {"branch_evidence": evidence}

# ============================================================
# PHASE 3 — VALIDATE BASE
# ============================================================

def is_sha(value: Any) -> bool:
    """Validate a full SHA-1 commit identifier."""
    return (
        isinstance(value, str)
        and re.fullmatch(r"[0-9a-fA-F]{40}", value) is not None
    )


def valid_remote_ref(ref: str) -> bool:
    """Validate a full branch ref using Git's own rules."""
    if not isinstance(ref, str):
        return False

    if not ref.startswith("refs/heads/"):
        return False

    result = run_git(
        "check-ref-format",
        ref,
        check=False,
    )
    return result.returncode == 0


def read_remote_ref(
    remote_ref: str,
) -> tuple[str | None, str | None]:
    """
    Query an exact remote branch without fetching.

    Returns:
        (sha, error)

    The remote SHA is an observation, not an approval.
    """
    if not valid_remote_ref(remote_ref):
        return None, "Invalid remote branch reference"

    try:
        result = run_git(
            "ls-remote",
            "--exit-code",
            "origin",
            remote_ref,
            check=False,
        )
    except GitError as error:
        return None, str(error)

    if result.returncode != 0:
        message = decode(result.stderr).strip()
        return (
            None,
            message or f"Remote ref unavailable: {remote_ref}",
        )

    matches = []

    for line in decode(result.stdout).splitlines():
        parts = line.split()

        if (
            len(parts) == 2
            and parts[1] == remote_ref
            and is_sha(parts[0])
        ):
            matches.append(parts[0].lower())

    if len(matches) != 1:
        return None, "Remote response is missing or ambiguous"

    return matches[0], None


def local_commit_exists(sha: str) -> bool:
    """Verify the exact commit object exists locally."""
    if not is_sha(sha):
        return False

    result = run_git(
        "cat-file",
        "-e",
        f"{sha}^{{commit}}",
        check=False,
    )

    return result.returncode == 0


def resolve_local_commit(ref: str) -> str | None:
    """Resolve a local commit without modifying refs."""
    if not isinstance(ref, str) or not ref:
        return None

    # Do not accept command-like or revision-expression input
    # as a canonical local branch reference.
    if ref.startswith("-") or any(
        character.isspace() for character in ref
    ):
        return None

    result = run_git(
        "rev-parse",
        "--verify",
        f"{ref}^{{commit}}",
        check=False,
    )

    if result.returncode != 0:
        return None

    sha = decode(result.stdout).strip().lower()
    return sha if is_sha(sha) else None


def verify_ancestry(
    ancestor: str,
    descendant: str,
) -> bool:
    """Check commit ancestry, read-only."""
    if not (
        local_commit_exists(ancestor)
        and local_commit_exists(descendant)
    ):
        return False

    result = run_git(
        "merge-base",
        "--is-ancestor",
        ancestor,
        descendant,
        check=False,
    )

    return result.returncode == 0


def list_range_commits(
    base_sha: str,
    head_sha: str,
) -> list[str]:
    """List every commit in the approved dependency range."""
    result = run_git(
        "rev-list",
        "--reverse",
        f"{base_sha}..{head_sha}",
    )

    output = decode(result.stdout).strip()
    return output.splitlines() if output else []


@managed_operation
def validate_base(
    issue: int,
    policy_path: str,
) -> dict[str, Any]:
    """
    Validate a previously selected canonical base.

    This operation does not choose the base policy,
    approve a dependency, fetch, switch, create branches,
    change files, stage, commit or push.

    PASS means base evidence is valid for this observation.
    It does not authorize Git mutations by itself.
    """
    evidence: dict[str, Any] = {
        "source": (
            "scripts/harness/git_policy.py validate-base"
        ),
        "phase": 3,
        "issue": issue,
        "observed_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "status": "BLOCK",
        "policy": None,
        "base_sha": None,
        "base_remote_sha_latest": None,
        "pr_target_sha_latest": None,
        "local_base_sha": None,
        "checks": {},
        "errors": [],
        "invalidated_by": [
            "remote-ref-change",
            "local-ref-change",
            "canonical-policy-change",
            "git-object-change",
        ],
    }

    errors = evidence["errors"]
    checks = evidence["checks"]

    try:
        policy = load_policy(policy_path)
    except GitError as error:
        errors.append(str(error))
        return {"base_validation_evidence": evidence}

    if policy is None:
        errors.append("Canonical base policy is required")
        return {"base_validation_evidence": evidence}

    policy_type = policy["policy"]
    base_sha = policy["base_sha"].lower()
    base_ref = policy["base_ref"]
    base_remote_ref = policy["base_remote_ref"]
    pr_target = policy["pr_target"]
    pr_target_ref = policy["pr_target_ref"]

    evidence["policy"] = policy_type
    evidence["base_sha"] = base_sha

    # --------------------------------------------------------
    # 1. Validate local commit object
    # --------------------------------------------------------

    checks["base_commit_exists"] = local_commit_exists(
        base_sha
    )

    if not checks["base_commit_exists"]:
        errors.append(
            "Approved base SHA is not available locally"
        )

    # --------------------------------------------------------
    # 2. Validate remote base reference
    # --------------------------------------------------------

    remote_base_sha, remote_error = read_remote_ref(
        base_remote_ref
    )

    evidence["base_remote_sha_latest"] = remote_base_sha

    checks["remote_base_accessible"] = (
        remote_error is None
    )

    if remote_error:
        errors.append(remote_error)

    checks["remote_matches_approved_base"] = (
        remote_base_sha == base_sha
    )

    if not checks["remote_matches_approved_base"]:
        errors.append(
            "Remote base SHA differs from approved base SHA"
        )

    # --------------------------------------------------------
    # 3. Validate remote PR target
    # --------------------------------------------------------

    target_sha, target_error = read_remote_ref(
        pr_target_ref
    )

    evidence["pr_target_sha_latest"] = target_sha

    checks["pr_target_accessible"] = (
        target_error is None
    )

    if target_error:
        errors.append(target_error)

    # --------------------------------------------------------
    # 4. Validate local base ref
    # --------------------------------------------------------

    local_base_sha = resolve_local_commit(base_ref)
    evidence["local_base_sha"] = local_base_sha

    checks["local_base_matches_approved"] = (
        local_base_sha == base_sha
    )

    if not checks["local_base_matches_approved"]:
        errors.append(
            "Local base ref differs from approved base SHA"
        )

    # --------------------------------------------------------
    # 5. Policy: standard-main
    # --------------------------------------------------------

    if policy_type == "standard-main":

        checks["standard_main_policy"] = (
            base_ref == "origin/main"
            and base_remote_ref == "refs/heads/main"
            and pr_target == "main"
            and pr_target_ref == "refs/heads/main"
        )

        if not checks["standard_main_policy"]:
            errors.append(
                "standard-main requires origin/main "
                "and main as the PR target"
            )

    # --------------------------------------------------------
    # 6. Policy: approved-dependency
    # --------------------------------------------------------

    elif policy_type == "approved-dependency":

        approval = policy.get("dependency_approval")
        expected_commits = policy.get("dependency_commits")

        checks["dependency_approval_record_present"] = (
            isinstance(approval, dict)
            and approval.get("approved") is True
            and isinstance(
                approval.get("approved_by"),
                str,
            )
            and bool(approval["approved_by"].strip())
            and isinstance(
                approval.get("reason"),
                str,
            )
            and bool(approval["reason"].strip())
        )

        if not checks[
            "dependency_approval_record_present"
        ]:
            errors.append(
                "Explicit dependency approval record missing"
            )

        checks["dependency_manifest_valid"] = (
            isinstance(expected_commits, list)
            and len(expected_commits) > 0
            and all(
                is_sha(sha) for sha in expected_commits
            )
        )

        if not checks["dependency_manifest_valid"]:
            errors.append(
                "Dependency commit manifest is invalid"
            )

        checks["dependency_target_documented"] = (
            bool(pr_target.strip())
            and valid_remote_ref(pr_target_ref)
            and base_remote_ref != pr_target_ref
        )

        if not checks["dependency_target_documented"]:
            errors.append(
                "Dependency PR target is missing or invalid"
            )

        # The remote target commit must be available locally
        # to verify ancestry without fetching.
        if target_sha is not None:
            checks["target_commit_exists_locally"] = (
                local_commit_exists(target_sha)
            )
        else:
            checks["target_commit_exists_locally"] = False

        if not checks["target_commit_exists_locally"]:
            errors.append(
                "Remote PR target commit unavailable locally"
            )

        if (
            checks["base_commit_exists"]
            and checks["target_commit_exists_locally"]
        ):
            checks["dependency_ancestry_valid"] = (
                verify_ancestry(target_sha, base_sha)
            )

            if not checks["dependency_ancestry_valid"]:
                errors.append(
                    "Dependency base does not descend "
                    "from its PR target"
                )

            elif checks["dependency_manifest_valid"]:
                actual_commits = list_range_commits(
                    target_sha,
                    base_sha,
                )

                checks["dependency_commits_match"] = (
                    actual_commits
                    == [
                        sha.lower()
                        for sha in expected_commits
                    ]
                )

                if not checks["dependency_commits_match"]:
                    errors.append(
                        "Dependency commit range does not "
                        "match the approved manifest"
                    )

        # This verifies the structure and Git facts.
        # The agent must separately establish that the
        # approval record comes from a real user decision.

    # --------------------------------------------------------
    # 7. Final result
    # --------------------------------------------------------

    evidence["status"] = (
        "PASS" if not errors else "BLOCK"
    )

    return {"base_validation_evidence": evidence}

# ============================================================
# PHASE 3 — PREPARE BRANCH
# ============================================================

def validate_issue_branch_name(
    branch_name: str,
    issue: int,
) -> tuple[bool, str | None]:
    """
    Validate a Git branch name belonging to an Issue.

    The branch number must be a complete segment.
    Issue 75 must not accidentally match Issue 175.
    """
    if not branch_name or branch_name == "main":
        return False, "Invalid or protected branch name"

    result = run_git(
        "check-ref-format",
        "--branch",
        branch_name,
        check=False,
    )

    if result.returncode != 0:
        return False, "Branch name is invalid in Git"

    matches = find_issue_branches([branch_name], issue)

    if branch_name not in matches:
        return (
            False,
            f"Branch name does not identify Issue #{issue}",
        )

    return True, None


def read_repository_state() -> dict[str, Any]:
    """Collect the local state used by the safety gate."""
    branch = git_text("branch", "--show-current")
    head = git_optional("rev-parse", "--verify", "HEAD")
    changes = read_status()

    return {
        "active_branch": branch,
        "head": head,
        "changes": changes,
        "clean": len(changes) == 0,
        "local_branches": read_local_branches(),
    }


@managed_operation
def prepare_branch(
    issue: int,
    branch_name: str,
    policy_path: str,
    expected_head: str,
    expected_branch: str,
) -> dict[str, Any]:
    """
    Create a new Issue branch from the exact approved SHA.

    Conservative safety rules:
    - Requires a valid canonical base.
    - Requires unchanged current HEAD and branch.
    - Refuses any staged, unstaged or untracked changes.
    - Refuses an existing Issue branch.
    - Never switches to main as the Issue branch.
    - Never fetches, stashes, rebases, resets or pushes.
    - Does not overwrite existing branches.

    Reusing existing branches requires a separate,
    explicitly verified workflow decision.
    """
    evidence: dict[str, Any] = {
        "source": (
            "scripts/harness/git_policy.py prepare-branch"
        ),
        "phase": 3,
        "issue": issue,
        "observed_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "status": "BLOCK",
        "operation": "create",
        "requested_branch": branch_name,
        "previous_branch": None,
        "previous_head": None,
        "approved_base_sha": None,
        "result_branch": None,
        "result_head": None,
        "checks": {},
        "errors": [],
    }

    errors = evidence["errors"]
    checks = evidence["checks"]

    def block(message: str) -> dict[str, Any]:
        errors.append(message)
        return {"branch_preparation_evidence": evidence}

    # --------------------------------------------------------
    # 1. Validate requested branch name
    # --------------------------------------------------------

    try:
        valid_name, name_error = validate_issue_branch_name(
            branch_name,
            issue,
        )
    except GitError as error:
        return block(str(error))

    checks["branch_name_valid"] = valid_name

    if not valid_name:
        return block(name_error or "Invalid branch name")

    # --------------------------------------------------------
    # 2. Validate canonical base before modifying Git
    # --------------------------------------------------------

    try:
        base_result = validate_base(
            issue=issue,
            policy_path=policy_path,
        )

        base_evidence = base_result[
            "base_validation_evidence"
        ]

        checks["base_validation_passed"] = (
            base_evidence["status"] == "PASS"
        )

        if not checks["base_validation_passed"]:
            errors.extend(
                base_evidence.get("errors", [])
            )
            return {"branch_preparation_evidence": evidence}

        base_sha = base_evidence["base_sha"]
        evidence["approved_base_sha"] = base_sha

        # The canonical policy must remain a distinct
        # approval decision made before this operation.
        policy = load_policy(policy_path)

        if (
            policy is None
            or policy["policy"] not in (
                "standard-main",
                "approved-dependency",
            )
        ):
            return block("Canonical policy is invalid")

    except GitError as error:
        return block(str(error))

    # --------------------------------------------------------
    # 3. Verify initial local state
    # --------------------------------------------------------

    try:
        state = read_repository_state()
    except GitError as error:
        return block(str(error))

    evidence["previous_branch"] = state["active_branch"]
    evidence["previous_head"] = state["head"]

    checks["expected_branch_matches"] = (
        state["active_branch"] == expected_branch
    )

    if not checks["expected_branch_matches"]:
        return block(
            "Active branch changed after initial inspection"
        )

    checks["expected_head_matches"] = (
        is_sha(expected_head)
        and state["head"] is not None
        and state["head"].lower() == expected_head.lower()
    )

    if not checks["expected_head_matches"]:
        return block(
            "HEAD changed after initial inspection"
        )

    # --------------------------------------------------------
    # 4. Protect preexisting local changes
    # --------------------------------------------------------

    checks["working_tree_clean"] = state["clean"]

    if not state["clean"]:
        evidence["preexisting_changes"] = state["changes"]

        return block(
            "Local changes exist. Automatic branch "
            "preparation is blocked to preserve them."
        )

    # --------------------------------------------------------
    # 5. Prevent duplicate Issue branches
    # --------------------------------------------------------

    issue_branches = find_issue_branches(
        state["local_branches"],
        issue,
    )

    evidence["existing_issue_branches"] = issue_branches

    checks["no_existing_issue_branch"] = (
        len(issue_branches) == 0
    )

    if not checks["no_existing_issue_branch"]:
        return block(
            "An Issue branch already exists. "
            "Creation is blocked; branch reuse must "
            "be validated separately."
        )

    if branch_name in state["local_branches"]:
        return block(
            "Requested branch already exists"
        )

    # --------------------------------------------------------
    # 6. Verify approved base still exists
    # --------------------------------------------------------

    checks["base_commit_exists"] = (
        local_commit_exists(base_sha)
    )

    if not checks["base_commit_exists"]:
        return block(
            "Approved base commit is unavailable locally"
        )

    # --------------------------------------------------------
    # 7. Recheck local mutable state immediately before write
    # --------------------------------------------------------

    try:
        latest = read_repository_state()
    except GitError as error:
        return block(str(error))

    checks["local_state_unchanged"] = (
        latest["active_branch"]
        == state["active_branch"]
        and latest["head"] == state["head"]
        and latest["changes"] == state["changes"]
        and latest["local_branches"]
        == state["local_branches"]
    )

    if not checks["local_state_unchanged"]:
        return block(
            "Local Git state changed before branch creation"
        )

    # --------------------------------------------------------
    # 8. Create and activate the Issue branch
    # --------------------------------------------------------

    evidence["branch_mutation_attempted"] = True
    try:
        result = run_git(
            "switch",
            "--no-track",
            "-c",
            branch_name,
            base_sha,
            check=False,
        )
    except GitError as error:
        return block(str(error))

    checks["git_switch_succeeded"] = (
        result.returncode == 0
    )

    if not checks["git_switch_succeeded"]:
        return block(
            "Git could not create/switch branch: "
            + decode(result.stderr).strip()
        )

    # --------------------------------------------------------
    # 9. Verify physical result
    # --------------------------------------------------------

    try:
        final_state = read_repository_state()
    except GitError as error:
        return block(
            "Branch operation ran but post-check failed: "
            + str(error)
        )

    evidence["result_branch"] = (
        final_state["active_branch"]
    )
    evidence["result_head"] = (
        final_state["head"]
    )

    checks["correct_branch_active"] = (
        final_state["active_branch"] == branch_name
    )

    checks["correct_base_head"] = (
        final_state["head"] is not None
        and final_state["head"].lower() == base_sha.lower()
    )

    checks["working_tree_preserved"] = (
        final_state["clean"]
    )

    if not all((
        checks["correct_branch_active"],
        checks["correct_base_head"],
        checks["working_tree_preserved"],
    )):
        return block(
            "Branch was created but final verification "
            "failed. Manual intervention is required."
        )

    evidence["status"] = "PASS"

    return {"branch_preparation_evidence": evidence}


# ============================================================
# PHASE 3 — CHECK BRANCH
# ============================================================

def read_approved_commits(
    path: str | None,
) -> list[str] | None:
    """
    Read an explicit approved commit manifest.

    JSON format:
        ["sha1", "sha2"]

    None means no manifest was provided, NOT that all
    existing commits are authorized.
    """
    if path is None:
        return None

    try:
        commits = read_json(path)
    except (OSError, ValueError) as error:
        raise GitError(
            f"Cannot read approved commit manifest: {error}"
        ) from error

    if (
        not isinstance(commits, list)
        or not all(is_sha(sha) for sha in commits)
        or len(set(sha.lower() for sha in commits))
        != len(commits)
    ):
        raise GitError(
            "Approved commits must be a list of unique "
            "full commit SHAs"
        )

    return [sha.lower() for sha in commits]


@managed_operation
def check_branch(
    issue: int,
    branch_name: str,
    policy_path: str,
    approved_commits_path: str | None = None,
) -> dict[str, Any]:
    """
    Verify an active Issue branch against its approved base.

    Read-only operation.

    A nonempty commit range must match an explicitly
    approved ordered commit manifest.

    PASS is technical evidence, not semantic approval
    of the Issue content.
    """
    evidence: dict[str, Any] = {
        "source": (
            "scripts/harness/git_policy.py check-branch"
        ),
        "phase": 3,
        "issue": issue,
        "observed_at": (
            datetime.now(timezone.utc).isoformat()
        ),
        "status": "BLOCK",
        "expected_branch": branch_name,
        "active_branch": None,
        "head_sha": None,
        "base_sha": None,
        "policy": None,
        "base_remote_sha_latest": None,
        "pr_target": None,
        "pr_target_ref": None,
        "commit_range": None,
        "range_commits": [],
        "approved_commits": None,
        "working_tree_clean": None,
        "local_changes": [],
        "existing_issue_branches": [],
        "checks": {},
        "errors": [],
        "invalidated_by": [
            "branch-change",
            "head-change",
            "local-ref-change",
            "remote-ref-change",
            "canonical-policy-change",
            "working-tree-change",
        ],
    }

    checks = evidence["checks"]
    errors = evidence["errors"]

    def fail(message: str) -> None:
        errors.append(message)

    # --------------------------------------------------------
    # 1. Validate requested branch name
    # --------------------------------------------------------

    try:
        valid_name, name_error = validate_issue_branch_name(
            branch_name,
            issue,
        )

        checks["valid_issue_branch_name"] = valid_name

        if not valid_name:
            fail(name_error or "Invalid Issue branch name")
            return {"branch_check_evidence": evidence}

        # ----------------------------------------------------
        # 2. Validate canonical base
        # ----------------------------------------------------

        policy = load_policy(policy_path)

        if policy is None:
            fail("Canonical base policy is required")
            return {"branch_check_evidence": evidence}

        evidence["policy"] = policy["policy"]
        evidence["pr_target"] = policy["pr_target"]
        evidence["pr_target_ref"] = (
            policy["pr_target_ref"]
        )

        base_result = validate_base(
            issue=issue,
            policy_path=policy_path,
        )["base_validation_evidence"]

        checks["canonical_base_valid"] = (
            base_result["status"] == "PASS"
        )

        if not checks["canonical_base_valid"]:
            errors.extend(base_result["errors"])
            return {"branch_check_evidence": evidence}

        base_sha = policy["base_sha"].lower()

        evidence["base_sha"] = base_sha
        evidence["base_remote_sha_latest"] = (
            base_result["base_remote_sha_latest"]
        )

        # ----------------------------------------------------
        # 3. Read actual local Git state
        # ----------------------------------------------------

        state = read_repository_state()

        active_branch = state["active_branch"]
        head_sha = state["head"]

        evidence["active_branch"] = active_branch
        evidence["head_sha"] = head_sha
        evidence["working_tree_clean"] = state["clean"]
        evidence["local_changes"] = state["changes"]

        checks["branch_is_active"] = (
            active_branch == branch_name
            and active_branch != ""
        )

        checks["not_main"] = (
            active_branch not in ("", "main")
        )

        checks["head_exists"] = (
            head_sha is not None
            and is_sha(head_sha)
        )

        related_branches = find_issue_branches(
            state["local_branches"],
            issue,
        )

        evidence["existing_issue_branches"] = (
            related_branches
        )

        checks["expected_branch_exists"] = (
            branch_name in state["local_branches"]
        )

        checks["no_ambiguous_issue_branches"] = (
            len(related_branches) == 1
            and related_branches[0] == branch_name
        )

        if not checks["branch_is_active"]:
            fail("Expected Issue branch is not active")

        if not checks["not_main"]:
            fail("The active branch is main or detached")

        if not checks["head_exists"]:
            fail("Cannot resolve an exact HEAD commit")

        if not checks["expected_branch_exists"]:
            fail("Expected Issue branch does not exist")

        if not checks["no_ambiguous_issue_branches"]:
            fail(
                "Multiple or inconsistent Issue branches "
                "require an explicit selection"
            )

        if errors:
            return {"branch_check_evidence": evidence}

        # ----------------------------------------------------
        # 4. Verify exact ancestry
        # ----------------------------------------------------

        checks["approved_base_exists"] = (
            local_commit_exists(base_sha)
        )

        if not checks["approved_base_exists"]:
            fail("Approved base commit does not exist")

        else:
            checks["base_is_ancestor"] = (
                verify_ancestry(base_sha, head_sha)
            )

            if not checks["base_is_ancestor"]:
                fail(
                    "Issue HEAD does not descend from "
                    "the approved base SHA"
                )

        if errors:
            return {"branch_check_evidence": evidence}

        # ----------------------------------------------------
        # 5. Verify complete commit range
        # ----------------------------------------------------

        actual_commits = list_range_commits(
            base_sha,
            head_sha,
        )

        evidence["commit_range"] = (
            f"{base_sha}..{head_sha}"
        )

        evidence["range_commits"] = actual_commits

        approved_commits = read_approved_commits(
            approved_commits_path
        )

        evidence["approved_commits"] = approved_commits

        if not actual_commits:
            # A newly created branch points at base_sha.
            checks["commit_range_authorized"] = (
                head_sha.lower() == base_sha
            )

            if not checks["commit_range_authorized"]:
                fail(
                    "Empty commit range but HEAD "
                    "does not match the approved base"
                )

        elif approved_commits is None:
            checks["commit_range_authorized"] = False
            fail(
                "Branch contains commits but no "
                "approved commit manifest was provided"
            )

        else:
            checks["commit_range_authorized"] = (
                actual_commits == approved_commits
            )

            if not checks["commit_range_authorized"]:
                fail(
                    "Issue branch commit range differs "
                    "from the approved commit manifest"
                )

        # ----------------------------------------------------
        # 6. Report working tree without modifying it
        # ----------------------------------------------------

        checks["working_tree_observed"] = True

        # Local changes are reported, not automatically
        # classified as belonging to the Issue.
        # The Branch Guard must determine whether those
        # changes can safely remain in place.

        # ----------------------------------------------------
        # 7. Final result
        # ----------------------------------------------------

        evidence["status"] = (
            "PASS" if not errors else "BLOCK"
        )

    except GitError as error:
        fail(str(error))

    return {"branch_check_evidence": evidence}




# ============================================================
# PHASE 9 — READ-ONLY PRE-STAGE OBSERVATION
# ============================================================

@managed_operation
def review_changes(
    issue: int,
    spec_path: str,
    plan_path: str,
    tasks_path: str,
    baseline_path: str | None = None,
) -> dict[str, Any]:
    """Collect once; PASS validates evidence, never Issue scope or staging.

    baseline_path accepts the unchanged phase-3 inspect JSON. Without it,
    provenance is explicitly unknown and every local change is protected.
    SDD paths are repository-relative, including when invoked in a subdirectory.
    Consumers must discard this observation after any invalidating event.
    """
    evidence: dict[str, Any] = {
        "source": {
            "operation": "scripts/harness/git_policy.py review-changes",
            "hook": ".opencode/commands/hooks/pre-stage-check.md",
            "git": [], "sdd": [], "baseline": baseline_path,
        },
        "phase": 9, "boundary": "pre-stage", "issue": issue,
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "repository": None, "branch": None, "head_sha": None,
        "status": "FAIL", "collection_status": "incomplete",
        "git_state": {}, "protected_paths": [],
        "preexisting_changes": None, "baseline": None, "sdd": {},
        "errors": [],
        "invalidated_by": [
            "file-edit-create-delete-rename", "staging-change",
            "branch-head-history-change", "sdd-source-change",
            "issue-scope-decision-context-change",
        ],
    }
    errors = evidence["errors"]

    def query(*args: str) -> str:
        evidence["source"]["git"].append(["git", *args])
        return decode(run_git(*args).stdout)

    def contradiction(message: str) -> None:
        evidence["collection_status"] = "contradictory"
        errors.append(message)

    try:
        if issue < 1:
            raise GitError("Issue must be positive")
        root = Path(query("rev-parse", "--show-toplevel").strip()).resolve()
        evidence["repository"] = {"root": str(root)}
        evidence["branch"] = query("branch", "--show-current").strip()
        evidence["head_sha"] = query("rev-parse", "--verify", "HEAD^{commit}").strip()
        # -C makes status paths and diffs independent of the caller's directory.
        evidence["source"]["git"].append(
            ["git", "status", "--porcelain=v1", "-z", "-uall"]
        )
        changes = read_status()
        classified = classify_changes(changes)
        state = {"changes": changes, **classified, "manifest": [],
                 "working_tree_clean": not changes}
        evidence["git_state"] = state
        for name, options in (("unstaged_diff", ()), ("staged_diff", ("--cached",))):
            state[name] = query("-C", str(root), "diff", *options,
                                "--binary", "--full-index", "--no-ext-diff",
                                "--no-textconv", "--no-relative", "--ignore-submodules=none")
        for change in changes:
            codes = [change["index_status"], change["worktree_status"]]
            if change["untracked"]:
                codes = ["A"]
            if any(code not in " AMDR?" for code in codes):
                contradiction(f"Unsupported or unmerged status: {change['path']}")
            state["manifest"].append({**change, "states": sorted(set(codes) & set("AMDR"))})
        state["opencode_json"] = {
            "exists": (root / "opencode.json").exists(),
            "changes": [c for c in changes if "opencode.json" in
                        (c["path"], c["original_path"])],
        }
        # Hash untracked content too: Git diffs do not include these files.
        state["untracked_content"] = []
        for item in classified["untracked"]:
            path = root / item["path"]
            data = os.fsencode(os.readlink(path)) if path.is_symlink() else path.read_bytes()
            state["untracked_content"].append({
                "path": item["path"], "sha256": hashlib.sha256(data).hexdigest(),
                "size": len(data), "symlink": path.is_symlink(),
            })
        # Protect unknown provenance as well as confirmed preexisting work.
        evidence["protected_paths"] = protected_changes(changes)
        for item in evidence["protected_paths"]:
            item["provenance"] = "unknown"
        if baseline_path is not None:
            baseline = read_json(baseline_path)
            baseline = baseline["branch_evidence"]
            if not isinstance(baseline, dict) or not isinstance(baseline.get("git"), dict):
                raise GitError("Invalid phase-3 baseline object")
            evidence["baseline"] = baseline
            if (baseline.get("status") != "complete"
                    or baseline.get("issue") != issue
                    or baseline.get("git", {}).get("repository_root") != str(root)):
                contradiction("Baseline is incomplete or belongs to another repository/Issue")
            previous = baseline.get("preexisting_protected_changes")
            if not isinstance(previous, list) or any(
                not isinstance(item, dict) or not isinstance(item.get("path"), str)
                for item in previous
            ):
                raise GitError("Invalid baseline protected inventory")
            evidence["preexisting_changes"] = previous
            old_paths = {p for item in previous for p in
                         (item.get("path"), item.get("original_path")) if p}
            for item in evidence["protected_paths"]:
                if {item["path"], item["original_path"]} & old_paths:
                    item["provenance"] = "preexisting-path"
            # Keep baseline entries even if their current status disappeared.
            evidence["protected_paths"].extend(
                {**item, "provenance": "baseline-only", "protected": True}
                for item in previous
                if not any(item["path"] in (c["path"], c["original_path"]) for c in changes)
            )
        for name, supplied in (("spec", spec_path), ("plan", plan_path), ("tasks", tasks_path)):
            path = root / supplied
            entry = {"path": supplied, "exists": False, "sha256": None, "raw": None}
            evidence["sdd"][name] = entry
            evidence["source"]["sdd"].append(supplied)
            if not path.resolve().is_relative_to(root) or path.is_symlink():
                raise GitError(f"SDD path escapes repository or is a symlink: {supplied}")
            entry["exists"] = path.exists()
            if not entry["exists"]:
                errors.append(f"Missing SDD source: {supplied}")
                continue
            data = path.read_bytes()
            entry["sha256"] = hashlib.sha256(data).hexdigest()
            entry["raw"] = data.decode("utf-8")
            if name == "tasks":
                entry["raw_tasks"] = [line for line in entry["raw"].splitlines()
                                      if re.match(r"^\s*[-*+]\s+\[[^\]]\]", line)]
        snapshot_paths = {"opencode.json"}
        snapshot_paths.update(p for change in changes
                              for p in (change["path"], change["original_path"]) if p)
        snapshot_paths.update(p for change in evidence["protected_paths"]
                              for p in (change["path"], change.get("original_path")) if p)
        evidence["protected_baselines"] = protected_snapshots(
            root, list(snapshot_paths), query("-C", str(root), "ls-files", "--stage", "-z").encode("utf-8", "surrogateescape")
        )
        if not errors:
            evidence["status"] = "PASS"
            evidence["collection_status"] = "complete"
    except (GitError, OSError, ValueError, KeyError, TypeError) as error:
        errors.append(str(error))
    return {"pre_stage_evidence": evidence}


@managed_operation
def prepare_staging(issue: int, evidence_path: str, approval_path: str) -> dict[str, Any]:
    """Stage whole files using an explicit change-review approval.

    Approval JSON: {status: PASS, issue, evidence_sha256, manifest: [
      {path: 'file', mode: '100644', sha256: '<raw content SHA256>'},
      {path: 'deleted', mode: '0', sha256: null}
    ]}. evidence_sha256 hashes canonical JSON of the pre_stage_evidence object
    (sort_keys=True, separators=(',', ':'), ensure_ascii=True).
    Rename approvals must include both the deleted and destination paths.
    No scope decisions, filters, commits, or partial-file staging are performed.
    A private index is validated before atomically publishing under index.lock.
    """
    result = {"source": "scripts/harness/git_policy.py prepare-staging",
              "phase": 10, "issue": issue, "status": "BLOCK", "errors": [],
              "observed_at": datetime.now(timezone.utc).isoformat(),
              "staged_manifest": [], "head_sha": None, "branch": None}
    lock_path = None
    lock_fd = None
    owns_lock = False
    try:
        prior = read_json(evidence_path)["pre_stage_evidence"]
        approval = read_json(approval_path)
        digest = hashlib.sha256(json.dumps(prior, sort_keys=True, separators=(",", ":"),
                                           ensure_ascii=True).encode()).hexdigest()
        if (prior["status"] != "PASS" or prior["collection_status"] != "complete"
                or prior["issue"] != issue or approval["issue"] != issue
                or approval["status"] != "PASS" or approval["evidence_sha256"] != digest):
            raise GitError("Missing, invalid or mismatched change-review approval")
        root = Path(git_text("rev-parse", "--show-toplevel")).resolve()
        if str(root) != prior["repository"]["root"]:
            raise GitError("Evidence belongs to another repository")
        result.update(repository=str(root), branch=prior["branch"], head_sha=prior["head_sha"])
        if prior["branch"] in ("", "main", "master"):
            raise GitError("A non-base work branch is required")
        manifest = approval["manifest"]
        if not isinstance(manifest, list) or not manifest:
            raise GitError("A nonempty whole-file manifest is required")
        entries = {}
        protected = {p for c in prior["protected_paths"]
                     if c.get("special_protection") or c.get("provenance") != "unknown"
                     for p in (c.get("path"), c.get("original_path")) if p}
        changed = {p for c in prior["git_state"]["changes"]
                   for p in (c["path"], c["original_path"]) if p}
        for entry in manifest:
            path = entry["path"]
            if (not isinstance(path, str) or not path or "\0" in path
                    or Path(path).is_absolute() or any(x.lower() in ("", ".", "..", ".git") for x in path.split("/"))
                    or path in entries or path not in changed or path in protected
                    or Path(path).name == "opencode.json"):
                raise GitError(f"Invalid, protected or duplicate manifest path: {path!r}")
            if entry["mode"] not in ("0", "100644", "100755", "120000"):
                raise GitError("Only regular files, symlinks and deletions are supported")
            entries[path] = entry
        for c in prior["git_state"]["changes"]:
            if c["original_path"] and ({c["path"], c["original_path"]} & entries.keys()):
                if not {c["path"], c["original_path"]} <= entries.keys():
                    raise GitError("Rename requires both source and destination")
        index = Path(git_text("rev-parse", "--path-format=absolute", "--git-path", "index"))
        lock_path = Path(str(index) + ".lock")
        lock_fd = os.open(lock_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o666)
        owns_lock = True
        original_index = index.read_bytes()

        def validate_observation():
            current = review_changes(issue, *(prior["sdd"][n]["path"] for n in ("spec", "plan", "tasks")),
                                     prior["source"].get("baseline"))["pre_stage_evidence"]
            for field in ("status", "collection_status", "repository", "branch", "head_sha",
                          "git_state", "sdd", "protected_paths", "baseline"):
                if current[field] != prior[field]:
                    raise GitError(f"Pre-stage evidence invalidated: {field}")

        validate_observation()
        # Existing index entries must already match the approved whole-file content.
        staged_paths = {decode(p) for p in run_git("-C", str(root), "diff", "--cached",
                        "--name-only", "--no-renames", "-z").stdout.split(b"\0") if p}
        if not staged_paths <= entries.keys():
            raise GitError("Existing staging contains changes outside the approval")
        payloads = {}
        for path, entry in entries.items():
            full = root / path
            if not full.parent.resolve().is_relative_to(root):
                raise GitError("Manifest path traverses an external symlink")
            if entry["mode"] == "0":
                if full.exists() or full.is_symlink() or entry["sha256"] is not None:
                    raise GitError(f"Deletion does not match working tree: {path}")
                payloads[path] = None
            else:
                mode = "120000" if full.is_symlink() else ("100755" if full.stat().st_mode & 0o111 else "100644")
                data = os.fsencode(os.readlink(full)) if full.is_symlink() else full.read_bytes()
                if mode != entry["mode"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
                    raise GitError(f"Approved content changed: {path}")
                payloads[path] = data
            if path in staged_paths:
                existing = run_git("-C", str(root), "ls-files", "--stage", "-z", "--", ":(literal)" + path).stdout
                if payloads[path] is None:
                    if existing:
                        raise GitError("Existing staged content differs from approved deletion")
                else:
                    hashed = subprocess.run(["git", "-C", str(root), "hash-object", "--stdin"],
                                            input=data, capture_output=True, timeout=20)
                    if hashed.returncode:
                        raise GitError(decode(hashed.stderr))
                    oid = decode(hashed.stdout).strip()
                    if not existing.startswith(f"{mode} {oid} 0\t".encode()):
                        raise GitError("Partial or different existing staging requires explicit resolution")
        import tempfile
        with tempfile.TemporaryDirectory(prefix="git-policy-staging-") as directory:
            temporary = Path(directory) / "index"
            temporary.write_bytes(original_index)
            env = {**os.environ, "GIT_INDEX_FILE": str(temporary), "GIT_OPTIONAL_LOCKS": "0"}

            def private_git(*args, data=None):
                process = subprocess.run(["git", "-C", str(root), *args], input=data,
                                         capture_output=True, env=env, timeout=20)
                if process.returncode:
                    raise GitError(decode(process.stderr))
                return process.stdout

            for path, entry in entries.items():
                data = payloads[path]
                if data is None:
                    private_git("update-index", "--force-remove", "--", path)
                else:
                    oid = decode(private_git("hash-object", "-w", "--stdin", data=data)).strip()
                    private_git("update-index", "--add", "--cacheinfo", entry["mode"], oid, path)
            final_paths = {decode(p) for p in private_git("diff", "--cached", "--name-only",
                           "--no-renames", "-z").split(b"\0") if p}
            if final_paths != entries.keys():
                raise GitError("Final staging differs from approved manifest")
            patch = private_git("diff", "--cached", "--binary", "--full-index",
                                "--no-ext-diff", "--no-textconv", "--no-relative")
            validate_observation()
            if index.read_bytes() != original_index:
                raise GitError("Index changed concurrently")
            with os.fdopen(lock_fd, "wb") as stream:
                lock_fd = None
                stream.write(temporary.read_bytes())
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(lock_path, index)
            lock_path = None
            result.update(status="PASS", staged_manifest=manifest,
                          staged_diff_sha256=hashlib.sha256(patch).hexdigest(),
                          evidence_sha256=digest)
    except (GitError, OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
        result["errors"].append(str(error))
    finally:
        if lock_fd is not None:
            os.close(lock_fd)
        # Never remove a lock owned by another Git process.
        if lock_path is not None and owns_lock:
            lock_path.unlink(missing_ok=True)
    return {"staging_preparation_evidence": result}


@managed_operation
def pre_commit_check(issue: int, evidence_path: str, staging_path: str,
                     policy_path: str, manifest_path: str) -> dict[str, Any]:
    """Read-only final comparison against workflow-approved content.

    manifest JSON fields: status=PASS, issue, repository (absolute root), branch,
    head_sha, base_sha, approved_commits (ordered), candidate_paths (complete
    union of paths touched by every range commit and staging), unrelated_paths,
    candidate_diff_sha256, policy_sha256, staging_evidence_sha256.
    Digests of JSON objects use sort_keys=True, separators=(',', ':'),
    ensure_ascii=True. Patch digest uses exact Git output with options below.
    The workflow supplies semantic approval; this function never infers scope.
    The recorded historical base is checked locally, without querying origin.
    """
    e: dict[str, Any] = {
        "source": "scripts/harness/git_policy.py pre-commit-check", "phase": 10,
        "issue": issue, "observed_at": datetime.now(timezone.utc).isoformat(),
        "status": "FAIL", "errors": [], "checks": {}, "git_state": {},
        "invalidated_by": ["staging-change", "branch-head-history-change",
                           "working-tree-change", "approval-policy-context-change"],
    }

    def digest(value):
        return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                         ensure_ascii=True).encode()).hexdigest()

    def require(condition, name):
        e["checks"][name] = bool(condition)
        if not condition:
            raise GitError(name)

    def paths(*args):
        return {decode(p) for p in run_git("-C", str(root), *args).stdout.split(b"\0") if p}

    def patch(*args):
        return run_git("-c", "diff.autoRefreshIndex=false", "-C", str(root), "diff", *args, "--binary", "--full-index",
                       "--no-ext-diff", "--no-textconv", "--no-relative").stdout

    try:
        prior = read_json(evidence_path)["pre_stage_evidence"]
        staging = read_json(staging_path)["staging_preparation_evidence"]
        manifest = read_json(manifest_path)
        policy = load_policy(policy_path)
        require(issue > 0 and prior["status"] == "PASS"
                and prior["collection_status"] == "complete"
                and staging["status"] == manifest["status"] == "PASS"
                and prior["issue"] == staging["issue"] == manifest["issue"] == issue,
                "valid_workflow_inputs")
        require(staging["evidence_sha256"] == digest(prior)
                and manifest["staging_evidence_sha256"] == digest(staging)
                and manifest["policy_sha256"] == digest(policy), "evidence_chain_matches")
        root = Path(git_text("rev-parse", "--show-toplevel")).resolve()
        branch = git_text("branch", "--show-current")
        head = git_text("rev-parse", "--verify", "HEAD^{commit}")
        e.update(repository=str(root), branch=branch, head_sha=head, base_sha=policy["base_sha"])
        require(str(root) == prior["repository"]["root"] == staging["repository"]
                == manifest["repository"], "repository_matches")
        require(branch not in ("", "main", "master")
                and branch == prior["branch"] == staging["branch"] == manifest["branch"],
                "expected_work_branch")
        require(head == prior["head_sha"] == staging["head_sha"] == manifest["head_sha"],
                "expected_head")
        base = policy["base_sha"].lower()
        require(base == manifest["base_sha"].lower() and local_commit_exists(base), "approved_historical_base")
        require(verify_ancestry(base, head), "base_is_ancestor")
        approved = manifest["approved_commits"]
        require(isinstance(approved, list) and all(is_sha(sha) for sha in approved)
                and len(set(approved)) == len(approved), "valid_commit_manifest")
        commits = list_range_commits(base, head)
        e["range_commits"] = commits
        require(commits == approved, "exact_approved_commit_range")
        changes = read_status()
        e["git_state"] = {"changes": changes, **classify_changes(changes)}
        require(not any("U" in (c["index_status"], c["worktree_status"])
                        or c["index_status"] + c["worktree_status"] in ("AA", "DD")
                        for c in changes), "no_unmerged_paths")
        staged = paths("diff", "--cached", "--name-only", "--no-renames", "-z")
        require(bool(staged), "nonempty_staging")
        expected = staging["staged_manifest"]
        require(isinstance(expected, list) and len({x["path"] for x in expected}) == len(expected)
                and staged == {x["path"] for x in expected}, "exact_staged_paths")
        staged_patch = patch("--cached")
        staged_hash = hashlib.sha256(staged_patch).hexdigest()
        e["staged_diff_sha256"] = staged_hash
        require(staged_hash == staging["staged_diff_sha256"], "exact_staged_content")
        # Include every commit, even paths whose changes cancel in the net diff.
        candidate_paths = set(staged)
        for commit in commits:
            candidate_paths.update(paths("diff-tree", "--root", "-m", "--no-commit-id",
                                         "--name-only", "--no-renames", "-r", "-z", commit))
        expected_paths = manifest["candidate_paths"]
        unrelated = manifest["unrelated_paths"]
        require(isinstance(expected_paths, list) and isinstance(unrelated, list)
                and all(isinstance(p, str) and p for p in expected_paths + unrelated)
                and len(set(expected_paths)) == len(expected_paths), "valid_path_manifests")
        e["candidate_paths"] = sorted(candidate_paths)
        require(candidate_paths == set(expected_paths), "exact_candidate_paths")
        protected = {p for c in prior["protected_paths"]
                     if c.get("special_protection") or c.get("provenance") != "unknown"
                     for p in (c.get("path"), c.get("original_path")) if p}
        require(not candidate_paths & (protected | set(unrelated))
                and not any(Path(p).name == "opencode.json" for p in candidate_paths),
                "no_protected_or_unrelated_candidate_changes")
        candidate_patch = patch("--cached", base)
        e["candidate_diff_sha256"] = hashlib.sha256(candidate_patch).hexdigest()
        require(e["candidate_diff_sha256"] == manifest["candidate_diff_sha256"],
                "exact_candidate_patch")
        e["git_state"]["unstaged_diff"] = decode(patch())
        for name in ("spec", "plan", "tasks"):
            source = prior["sdd"][name]
            file = root / source["path"]
            require(file.resolve().is_relative_to(root) and not file.is_symlink()
                    and hashlib.sha256(file.read_bytes()).hexdigest() == source["sha256"],
                    f"{name}_unchanged")
        # Reject observable concurrent changes instead of issuing a stale PASS.
        require(git_text("branch", "--show-current") == branch
                and git_text("rev-parse", "HEAD") == head
                and read_status() == changes and patch("--cached") == staged_patch
                and patch("--cached", base) == candidate_patch, "observation_still_consistent")
        e["status"] = "PASS"
    except (GitError, OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        e["errors"].append(str(error))
    return {"pre_commit_evidence": e}


@managed_operation
def create_commit(issue: int, evidence_path: str, staging_path: str,
                  policy_path: str, manifest_path: str, pre_commit_path: str,
                  authorization_path: str, message_path: str,
                  workflow_id: str) -> dict[str, Any]:
    """Create exactly one normal commit after explicit workflow approval.

    Authorization JSON: {status: APPROVED, issue, workflow_id,
    pre_commit_evidence_sha256, message_sha256}. The first digest uses canonical
    JSON of the pre_commit_evidence object (sort_keys=True, separators=(',', ':'),
    ensure_ascii=True); the second hashes the exact UTF-8 message file bytes.
    Messages must contain (#<issue>). Existing hooks and signing remain enabled.
    On hook failure or post-check mismatch, stop and report; never reset, amend,
    retry, stash, push, or discard local work. A BLOCK may report a real commit.
    """
    e: dict[str, Any] = {
        "source": "scripts/harness/git_policy.py create-commit", "phase": 10,
        "issue": issue, "workflow_id": workflow_id, "status": "BLOCK",
        "observed_at": datetime.now(timezone.utc).isoformat(), "errors": [],
        "commit_attempted": False, "commit_created": False,
        "commit_sha": None, "before_head": None, "branch": None,
        "checks": {}, "manual_intervention_required": False,
    }
    before_head = None

    def require(condition, name):
        e["checks"][name] = bool(condition)
        if not condition:
            raise GitError(name)

    def digest(value):
        return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                         ensure_ascii=True).encode()).hexdigest()

    def patch(*args):
        return run_git("-c", "diff.autoRefreshIndex=false", "diff", *args,
                       "--binary", "--full-index", "--no-ext-diff", "--no-textconv",
                       "--no-relative").stdout

    def local_work():
        # Index-relative unstaged patches remain identical after a normal commit.
        result = {"unstaged_diff": decode(patch()), "untracked": []}
        for c in read_status():
            if c["untracked"]:
                file = root / c["path"]
                data = os.fsencode(os.readlink(file)) if file.is_symlink() else file.read_bytes()
                result["untracked"].append((c["path"], hashlib.sha256(data).hexdigest()))
        return result

    try:
        require(not any(os.environ.get(name) for name in
                        ("GIT_INDEX_FILE", "GIT_DIR", "GIT_WORK_TREE")), "standard_repository_context")
        authorization = read_json(authorization_path)
        previous = read_json(pre_commit_path)["pre_commit_evidence"]
        message_bytes = read_message_bytes(message_path)
        message = message_bytes.decode("utf-8")
        require(isinstance(workflow_id, str) and bool(workflow_id.strip())
                and authorization["status"] == "APPROVED"
                and authorization["issue"] == issue
                and authorization["workflow_id"] == workflow_id
                and authorization["pre_commit_evidence_sha256"] == digest(previous)
                and authorization["message_sha256"] == hashlib.sha256(message_bytes).hexdigest(),
                "explicit_workflow_authorization")
        require(message.strip() and "\0" not in message and f"(#{issue})" in message,
                "valid_issue_commit_message")
        require(previous["source"] == "scripts/harness/git_policy.py pre-commit-check"
                and previous["phase"] == 10 and previous["issue"] == issue
                and previous["status"] == "PASS", "valid_pre_commit_evidence")
        current = pre_commit_check(issue, evidence_path, staging_path, policy_path,
                                   manifest_path)["pre_commit_evidence"]
        require(current["status"] == "PASS", "fresh_pre_commit_check_passed")
        require({k: v for k, v in current.items() if k != "observed_at"}
                == {k: v for k, v in previous.items() if k != "observed_at"},
                "pre_commit_evidence_still_current")
        root = Path(current["repository"])
        before_head = current["head_sha"]
        e.update(repository=str(root), branch=current["branch"], before_head=before_head,
                 pre_commit_evidence_sha256=digest(previous),
                 requested_message=message, base_sha=current["base_sha"])
        # Refuse workflows where git commit could continue another operation.
        for marker in ("MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "rebase-merge", "rebase-apply", "sequencer"):
            marker_path = Path(git_text("rev-parse", "--path-format=absolute", "--git-path", marker))
            require(not marker_path.exists(), f"no_pending_{marker}")
        expected_tree = git_text("write-tree")
        e.update(approved_tree=expected_tree, staged_diff_sha256=current["staged_diff_sha256"],
                 candidate_diff_sha256=current["candidate_diff_sha256"],
                 approved_range_commits=current["range_commits"])
        local_before = local_work()
        require(git_text("branch", "--show-current") == e["branch"]
                and git_text("rev-parse", "HEAD") == before_head
                and hashlib.sha256(patch("--cached")).hexdigest() == current["staged_diff_sha256"],
                "state_matches_immediately_before_commit")
        e["commit_attempted"] = True
        # Feed the approved bytes directly; never let a changed message file race.
        environment = {**os.environ, "GIT_OPTIONAL_LOCKS": "0", "GIT_TERMINAL_PROMPT": "0", "GIT_PAGER": "cat"}
        process = subprocess.run(["git", "commit", "--cleanup=verbatim", "--file=-"],
                                 input=message_bytes, capture_output=True, env=environment, timeout=60)
        e.update(git_returncode=process.returncode, git_stdout=decode(process.stdout),
                 git_stderr=decode(process.stderr))
        after = git_text("rev-parse", "HEAD")
        e["commit_created"] = after != before_head
        if after != before_head:
            e["commit_sha"] = after
        require(process.returncode == 0, "git_commit_succeeded")
        require(after != before_head, "new_commit_created")
        require(git_text("branch", "--show-current") == e["branch"], "commit_on_expected_branch")
        require(git_text("rev-list", "--parents", "-n", "1", after).split() == [after, before_head],
                "single_expected_parent")
        require(git_text("rev-parse", after + "^{tree}") == expected_tree, "commit_matches_approved_tree")
        actual_message = decode(run_git("show", "-s", "--format=%B", after).stdout).rstrip("\n")
        e["message"] = actual_message
        require(actual_message == message.rstrip("\n"), "commit_message_matches_approval")
        actual_patch = patch(before_head, after)
        require(hashlib.sha256(actual_patch).hexdigest() == current["staged_diff_sha256"],
                "commit_matches_approved_patch")
        require(git_text("write-tree") == expected_tree, "index_content_preserved")
        require(local_work() == local_before, "unrelated_local_work_preserved")
        e["status"] = "PASS"
    except (GitError, OSError, ValueError, KeyError, TypeError, AttributeError,
            subprocess.TimeoutExpired) as error:
        e["errors"].append(str(error))
        if e["commit_attempted"]:
            e["manual_intervention_required"] = True
            # A hook or timeout may have created a commit despite an error.
            try:
                after = git_text("rev-parse", "HEAD")
                e["commit_created"] = after != before_head
                e["commit_sha"] = after if after != before_head else None
                e["current_branch"] = git_text("branch", "--show-current")
            except GitError as observation_error:
                e["errors"].append(str(observation_error))
    return {"commit_creation_evidence": e}


@managed_operation
def check_commit(issue: int, evidence_path: str, staging_path: str,
                 policy_path: str, manifest_path: str, pre_commit_path: str,
                 creation_path: str, authorization_path: str, message_path: str,
                 workflow_id: str) -> dict[str, Any]:
    """Verify the workflow's newly created HEAD commit without any Git writes.

    Consumes the same approved inputs as create-commit, plus its emitted
    commit_creation_evidence. Evidence proves workflow provenance by an explicit
    authorization chain and the recorded before-HEAD/new-commit relationship;
    callers must retain authentic session evidence. It is not a signature.
    PASS is technical validation; semantic traceability remains the Commit Guard.
    """
    e: dict[str, Any] = {
        "source": "scripts/harness/git_policy.py check-commit", "phase": 10,
        "issue": issue, "workflow_id": workflow_id, "status": "BLOCK",
        "observed_at": datetime.now(timezone.utc).isoformat(), "errors": [],
        "checks": {}, "commit_sha": None, "branch": None,
        "invalidated_by": ["branch-head-history-change", "approval-context-change"],
    }

    def digest(value):
        return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                         ensure_ascii=True).encode()).hexdigest()

    def require(condition, name):
        e["checks"][name] = bool(condition)
        if not condition:
            raise GitError(name)

    def read(path, key=None):
        value = read_json(path)
        return value[key] if key else value

    def patch(*args):
        return run_git("-c", "diff.autoRefreshIndex=false", "-C", str(root), "diff", *args,
                       "--binary", "--full-index", "--no-ext-diff", "--no-textconv",
                       "--no-relative").stdout

    def changed_paths(*args):
        return {decode(p) for p in run_git("-C", str(root), *args).stdout.split(b"\0") if p}

    try:
        require(not any(os.environ.get(name) for name in
                        ("GIT_INDEX_FILE", "GIT_DIR", "GIT_WORK_TREE")), "standard_repository_context")
        prior = read(evidence_path, "pre_stage_evidence")
        staging = read(staging_path, "staging_preparation_evidence")
        pre = read(pre_commit_path, "pre_commit_evidence")
        creation = read(creation_path, "commit_creation_evidence")
        manifest = read(manifest_path)
        authorization = read(authorization_path)
        policy = load_policy(policy_path)
        message_bytes = read_message_bytes(message_path)
        requested_message = message_bytes.decode("utf-8")
        require(issue > 0 and workflow_id.strip()
                and all(item["issue"] == issue for item in
                        (prior, staging, pre, creation, manifest, authorization)), "issue_matches")
        require(prior["status"] == staging["status"] == pre["status"]
                == creation["status"] == manifest["status"] == "PASS"
                and prior["collection_status"] == "complete", "complete_passing_evidence")
        require(pre["source"] == "scripts/harness/git_policy.py pre-commit-check"
                and creation["source"] == "scripts/harness/git_policy.py create-commit"
                and pre["phase"] == creation["phase"] == 10
                and creation["commit_attempted"] is True and creation["commit_created"] is True
                and creation["git_returncode"] == 0
                and creation["manual_intervention_required"] is False,
                "successful_workflow_commit_creation")
        require(authorization["status"] == "APPROVED"
                and authorization["workflow_id"] == creation["workflow_id"] == workflow_id
                and authorization["message_sha256"] == hashlib.sha256(message_bytes).hexdigest()
                and authorization["pre_commit_evidence_sha256"] == digest(pre)
                == creation["pre_commit_evidence_sha256"]
                and staging["evidence_sha256"] == digest(prior)
                and manifest["staging_evidence_sha256"] == digest(staging)
                and manifest["policy_sha256"] == digest(policy), "authorization_chain_matches")
        root = Path(git_text("rev-parse", "--show-toplevel")).resolve()
        branch = git_text("branch", "--show-current")
        head = git_text("rev-parse", "--verify", "HEAD^{commit}")
        commit = creation["commit_sha"]
        before = creation["before_head"]
        e.update(repository=str(root), branch=branch, commit_sha=commit, head_sha=head,
                 before_head=before, creation_evidence_sha256=digest(creation),
                 base_sha=policy["base_sha"].lower(), canonical_base=dict(policy))
        require(str(root) == creation["repository"] == pre["repository"]
                == staging["repository"] == manifest["repository"] == prior["repository"]["root"],
                "repository_matches")
        require(branch not in ("", "main", "master")
                and branch == creation["branch"] == pre["branch"] == staging["branch"]
                == manifest["branch"] == prior["branch"], "expected_work_branch")
        require(is_sha(commit) and is_sha(before) and commit != before
                and local_commit_exists(commit) and head == commit, "created_commit_is_current_head")
        require(before == pre["head_sha"] == staging["head_sha"]
                == manifest["head_sha"] == prior["head_sha"], "recorded_before_head_matches")
        require(git_text("rev-list", "--parents", "-n", "1", commit).split() == [commit, before],
                "single_expected_parent")
        require(git_text("rev-parse", commit + "^{tree}") == creation["approved_tree"],
                "approved_tree_matches")
        actual_patch = patch(before, commit)
        require(bool(actual_patch), "nonempty_commit")
        e["staged_diff_sha256"] = hashlib.sha256(actual_patch).hexdigest()
        require(e["staged_diff_sha256"] == creation["staged_diff_sha256"]
                == pre["staged_diff_sha256"] == staging["staged_diff_sha256"], "exact_commit_patch")
        commit_paths = changed_paths("diff", "--name-only", "--no-renames", "-z", before, commit)
        require(commit_paths == {item["path"] for item in staging["staged_manifest"]},
                "exact_commit_manifest")
        message = decode(run_git("show", "-s", "--format=%B", commit).stdout).rstrip("\n")
        e["message"] = message
        require(message.strip() and f"(#{issue})" in message and "\0" not in requested_message
                and message == creation["message"] == creation["requested_message"].rstrip("\n")
                == requested_message.rstrip("\n"), "approved_issue_message")
        base = policy["base_sha"].lower()
        require(base == creation["base_sha"] == pre["base_sha"] == manifest["base_sha"].lower()
                and verify_ancestry(base, before), "approved_historical_base")
        approved = manifest["approved_commits"]
        require(approved == creation["approved_range_commits"] == pre["range_commits"]
                and list_range_commits(base, before) == approved
                and list_range_commits(base, commit) == approved + [commit], "exact_issue_commit_range")
        all_paths = set(commit_paths)
        for sha in approved:
            all_paths.update(changed_paths("diff-tree", "--root", "-m", "--no-commit-id",
                                          "--name-only", "--no-renames", "-r", "-z", sha))
        e["commit_paths"] = sorted(commit_paths)
        e["candidate_paths"] = sorted(all_paths)
        require(all_paths == set(manifest["candidate_paths"]) == set(pre["candidate_paths"]),
                "exact_candidate_paths")
        protected = {p for item in prior["protected_paths"]
                     if item.get("special_protection") or item.get("provenance") != "unknown"
                     for p in (item.get("path"), item.get("original_path")) if p}
        require(not all_paths & (protected | set(manifest["unrelated_paths"]))
                and not any(Path(p).name == "opencode.json" for p in all_paths),
                "no_protected_or_unrelated_committed_changes")
        e["candidate_diff_sha256"] = hashlib.sha256(patch(base, commit)).hexdigest()
        require(e["candidate_diff_sha256"] == manifest["candidate_diff_sha256"]
                == pre["candidate_diff_sha256"] == creation["candidate_diff_sha256"], "exact_candidate_patch")
        changes = read_status()
        e["git_state"] = {"changes": changes, **classify_changes(changes)}
        require(git_text("branch", "--show-current") == branch
                and git_text("rev-parse", "HEAD") == head, "observation_still_consistent")
        e["status"] = "PASS"
    except (GitError, OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        e["errors"].append(str(error))
    return {"commit_check_evidence": e}


def parse_name_status(raw: bytes) -> list[dict[str, Any]]:
    """Parse complete NUL-delimited name-status, including rename/copy scores."""
    if raw and not raw.endswith(b"\0"):
        raise GitError("Truncated name-status output")
    fields = raw.split(b"\0")[:-1]
    entries = []
    position = 0
    while position < len(fields):
        code = decode(fields[position])
        position += 1
        if not re.fullmatch(r"[AMDRC](?:[0-9]{1,3})?", code):
            raise GitError(f"Unsupported name-status: {code!r}")
        count = 2 if code[0] in "RC" else 1
        if position + count > len(fields) or not all(fields[position:position + count]):
            raise GitError("Missing path in name-status output")
        old = decode(fields[position]) if count == 2 else None
        path = decode(fields[position + count - 1])
        position += count
        entries.append({"status": code, "state": "A" if code[0] == "C" else code[0],
                        "score": int(code[1:]) if code[1:] else None,
                        "path": path, "original_path": old})
    return entries


def protected_snapshots(root: Path, paths: list[str], index_raw: bytes) -> dict[str, Any]:
    """Fingerprint protected working files and index entries without Git writes."""
    indexed: dict[str, Any] = {}
    for record in index_raw.split(b"\0"):
        if not record:
            continue
        metadata, path = record.split(b"\t", 1)
        mode, oid, stage = decode(metadata).split()
        indexed.setdefault(decode(path), []).append({"mode": mode, "oid": oid, "stage": stage})
    result = {}
    for path in sorted(set(paths)):
        if (not path or Path(path).is_absolute()
                or any(part in ("", ".", "..", ".git") for part in path.split("/"))):
            raise GitError(f"Invalid protected path: {path!r}")
        file = root / path
        if not file.parent.resolve().is_relative_to(root):
            raise GitError(f"Protected path escapes repository: {path}")
        entry = {"exists": file.exists() or file.is_symlink(), "mode": None,
                 "sha256": None, "index_entries": indexed.get(path, [])}
        if entry["exists"]:
            if file.is_symlink():
                data = os.fsencode(os.readlink(file))
                entry["mode"] = "120000"
            elif file.is_file():
                data = file.read_bytes()
                entry["mode"] = "100755" if file.stat().st_mode & 0o111 else "100644"
            else:
                raise GitError(f"Cannot fingerprint protected directory: {path}")
            entry["sha256"] = hashlib.sha256(data).hexdigest()
        result[path] = entry
    return result


@managed_operation
def post_check_commit(issue: int, evidence_path: str, staging_path: str,
                      policy_path: str, creation_path: str, check_path: str,
                      guard_path: str, workflow_id: str) -> dict[str, Any]:
    """Produce the sole phase-11 observation, never semantic PASS or Git writes.

    --commit-guard-json is an explicit workflow decision with status=PASS, issue,
    workflow_id, repository, branch, commit_sha, message and
    commit_check_evidence_sha256 (canonical JSON digest of commit_check_evidence).
    The canonical phase-9 evidence must include protected_baselines. Missing
    historical fingerprints remain unknown/incomplete; never infer conservation.
    """
    e: dict[str, Any] = {
        "source": {"hook": ".opencode/commands/hooks/post-commit.md",
                   "operation": "scripts/harness/git_policy.py post-check-commit",
                   "commands": []},
        "phase": "post-commit", "phase_number": 11, "issue": issue,
        "workflow_id": workflow_id, "observed_at": datetime.now(timezone.utc).isoformat(),
        "repository": None, "status": "incomplete", "errors": [],
        "expected_commit": {"sha": None, "message": None},
        "branch": None, "head": None, "last_commit": None,
        "git_state": {}, "base": {}, "range": {}, "protected_paths": [],
        "validity": {},
        "invalidated_by": ["history-or-ref-mutation", "branch-or-head-change",
                           "file-edit-create-delete-rename", "staging-change",
                           "stash-restore-checkout-even-if-visible-state-unchanged",
                           "sdd-source-change", "issue-scope-decision-context-change",
                           "protected-path-change-absence-contradiction"],
    }

    def query(*args, check=True):
        command = ["git", "-c", "diff.autoRefreshIndex=false", *args]
        e["source"]["commands"].append(command)
        return run_git(*command[1:], check=check)

    def text_query(*args):
        return decode(query(*args).stdout).strip()

    def digest(value):
        return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                         ensure_ascii=True).encode()).hexdigest()

    def read(path, key=None):
        data = read_json(path)
        return data[key] if key else data

    def contradiction(condition, message):
        e["validity"][message] = bool(condition)
        if not condition:
            e["status"] = "contradictory"
            e["errors"].append(message)

    try:
        prior = read(evidence_path, "pre_stage_evidence")
        staging = read(staging_path, "staging_preparation_evidence")
        creation = read(creation_path, "commit_creation_evidence")
        accepted = read(check_path, "commit_check_evidence")
        guard = read(guard_path)
        policy = load_policy(policy_path)
        if (issue < 1 or not workflow_id.strip() or policy is None
                or any(item["status"] != "PASS" or item["issue"] != issue
                       for item in (prior, staging, creation, accepted, guard))
                or prior["collection_status"] != "complete"):
            raise GitError("Missing complete canonical evidence and passed Commit Guard")
        if (creation["workflow_id"] != workflow_id or accepted["workflow_id"] != workflow_id
                or guard["workflow_id"] != workflow_id
                or accepted["source"] != "scripts/harness/git_policy.py check-commit"
                or accepted["phase"] != 10
                or accepted["creation_evidence_sha256"] != digest(creation)
                or guard["commit_check_evidence_sha256"] != digest(accepted)
                or staging["evidence_sha256"] != digest(prior)):
            raise GitError("Workflow evidence chain does not match")
        e["expected_commit"] = {"sha": guard["commit_sha"], "message": guard["message"]}
        root = Path(text_query("rev-parse", "--show-toplevel")).resolve()
        e["repository"] = str(root)
        e["branch"] = text_query("branch", "--show-current")
        e["head"] = text_query("rev-parse", "--verify", "HEAD^{commit}")
        e["refs_sha256"] = hashlib.sha256(query("for-each-ref", "--format=%(refname) %(objectname)").stdout).hexdigest()
        contradiction(str(root) == prior["repository"]["root"] == staging["repository"]
                      == creation["repository"] == accepted["repository"] == guard["repository"],
                      "repository_matches_workflow")
        contradiction(e["branch"] == creation["branch"] == accepted["branch"] == guard["branch"],
                      "branch_matches_workflow")
        contradiction(e["head"] == guard["commit_sha"] == creation["commit_sha"] == accepted["commit_sha"],
                      "head_matches_expected_commit")
        raw = query("status", "--porcelain=v1", "-z", "-uall").stdout
        changes = read_status(raw)
        pending = []
        for c in changes:
            codes = c["index_status"] + c["worktree_status"]
            if not c["untracked"] and any(code not in " AMDR" for code in codes):
                raise GitError(f"Unmerged or unsupported pending state: {c['path']}")
            pending.append({**c, "status": codes, "states": ["A"] if c["untracked"]
                            else sorted(set(codes) & set("AMDR"))})
        staged_raw = query("-C", str(root), "diff", "--cached", "--name-status", "-z", "-M", "-C", "--no-ext-diff", "--no-textconv", "--no-relative").stdout
        unstaged_raw = query("-C", str(root), "diff", "--name-status", "-z", "-M", "-C", "--no-ext-diff", "--no-textconv", "--no-relative").stdout
        staged = parse_name_status(staged_raw)
        unstaged = parse_name_status(unstaged_raw)
        classified = classify_changes(changes)
        contradiction({entry["path"] for entry in staged}
                      == {entry["path"] for entry in classified["staged"]},
                      "staged_manifest_matches_status")
        contradiction({entry["path"] for entry in unstaged}
                      == {entry["path"] for entry in classified["unstaged"]},
                      "unstaged_manifest_matches_status")
        untracked = [{"status": "??", "state": "A", "path": c["path"],
                      "original_path": None, "score": None} for c in changes if c["untracked"]]
        e["git_state"] = {
            "working_tree": {"raw": decode(raw), "interpreted": changes, "clean": not changes},
            "staging": {"raw": decode(staged_raw), "interpreted": staged, "empty": not staged},
            "pending_manifest": pending, "staged_manifest": staged,
            "unstaged_manifest": unstaged + untracked,
        }
        base_sha = policy["base_sha"].lower()
        e["base"] = {"base_policy": policy["policy"], "base_branch": policy.get("base_branch"),
                     "base_ref": policy["base_ref"], "base_remote_ref": policy["base_remote_ref"],
                     "base_sha": base_sha, "immutable": True, "is_ancestor_of_head": "unknown",
                     "canonical_policy": dict(policy)}
        if "canonical_base" not in accepted:
            raise GitError("Commit check evidence lacks the approved canonical policy")
        if not policy.get("base_branch"):
            e["errors"].append("Canonical policy has no explicit base_branch")
        else:
            contradiction(policy == accepted["canonical_base"], "canonical_policy_matches")
        contradiction(base_sha == creation["base_sha"] == accepted["base_sha"], "historical_base_matches")
        ancestor = query("merge-base", "--is-ancestor", base_sha, e["head"], check=False)
        if ancestor.returncode not in (0, 1):
            raise GitError("Cannot determine historical base ancestry")
        e["base"]["is_ancestor_of_head"] = ancestor.returncode == 0
        contradiction(ancestor.returncode == 0, "historical_base_is_ancestor")
        expression = base_sha + ".." + e["head"]
        shas = text_query("rev-list", "--reverse", expression).splitlines()
        commits = []
        metadata = {}
        for sha in dict.fromkeys([*shas, e["head"]]):
            info = query("show", "-s", "--format=%H%x00%P%x00%B", sha).stdout.split(b"\0", 2)
            if len(info) != 3:
                raise GitError("Incomplete commit metadata")
            observed_sha, parents, message = decode(info[0]), decode(info[1]).split(), decode(info[2]).rstrip("\n")
            if observed_sha != sha:
                raise GitError("Commit metadata SHA mismatch")
            metadata[sha] = {"sha": sha, "parents": parents, "message": message}
        for sha in shas:
            item = {**metadata[sha], "manifest": [], "parent_manifests": []}
            for parent in item["parents"] or [None]:
                args = ["diff-tree", "--no-commit-id", "--name-status", "-z", "-r", "-M", "-C"]
                args += [parent, sha] if parent else ["--root", sha]
                manifest = parse_name_status(query(*args).stdout)
                item["parent_manifests"].append({"parent": parent, "files": manifest})
                item["manifest"].extend({**entry, "parent": parent} for entry in manifest)
            commits.append(item)
        files = parse_name_status(query("diff", "--name-status", "-z", "-M", "-C", "--no-ext-diff", "--no-textconv", "--no-relative", base_sha, e["head"]).stdout)
        e["range"] = {"expression": expression, "commits": commits, "files": files}
        e["last_commit"] = {"sha": e["head"], "message": metadata[e["head"]]["message"]}
        contradiction(e["last_commit"]["message"] == guard["message"] == accepted["message"]
                      == creation["message"], "message_matches_expected_commit")
        contradiction(shas == creation["approved_range_commits"] + [creation["commit_sha"]],
                      "range_matches_recorded_workflow")
        # Provisional unknown paths approved for the Issue are released by staging.
        approved_paths = {entry["path"] for entry in staging["staged_manifest"]}
        protected = {"opencode.json": "unknown"}
        for item in prior["protected_paths"]:
            for path in (item.get("path"), item.get("original_path")):
                if path and (item.get("special_protection") or item.get("provenance") != "unknown"
                             or path not in approved_paths):
                    protected[path] = True if item.get("provenance") != "unknown" else "unknown"
        # opencode.json is always included, even when clean or absent.
        if any(c["path"] == "opencode.json" or c["original_path"] == "opencode.json"
               for c in prior["git_state"]["changes"]):
            protected["opencode.json"] = True
        elif prior.get("baseline") is not None and protected["opencode.json"] is not True:
            protected["opencode.json"] = False
        index_raw = query("-C", str(root), "ls-files", "--stage", "-z").stdout
        pending_paths = {p for change in changes
                         for p in (change["path"], change["original_path"]) if p}
        all_snapshots = protected_snapshots(root, list(set(protected) | pending_paths), index_raw)
        current_snapshots = {p: all_snapshots[p] for p in protected}
        e["git_state"]["pending_fingerprints"] = {p: all_snapshots[p] for p in sorted(pending_paths)}
        historical = prior.get("protected_baselines", {})
        touched = {p for item in commits for entry in item["manifest"]
                   for p in (entry["path"], entry["original_path"]) if p}
        touched.update(p for entry in files for p in (entry["path"], entry["original_path"]) if p)
        for path, preexisting in sorted(protected.items()):
            current = current_snapshots[path]
            preserved = current == historical[path] if path in historical else "unknown"
            related = [c for c in changes if path in (c["path"], c["original_path"])]
            e["protected_paths"].append({"path": path, "preexisting": preexisting,
                "current_state": {**current, "changes": related},
                "staged": any(path in (item["path"], item["original_path"]) for item in staged),
                "in_range": path in touched, "unchanged_from_precommit": preserved})
            if preserved == "unknown":
                e["errors"].append(f"Missing historical protected fingerprint: {path}")
        # Policy and scope decisions belong to the guard, including pending work.
        if not e["errors"]:
            e["status"] = "complete"
    except (GitError, OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        e["errors"].append(str(error))
    return {"post_commit_evidence": e}


@managed_operation
def final_check(issue: int, post_path: str, context_path: str,
                workflow_id: str) -> dict[str, Any]:
    """Read-only final handoff gate. See final_check_contract.md for input schema.

    Immutable validated post-commit facts are reused, not reconstructed. Current
    Git is compared to that observation; semantic SDD/coverage, MCP GitHub reads,
    and a complete workflow action audit must be supplied by the workflow.
    Missing/invalidated evidence fails closed. Git alone cannot prove no push.
    """
    e: dict[str, Any] = {
        "source": {"hook": ".opencode/commands/hooks/final-workflow-check.md",
                   "operation": "scripts/harness/git_policy.py final-check", "commands": []},
        "phase": 13, "issue": issue, "workflow_id": workflow_id,
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "status": "FAIL", "ready_for_manual_validation": False,
        "invalidated_by": ["git-or-working-tree-mutation", "sdd-or-verification-change",
                           "github-state-or-documentation-change", "workflow-action-or-scope-change"],
        "checks": {}, "failures": [], "errors": [],
    }
    phase = "13: inputs"

    def digest(value):
        return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                         ensure_ascii=True).encode()).hexdigest()

    def require(condition, name):
        e["checks"][name] = bool(condition)
        if not condition:
            raise GitError(name)

    def query(*args):
        command = ["git", "-c", "diff.autoRefreshIndex=false", *args]
        e["source"]["commands"].append(command)
        return run_git(*command[1:]).stdout

    def text_query(*args):
        return decode(query(*args)).strip()

    def evidence_time(value):
        observed = datetime.fromisoformat(value)
        require(observed.tzinfo is not None, "evidence_timestamp_has_timezone")
        return observed

    try:
        require(not any(os.environ.get(name) for name in
                        ("GIT_INDEX_FILE", "GIT_DIR", "GIT_WORK_TREE")), "standard_repository_context")
        post = read_json(post_path)["post_commit_evidence"]
        context = read_json(context_path)
        require(issue > 0 and workflow_id.strip() and context["status"] == "PASS"
                and context["invalidated"] is False and context["issue"] == post["issue"] == issue
                and context["workflow_id"] == post["workflow_id"] == workflow_id,
                "complete_current_workflow_context")
        require(post["status"] == "complete" and not post["errors"]
                and post["phase"] == "post-commit"
                and post["source"]["hook"] == ".opencode/commands/hooks/post-commit.md"
                and all(post["validity"].values()) and bool(post["validity"]), "valid_post_commit_observation")
        post_digest = digest(post)
        require(context["post_commit_evidence_sha256"] == post_digest
                and context["post_commit_guard"]["status"] == "PASS"
                and context["post_commit_guard"]["evidence_sha256"] == post_digest
                and bool(context["post_commit_guard"]["source"]), "passed_post_commit_guard")
        require(evidence_time(post["observed_at"]) <= evidence_time(context["observed_at"])
                <= evidence_time(e["observed_at"]), "context_is_after_post_commit")
        phase = "13.2: local Git"
        root = Path(text_query("rev-parse", "--show-toplevel")).resolve()
        branch = text_query("branch", "--show-current")
        head = text_query("rev-parse", "--verify", "HEAD^{commit}")
        e.update(repository=str(root), branch=branch, head_sha=head)
        require(str(root) == context["repository"] == post["repository"], "repository_matches")
        require(branch not in ("", "main", "master") and branch == context["branch"] == post["branch"]
                and bool(find_issue_branches([branch], issue)), "expected_issue_branch")
        require(head == context["head_sha"] == post["head"] == post["last_commit"]["sha"]
                == post["expected_commit"]["sha"], "expected_workflow_commit_is_head")
        require(hashlib.sha256(query("for-each-ref", "--format=%(refname) %(objectname)")).hexdigest()
                == post["refs_sha256"], "post_commit_refs_not_invalidated")
        message = post["last_commit"]["message"]
        require(message == post["last_commit"]["message"] == post["expected_commit"]["message"]
                and message.strip() and f"(#{issue})" in message, "expected_issue_commit_message")
        tree = text_query("rev-parse", head + "^{tree}")
        base = post["base"]
        policy = base["canonical_policy"]
        approval = context["base_approval"]
        require(approval["status"] == "PASS" and approval["source"]
                and approval["policy"] == policy
                and is_sha(approval["initial_remote_sha"])
                and approval["initial_remote_sha"].lower() == policy["base_sha"].lower() == base["base_sha"]
                and base["immutable"] is True and base["is_ancestor_of_head"] is True,
                "documented_approved_historical_base")
        require(policy["policy"] == base["base_policy"] and policy["base_branch"] == base["base_branch"]
                and policy["base_ref"] == base["base_ref"]
                and policy["base_remote_ref"] == base["base_remote_ref"], "canonical_base_fields_match")
        if policy["policy"] == "standard-main":
            require(policy["base_branch"] == policy["pr_target"] == "main"
                    and policy["base_ref"] == "origin/main"
                    and policy["base_remote_ref"] == policy["pr_target_ref"] == "refs/heads/main",
                    "standard_main_base_and_future_target")
        else:
            dependency = policy["dependency_approval"]
            require(policy["policy"] == "approved-dependency" and dependency["approved"] is True
                    and dependency["approved_by"].strip() and dependency["reason"].strip()
                    and policy["dependency_commits"] and all(is_sha(s) for s in policy["dependency_commits"])
                    and policy["base_remote_ref"] != policy["pr_target_ref"]
                    and policy["base_remote_ref"].startswith("refs/heads/")
                    and policy["pr_target_ref"].startswith("refs/heads/") and policy["pr_target"].strip(),
                    "complete_approved_dependency_exception")
        # Git commit objects are immutable. With identical HEAD/refs and a
        # valid post-commit guard, reuse the canonical range instead of logging
        # or diffing it again. Only mutable local state is observed afresh.
        require(base["is_ancestor_of_head"] is True, "base_is_ancestor")
        expression = base["base_sha"] + ".." + head
        commits = post["range"]["commits"]
        shas = [commit["sha"] for commit in commits]
        require(expression == post["range"]["expression"] and bool(shas) and shas[-1] == head
                and len(set(shas)) == len(shas) and all(is_sha(sha) for sha in shas),
                "complete_expected_commit_range")
        require(isinstance(post["range"]["files"], list)
                and all(isinstance(commit["manifest"], list)
                        and len(commit["parent_manifests"]) == max(1, len(commit["parents"]))
                        for commit in commits), "complete_expected_range_manifest")
        raw_status = query("status", "--porcelain=v1", "-z", "-uall")
        changes = read_status(raw_status)
        require(changes == post["git_state"]["working_tree"]["interpreted"], "post_commit_state_not_invalidated")
        e["git_state"] = {"raw": decode(raw_status), "changes": changes, **classify_changes(changes)}
        protected = post["protected_paths"]
        require(any(item["path"] == "opencode.json" for item in protected)
                and all(item["unchanged_from_precommit"] is True and item["staged"] is False
                        and item["in_range"] is False for item in protected), "protected_paths_remained_intact")
        paths = {item["path"] for item in protected}
        paths.update(p for change in changes for p in (change["path"], change["original_path"]) if p)
        current_fingerprints = protected_snapshots(root, list(paths), query("-C", str(root), "ls-files", "--stage", "-z"))
        for item in protected:
            expected = {key: item["current_state"][key] for key in ("exists", "mode", "sha256", "index_entries")}
            require(current_fingerprints[item["path"]] == expected, "protected_content_still_unchanged")
        require(post["git_state"]["pending_fingerprints"] ==
                {p: current_fingerprints[p] for p in post["git_state"]["pending_fingerprints"]},
                "pending_content_still_unchanged")
        unrelated = context["unrelated_changes"]
        require(isinstance(unrelated, list) and len({c["path"] for c in unrelated}) == len(unrelated)
                and {c["path"] for c in changes} == {c["path"] for c in unrelated}
                and all(c["classification"] == "unrelated" and c["source"] and c["justification"]
                        for c in unrelated), "all_pending_changes_previously_classified_unrelated")
        phase = "13.3: SDD and verification evidence"
        sdd = context["sdd"]
        require(sdd["status"] == "PASS" and sdd["source"] and sdd["content_approved"] is True
                and sdd["slug_matches_issue"] is True, "approved_semantic_sdd_evidence")
        spec_root = root / "specs"
        require(spec_root.is_dir() and not spec_root.is_symlink(), "sdd_root_exists")
        folders = [p for p in spec_root.iterdir() if (p.is_dir() or p.is_symlink())
                   and re.match(rf"^0*{issue}(?:-|$)", p.name)]
        require(len(folders) == 1 and not folders[0].is_symlink()
                and re.fullmatch(rf"0*{issue}-[a-z0-9]+(?:-[a-z0-9]+)*", folders[0].name), "single_valid_sdd_folder")
        folder = folders[0]
        require(str(folder.relative_to(root)) == sdd["folder"], "expected_sdd_folder")
        files = {}
        for name in ("spec.md", "plan.md", "tasks.md"):
            file = folder / name
            require(file.is_file() and not file.is_symlink(), "required_sdd_files_exist")
            data = file.read_bytes()
            content = data.decode("utf-8")
            require(bool(content.strip()), "nonempty_sdd_content")
            files[name] = hashlib.sha256(data).hexdigest()
            if name == "tasks.md":
                tasks = []
                fence = None
                for line in content.splitlines():
                    marker = re.match(r"^\s*(`{3,}|~{3,})", line)
                    if marker:
                        if fence is None:
                            fence = marker[1][0]
                        elif marker[1][0] == fence:
                            fence = None
                        continue
                    if fence is None:
                        match = re.match(r"^\s*(?:[-*+]|\d+[.)])\s+\[([^\]]*)\]\s*(.*)$", line)
                        if match:
                            tasks.append(match.groups())
                require(bool(tasks) and all(state in ("x", "X") and text.strip() for state, text in tasks),
                        "all_concrete_tasks_completed")
        require(files == sdd["files"], "sdd_content_matches_approved_evidence")
        sdd_paths = {str((folder / name).relative_to(root)) for name in files}
        require(not sdd_paths & paths, "no_uncommitted_sdd_changes")
        verification = context["verifications"]
        require(verification["status"] == "PASS" and verification["source"]
                and verification["inventory_complete"] is True and verification["tree_sha"] == tree
                and verification["sdd_files"] == files, "verification_evidence_matches_committed_content")
        reports = verification["reports"]
        required = verification["required"]
        require(isinstance(required, list) and isinstance(reports, list)
                and len(set(required)) == len(required) and len({r["id"] for r in reports}) == len(reports)
                and set(required) == {r["id"] for r in reports if r["applicable"] is True}
                and (bool(required) or bool(verification["not_applicable_reason"])), "complete_applicable_verification_inventory")
        require(all(r["source"] and r["tree_sha"] == tree and
                    ((r["applicable"] is True and r["status"] == "PASS" and r["exit_code"] == 0 and r["command"])
                     or (r["applicable"] is False and r["status"] == "NOT_APPLICABLE" and r["reason"]))
                    for r in reports), "all_applicable_verifications_passed")
        criteria = sdd["acceptance_criteria"]
        require(sdd["acceptance_inventory_complete"] is True
                and set(sdd["required_criteria"]) == {c["id"] for c in criteria}
                and len({c["id"] for c in criteria}) == len(criteria), "complete_acceptance_criteria_inventory")
        require(bool(criteria) and all(c["covered"] is True and c["id"] and c["source"]
                                      and c["implemented_tasks"]
                                      and set(c["verification_ids"]) <= set(required) for c in criteria),
                "all_approved_acceptance_criteria_covered")
        e["sdd"] = {"folder": sdd["folder"], "files": files, "tasks_completed": len(tasks)}
        phase = "13.4: GitHub documentation evidence"
        github = context["github"]
        origin = text_query("config", "--get", "remote.origin.url")
        match = re.fullmatch(r"(?:git@github\.com:|https://github\.com/)([^/]+/[^/]+?)(?:\.git)?/?", origin)
        require(match is not None, "github_origin_identified")
        repository_name = match[1]
        require(github["source"] == "github-mcp" and github["invalidated"] is False
                and github["repository"] == repository_name and github["number"] == issue
                and github["state"] == "open" and github["issue_url"] ==
                f"https://github.com/{repository_name}/issues/{issue}", "current_open_github_issue")
        require(evidence_time(post["observed_at"]) <= evidence_time(github["observed_at"])
                <= evidence_time(context["observed_at"]), "github_evidence_is_current_for_handoff")
        documentation = context["documentation"]
        comments = [c for c in github["comments"] if c["id"] == documentation["comment_id"]]
        require(documentation["status"] == "PASS" and documentation["source"] and len(comments) == 1,
                "github_documentation_guard_passed")
        body = comments[0]["body"]
        require(hashlib.sha256(body.encode()).hexdigest() == documentation["body_sha256"]
                and head in body and message in body, "github_documentation_matches_real_commit")
        summary = documentation["static_summary"]
        embedded = []
        for block in re.findall(r"```json\s*\n(.*?)\n```", body, re.DOTALL):
            try:
                embedded.append(json.loads(block))
            except ValueError:
                continue
        require(summary in embedded and summary["source"] and summary["issue"] == issue
                and summary["workflow_id"] == workflow_id and summary["scope_approved"] is True
                and summary["decisions_and_dependencies_approved"] is True
                and summary["mutable_observations_are_current"] is False
                and summary["commit"] == {"sha": head, "message": message, "branch": branch}
                and summary["base_policy"] == policy
                and summary["initial_remote_sha"] == approval["initial_remote_sha"]
                and summary["sdd"] == {"folder": sdd["folder"], "files": files}
                and summary["verification_ids"] == required
                and summary["range"] == post["range"], "documented_static_evidence_is_complete_and_historical")
        phase = "13.5: workflow actions and manual handoff"
        audit = context["actions"]
        require(audit["source"] == "workflow-action-log" and audit["complete"] is True
                and audit["coverage"] == "entire-workflow" and audit["workflow_id"] == workflow_id,
                "complete_workflow_action_evidence")
        events = audit["events"]
        require(bool(events) and [event["sequence"] for event in events] == list(range(1, len(events) + 1))
                and events[0]["operation"] == "issue-start", "continuous_action_audit")
        require(not any(event["operation"] in ("push", "finish-issue", "manual-approve") for event in events),
                "no_push_finish_or_manual_approval_in_workflow")
        audited_operations = {
            "issue-start", "inspect", "validate-base", "prepare-branch", "check-branch",
            "sdd", "planning", "implementation", "verification", "review-changes", "change-review",
            "prepare-staging", "pre-commit-check", "create-commit", "check-commit", "commit-guard",
            "post-check-commit", "post-commit-guard", "github-read", "github-documentation",
            "github-documentation-guard", "manual-validation-plan", "final-check", "handoff-guard",
        }
        require(all(event["operation"] in audited_operations for event in events),
                "no_unclassified_workflow_actions")
        require(any(event["operation"] == "create-commit" and event["status"] == "PASS"
                    and event["commit_sha"] == head for event in events)
                and any(event["operation"] == "github-documentation" and event["status"] == "PASS"
                        and event["comment_id"] == documentation["comment_id"] for event in events),
                "commit_and_documentation_recorded_in_workflow")
        manual = context["manual_validation"]
        require(manual["status"] == "pending" and manual["source"] and manual["checks"]
                and all(c["status"] == "pending" and c["id"] and c["description"] for c in manual["checks"])
                and context["finish_issue_status"] == "pending", "manual_validation_and_finish_remain_pending")
        require(all(c["description"] in body for c in manual["checks"]), "manual_validation_plan_is_documented")
        e.update(status="PASS", ready_for_manual_validation=True,
                 commit={"sha": head, "message": message}, base=base, range=post["range"],
                 evidence_sources={"post_sha256": post_digest, "context_sha256": digest(context),
                                   "github": github["source"], "actions": audit["source"]})
    except (GitError, OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        e["errors"].append(str(error))
        e["failures"].append({"phase": phase, "condition": str(error),
                              "intervention": "Resolve the reported condition and supply fresh, complete evidence; preserve local work."})
    return {"final_check_evidence": e}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Hybrid Issue Git harness"
    )

    operations = parser.add_subparsers(
        dest="operation",
        required=True,
    )

    # ========================================================
    # INSPECT
    # ========================================================

    inspect_parser = operations.add_parser(
        "inspect",
        help="Collect read-only branch evidence",
    )
    inspect_parser.add_argument(
        "--issue", type=int, required=True
    )
    inspect_parser.add_argument(
        "--policy-json", default=None
    )

    # ========================================================
    # VALIDATE BASE
    # ========================================================

    base_parser = operations.add_parser(
        "validate-base",
        help="Validate an approved canonical Git base",
    )
    base_parser.add_argument(
        "--issue", type=int, required=True
    )
    base_parser.add_argument(
        "--policy-json", required=True
    )

    # ========================================================
    # PREPARE BRANCH
    # ========================================================

    prepare_parser = operations.add_parser(
        "prepare-branch",
        help="Safely create an Issue branch from approved SHA",
    )
    prepare_parser.add_argument(
        "--issue", type=int, required=True
    )
    prepare_parser.add_argument(
        "--branch", required=True
    )
    prepare_parser.add_argument(
        "--policy-json", required=True
    )
    prepare_parser.add_argument(
        "--expected-head", required=True
    )
    prepare_parser.add_argument(
        "--expected-branch", required=True
    )

    # ========================================================
    # CHECK BRANCH
    # ========================================================

    check_parser = operations.add_parser(
        "check-branch",
        help="Verify the active Issue branch",
    )
    check_parser.add_argument(
        "--issue", type=int, required=True
    )
    check_parser.add_argument(
        "--branch", required=True
    )
    check_parser.add_argument(
        "--policy-json", required=True
    )
    check_parser.add_argument(
        "--approved-commits-json",
        default=None,
    )

    # ========================================================
    # PARSE ARGUMENTS
    # ========================================================

    review_parser = operations.add_parser(
        "review-changes", help="Collect read-only phase-9 pre-stage evidence"
    )
    review_parser.add_argument("--issue", type=int, required=True)
    for name in ("spec", "plan", "tasks"):
        review_parser.add_argument(f"--{name}-path", required=True)
    review_parser.add_argument("--baseline-json", default=None,
                               help="Previously collected phase-3 inspect JSON")

    staging_parser = operations.add_parser("prepare-staging", help="Stage an explicitly approved whole-file manifest")
    staging_parser.add_argument("--issue", type=int, required=True)
    staging_parser.add_argument("--evidence-json", required=True)
    staging_parser.add_argument("--approval-json", required=True)

    precommit_parser = operations.add_parser("pre-commit-check", help="Read-only final commit readiness check")
    precommit_parser.add_argument("--issue", type=int, required=True)
    for name in ("evidence", "staging", "policy", "manifest"):
        precommit_parser.add_argument(f"--{name}-json", required=True)

    commit_parser = operations.add_parser("create-commit", help="Create one explicitly authorized Issue commit")
    commit_parser.add_argument("--issue", type=int, required=True)
    for name in ("evidence", "staging", "policy", "manifest", "pre-commit", "authorization"):
        commit_parser.add_argument(f"--{name}-json", required=True)
    commit_parser.add_argument("--message-file", required=True)
    commit_parser.add_argument("--workflow-id", required=True)

    check_commit_parser = operations.add_parser("check-commit", help="Read-only verification of the workflow commit")
    check_commit_parser.add_argument("--issue", type=int, required=True)
    for name in ("evidence", "staging", "policy", "manifest", "pre-commit", "creation", "authorization"):
        check_commit_parser.add_argument(f"--{name}-json", required=True)
    check_commit_parser.add_argument("--message-file", required=True)
    check_commit_parser.add_argument("--workflow-id", required=True)

    post_parser = operations.add_parser("post-check-commit", help="Collect the sole read-only phase-11 observation")
    post_parser.add_argument("--issue", type=int, required=True)
    for name in ("evidence", "staging", "policy", "creation", "check", "commit-guard"):
        post_parser.add_argument(f"--{name}-json", required=True)
    post_parser.add_argument("--workflow-id", required=True)

    final_parser = operations.add_parser("final-check", help="Read-only final gate before manual validation")
    final_parser.add_argument("--issue", type=int, required=True)
    final_parser.add_argument("--post-json", required=True)
    final_parser.add_argument("--context-json", required=True)
    final_parser.add_argument("--workflow-id", required=True)

    arguments = parser.parse_args()

    if arguments.issue < 1:
        parser.error("--issue must be positive")

    # ========================================================
    # EXECUTE INSPECT
    # ========================================================

    if arguments.operation == "inspect":
        result = inspect(
            issue=arguments.issue,
            policy_path=arguments.policy_json,
        )
        evidence = result["branch_evidence"]

        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if evidence["status"] == "complete" else 1

    # ========================================================
    # EXECUTE VALIDATE BASE
    # ========================================================

    if arguments.operation == "validate-base":
        result = validate_base(
            issue=arguments.issue,
            policy_path=arguments.policy_json,
        )
        evidence = result["base_validation_evidence"]

        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if evidence["status"] == "PASS" else 1

    # ========================================================
    # EXECUTE PREPARE BRANCH
    # ========================================================

    if arguments.operation == "prepare-branch":
        result = prepare_branch(
            issue=arguments.issue,
            branch_name=arguments.branch,
            policy_path=arguments.policy_json,
            expected_head=arguments.expected_head,
            expected_branch=arguments.expected_branch,
        )
        evidence = result["branch_preparation_evidence"]

        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if evidence["status"] == "PASS" else 1

    # ========================================================
    # EXECUTE CHECK BRANCH
    # ========================================================

    if arguments.operation == "check-branch":
        result = check_branch(
            issue=arguments.issue,
            branch_name=arguments.branch,
            policy_path=arguments.policy_json,
            approved_commits_path=(
                arguments.approved_commits_json
            ),
        )
        evidence = result["branch_check_evidence"]

        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if evidence["status"] == "PASS" else 1

    if arguments.operation == "review-changes":
        result = review_changes(arguments.issue, arguments.spec_path,
                                arguments.plan_path, arguments.tasks_path,
                                arguments.baseline_json)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["pre_stage_evidence"]["status"] == "PASS" else 1

    if arguments.operation == "prepare-staging":
        result = prepare_staging(arguments.issue, arguments.evidence_json, arguments.approval_json)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["staging_preparation_evidence"]["status"] == "PASS" else 1

    if arguments.operation == "pre-commit-check":
        result = pre_commit_check(arguments.issue, arguments.evidence_json, arguments.staging_json,
                                  arguments.policy_json, arguments.manifest_json)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["pre_commit_evidence"]["status"] == "PASS" else 1

    if arguments.operation == "create-commit":
        result = create_commit(arguments.issue, arguments.evidence_json, arguments.staging_json,
                               arguments.policy_json, arguments.manifest_json, arguments.pre_commit_json,
                               arguments.authorization_json, arguments.message_file, arguments.workflow_id)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["commit_creation_evidence"]["status"] == "PASS" else 1

    if arguments.operation == "check-commit":
        result = check_commit(arguments.issue, arguments.evidence_json, arguments.staging_json,
                              arguments.policy_json, arguments.manifest_json, arguments.pre_commit_json,
                              arguments.creation_json, arguments.authorization_json,
                              arguments.message_file, arguments.workflow_id)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["commit_check_evidence"]["status"] == "PASS" else 1

    if arguments.operation == "post-check-commit":
        result = post_check_commit(arguments.issue, arguments.evidence_json, arguments.staging_json,
                                   arguments.policy_json, arguments.creation_json, arguments.check_json,
                                   arguments.commit_guard_json, arguments.workflow_id)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["post_commit_evidence"]["status"] == "complete" else 1

    if arguments.operation == "final-check":
        result = final_check(arguments.issue, arguments.post_json, arguments.context_json,
                             arguments.workflow_id)
        print(json.dumps(result, ensure_ascii=True, indent=2))
        return 0 if result["final_check_evidence"]["status"] == "PASS" else 1

    return 2


if __name__ == "__main__":
    sys.exit(main())

