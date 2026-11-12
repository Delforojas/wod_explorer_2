"""Read-only controls for the explicit existing-content validation profile."""
from __future__ import annotations

from datetime import datetime, timezone
import hashlib
from pathlib import Path
import subprocess
from typing import Any

from evidence_manager import managed_operation


PROFILE = "existing-content-validation"
PROHIBITED_OPERATIONS = {"create-commit", "prepare-staging", "push", "merge", "finish-issue"}
NOT_APPLICABLE_PHASES = {
    3: "branch", 4: "sdd", 5: "planning", 6: "implementation", 8: "repair",
    9: "change-review", 10: "commit", 11: "post-commit", 12: "github-documentation",
}
REQUIRED_NOT_APPLICABLE = set(NOT_APPLICABLE_PHASES.values())


def _git(root: Path, *args: str) -> str:
    result = subprocess.run(["git", *args], cwd=root, capture_output=True, text=True, check=False)
    if result.returncode:
        raise ValueError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout.strip()


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _timestamp(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return None
    return parsed if parsed.tzinfo else None


def validate_not_applicable_manifest(manifest: list[dict[str, Any]]) -> tuple[bool, str | None]:
    """Validate the complete pre-route manifest; evidence references are resolved by the controller."""
    if not isinstance(manifest, list) or len(manifest) != len(NOT_APPLICABLE_PHASES):
        return False, "Non-applicability manifest is incomplete"
    by_phase = {item.get("phase"): item for item in manifest if isinstance(item, dict)}
    if set(by_phase) != set(NOT_APPLICABLE_PHASES):
        return False, "Non-applicability manifest has missing or duplicate phases"
    for phase, operation in NOT_APPLICABLE_PHASES.items():
        item = by_phase[phase]
        if (item.get("operation") != operation or item.get("required_check") is not False
                or item.get("authorized") is not True or item.get("authorization_source") != "user"
                or not isinstance(item.get("reason"), str) or not item["reason"].strip()
                or not isinstance(item.get("evidence"), list) or not item["evidence"]):
            return False, f"Non-applicability entry for phase {phase} is not authorized and evidence-bound"
    return True, None


@managed_operation
def snapshot(issue: int, repository: str | Path, protected_paths: list[str]) -> dict[str, Any]:
    """Capture the exact clean repository state before content review begins."""
    root = Path(repository).resolve()
    errors: list[str] = []
    protected: dict[str, str] = {}
    try:
        status = _git(root, "status", "--porcelain=v1", "-z", "-uall")
        for value in protected_paths:
            if not isinstance(value, str) or not value or Path(value).is_absolute() or ".." in Path(value).parts:
                errors.append("Protected path is invalid")
                continue
            file = root / value
            if not file.is_file():
                errors.append(f"Protected path is missing: {value}")
                continue
            protected[value] = _sha256(file)
        evidence = {
            "source": "scripts/harness/existing_content_validation.py snapshot",
            "phase": 13,
            "profile": PROFILE,
            "issue": issue,
            "repository": str(root),
            "observed_at": datetime.now(timezone.utc).isoformat(),
            "head_sha": _git(root, "rev-parse", "HEAD"),
            "tree_sha": _git(root, "rev-parse", "HEAD^{tree}"),
            "branch": _git(root, "branch", "--show-current"),
            "status_sha256": hashlib.sha256(status.encode()).hexdigest(),
            "working_tree_clean": status == "",
            # Reflog equality catches a create/reset or create/revert sequence.
            "reflog_sha256": hashlib.sha256(_git(root, "reflog", "--format=%H%x00%gs").encode()).hexdigest(),
            "protected_paths": protected,
            "errors": errors,
        }
    except ValueError as error:
        return {"existing_content_baseline": {"source": "scripts/harness/existing_content_validation.py snapshot", "phase": 13,
                                              "profile": PROFILE, "issue": issue, "status": "BLOCK",
                                              "observed_at": datetime.now(timezone.utc).isoformat(), "errors": [str(error)]}}
    evidence["status"] = "PASS" if evidence["working_tree_clean"] and not errors else "BLOCK"
    if not evidence["working_tree_clean"]:
        errors.append("Baseline requires a clean index and working tree")
    return {"existing_content_baseline": evidence}


@managed_operation
def validate(issue: int, repository: str | Path, baseline: dict[str, Any], criteria: list[dict[str, Any]],
             semantic_review: dict[str, Any], not_applicable: list[dict[str, Any]], verification: dict[str, Any],
             authorization: dict[str, Any]) -> dict[str, Any]:
    """Validate a no-change conclusion from current local evidence only."""
    root = Path(repository).resolve()
    errors: list[str] = []
    checks: dict[str, bool] = {}
    now = datetime.now(timezone.utc).isoformat()
    checks["explicit_profile_authorization"] = (
        authorization.get("profile") == PROFILE and authorization.get("authorized") is True
        and authorization.get("source") == "user"
        and isinstance(authorization.get("reason"), str) and bool(authorization["reason"].strip())
    )
    if not checks["explicit_profile_authorization"]:
        errors.append("Existing-content validation requires explicit user authorization")
    checks["baseline_valid"] = (
        baseline.get("profile") == PROFILE and baseline.get("issue") == issue
        and baseline.get("repository") == str(root) and baseline.get("status") == "PASS"
        and _timestamp(baseline.get("observed_at")) is not None
    )
    if not checks["baseline_valid"]:
        errors.append("Baseline is missing, stale in identity, or was not passing")
    try:
        status = _git(root, "status", "--porcelain=v1", "-z", "-uall")
        current = {
            "head_sha": _git(root, "rev-parse", "HEAD"),
            "tree_sha": _git(root, "rev-parse", "HEAD^{tree}"),
            "branch": _git(root, "branch", "--show-current"),
            "status_sha256": hashlib.sha256(status.encode()).hexdigest(),
            "reflog_sha256": hashlib.sha256(_git(root, "reflog", "--format=%H%x00%gs").encode()).hexdigest(),
        }
        checks["baseline_unchanged"] = all(current[key] == baseline.get(key) for key in current)
        checks["index_and_working_tree_clean"] = status == ""
        protected = baseline.get("protected_paths")
        checks["protected_paths_unchanged"] = isinstance(protected, dict) and all(
            isinstance(path, str) and (root / path).is_file() and _sha256(root / path) == digest
            for path, digest in protected.items()
        )
    except ValueError as error:
        errors.append(str(error))
        checks.update({"baseline_unchanged": False, "index_and_working_tree_clean": False, "protected_paths_unchanged": False})
    for name, message in (("baseline_unchanged", "Repository mutation or attributable commit/revert detected"),
                          ("index_and_working_tree_clean", "Index or working tree is not clean"),
                          ("protected_paths_unchanged", "A protected path changed or is unavailable")):
        if not checks[name]:
            errors.append(message)

    baseline_time = _timestamp(baseline.get("observed_at"))
    ids = [item.get("id") for item in criteria if isinstance(item, dict)]
    checks["criterion_coverage_complete"] = bool(ids) and len(ids) == len(set(ids)) and all(
        isinstance(item.get("evidence"), list) and item["evidence"]
        and _timestamp(item.get("observed_at")) is not None
        and (baseline_time is None or _timestamp(item["observed_at"]) >= baseline_time)
        for item in criteria if isinstance(item, dict)
    )
    if not checks["criterion_coverage_complete"]:
        errors.append("Every criterion needs current, non-empty evidence")
    checks["independent_semantic_review"] = (
        semantic_review.get("status") == "PASS" and isinstance(semantic_review.get("reviewer"), str)
        and bool(semantic_review["reviewer"].strip()) and semantic_review.get("independent") is True
        and sorted(semantic_review.get("criteria", [])) == sorted(ids)
        and _timestamp(semantic_review.get("observed_at")) is not None
        and (baseline_time is None or _timestamp(semantic_review["observed_at"]) >= baseline_time)
    )
    if not checks["independent_semantic_review"]:
        errors.append("An independent semantic review must cover every criterion")
    checks["not_applicable_guarded"], non_applicable_error = validate_not_applicable_manifest(not_applicable)
    if not checks["not_applicable_guarded"]:
        errors.append(non_applicable_error or "NOT_APPLICABLE requires authorization, reason, evidence, and a non-required operation")
    operations = {item.get("operation") for item in not_applicable if isinstance(item, dict)}
    checks["no_prohibited_attributable_operations"] = not bool(operations & PROHIBITED_OPERATIONS)
    if not checks["no_prohibited_attributable_operations"]:
        errors.append("A prohibited attributable operation cannot be NOT_APPLICABLE")
    reports = verification.get("reports") if isinstance(verification, dict) else None
    applicable = verification.get("applicable_checks") if isinstance(verification, dict) else None
    if applicable is None and isinstance(verification, dict):
        applicable = verification.get("coverage", {}).get("applicable")
    def command_text(report: dict[str, Any]) -> str:
        command = report.get("command")
        return " ".join(command) if isinstance(command, list) else command
    checks["applicable_verifications_passed"] = (
        verification.get("status") == "PASS" and verification.get("source") == "scripts/harness/verification_runner.py run"
        and isinstance(applicable, list) and applicable and verification.get("all_applicable_checks_executed") is True
        and isinstance(reports, list) and {report.get("id") for report in reports if isinstance(report, dict)} == set(applicable)
        and all(report.get("status") == "PASS" and report.get("execution_status") == "completed" for report in reports if isinstance(report, dict))
        and any(report.get("id") == "git-diff-check" and command_text(report) == "git diff --check"
                and report.get("status") == "PASS" for report in reports if isinstance(report, dict))
    )
    if not checks["applicable_verifications_passed"]:
        errors.append("Applicable verification evidence, including git diff --check, must pass")
    return {"existing_content_validation_evidence": {
        "source": "scripts/harness/existing_content_validation.py validate", "phase": 13,
        "profile": PROFILE, "issue": issue, "repository": str(root), "observed_at": now,
        "status": "PASS" if not errors else "BLOCK", "outcome": "NO_CHANGES" if not errors else None,
        "checks": checks, "errors": errors, "baseline_sha256": hashlib.sha256(repr(sorted(baseline.items())).encode()).hexdigest(),
    }}
