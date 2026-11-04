
import json
import subprocess
import sys
import tempfile
import unittest

from pathlib import Path


SCRIPT = (
    Path(__file__).resolve().parents[1] / "git_policy.py"
)


class PrepareBranchTests(unittest.TestCase):

    def setUp(self):
        # All repositories and policy files live outside
        # the actual WOD Explorer repository.
        self.temp = tempfile.TemporaryDirectory()

        root = Path(self.temp.name)
        self.repo = root / "project"
        self.remote = root / "remote.git"
        self.policy_path = root / "policy.json"

        self.repo.mkdir()

        self.git("init", "--bare", str(self.remote), cwd=root)
        self.git("init", "-b", "main")

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

        self.base_sha = self.git(
            "rev-parse", "HEAD"
        ).stdout.strip()

        self.policy = {
            "policy": "standard-main",
            "base_ref": "origin/main",
            "base_remote_ref": "refs/heads/main",
            "base_sha": self.base_sha,
            "pr_target": "main",
            "pr_target_ref": "refs/heads/main",
        }

        self.save_policy()

        self.expected_head = self.base_sha
        self.expected_branch = "main"
        self.branch_name = "feat/075-test"

    def tearDown(self):
        self.temp.cleanup()

    def git(self, *args, cwd=None, check=True):
        return subprocess.run(
            ["git", *args],
            cwd=cwd or self.repo,
            capture_output=True,
            text=True,
            check=check,
        )

    def save_policy(self):
        self.policy_path.write_text(
            json.dumps(self.policy),
            encoding="utf-8",
        )

    def current_branch(self):
        return self.git(
            "branch", "--show-current"
        ).stdout.strip()

    def current_head(self):
        return self.git(
            "rev-parse", "HEAD"
        ).stdout.strip()

    def status(self):
        return self.git(
            "status", "--porcelain=v1", "-uall"
        ).stdout

    def local_branches(self):
        output = self.git(
            "branch", "--format=%(refname:short)"
        ).stdout

        return output.splitlines()

    def prepare(
        self,
        branch=None,
        expected_head=None,
        expected_branch=None,
    ):
        command = [
            sys.executable,
            str(SCRIPT),
            "prepare-branch",
            "--issue", "75",
            "--branch", (
                self.branch_name if branch is None else branch
            ),
            "--policy-json", str(self.policy_path),
            "--expected-head", (
                self.expected_head
                if expected_head is None
                else expected_head
            ),
            "--expected-branch", (
                self.expected_branch
                if expected_branch is None
                else expected_branch
            ),
        ]

        process = subprocess.run(
            command,
            cwd=self.repo,
            capture_output=True,
            text=True,
        )

        try:
            result = json.loads(process.stdout)
            evidence = result["branch_preparation_evidence"]
        except (ValueError, KeyError) as error:
            self.fail(
                "Invalid CLI response:\n"
                f"stdout: {process.stdout}\n"
                f"stderr: {process.stderr}\n"
                f"error: {error}"
            )

        return process, evidence

    def assert_blocked_without_mutation(self, action):
        """
        Confirm a rejected operation did not change:
        - active branch
        - HEAD
        - working tree or staging
        - local branch list
        """
        before_branch = self.current_branch()
        before_head = self.current_head()
        before_status = self.status()
        before_branches = self.local_branches()

        process, evidence = action()

        self.assertNotEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "BLOCK")

        self.assertEqual(self.current_branch(), before_branch)
        self.assertEqual(self.current_head(), before_head)
        self.assertEqual(self.status(), before_status)
        self.assertEqual(
            self.local_branches(), before_branches
        )

        return evidence

    # ========================================================
    # SUCCESS CASES
    # ========================================================

    def test_create_branch_from_approved_sha(self):
        process, evidence = self.prepare()

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")
        self.assertEqual(
            self.current_branch(),
            "feat/075-test",
        )
        self.assertEqual(self.current_head(), self.base_sha)
        self.assertEqual(self.status(), "")

    def test_branch_uses_base_not_previous_head(self):
        """
        Even when another working branch has extra commits,
        the new Issue branch must start at base_sha.
        """
        self.git("switch", "-c", "develop")

        (self.repo / "develop.txt").write_text(
            "Not part of Issue 75\n",
            encoding="utf-8",
        )

        self.git("add", "develop.txt")
        self.git("commit", "-m", "Unrelated develop commit")

        develop_head = self.current_head()

        self.expected_branch = "develop"
        self.expected_head = develop_head

        process, evidence = self.prepare()

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")

        self.assertEqual(
            self.current_branch(), "feat/075-test"
        )
        self.assertEqual(self.current_head(), self.base_sha)
        self.assertNotEqual(self.current_head(), develop_head)

        self.assertFalse(
            (self.repo / "develop.txt").exists()
        )

        # The original branch and commit must still exist.
        self.assertEqual(
            self.git("rev-parse", "develop").stdout.strip(),
            develop_head,
        )

    # ========================================================
    # SAFETY CASES
    # ========================================================

    def test_block_wrong_expected_head(self):
        self.assert_blocked_without_mutation(
            lambda: self.prepare(
                expected_head="0" * 40
            )
        )

    def test_block_wrong_expected_branch(self):
        self.assert_blocked_without_mutation(
            lambda: self.prepare(
                expected_branch="develop"
            )
        )

    def test_block_existing_issue_branch(self):
        self.git("branch", "feat/075-existing")

        self.assert_blocked_without_mutation(
            self.prepare
        )

    def test_block_wrong_issue_number(self):
        self.assert_blocked_without_mutation(
            lambda: self.prepare(
                branch="feat/175-other"
            )
        )

    def test_block_protected_main_name(self):
        self.assert_blocked_without_mutation(
            lambda: self.prepare(branch="main")
        )

    def test_block_unstaged_changes(self):
        (self.repo / "README.md").write_text(
            "Uncommitted changes\n",
            encoding="utf-8",
        )

        self.assert_blocked_without_mutation(self.prepare)

        self.assertEqual(
            (self.repo / "README.md").read_text(
                encoding="utf-8"
            ),
            "Uncommitted changes\n",
        )

    def test_block_staged_changes(self):
        (self.repo / "README.md").write_text(
            "Staged changes\n",
            encoding="utf-8",
        )

        self.git("add", "README.md")

        self.assert_blocked_without_mutation(self.prepare)

        staged_diff = self.git(
            "diff", "--cached", "--name-only"
        ).stdout

        self.assertIn("README.md", staged_diff)

    def test_block_untracked_file(self):
        (self.repo / "new-file.txt").write_text(
            "Untracked work\n",
            encoding="utf-8",
        )

        self.assert_blocked_without_mutation(self.prepare)

        self.assertTrue(
            (self.repo / "new-file.txt").exists()
        )

    def test_block_modified_opencode_json(self):
        # Track opencode.json first, as if the project
        # already contained an existing configuration.
        (self.repo / "opencode.json").write_text(
            '{"original": true}\n',
            encoding="utf-8",
        )
        self.git("add", "opencode.json")
        self.git("commit", "-m", "Add OpenCode config")
        self.git("push", "origin", "main")

        # Update the approved base to the new remote SHA.
        self.base_sha = self.current_head()
        self.policy["base_sha"] = self.base_sha
        self.save_policy()

        self.expected_head = self.base_sha

        # This modification must never be overwritten.
        (self.repo / "opencode.json").write_text(
            '{"local": true}\n',
            encoding="utf-8",
        )

        self.assert_blocked_without_mutation(self.prepare)

        self.assertEqual(
            (self.repo / "opencode.json").read_text(
                encoding="utf-8"
            ),
            '{"local": true}\n',
        )

    def test_block_invalid_base_sha(self):
        self.policy["base_sha"] = "0" * 40
        self.save_policy()

        self.assert_blocked_without_mutation(self.prepare)

    def test_block_remote_base_changed(self):
        (self.repo / "README.md").write_text(
            "Advance remote base\n",
            encoding="utf-8",
        )
        self.git("add", "README.md")
        self.git("commit", "-m", "Advance main")
        self.git("push", "origin", "main")

        # Keep the expected current HEAD accurate:
        # the rejection must come from base validation.
        self.expected_head = self.current_head()

        self.assert_blocked_without_mutation(self.prepare)


if __name__ == "__main__":
    unittest.main()
