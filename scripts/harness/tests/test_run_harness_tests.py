"""Tests for the portable harness suite wrapper."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


WRAPPER = Path(__file__).resolve().parents[1] / 'run-harness-tests.sh'


class RunHarnessTestsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.wrapper = self.root / 'scripts/harness/run-harness-tests.sh'
        self.wrapper.parent.mkdir(parents=True)
        shutil.copy2(WRAPPER, self.wrapper)
        self.wrapper.chmod(0o755)

    def install_python(self, body):
        executable = self.root / '.venv/bin/python'
        executable.parent.mkdir(parents=True)
        executable.write_text('#!/bin/sh\n' + body)
        executable.chmod(0o755)
        return executable

    def run_wrapper(self):
        return subprocess.run([str(self.wrapper)], cwd=self.root, capture_output=True, text=True)

    def test_missing_interpreter_has_a_distinct_failure(self):
        result = self.run_wrapper()

        self.assertEqual(result.returncode, 127)
        self.assertIn('Harness interpreter is unavailable', result.stderr)

    def test_missing_mcp_dependency_has_a_distinct_failure(self):
        self.install_python('if [ "$1" = "-c" ]; then exit 1; fi\nexit 0\n')
        result = self.run_wrapper()

        self.assertEqual(result.returncode, 126)
        self.assertIn('Harness dependency is unavailable: mcp', result.stderr)

    def test_available_interpreter_and_dependency_runs_the_suite(self):
        marker = self.root / 'arguments.txt'
        self.install_python('if [ "$1" = "-c" ]; then exit 0; fi\nprintf "%s" "$*" > "' + str(marker) + '"\n')
        result = self.run_wrapper()

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(marker.read_text(), '-m unittest discover -s scripts/harness/tests')
