"""Verification runner tests use only temporary repositories and fake commands."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'verification_runner.py'
if not SCRIPT.exists():
    SCRIPT = Path(__file__).with_name('verification_runner.py')

HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))
import verification_runner
from verification_runner import VerificationError


class VerificationRunnerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        self.git('init', '-b', 'feat/075-verification')
        self.git('config', 'user.name', 'Test')
        self.git('config', 'user.email', 'test@example.invalid')
        (self.repo / 'source.txt').write_text('initial')
        self.git('add', 'source.txt')
        self.git('commit', '-m', 'Initial')
        (self.repo / 'checks').mkdir()
        self.registry = self.root / 'registry.json'
        self.selection = self.root / 'selection.json'
        self.review = self.root / 'review.json'
        self.entries = []

    def git(self, *args):
        return subprocess.run(['git', *args], cwd=self.repo, check=True, capture_output=True,
                              env={**os.environ, 'GIT_OPTIONAL_LOCKS': '0'}).stdout

    def snapshot(self):
        return {str(p.relative_to(self.repo)): p.read_bytes() for p in self.repo.rglob('*') if p.is_file()}

    def add(self, identifier, code, timeout=5):
        file = self.repo / 'checks' / (identifier + '.py')
        file.write_text(code)
        self.entries.append({'id': identifier, 'command': [sys.executable, str(file.relative_to(self.repo))],
                             'cwd': '.', 'sources': [str(file.relative_to(self.repo))], 'timeout_seconds': timeout})
        self.registry.write_text(json.dumps({'checks': self.entries}))

    def invoke(self, operation, *args, readonly=True):
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(SCRIPT), operation, '--registry-json', str(self.registry), *args],
                                  cwd=self.repo, capture_output=True, text=True)
        if readonly:
            self.assertEqual(before, self.snapshot(), 'Runner changed existing source or Git')
        e = next(iter(json.loads(process.stdout).values()))
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        return e

    def approve(self, checks, phase=7, applicable=None):
        discovered = self.invoke('discover')
        self.assertEqual(discovered['status'], 'PASS', discovered)
        approval = {'status': 'APPROVED', 'source': 'workflow-applicability-review', 'issue': 75,
                    'workflow_id': 'test-workflow', 'repository': str(self.repo), 'phase': phase,
                    'checks': checks, 'applicable_checks': applicable or checks,
                    'catalog_sha256': discovered['catalog_sha256'],
                    'source_fingerprint': discovered['source_fingerprint']['sha256'],
                    'tasks_completed': True, 'applicability_complete': True, 'rerun_reason': 'Approved affected checks'}
        self.selection.write_text(json.dumps(approval))
        return discovered, approval

    def run_checks(self, checks, phase=7, readonly=True, review=False, logs=None):
        extra = ['--diagnostics-review-json', str(self.review)] if review else []
        return self.invoke('run', '--issue', '75', '--workflow-id', 'test-workflow', '--phase', str(phase),
                           '--selection-json', str(self.selection), '--checks', *checks,
                           '--log-dir', str(logs or self.root / 'logs'), *extra, readonly=readonly)

    def review_findings(self, evidence, blocking=False):
        self.review.write_text(json.dumps({'source': 'verification-guard', 'issue': 75,
            'workflow_id': 'test-workflow', 'source_fingerprint': evidence['source_fingerprint']['sha256'],
            'reviews': [{'check_id': r['id'], 'definition_sha256': r['definition_sha256'],
                         'diagnostics_sha256': r['diagnostics_sha256'], 'blocking': blocking,
                         'reason': 'Explicit diagnostic relevance review'} for r in evidence['reports']]}))

    def test_discover_never_executes_commands(self):
        marker = self.root / 'should-not-exist'
        self.add('unit', 'from pathlib import Path\nPath(' + repr(str(marker)) + ').write_text("executed")\n')
        e = self.invoke('discover')
        self.assertEqual(e['status'], 'PASS')
        self.assertEqual(e['checks'][0]['command'][0], sys.executable)
        self.assertFalse(marker.exists())

    def test_success_has_complete_logs_and_exit_code(self):
        self.add('unit', 'import sys\nprint("actual stdout")\nprint("actual stderr", file=sys.stderr)\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        self.assertEqual(e['status'], 'PASS', e)
        report = e['reports'][0]
        self.assertEqual(report['execution_status'], 'completed')
        self.assertEqual(report['exit_code'], 0)
        self.assertEqual(Path(report['logs']['stdout']['path']).read_bytes(), b'actual stdout\n')
        self.assertEqual(Path(report['logs']['stderr']['path']).read_bytes(), b'actual stderr\n')

    def test_nonzero_exit_is_fail_and_remaining_checks_execute(self):
        self.add('first', 'import sys\nprint("error: bad result")\nsys.exit(7)\n')
        self.add('second', 'print("second executed")\n')
        self.approve(['first', 'second'])
        e = self.run_checks(['first', 'second'])
        self.assertEqual(e['status'], 'FAIL')
        self.assertEqual(e['reports'][0]['exit_code'], 7)
        self.assertEqual(e['reports'][1]['status'], 'PASS')

    def test_unknown_check_prevents_all_execution(self):
        self.add('unit', 'print("do not execute")\n')
        self.approve(['unit'])
        e = self.run_checks(['unit', 'missing'])
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertTrue(all(r['execution_status'] == 'not_executed' for r in e['reports']))

    def test_stale_source_requires_new_selection(self):
        self.add('unit', 'print("ok")\n')
        self.approve(['unit'])
        (self.repo / 'source.txt').write_text('later changes')
        self.assertEqual(self.run_checks(['unit'])['reports'][0]['execution_status'], 'not_executed')

    def test_changed_check_definition_requires_new_selection(self):
        self.add('unit', 'print("ok")\n')
        self.approve(['unit'])
        self.entries[0]['timeout_seconds'] = 9
        self.registry.write_text(json.dumps({'checks': self.entries}))
        self.assertEqual(self.run_checks(['unit'])['status'], 'INCOMPLETE')

    def test_warning_requires_explicit_relevance_review(self):
        self.add('unit', 'print("WARNING: deprecated option")\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertEqual(e['reports'][0]['exit_code'], 0)
        self.assertTrue(e['reports'][0]['warnings'])
        self.review_findings(e, blocking=False)
        self.assertEqual(self.run_checks(['unit'], review=True)['status'], 'PASS')

    def test_blocking_warning_is_not_ignored(self):
        self.add('unit', 'print("WARNING: invalid configuration")\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        self.review_findings(e, blocking=True)
        self.assertEqual(self.run_checks(['unit'], review=True)['status'], 'FAIL')

    def test_diagnostic_review_cannot_override_nonzero_exit(self):
        self.add('unit', 'import sys\nprint("error: failure")\nsys.exit(1)\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        self.review_findings(e, blocking=False)
        self.assertEqual(self.run_checks(['unit'], review=True)['status'], 'FAIL')

    def test_unreviewed_error_with_exit_zero_is_incomplete(self):
        self.add('unit', 'print("ERROR: result cannot be trusted")\n')
        self.approve(['unit'])
        self.assertEqual(self.run_checks(['unit'])['status'], 'INCOMPLETE')

    def test_timeout_is_incomplete_and_preserves_partial_logs(self):
        self.add('slow', 'import time\nprint("started", flush=True)\ntime.sleep(10)\n', timeout=0.1)
        self.approve(['slow'])
        e = self.run_checks(['slow'])
        r = e['reports'][0]
        self.assertEqual(r['status'], 'INCOMPLETE')
        self.assertEqual(r['execution_status'], 'timed_out')
        self.assertIn(b'started', Path(r['logs']['stdout']['path']).read_bytes())

    def test_source_modification_invalidates_results_and_stops_next_check(self):
        self.add('mutates', 'from pathlib import Path\nPath("source.txt").write_text("changed by check")\n')
        self.add('next', 'print("must not execute")\n')
        self.approve(['mutates', 'next'])
        e = self.run_checks(['mutates', 'next'], readonly=False)
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertEqual(e['reports'][1]['execution_status'], 'not_executed')
        self.assertEqual((self.repo / 'source.txt').read_text(), 'changed by check')

    def test_phase8_subset_does_not_claim_full_coverage(self):
        self.add('unit', 'print("ok")\n')
        self.add('integration', 'print("not selected")\n')
        self.approve(['unit'], phase=8, applicable=['unit', 'integration'])
        e = self.run_checks(['unit'], phase=8)
        self.assertEqual(e['reports'][0]['status'], 'PASS')
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertEqual(e['coverage']['not_run_in_this_invocation'], ['integration'])

    def test_phase7_cannot_omit_an_applicable_check(self):
        self.add('unit', 'print("ok")\n')
        self.add('integration', 'print("ok")\n')
        self.approve(['unit'], applicable=['unit', 'integration'])
        self.assertEqual(self.run_checks(['unit'])['status'], 'INCOMPLETE')

    def test_log_directory_must_be_outside_repository(self):
        self.add('unit', 'print("ok")\n')
        self.approve(['unit'])
        self.assertEqual(self.run_checks(['unit'], logs=self.repo / 'logs')['status'], 'INCOMPLETE')
        self.assertFalse((self.repo / 'logs').exists())

    def test_full_logs_are_not_truncated(self):
        self.add('verbose', 'import sys\nsys.stdout.buffer.write(b"x" * 1000000 + b"\\x00\\xff")\n')
        self.approve(['verbose'])
        e = self.run_checks(['verbose'])
        self.assertEqual(e['status'], 'PASS')
        log = e['reports'][0]['logs']['stdout']
        data = Path(log['path']).read_bytes()
        self.assertEqual(len(data), 1000002)
        self.assertEqual(hashlib.sha256(data).hexdigest(), log['sha256'])

    def test_duplicate_selection_cannot_run_twice(self):
        self.add('unit', 'print("ok")\n')
        self.approve(['unit'])
        self.assertEqual(self.run_checks(['unit', 'unit'])['status'], 'INCOMPLETE')

    def test_arbitrary_git_write_is_not_a_check(self):
        self.registry.write_text(json.dumps({'checks': [{'id': 'bad', 'command': ['git', 'commit'],
                                                        'cwd': '.', 'sources': ['source.txt']}]}))
        self.assertEqual(self.invoke('discover')['status'], 'INCOMPLETE')

    def test_shell_command_string_is_rejected(self):
        self.registry.write_text(json.dumps({'checks': [{'id': 'bad', 'command': 'echo ok; git push',
                                                        'cwd': '.', 'sources': ['source.txt']}]}))
        self.assertEqual(self.invoke('discover')['status'], 'INCOMPLETE')

    def test_frontend_discovery_uses_only_existing_scripts(self):
        (self.repo / 'frontend').mkdir()
        (self.repo / 'frontend/package.json').write_text(json.dumps({'scripts': {'test': 'vitest run', 'dev': 'vite'}}))
        self.add('unit', 'print("ok")\n')
        e = self.invoke('discover')
        identifiers = {c['id'] for c in e['checks']}
        self.assertIn('frontend.test', identifiers)
        self.assertNotIn('frontend.build', identifiers)
        self.assertNotIn('frontend.dev', identifiers)

    def test_missing_executable_is_reported_not_executed(self):
        (self.repo / 'checks/no-interpreter').write_text('#!/does/not/exist\n')
        (self.repo / 'checks/no-interpreter').chmod(0o755)
        self.entries = [{'id': 'missing', 'command': ['./checks/no-interpreter'], 'cwd': '.', 'sources': ['checks/no-interpreter']}]
        self.registry.write_text(json.dumps({'checks': self.entries}))
        self.approve(['missing'])
        e = self.run_checks(['missing'])
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertEqual(e['reports'][0]['execution_status'], 'not_executed')

    def test_zero_error_counts_are_not_failures(self):
        self.add('unit', 'print("Tests run: 3, Failures: 0, Errors: 0")\n')
        self.approve(['unit'])
        self.assertEqual(self.run_checks(['unit'])['status'], 'PASS')

    def test_unfinished_tasks_cannot_authorize_checks(self):
        self.add('unit', 'print("ok")\n')
        _, approval = self.approve(['unit'])
        approval['tasks_completed'] = False
        self.selection.write_text(json.dumps(approval))
        self.assertEqual(self.run_checks(['unit'])['status'], 'INCOMPLETE')

    def test_backend_catalog_uses_only_documented_wrapper_goals(self):
        (self.repo / 'backend').mkdir()
        (self.repo / 'backend/mvnw').write_text('#!/bin/sh\nexit 0\n')
        (self.repo / 'backend/pom.xml').write_text('<project/>')
        (self.repo / 'PROJECT.md').write_text('Validate: ./mvnw -q -DskipTests validate\nTest: ./mvnw -q test\n')
        self.add('unit', 'print("ok")\n')
        e = self.invoke('discover')
        checks = {c['id']: c for c in e['checks']}
        self.assertEqual(checks['backend.test']['command'], ['./mvnw', '-q', 'test'])
        self.assertIn('backend.validate', checks)
        self.assertNotIn('backend.build', checks)

    def test_warning_excerpts_are_bounded_but_diagnostics_are_complete(self):
        self.add('unit', 'print("WARNING: " + "x" * 20000)\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        r = e['reports'][0]
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertLessEqual(len(r['warnings'][0]), 1000)
        diagnostics = Path(r['logs']['diagnostics']['path']).read_text()
        self.assertGreater(len(json.loads(diagnostics)['text']), 20000)

    def test_review_for_different_diagnostics_cannot_pass(self):
        self.add('unit', 'print("WARNING: needs review")\n')
        self.approve(['unit'])
        e = self.run_checks(['unit'])
        self.review_findings(e)
        review = json.loads(self.review.read_text())
        review['reviews'][0]['diagnostics_sha256'] = '0' * 64
        self.review.write_text(json.dumps(review))
        self.assertEqual(self.run_checks(['unit'], review=True)['status'], 'INCOMPLETE')

    def test_ignored_build_artifacts_do_not_invalidate_source(self):
        (self.repo / '.gitignore').write_text('build/\n')
        self.add('build', 'from pathlib import Path\nPath("build").mkdir()\nPath("build/result").write_text("artifact")\n')
        self.approve(['build'])
        e = self.run_checks(['build'], readonly=False)
        self.assertEqual(e['status'], 'PASS', e)
        self.assertEqual((self.repo / 'source.txt').read_text(), 'initial')

    def test_source_change_invalidates_earlier_passes(self):
        self.add('first', 'print("ok")\n')
        self.add('mutates', 'from pathlib import Path\nPath("source.txt").write_text("changed")\n')
        self.approve(['first', 'mutates'])
        e = self.run_checks(['first', 'mutates'], readonly=False)
        self.assertEqual(e['reports'][0]['status'], 'INCOMPLETE')
        self.assertFalse(e['reports'][0]['evidence_valid'])

    def test_timeout_terminates_child_processes(self):
        marker = self.root / 'escaped-child'
        child = 'import time; from pathlib import Path; time.sleep(1); Path(' + repr(str(marker)) + ').write_text("escaped")'
        self.add('parent', 'import subprocess,sys,time\nsubprocess.Popen([sys.executable,"-c",' + repr(child) + '])\nprint("parent ready",flush=True)\ntime.sleep(10)\n', timeout=0.1)
        self.approve(['parent'])
        e = self.run_checks(['parent'])
        self.assertEqual(e['reports'][0]['execution_status'], 'timed_out')
        import time
        time.sleep(1.1)
        self.assertFalse(marker.exists())

    def test_real_npm_command_shape_and_working_directory_with_fake_executable(self):
        (self.repo / 'frontend').mkdir()
        (self.repo / 'frontend/package.json').write_text(json.dumps({'scripts': {'test': 'existing-test-command'}}))
        self.add('unit', 'print("not selected")\n')
        self.approve(['frontend.test'])
        bin_dir = self.root / 'bin'
        bin_dir.mkdir()
        fake = bin_dir / 'npm'
        fake.write_text('#!' + sys.executable + '\nimport os,sys\nassert sys.argv[1:]==["run","test"]\nprint(os.getcwd())\n')
        fake.chmod(0o755)
        from unittest.mock import patch
        with patch.dict(os.environ, {'PATH': str(bin_dir) + os.pathsep + os.environ['PATH']}):
            e = self.run_checks(['frontend.test'])
        self.assertEqual(e['status'], 'PASS', e)
        report = e['reports'][0]
        self.assertEqual(Path(report['logs']['stdout']['path']).read_text().strip(), str(self.repo / 'frontend'))
        self.assertTrue(Path(e['source_manifest']['path']).is_file())

    def test_background_child_prevents_a_false_completed_result(self):
        # Keep the child alive while this fixture exists, independent of host
        # scheduling pauses. If the assertion fails, fixture cleanup ends it.
        child = 'from pathlib import Path; import time\nroot=Path(' + repr(str(self.root)) + ')\nwhile root.exists(): time.sleep(0.02)\n'
        self.add('parent', 'import subprocess,sys\nsubprocess.Popen([sys.executable,"-c",' + repr(child) + '])\n')
        self.approve(['parent'])
        e = self.run_checks(['parent'])
        self.assertEqual(e['status'], 'INCOMPLETE')
        self.assertEqual(e['reports'][0]['execution_status'], 'incomplete')

    def test_git_whitespace_check_does_not_refresh_real_index_bytes(self):
        (self.repo / 'source.txt').write_text('changed without whitespace errors\n')
        self.registry.write_text(json.dumps({'checks': [{'id': 'git.whitespace', 'command': ['git', 'diff', '--check'],
                                                        'cwd': '.', 'sources': ['source.txt']}]}))
        self.approve(['git.whitespace'])
        e = self.run_checks(['git.whitespace'])
        self.assertEqual(e['status'], 'PASS', e)
        self.assertIn('diff.autoRefreshIndex=false', e['reports'][0]['command'])


class BuildSelectionTests(unittest.TestCase):
    """build_selection is the official producer of run_checks' selection_path."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        env = {**os.environ, 'GIT_OPTIONAL_LOCKS': '0'}
        for args in (['init', '-b', 'fix/205-build-selection'], ['config', 'user.name', 'Test'],
                     ['config', 'user.email', 'test@example.invalid']):
            subprocess.run(['git', *args], cwd=self.repo, check=True, capture_output=True, env=env)
        (self.repo / 'source.txt').write_text('initial')
        subprocess.run(['git', 'add', 'source.txt'], cwd=self.repo, check=True, capture_output=True, env=env)
        subprocess.run(['git', 'commit', '-m', 'Initial'], cwd=self.repo, check=True, capture_output=True, env=env)
        self.single_check_registry = {'checks': [
            {'id': 'git.diff-check', 'command': ['git', 'diff', '--check'], 'cwd': '.', 'sources': ['source.txt']},
        ]}
        self.catalog = verification_runner.discover(str(self.repo), self.single_check_registry)
        self.assertEqual(self.catalog['verification_catalog']['status'], 'PASS')

    def build(self, **overrides):
        kwargs = dict(catalog_evidence=self.catalog, issue=205, workflow_id='test-workflow', phase=7,
                      selected=['git.diff-check'], applicable_checks=['git.diff-check'],
                      tasks_completed=True, applicability_complete=True)
        kwargs.update(overrides)
        return verification_runner.build_selection(**kwargs)

    def test_builds_valid_phase_7_selection(self):
        source = self.catalog['verification_catalog']
        result = self.build()
        approval = result['selection_approval']
        self.assertEqual(approval['status'], 'PASS')
        selection = approval['selection']
        self.assertEqual(selection['status'], 'APPROVED')
        self.assertEqual(selection['issue'], 205)
        self.assertEqual(selection['checks'], ['git.diff-check'])
        self.assertEqual(selection['applicable_checks'], ['git.diff-check'])
        self.assertEqual(selection['catalog_sha256'], source['catalog_sha256'])
        self.assertEqual(selection['source_fingerprint'], source['source_fingerprint']['sha256'])
        self.assertNotIn('rerun_reason', selection)

    def test_builds_valid_phase_8_selection_with_rerun_reason(self):
        result = self.build(phase=8, rerun_reason='Affected by a later source change')
        selection = result['selection_approval']['selection']
        self.assertEqual(selection['phase'], 8)
        self.assertEqual(selection['rerun_reason'], 'Affected by a later source change')

    def test_rejects_incomplete_catalog_observation(self):
        incomplete = {'verification_catalog': {**self.catalog['verification_catalog'], 'status': 'INCOMPLETE'}}
        with self.assertRaises(VerificationError):
            self.build(catalog_evidence=incomplete)

    def test_rejects_invalid_issue_and_workflow_id(self):
        with self.assertRaises(VerificationError):
            self.build(issue=0)
        with self.assertRaises(VerificationError):
            self.build(workflow_id='   ')

    def test_rejects_unknown_check_id(self):
        with self.assertRaises(VerificationError):
            self.build(selected=['unknown.check'], applicable_checks=['unknown.check'])

    def test_rejects_duplicate_selected_checks(self):
        with self.assertRaises(VerificationError):
            self.build(selected=['git.diff-check', 'git.diff-check'])

    def test_phase_7_rejects_partial_selection(self):
        registry = {'checks': [*self.single_check_registry['checks'],
                               {'id': 'git.diff-check-2', 'command': ['git', 'diff', '--check'], 'cwd': '.',
                                'sources': ['source.txt']}]}
        catalog = verification_runner.discover(str(self.repo), registry)
        with self.assertRaises(VerificationError):
            self.build(catalog_evidence=catalog, applicable_checks=['git.diff-check', 'git.diff-check-2'])

    def test_phase_8_requires_non_empty_rerun_reason(self):
        with self.assertRaises(VerificationError):
            self.build(phase=8)
        with self.assertRaises(VerificationError):
            self.build(phase=8, rerun_reason='   ')

    def test_requires_explicit_task_completion_and_applicability(self):
        with self.assertRaises(VerificationError):
            self.build(tasks_completed=False)
        with self.assertRaises(VerificationError):
            self.build(applicability_complete=False)
