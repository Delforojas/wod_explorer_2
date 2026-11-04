
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


if __name__ == "__main__":
    unittest.main()
