"""Focused controls for the opt-in NO_CHANGES profile."""
from contextlib import chdir
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))

import existing_content_validation as validation
from workflow_controller import WorkflowController


class ExistingContentValidationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name)
        for args in (("init", "-b", "main"), ("config", "user.email", "test@example.invalid"),
                     ("config", "user.name", "Test")):
            subprocess.run(["git", *args], cwd=self.repo, check=True, capture_output=True)
        (self.repo / "content.md").write_text("already satisfies the criterion\n")
        (self.repo / "protected.md").write_text("do not change\n")
        subprocess.run(["git", "add", "."], cwd=self.repo, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "Baseline"], cwd=self.repo, check=True, capture_output=True)
        self.baseline = validation.snapshot(218, self.repo, ["protected.md"])["existing_content_baseline"]

    def inputs(self):
        observed = datetime.now(timezone.utc).isoformat()
        return {
            "criteria": [{"id": "AC1", "evidence": ["content.md:1"], "observed_at": observed}],
            "semantic_review": {"status": "PASS", "reviewer": "independent-reviewer", "independent": True,
                                "criteria": ["AC1"], "observed_at": observed},
            "not_applicable": [{"operation": operation, "required_check": False, "authorized": True,
                                "authorization_source": "user", "reason": "Existing content is reviewed in place",
                                "evidence": ["baseline"],
                                "phase": next(phase for phase, name in validation.NOT_APPLICABLE_PHASES.items() if name == operation)}
                               for operation in sorted(validation.REQUIRED_NOT_APPLICABLE)],
            "verification": {"source": "scripts/harness/verification_runner.py run", "status": "PASS", "applicable_checks": ["git-diff-check"],
                             "all_applicable_checks_executed": True, "reports": [
                {"id": "git-diff-check", "command": ["git", "diff", "--check"], "status": "PASS", "execution_status": "completed"}
            ]},
            "authorization": {"profile": validation.PROFILE, "authorized": True,
                              "source": "user", "reason": "User explicitly requested existing-content validation"},
        }

    def validate(self):
        return validation.validate(218, self.repo, self.baseline, **self.inputs())["existing_content_validation_evidence"]

    def test_complete_current_coverage_and_independent_review_yield_no_changes(self):
        evidence = self.validate()
        self.assertEqual(evidence["status"], "PASS", evidence)
        self.assertEqual(evidence["outcome"], "NO_CHANGES")

    def test_missing_criterion_coverage_or_invalid_not_applicable_blocks(self):
        values = self.inputs()
        values["criteria"][0]["evidence"] = []
        values["not_applicable"][0]["required_check"] = True
        evidence = validation.validate(218, self.repo, self.baseline, **values)["existing_content_validation_evidence"]
        self.assertEqual(evidence["status"], "BLOCK")
        self.assertIn("Every criterion", " ".join(evidence["errors"]))
        self.assertIn("Non-applicability", " ".join(evidence["errors"]))

    def test_applicable_verification_and_git_diff_check_are_required(self):
        values = self.inputs()
        values["verification"]["reports"][0]["status"] = "FAIL"
        evidence = validation.validate(218, self.repo, self.baseline, **values)["existing_content_validation_evidence"]
        self.assertEqual(evidence["status"], "BLOCK")
        self.assertIn("git diff --check", " ".join(evidence["errors"]))

    def test_mutation_and_reverted_commit_cannot_qualify(self):
        (self.repo / "protected.md").write_text("changed\n")
        self.assertEqual(self.validate()["status"], "BLOCK")
        (self.repo / "protected.md").write_text("do not change\n")
        (self.repo / "temporary.txt").write_text("attributable mutation\n")
        subprocess.run(["git", "add", "."], cwd=self.repo, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "Temporary attributable commit"], cwd=self.repo, check=True, capture_output=True)
        subprocess.run(["git", "reset", "--hard", "HEAD~1"], cwd=self.repo, check=True, capture_output=True)
        evidence = self.validate()
        self.assertEqual(evidence["status"], "BLOCK")
        self.assertIn("attributable commit/revert", " ".join(evidence["errors"]))

    def test_profile_requires_explicit_selection_and_keeps_ordinary_route(self):
        ordinary = WorkflowController(218, self.repo, "ordinary")
        self.assertEqual(ordinary.advance()["phase"], 1)
        selected = WorkflowController(218, self.repo, "existing")
        with self.assertRaises(ValueError):
            selected.select_profile(validation.PROFILE, {"authorized": True})
        selected.select_profile(validation.PROFILE, {"profile": validation.PROFILE, "authorized": True, "source": "user", "reason": "explicit"})
        self.assertEqual(selected.snapshot()["workflow"]["profile"], validation.PROFILE)
        # A resumed in-memory controller preserves the selected route and cannot reselect it.
        with self.assertRaises(ValueError):
            selected.select_profile(validation.PROFILE, {"profile": validation.PROFILE, "authorized": True, "source": "user", "reason": "again"})

    def test_saved_baseline_is_valid_after_a_read_only_resumption(self):
        # A new local validation call uses only the saved baseline and current Git state.
        resumed = validation.validate(218, self.repo, self.baseline, **self.inputs())["existing_content_validation_evidence"]
        self.assertEqual(resumed["status"], "PASS", resumed)
        self.assertEqual(resumed["outcome"], "NO_CHANGES")

    def test_issue_213_control_is_read_only_and_does_not_need_canonical_state(self):
        before = {path.name: path.read_bytes() for path in self.repo.iterdir() if path.is_file()}
        baseline = validation.snapshot(213, self.repo, ["protected.md"])["existing_content_baseline"]
        evidence = validation.validate(213, self.repo, baseline, **self.inputs())["existing_content_validation_evidence"]
        after = {path.name: path.read_bytes() for path in self.repo.iterdir() if path.is_file()}
        self.assertEqual(evidence["status"], "PASS", evidence)
        self.assertEqual(before, after)

    def test_controller_routes_selected_profile_to_guarded_validation(self):
        controller = WorkflowController(218, self.repo, "route")
        controller.select_profile(validation.PROFILE, {"profile": validation.PROFILE, "authorized": True, "source": "user", "reason": "explicit"})
        controller.phase = 2
        controller.evidence.record("context", {"path": "AGENTS.md"}, category="static", kind="context_item",
                                   source="test", phase=2, status="PASS", observed_at=datetime.now(timezone.utc).isoformat())
        ref = controller.evidence.reference("context", "static")
        manifest = [{"phase": phase, "operation": operation, "required_check": False, "authorized": True,
                     "authorization_source": "user", "reason": "No mutation is needed", "evidence": [ref]}
                    for phase, operation in validation.NOT_APPLICABLE_PHASES.items()]
        manifest_ref = controller.record_not_applicable_manifest(manifest)
        controller.decide_guard("context", "PASS", ".opencode/commands/guardarails/context.md", [ref, manifest_ref], "context observed")
        self.assertEqual(controller.advance()["phase"], 7)
        skipped = [entry["phase"] for entry in controller.history if entry["status"] == "NOT_APPLICABLE"]
        self.assertEqual(skipped, list(validation.NOT_APPLICABLE_PHASES))
        self.assertNotIn(7, skipped)
        self.assertEqual(controller.advance()["status"], "BLOCK")

    def test_controller_blocks_route_without_a_complete_manifest(self):
        controller = WorkflowController(218, self.repo, "missing-manifest")
        controller.select_profile(validation.PROFILE, {"profile": validation.PROFILE, "authorized": True, "source": "user", "reason": "explicit"})
        controller.phase = 2
        controller.evidence.record("context", {"path": "AGENTS.md"}, category="static", kind="context_item",
                                   source="test", phase=2, status="PASS", observed_at=datetime.now(timezone.utc).isoformat())
        ref = controller.evidence.reference("context", "static")
        controller.decide_guard("context", "PASS", ".opencode/commands/guardarails/context.md", [ref], "context observed")
        self.assertEqual(controller.advance()["status"], "BLOCK")

    def test_profile_handoff_requires_truthful_no_change_documentation(self):
        controller = WorkflowController(218, self.repo, "handoff")
        controller.select_profile(validation.PROFILE, {"profile": validation.PROFILE, "authorized": True, "source": "user", "reason": "explicit"})
        controller.phase = 14
        observed = datetime.now(timezone.utc).isoformat()
        controller.evidence.record("existing_content_validation_evidence", {
            "source": "test", "phase": 13, "issue": 218, "repository": str(self.repo),
            "workflow_id": "handoff", "status": "PASS", "observed_at": observed, "outcome": "NO_CHANGES",
        })
        controller.evidence.record("verification_evidence", {
            "source": "test", "phase": 7, "issue": 218, "repository": str(self.repo),
            "workflow_id": "handoff", "status": "PASS", "observed_at": observed,
        })
        controller.record_external("manual_validation_plan", {
            "source": "test", "phase": 14, "issue": 218, "repository": str(self.repo),
            "workflow_id": "handoff", "status": "PASS", "observed_at": observed,
            "manual_status": "pending", "checks": [{"status": "pending"}],
        })
        refs = [controller.evidence.reference(key) for key in ("existing_content_validation_evidence", "verification_evidence", "manual_validation_plan")]
        controller.decide_guard("manual-validation", "PASS", ".opencode/commands/guardarails/manual-validation.md", refs, "manual checks are pending")
        result = controller.advance()
        self.assertEqual(result["status"], "BLOCK")
        self.assertIn("no_change_documentation_evidence", result["errors"][0])


if __name__ == "__main__":
    unittest.main()
