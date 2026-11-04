
import json
import subprocess
import sys
import tempfile
import unittest

from pathlib import Path


SCRIPT = (
    Path(__file__).resolve().parents[1] / "git_policy.py"
)


class CheckBranchTests(unittest.TestCase):

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)

        self.repo = root / "project"
        self.remote = root / "remote.git"
        self.policy_path = root / "policy.json"
        self.commits_path = root / "approved_commits.json"

        self.repo.mkdir()

        self.git("init", "--bare", str(self.remote), cwd=root)
        self.git("init", "-b", "main")
        self.git("config", "user.email", "test@example.com")
        self.git("config", "user.name", "Test User")

        (self.repo / "README.md").write_text(
            "Initial project\n",
            encoding="utf-8",
        )
        self.git("add", "README.md")
        self.git("commit", "-m", "Initial commit")

        self.git("remote", "add", "origin", str(self.remote))
        self.git("push", "-u", "origin", "main")

        self.base_sha = self.head()
        self.branch_name = "feat/075-test"

        self.policy = {
            "policy": "standard-main",
            "base_ref": "origin/main",
            "base_remote_ref": "refs/heads/main",
            "base_sha": self.base_sha,
            "pr_target": "main",
            "pr_target_ref": "refs/heads/main",
        }

        self.save_policy()

        # Create the Issue branch from the exact base.
        self.git(
            "switch", "--no-track", "-c",
            self.branch_name, self.base_sha,
        )

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

    def head(self):
        return self.git("rev-parse", "HEAD").stdout.strip()

    def current_branch(self):
        return self.git(
            "branch", "--show-current"
        ).stdout.strip()

    def status(self):
        return self.git(
            "status", "--porcelain=v1", "-uall"
        ).stdout

    def local_branches(self):
        return self.git(
            "branch", "--format=%(refname:short)"
        ).stdout.splitlines()

    def save_policy(self):
        self.policy_path.write_text(
            json.dumps(self.policy),
            encoding="utf-8",
        )

    def save_approved_commits(self, commits):
        self.commits_path.write_text(
            json.dumps(commits),
            encoding="utf-8",
        )

    def commit_file(self, filename, content, message):
        (self.repo / filename).write_text(
            content,
            encoding="utf-8",
        )
        self.git("add", filename)
        self.git("commit", "-m", message)
        return self.head()

    def check_branch(
        self,
        branch=None,
        approved_commits=None,
    ):
        command = [
            sys.executable,
            str(SCRIPT),
            "check-branch",
            "--issue", "75",
            "--branch", branch or self.branch_name,
            "--policy-json", str(self.policy_path),
        ]

        if approved_commits is not None:
            self.save_approved_commits(approved_commits)
            command.extend([
                "--approved-commits-json",
                str(self.commits_path),
            ])

        process = subprocess.run(
            command,
            cwd=self.repo,
            capture_output=True,
            text=True,
        )

        try:
            evidence = json.loads(
                process.stdout
            )["branch_check_evidence"]
        except (ValueError, KeyError):
            self.fail(
                "Invalid check-branch response:\n"
                f"stdout: {process.stdout}\n"
                f"stderr: {process.stderr}"
            )

        return process, evidence

    def assert_read_only(self, action):
        before = {
            "branch": self.current_branch(),
            "head": self.head(),
            "status": self.status(),
            "branches": self.local_branches(),
        }

        result = action()

        after = {
            "branch": self.current_branch(),
            "head": self.head(),
            "status": self.status(),
            "branches": self.local_branches(),
        }

        self.assertEqual(before, after)
        return result

    # ========================================================
    # VALID BRANCH
    # ========================================================

    def test_new_issue_branch_passes(self):
        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")
        self.assertEqual(
            evidence["active_branch"],
            self.branch_name,
        )
        self.assertEqual(evidence["head_sha"], self.base_sha)
        self.assertEqual(evidence["range_commits"], [])

    def test_approved_commits_pass(self):
        sha1 = self.commit_file(
            "first.txt", "First\n", "Issue commit 1"
        )
        sha2 = self.commit_file(
            "second.txt", "Second\n", "Issue commit 2"
        )

        process, evidence = self.assert_read_only(
            lambda: self.check_branch(
                approved_commits=[sha1, sha2]
            )
        )

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")
        self.assertEqual(
            evidence["range_commits"],
            [sha1, sha2],
        )

    # ========================================================
    # INVALID BRANCH
    # ========================================================

    def test_wrong_active_branch_blocks(self):
        self.git("switch", "main")

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertNotEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "BLOCK")

    def test_wrong_issue_number_blocks(self):
        process, evidence = self.assert_read_only(
            lambda: self.check_branch(
                branch="feat/175-other"
            )
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_multiple_issue_branches_block(self):
        self.git("branch", "feat/075-duplicate")

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_unknown_commit_blocks(self):
        self.commit_file(
            "unexpected.txt",
            "Unexpected\n",
            "Unapproved commit",
        )

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_wrong_approved_manifest_blocks(self):
        sha1 = self.commit_file(
            "first.txt", "First\n", "Issue commit 1"
        )
        self.commit_file(
            "second.txt", "Second\n", "Issue commit 2"
        )

        process, evidence = self.assert_read_only(
            lambda: self.check_branch(
                approved_commits=[sha1]
            )
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_reordered_manifest_blocks(self):
        sha1 = self.commit_file(
            "first.txt", "First\n", "Issue commit 1"
        )
        sha2 = self.commit_file(
            "second.txt", "Second\n", "Issue commit 2"
        )

        process, evidence = self.assert_read_only(
            lambda: self.check_branch(
                approved_commits=[sha2, sha1]
            )
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_invalid_base_sha_blocks(self):
        self.policy["base_sha"] = "0" * 40
        self.save_policy()

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(evidence["status"], "BLOCK")

    def test_unrelated_local_changes_are_reported(self):
        (self.repo / "local.txt").write_text(
            "Existing local work\n",
            encoding="utf-8",
        )

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence["status"], "PASS")
        self.assertFalse(evidence["working_tree_clean"])
        self.assertTrue(
            any(
                item["path"] == "local.txt"
                for item in evidence["local_changes"]
            )
        )

    # ========================================================
    # HISTORICAL BASE REGRESSION
    # ========================================================

    def test_remote_advance_preserves_historical_base(self):
        """
        A valid Issue branch must not become invalid solely
        because origin/main advanced after branch creation.
        """
        original_issue_head = self.head()

        self.git("switch", "main")
        self.commit_file(
            "advance.txt",
            "Main advanced\n",
            "Advance main",
        )
        self.git("push", "origin", "main")

        self.git("switch", self.branch_name)

        self.assertEqual(self.head(), original_issue_head)

        process, evidence = self.assert_read_only(
            self.check_branch
        )

        self.assertEqual(
            evidence["status"],
            "PASS",
            msg=(
                "Historical base regression: check-branch "
                "must not require current remote SHA to "
                "equal the original approved base SHA. "
                f"Errors: {evidence['errors']}"
            ),
        )
        self.assertEqual(process.returncode, 0)
        self.assertEqual(evidence['base_sha'], self.base_sha)
        self.assertEqual(evidence['base_remote_sha_latest'], self.git('rev-parse', 'origin/main').stdout.strip())

    def test_historical_check_allows_stale_tracking_ref_after_remote_advance(self):
        self.git('switch', 'main')
        self.commit_file('advance.txt', 'advance', 'Advance main')
        self.git('push', 'origin', 'main')
        self.git('switch', self.branch_name)
        self.git('update-ref', 'refs/remotes/origin/main', self.base_sha)
        process, evidence = self.assert_read_only(self.check_branch)
        self.assertEqual(evidence['status'], 'PASS', evidence)
        self.assertEqual(process.returncode, 0)

    def test_historical_check_rejects_remote_rewind(self):
        original = self.base_sha
        self.base_sha = self.commit_file('base.txt', 'new base', 'Approved newer base')
        self.policy['base_sha'] = self.base_sha
        self.save_policy()
        self.git('update-ref', 'refs/remotes/origin/main', self.base_sha)
        # Remote remains at the older commit, although the Issue descends from it.
        self.assertNotEqual(original, self.base_sha)
        process, evidence = self.assert_read_only(self.check_branch)
        self.assertEqual(evidence['status'], 'BLOCK', evidence)
        self.assertFalse(evidence['checks']['canonical_base_valid'])
        self.assertIn('Remote base does not descend from approved base SHA', evidence['errors'])
        self.assertNotEqual(process.returncode, 0)

    def test_historical_check_rejects_diverged_tracking_ref(self):
        self.git('checkout', '--orphan', 'unrelated')
        self.commit_file('unrelated.txt', 'unrelated', 'Unrelated root')
        unrelated = self.head()
        self.git('switch', self.branch_name)
        self.git('update-ref', 'refs/remotes/origin/main', unrelated)
        process, evidence = self.assert_read_only(self.check_branch)
        self.assertEqual(evidence['status'], 'BLOCK', evidence)
        self.assertFalse(evidence['checks']['canonical_base_valid'])
        self.assertIn('Local base ref does not descend from approved base SHA', evidence['errors'])
        self.assertNotEqual(process.returncode, 0)

    def test_historical_check_rejects_unavailable_remote_object(self):
        other = self.repo.parent / 'other'
        self.git('clone', str(self.remote), str(other), cwd=self.repo.parent)
        self.git('config', 'user.email', 'test@example.com', cwd=other)
        self.git('config', 'user.name', 'Test User', cwd=other)
        self.git('checkout', 'main', cwd=other)
        (other / 'remote-only.txt').write_text('not available in Issue checkout')
        self.git('add', '.', cwd=other)
        self.git('commit', '-m', 'Remote-only advance', cwd=other)
        self.git('push', 'origin', 'main', cwd=other)
        process, evidence = self.assert_read_only(self.check_branch)
        self.assertEqual(evidence['status'], 'BLOCK', evidence)
        self.assertFalse(evidence['checks']['canonical_base_valid'])
        self.assertIn('Remote base does not descend from approved base SHA', evidence['errors'])
        self.assertNotEqual(process.returncode, 0)


if __name__ == "__main__":
    unittest.main()
