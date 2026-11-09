"""Adoption evidence is read-only and requires an external provenance verifier."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import unittest

import test_review_changes as review_tests


SCRIPT = review_tests.SCRIPT


class PreexistingAdoptionTests(unittest.TestCase):
    git = review_tests.ReviewChangesTests.git
    snapshot = review_tests.ReviewChangesTests.snapshot
    review = review_tests.ReviewChangesTests.review

    def setUp(self):
        review_tests.ReviewChangesTests.setUp(self)
        self.git("checkout", "-b", "feat/075-example")
        (self.repo / "old.txt").write_text("preexisting issue work\n")
        self.baseline_path = Path(self.tmp.name) / "baseline.json"
        self.baseline_path.write_text(json.dumps({"branch_evidence": {
            "status": "complete", "issue": 75,
            "git": {"repository_root": str(self.repo)},
            "preexisting_protected_changes": [{
                "path": "old.txt", "original_path": None,
                "index_status": " ", "worktree_status": "M",
            }],
        }}))

    def call(self, *args, environment=None):
        return subprocess.run([sys.executable, str(SCRIPT), *args], cwd=self.repo,
                              text=True, capture_output=True, env=environment)

    def pre_stage_file(self):
        evidence = self.review("--baseline-json", str(self.baseline_path))
        path = Path(self.tmp.name) / "evidence.json"
        path.write_text(json.dumps({"pre_stage_evidence": evidence}))
        return evidence, path

    def proposal_context(self):
        pre_stage, evidence_path = self.pre_stage_file()
        process = self.call("propose-preexisting-adoption", "--issue", "75",
                            "--workflow-id", "wf", "--evidence-json", str(evidence_path))
        proposal = json.loads(process.stdout)["preexisting_adoption_proposal"]
        self.assertEqual(process.returncode, 0, proposal)
        proposal_path = Path(self.tmp.name) / "proposal.json"
        proposal_path.write_text(json.dumps({"preexisting_adoption_proposal": proposal}))
        return pre_stage, evidence_path, proposal, proposal_path

    def authorization(self, pre_stage, proposal, manifest=None):
        candidate = proposal["candidates"][0]
        return {
            "issue": 75, "workflow_id": "wf", "repository": str(self.repo),
            "branch": pre_stage["branch"], "head_sha": pre_stage["head_sha"],
            "baseline_sha256": proposal["baseline_sha256"],
            "pre_stage_evidence_sha256": proposal["pre_stage_evidence_sha256"],
            "manifest": manifest or [{
                "path": candidate["path"], "mode": candidate["mode"],
                "content_sha256": candidate["content_sha256"],
                "diff_sha256": candidate["diff_sha256"], "justification": "Required by Issue 75",
            }],
        }

    def verifier_environment(self, *, issued_at="2026-01-01T00:00:00+00:00",
                             expires_at="2099-01-01T00:00:00+00:00", exit_code=0):
        verifier = Path(self.tmp.name) / "verifier.py"
        verifier.write_text(
            "import hashlib,json,sys\nraw=sys.stdin.buffer.read()\n"
            f"sys.exit({exit_code})\n" if exit_code else
            "import hashlib,json,sys\nraw=sys.stdin.buffer.read()\n"
            "print(json.dumps({'verified':True,'issuer':'test-idp','subject':'human-test',"
            f"'issued_at':'{issued_at}','expires_at':'{expires_at}',"
            "'authorization_sha256':hashlib.sha256(raw).hexdigest()}))\n"
        )
        return {**os.environ, "HYSSUE_ADOPTION_VERIFIER": f"{sys.executable} {verifier}"}

    def validate(self, evidence_path, proposal_path, authorization, environment):
        authorization_path = Path(self.tmp.name) / "authorization.json"
        authorization_path.write_text(json.dumps(authorization))
        return self.call("validate-preexisting-adoption", "--issue", "75", "--workflow-id", "wf",
                         "--evidence-json", str(evidence_path), "--proposal-json", str(proposal_path),
                         "--authorization-json", str(authorization_path), environment=environment)

    def test_proposal_only_includes_preexisting_path(self):
        _, evidence_path = self.pre_stage_file()
        process = self.call("propose-preexisting-adoption", "--issue", "75",
                            "--workflow-id", "wf", "--evidence-json", str(evidence_path))
        proposal = json.loads(process.stdout)["preexisting_adoption_proposal"]
        self.assertEqual(process.returncode, 0, proposal)
        self.assertEqual(proposal["status"], "PASS")
        self.assertEqual([item["path"] for item in proposal["candidates"]], ["old.txt"])
        self.assertEqual(proposal["candidates"][0]["classification"], "preexisting-path")

    def test_validation_requires_external_provenance_and_exact_manifest(self):
        pre_stage, evidence_path = self.pre_stage_file()
        proposal_process = self.call("propose-preexisting-adoption", "--issue", "75",
                                     "--workflow-id", "wf", "--evidence-json", str(evidence_path))
        proposal = json.loads(proposal_process.stdout)["preexisting_adoption_proposal"]
        proposal_path = Path(self.tmp.name) / "proposal.json"
        proposal_path.write_text(json.dumps({"preexisting_adoption_proposal": proposal}))
        candidate = proposal["candidates"][0]
        authorization = {
            "issue": 75, "workflow_id": "wf", "repository": str(self.repo),
            "branch": pre_stage["branch"], "head_sha": pre_stage["head_sha"],
            "baseline_sha256": proposal["baseline_sha256"],
            "pre_stage_evidence_sha256": proposal["pre_stage_evidence_sha256"],
            "manifest": [{"path": "old.txt", "mode": candidate["mode"],
                          "content_sha256": candidate["content_sha256"],
                          "diff_sha256": candidate["diff_sha256"], "justification": "Required by Issue 75"}],
        }
        authorization_path = Path(self.tmp.name) / "authorization.json"
        authorization_path.write_text(json.dumps(authorization))
        blocked = self.call("validate-preexisting-adoption", "--issue", "75", "--workflow-id", "wf",
                            "--evidence-json", str(evidence_path), "--proposal-json", str(proposal_path),
                            "--authorization-json", str(authorization_path))
        self.assertNotEqual(blocked.returncode, 0)

        verifier = Path(self.tmp.name) / "verifier.py"
        verifier.write_text(
            "import hashlib,json,sys\nraw=sys.stdin.buffer.read()\n"
            "print(json.dumps({'verified':True,'issuer':'test-idp','subject':'human-test',"
            "'issued_at':'2026-01-01T00:00:00+00:00','expires_at':'2099-01-01T00:00:00+00:00',"
            "'authorization_sha256':hashlib.sha256(raw).hexdigest()}))\n"
        )
        environment = {**os.environ, "HYSSUE_ADOPTION_VERIFIER": f"{sys.executable} {verifier}"}
        passed = self.call("validate-preexisting-adoption", "--issue", "75", "--workflow-id", "wf",
                           "--evidence-json", str(evidence_path), "--proposal-json", str(proposal_path),
                           "--authorization-json", str(authorization_path), environment=environment)
        result = json.loads(passed.stdout)["preexisting_adoption_evidence"]
        self.assertEqual(passed.returncode, 0, result)
        self.assertEqual(result["status"], "PASS")
        self.assertEqual([item["path"] for item in result["adopted_paths"]], ["old.txt"])

    def test_staging_revalidates_adopted_bytes(self):
        pre_stage, evidence_path = self.pre_stage_file()
        proposal = json.loads(self.call(
            "propose-preexisting-adoption", "--issue", "75", "--workflow-id", "wf",
            "--evidence-json", str(evidence_path),
        ).stdout)["preexisting_adoption_proposal"]
        candidate = proposal["candidates"][0]
        proposal_path = Path(self.tmp.name) / "proposal.json"
        proposal_path.write_text(json.dumps({"preexisting_adoption_proposal": proposal}))
        authorization = {
            "issue": 75, "workflow_id": "wf", "repository": str(self.repo),
            "branch": pre_stage["branch"], "head_sha": pre_stage["head_sha"],
            "baseline_sha256": proposal["baseline_sha256"],
            "pre_stage_evidence_sha256": proposal["pre_stage_evidence_sha256"],
            "manifest": [{"path": "old.txt", "mode": candidate["mode"],
                          "content_sha256": candidate["content_sha256"],
                          "diff_sha256": candidate["diff_sha256"], "justification": "Issue 75"}],
        }
        authorization_path = Path(self.tmp.name) / "authorization.json"
        authorization_path.write_text(json.dumps(authorization))
        verifier = Path(self.tmp.name) / "verifier.py"
        verifier.write_text(
            "import hashlib,json,sys\nraw=sys.stdin.buffer.read()\n"
            "print(json.dumps({'verified':True,'issuer':'test-idp','subject':'human-test',"
            "'issued_at':'2026-01-01T00:00:00+00:00','expires_at':'2099-01-01T00:00:00+00:00',"
            "'authorization_sha256':hashlib.sha256(raw).hexdigest()}))\n"
        )
        environment = {**os.environ, "HYSSUE_ADOPTION_VERIFIER": f"{sys.executable} {verifier}"}
        adoption = json.loads(self.call(
            "validate-preexisting-adoption", "--issue", "75", "--workflow-id", "wf",
            "--evidence-json", str(evidence_path), "--proposal-json", str(proposal_path),
            "--authorization-json", str(authorization_path), environment=environment,
        ).stdout)["preexisting_adoption_evidence"]
        adoption_path = Path(self.tmp.name) / "adoption.json"
        adoption_path.write_text(json.dumps({"preexisting_adoption_evidence": adoption}))
        approval_path = Path(self.tmp.name) / "approval.json"
        approval_path.write_text(json.dumps({
            "issue": 75, "status": "PASS",
            "evidence_sha256": hashlib.sha256(json.dumps(
                pre_stage, sort_keys=True, separators=(",", ":"), ensure_ascii=True,
            ).encode()).hexdigest(),
            "manifest": [{"path": "old.txt", "mode": candidate["mode"],
                          "sha256": candidate["content_sha256"]}],
        }))
        staged = self.call("prepare-staging", "--issue", "75", "--evidence-json", str(evidence_path),
                           "--approval-json", str(approval_path), "--adoption-json", str(adoption_path),
                           environment=environment)
        result = json.loads(staged.stdout)["staging_preparation_evidence"]
        self.assertEqual(staged.returncode, 0, result)
        self.assertEqual(result["status"], "PASS")
        self.assertEqual(self.git("diff", "--cached", "--name-only").decode().splitlines(), ["old.txt"])

    def test_validation_rejects_expired_or_temporally_invalid_receipts(self):
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        authorization = self.authorization(pre_stage, proposal)
        for issued_at, expires_at in (
            ("2026-01-01T00:00:00+00:00", "2020-01-01T00:00:00+00:00"),
            ("2099-01-02T00:00:00+00:00", "2099-01-01T00:00:00+00:00"),
        ):
            with self.subTest(issued_at=issued_at, expires_at=expires_at):
                result = self.validate(evidence_path, proposal_path, authorization,
                                       self.verifier_environment(issued_at=issued_at, expires_at=expires_at))
                self.assertNotEqual(result.returncode, 0)

    def test_validation_rejects_mismatched_identity_and_hashes(self):
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        fields = {
            "issue": 76,
            "workflow_id": "other-workflow",
            "repository": "/other/repository",
            "branch": "other-branch",
            "head_sha": "0" * 40,
            "baseline_sha256": "0" * 64,
            "pre_stage_evidence_sha256": "0" * 64,
        }
        for field, value in fields.items():
            with self.subTest(field=field):
                authorization = self.authorization(pre_stage, proposal)
                authorization[field] = value
                result = self.validate(evidence_path, proposal_path, authorization,
                                       self.verifier_environment())
                self.assertNotEqual(result.returncode, 0)

        for field in ("content_sha256", "diff_sha256", "mode"):
            with self.subTest(field=field):
                authorization = self.authorization(pre_stage, proposal)
                authorization["manifest"][0][field] = "0" * 64 if field != "mode" else "100755"
                result = self.validate(evidence_path, proposal_path, authorization,
                                       self.verifier_environment())
                self.assertNotEqual(result.returncode, 0)

    def test_validation_rejects_unapproved_and_forbidden_paths(self):
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        candidate = proposal["candidates"][0]
        for path in ("directory", "*.txt", "opencode.json", "__pycache__/generated.pyc"):
            with self.subTest(path=path):
                authorization = self.authorization(pre_stage, proposal, [{
                    "path": path, "mode": candidate["mode"],
                    "content_sha256": candidate["content_sha256"],
                    "diff_sha256": candidate["diff_sha256"], "justification": "Not authorized",
                }])
                result = self.validate(evidence_path, proposal_path, authorization,
                                       self.verifier_environment())
                self.assertNotEqual(result.returncode, 0)

    def test_validation_rejects_changed_content_or_mode_after_authorization(self):
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        authorization = self.authorization(pre_stage, proposal)
        for change in ("content", "mode"):
            with self.subTest(change=change):
                if change == "content":
                    (self.repo / "old.txt").write_text("changed after authorization\n")
                else:
                    (self.repo / "old.txt").write_text("preexisting issue work\n")
                    os.chmod(self.repo / "old.txt", 0o755)
                result = self.validate(evidence_path, proposal_path, authorization,
                                       self.verifier_environment())
                self.assertNotEqual(result.returncode, 0)

    def test_validation_rejects_failed_verifier_and_unapproved_staging_path(self):
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        authorization = self.authorization(pre_stage, proposal)
        failed = self.validate(evidence_path, proposal_path, authorization,
                               self.verifier_environment(exit_code=1))
        self.assertNotEqual(failed.returncode, 0)

        (self.repo / "mixed.txt").write_text("unapproved change\n")
        baseline = json.loads(self.baseline_path.read_text())
        baseline["branch_evidence"]["preexisting_protected_changes"].append({
            "path": "mixed.txt", "original_path": None,
            "index_status": "?", "worktree_status": "?",
        })
        self.baseline_path.write_text(json.dumps(baseline))
        pre_stage, evidence_path, proposal, proposal_path = self.proposal_context()
        authorization = self.authorization(pre_stage, proposal)
        passed = self.validate(evidence_path, proposal_path, authorization,
                               self.verifier_environment())
        adoption = json.loads(passed.stdout)["preexisting_adoption_evidence"]
        self.assertEqual(passed.returncode, 0, adoption)

        adoption_path = Path(self.tmp.name) / "adoption.json"
        adoption_path.write_text(json.dumps({"preexisting_adoption_evidence": adoption}))
        approval_path = Path(self.tmp.name) / "approval.json"
        approval_path.write_text(json.dumps({
            "issue": 75, "status": "PASS",
            "evidence_sha256": hashlib.sha256(json.dumps(
                pre_stage, sort_keys=True, separators=(",", ":"), ensure_ascii=True,
            ).encode()).hexdigest(),
            "manifest": [{"path": "mixed.txt", "mode": "100644",
                          "sha256": hashlib.sha256(b"unapproved change\n").hexdigest()}],
        }))
        result = self.call("prepare-staging", "--issue", "75", "--evidence-json", str(evidence_path),
                           "--approval-json", str(approval_path), "--adoption-json", str(adoption_path),
                           environment=self.verifier_environment())
        self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
