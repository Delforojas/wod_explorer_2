
import json
import os
import subprocess
import sys
import tempfile
import unittest

from pathlib import Path


SCRIPT = (
    Path(__file__)
    .resolve()
    .parents[1]
    / "git_policy.py"
)


def git(*arguments):
    return subprocess.run(
        ["git", *arguments],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


class GitPolicyInspectTests(unittest.TestCase):

    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.previous = os.getcwd()

        os.chdir(self.temporary.name)

        git("init", "-b", "main")
        git("config", "user.email", "test@example.com")
        git("config", "user.name", "Test User")

        Path("README.md").write_text(
            "Initial project\n",
            encoding="utf-8",
        )

        git("add", "README.md")
        git("commit", "-m", "Initial commit")

        # A local bare remote allows deterministic tests.
        self.remote = tempfile.TemporaryDirectory()

        git(
            "init",
            "--bare",
            self.remote.name,
        )

        git("remote", "add", "origin", self.remote.name)
        git("push", "-u", "origin", "main")

    def tearDown(self):
        os.chdir(self.previous)
        self.temporary.cleanup()
        self.remote.cleanup()

    def inspect(self, issue=75):
        process = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "inspect",
                "--issue",
                str(issue),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        return process, json.loads(process.stdout)[
            "branch_evidence"
        ]

    def test_clean_repository(self):
        process, evidence = self.inspect()

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "complete")
        self.assertTrue(
            evidence["git"]["working_tree_clean"]
        )
        self.assertEqual(
            evidence["git"]["active_branch"],
            "main",
        )

    def test_staged_change(self):
        Path("README.md").write_text(
            "Modified\n",
            encoding="utf-8",
        )

        git("add", "README.md")

        _, evidence = self.inspect()

        self.assertEqual(
            len(evidence["git"]["staged"]),
            1,
        )

        self.assertEqual(
            len(evidence["git"]["unstaged"]),
            0,
        )

    def test_unstaged_change(self):
        Path("README.md").write_text(
            "Modified\n",
            encoding="utf-8",
        )

        _, evidence = self.inspect()

        self.assertEqual(
            len(evidence["git"]["staged"]),
            0,
        )

        self.assertEqual(
            len(evidence["git"]["unstaged"]),
            1,
        )

    def test_untracked_file(self):
        Path("new-file.txt").write_text(
            "New\n",
            encoding="utf-8",
        )

        _, evidence = self.inspect()

        self.assertEqual(
            evidence["git"]["untracked"][0]["path"],
            "new-file.txt",
        )

    def test_existing_issue_branch(self):
        git("branch", "feat/075-auth")
        git("branch", "feat/175-other")

        _, evidence = self.inspect()

        self.assertIn(
            "feat/075-auth",
            evidence["git"]["issue_branches"],
        )

        self.assertNotIn(
            "feat/175-other",
            evidence["git"]["issue_branches"],
        )

    def test_protected_opencode_configuration(self):
        Path("opencode.json").write_text(
            '{"test": true}',
            encoding="utf-8",
        )

        _, evidence = self.inspect()

        protected = (
            evidence["preexisting_protected_changes"]
        )

        self.assertTrue(
            any(
                item["path"] == "opencode.json"
                and item["special_protection"]
                for item in protected
            )
        )

    def test_rename_detection(self):
        git("mv", "README.md", "RENAMED.md")

        _, evidence = self.inspect()

        renamed = [
            item
            for item in evidence["git"]["staged"]
            if item["index_status"] == "R"
        ]

        self.assertEqual(len(renamed), 1)

        self.assertEqual(
            renamed[0]["path"],
            "RENAMED.md",
        )

        self.assertEqual(
            renamed[0]["original_path"],
            "README.md",
        )


if __name__ == "__main__":
    unittest.main()
