
import json
import os
import subprocess
import sys
import tempfile
import unittest

from pathlib import Path


SCRIPT = (
    Path(__file__).resolve().parents[1] / "git_policy.py"
)


class ValidateBaseTests(unittest.TestCase):

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.remote_temp = tempfile.TemporaryDirectory()
        self.previous_directory = os.getcwd()

        self.repo = Path(self.temp.name)
        self.remote = Path(self.remote_temp.name)

        self.git("init", "--bare", str(self.remote))
        self.git("init", "-b", "main", cwd=self.repo)
        self.git(
            "config", "user.email", "test@example.com"
        )
        self.git(
            "config", "user.name", "Test User"
        )

        (self.repo / "README.md").write_text(
            "Initial project\n",
            encoding="utf-8",
        )

        self.git("add", "README.md")
        self.git("commit", "-m", "Initial commit")
        self.git("remote", "add", "origin", str(self.remote))
        self.git("push", "-u", "origin", "main")

        self.base_sha = self.git("rev-parse", "HEAD").stdout.strip()

        self.policy = {
            "policy": "standard-main",
            "base_ref": "origin/main",
            "base_remote_ref": "refs/heads/main",
            "base_sha": self.base_sha,
            "pr_target": "main",
            "pr_target_ref": "refs/heads/main",
        }

        self.policy_path = self.repo / "policy.json"
        self.save_policy()

    def tearDown(self):
        os.chdir(self.previous_directory)
        self.temp.cleanup()
        self.remote_temp.cleanup()

    def test_phase3_through_workflow_controller(self):
        from contextlib import chdir

        harness_dir = str(SCRIPT.parent)
        sys.path.insert(0, harness_dir)

        try:
            from workflow_controller import (
                WorkflowController,
                perform,
            )

            issue = 198
            branch_name = f"test/{issue}-controller"

            # Existing fixture policy.json would make
            # the temporary Git working tree dirty.
            self.policy_path.unlink()

            controller = WorkflowController(
                issue=issue,
                repository=self.repo,
                workflow_id="integration-test",
            )
            controller.phase = 3

            def invoke(operation, arguments):
                return perform(controller, {
                    "operation": "invoke",
                    "arguments": {
                        "operation": operation,
                        "arguments": arguments,
                    },
                })

            with chdir(self.repo):
                inspection = invoke(
                    "git_policy.inspect",
                    {"issue": issue},
                )["branch_evidence"]

                self.assertEqual(
                    inspection["status"], "complete"
                )

                candidate = inspection["base_candidate"]

                policy = {
                    "policy": "standard-main",
                    "base_branch": "main",
                    "base_ref": candidate["base_ref"],
                    "base_remote_ref": candidate["base_remote_ref"],
                    "base_sha": candidate[
                        "base_remote_sha_latest"
                    ],
                    "pr_target": "main",
                    "pr_target_ref": "refs/heads/main",
                }

                validation = invoke(
                    "git_policy.validate_base",
                    {
                        "issue": issue,
                        "policy_path": policy,
                    },
                )["base_validation_evidence"]

                self.assertEqual(
                    validation["status"],
                    "PASS",
                    validation["errors"],
                )

                # Verify automatic canonical base registration.
                canonical = controller.evidence.get(
                    "canonical_base", "static"
                )

                self.assertEqual(
                    canonical["payload"]["base_sha"],
                    policy["base_sha"],
                )

                preparation = invoke(
                    "git_policy.prepare_branch",
                    {
                        "issue": issue,
                        "branch_name": branch_name,
                        "policy_path": policy,
                        "expected_head": inspection["git"]["head"],
                        "expected_branch": inspection["git"][
                            "active_branch"
                        ],
                    },
                )["branch_preparation_evidence"]

                self.assertEqual(
                    preparation["status"],
                    "PASS",
                    preparation["errors"],
                )

                branch_check = invoke(
                    "git_policy.check_branch",
                    {
                        "issue": issue,
                        "branch_name": branch_name,
                        "policy_path": policy,
                    },
                )["branch_check_evidence"]

                self.assertEqual(
                    branch_check["status"],
                    "PASS",
                    branch_check["errors"],
                )

                self.assertEqual(
                    controller.status, "RUNNING"
                )
                # Verify mandatory canonical base fields.
                canonical = controller.evidence.get(
                    "canonical_base", "static"
                )["payload"]

                required_fields = (
                    "policy",
                    "base_branch",
                    "base_ref",
                    "base_remote_ref",
                    "base_sha",
                    "pr_target",
                    "pr_target_ref",
                    "base_remote_sha_initial",
                )

                for field in required_fields:
                    with self.subTest(field=field):
                        self.assertTrue(
                            canonical.get(field),
                            f"Missing canonical field: {field}",
                        )

                self.assertEqual(
                    canonical["base_remote_sha_initial"],
                    policy["base_sha"],
                )

                # The Branch Guard must reference both
                # mandatory evidence entries.
                references = [
                    controller.evidence.reference(
                        "canonical_base", "static"
                    ),
                    controller.evidence.reference(
                        "branch_check_evidence", "mutable"
                    ),
                ]

                guard = controller.decide_guard(
                    name="branch",
                    status="PASS",
                    source=".opencode/commands/guardarails/branch.md",
                    references=references,
                    reason="Verified canonical base and Issue branch",
                )

                self.assertEqual(guard["status"], "PASS")

                # The real regression check: Phase 3 -> Phase 4.
                result = controller.advance()

                self.assertEqual(
                    result["status"], "PASS", result
                )
                self.assertEqual(result["phase"], 4)
                self.assertEqual(controller.phase, 4)
                self.assertEqual(controller.status, "RUNNING")
        finally:
            sys.path.remove(harness_dir)

    def git(self, *args, cwd=None):
        return subprocess.run(
            ["git", *args],
            cwd=cwd or self.repo,
            capture_output=True,
            text=True,
            check=True,
        )

    def save_policy(self):
        self.policy_path.write_text(
            json.dumps(self.policy),
            encoding="utf-8",
        )

    def validate(self):
        process = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "validate-base",
                "--issue",
                "75",
                "--policy-json",
                str(self.policy_path),
            ],
            cwd=self.repo,
            capture_output=True,
            text=True,
        )

        evidence = json.loads(process.stdout)[
            "base_validation_evidence"
        ]

        return process, evidence

    def test_valid_standard_main(self):
        process, evidence = self.validate()

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")
        self.assertEqual(
            evidence["base_sha"],
            self.base_sha,
        )

    def test_phase3_with_in_memory_policy(self):
        import importlib.util

        issue = 197
        branch_name = f"test/{issue}-memory-policy"

        spec = importlib.util.spec_from_file_location(
            "git_policy_integration", SCRIPT
        )
        module = importlib.util.module_from_spec(spec)

        # git_policy imports evidence_manager from its directory.
        sys.path.insert(0, str(SCRIPT.parent))

        try:
            spec.loader.exec_module(module)

            os.chdir(self.repo)
            self.policy_path.unlink()
            # The policy is constructed dynamically from
            # the current repository's verified remote SHA.
            inspection = module.inspect(issue=issue)[
                "branch_evidence"
            ]

            self.assertEqual(
                inspection["status"], "complete"
            )

            candidate = inspection["base_candidate"]

            policy = {
                "policy": "standard-main",
                "base_branch": "main",
                "base_ref": candidate["base_ref"],
                "base_remote_ref": candidate["base_remote_ref"],
                "base_sha": candidate[
                    "base_remote_sha_latest"
                ],
                "pr_target": "main",
                "pr_target_ref": "refs/heads/main",
            }

            # Validate without creating policy.json.
            validation = module.validate_base(
                issue=issue,
                policy_path=policy,
            )["base_validation_evidence"]

            self.assertEqual(
                validation["status"],
                "PASS",
                validation["errors"],
            )

            # Create an Issue branch only in the temp repo.
            preparation = module.prepare_branch(
                issue=issue,
                branch_name=branch_name,
                policy_path=policy,
                expected_head=inspection["git"]["head"],
                expected_branch=inspection["git"][
                    "active_branch"
                ],
            )["branch_preparation_evidence"]

            self.assertEqual(
                preparation["status"],
                "PASS",
                preparation["errors"],
            )

            # Verify the newly created branch.
            branch_check = module.check_branch(
                issue=issue,
                branch_name=branch_name,
                policy_path=policy,
            )["branch_check_evidence"]

            self.assertEqual(
                branch_check["status"],
                "PASS",
                branch_check["errors"],
            )

            self.assertEqual(
                self.git("branch", "--show-current")
                .stdout.strip(),
                branch_name,
            )

        finally:
            os.chdir(self.previous_directory)
            sys.path.remove(str(SCRIPT.parent))

    def test_invalid_base_sha(self):
        self.policy["base_sha"] = "0" * 40
        self.save_policy()

        process, evidence = self.validate()

        self.assertNotEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "BLOCK")

    def test_missing_canonical_field(self):
        del self.policy["base_ref"]
        self.save_policy()

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")

    def test_invalid_policy_type(self):
        self.policy["policy"] = "unknown-policy"
        self.save_policy()

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")

    def test_wrong_pr_target(self):
        self.policy["pr_target"] = "develop"
        self.save_policy()

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")

    def test_remote_base_changed(self):
        (self.repo / "README.md").write_text(
            "Second commit\n",
            encoding="utf-8",
        )

        self.git("add", "README.md")
        self.git("commit", "-m", "Advance main")
        self.git("push", "origin", "main")

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")
        self.assertNotEqual(
            evidence["base_remote_sha_latest"],
            self.base_sha,
        )

    def test_remote_unavailable(self):
        self.git("remote", "remove", "origin")

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")

    def test_dependency_without_approval(self):
        self.policy["policy"] = "approved-dependency"
        self.policy["base_ref"] = "origin/dependency"
        self.policy["base_remote_ref"] = (
            "refs/heads/dependency"
        )
        self.policy["pr_target"] = "main"

        self.save_policy()

        process, evidence = self.validate()

        self.assertEqual(evidence["status"], "BLOCK")

    def test_phase3_reuses_existing_issue_branch(self):
        from contextlib import chdir

        sys.path.insert(0, str(SCRIPT.parent))

        try:
            from workflow_controller import WorkflowController, perform

            issue = 199
            branch_name = f"test/{issue}-existing"

            # Prepare an existing branch before starting
            # the controller session.
            self.git("switch", "-c", branch_name)
            self.policy_path.unlink()

            controller = WorkflowController(
                issue=issue,
                repository=self.repo,
                workflow_id="reuse-integration-test",
            )
            controller.phase = 3

            with chdir(self.repo):
                def invoke(operation, arguments):
                    return perform(controller, {
                        "operation": "invoke",
                        "arguments": {
                            "operation": operation,
                            "arguments": arguments,
                        },
                    })

                inspection = invoke(
                    "git_policy.inspect",
                    {"issue": issue},
                )["branch_evidence"]

                self.assertEqual(inspection["status"], "complete")

                candidate = inspection["base_candidate"]
                policy = {
                    "policy": "standard-main",
                    "base_branch": "main",
                    "base_ref": candidate["base_ref"],
                    "base_remote_ref": candidate["base_remote_ref"],
                    "base_sha": candidate["base_remote_sha_latest"],
                    "pr_target": "main",
                    "pr_target_ref": "refs/heads/main",
                }

                validation = invoke(
                    "git_policy.validate_base",
                    {"issue": issue, "policy_path": policy},
                )["base_validation_evidence"]

                self.assertEqual(validation["status"], "PASS")

                branch_check = invoke(
                    "git_policy.check_branch",
                    {
                        "issue": issue,
                        "branch_name": branch_name,
                        "policy_path": policy,
                    },
                )["branch_check_evidence"]

                self.assertEqual(
                    branch_check["status"], "PASS",
                    branch_check["errors"],
                )

                references = [
                    controller.evidence.reference(
                        "canonical_base", "static"
                    ),
                    controller.evidence.reference(
                        "branch_check_evidence", "mutable"
                    ),
                ]

                controller.decide_guard(
                    name="branch",
                    status="PASS",
                    source=".opencode/commands/guardarails/branch.md",
                    references=references,
                    reason="Existing Issue branch verified",
                )

                result = controller.advance()

                self.assertEqual(result["status"], "PASS", result)
                self.assertEqual(result["phase"], 4)

        finally:
            sys.path.remove(str(SCRIPT.parent))


if __name__ == "__main__":
    unittest.main()
