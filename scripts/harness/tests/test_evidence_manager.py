"""Evidence lifetime/export tests never write Git or persist mutable state."""
from contextlib import chdir
from copy import deepcopy
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HARNESS = Path(__file__).resolve().parents[1]
if not (HARNESS / 'evidence_manager.py').exists():
    HARNESS = Path(__file__).parent
sys.path.insert(0, str(HARNESS))
sys.dont_write_bytecode = True
from evidence_manager import EvidenceManager, EvidenceError, using_evidence, managed_operation, register_result


class EvidenceManagerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name).resolve()
        self.session = EvidenceManager(75, self.repo, 'wf')

    def payload(self, status='PASS', phase=9):
        return {'source': 'test-observer', 'phase': phase, 'observed_at': datetime.now(timezone.utc).isoformat(),
                'issue': 75, 'repository': str(self.repo), 'status': status}

    def static(self, key='canonical_base', kind='canonical_base', data=None, **kwargs):
        return self.session.record(key, data or {'base_sha': 'a' * 40, 'policy': 'standard-main'},
            category='static', kind=kind, source='approved-context', phase=3, status='PASS',
            observed_at=datetime.now(timezone.utc).isoformat(), **kwargs)

    def test_record_and_reuse_identical_observation(self):
        p = self.payload()
        a = self.session.record('pre_stage_evidence', p)
        b = self.session.record('pre_stage_evidence', p)
        self.assertEqual(a, b)
        p['status'] = 'FAIL'
        self.assertEqual(self.session.get('pre_stage_evidence')['payload']['status'], 'PASS')

    def test_new_observation_invalidates_old_reference(self):
        old = self.session.record('pre_stage_evidence', self.payload())
        self.session.record('pre_stage_evidence', self.payload())
        with self.assertRaises(EvidenceError):
            self.session.resolve(old)

    def test_missing_or_failed_evidence_never_passes(self):
        with self.assertRaises(EvidenceError):
            self.session.get('missing')
        reference = self.session.record('verification_evidence', self.payload('FAIL', 7))
        with self.assertRaises(EvidenceError):
            self.session.resolve(reference)
        self.assertEqual(self.session.resolve(reference, require_verified=False)['status'], 'FAIL')

    def test_missing_source_phase_time_are_not_invented(self):
        for field in ('source', 'phase', 'observed_at', 'status'):
            p = self.payload()
            p.pop(field)
            with self.assertRaises(EvidenceError):
                self.session.record('pre_stage_evidence', p)

    def test_naive_timestamp_rejected(self):
        p = self.payload()
        p['observed_at'] = '2026-11-04T10:00:00'
        with self.assertRaises(EvidenceError):
            self.session.record('pre_stage_evidence', p)

    def test_cross_issue_and_repository_are_rejected(self):
        for changes in ({'issue': 76}, {'workflow_id': 'other'}, {'repository': str(self.repo / 'other')}):
            p = {**self.payload(), **changes}
            with self.assertRaises(EvidenceError):
                self.session.record('pre_stage_evidence', p)

    def test_remote_mutation_preserves_local_observation_and_base(self):
        local = self.session.record('working_tree_observation', self.payload(), topics=['working_tree', 'index'])
        remote = self.session.record('remote', self.payload(), topics=['remote'])
        base = self.static(topics=['scope', 'instructions', 'dependencies'])
        self.session.invalidate('remote-change', source='observed ref update')
        self.session.resolve(local)
        self.session.resolve(base)
        with self.assertRaises(EvidenceError):
            self.session.resolve(remote)

    def test_staging_invalidates_pre_and_post_without_dropping_payloads(self):
        pre = self.session.record('pre_stage_evidence', self.payload())
        post = self.session.record('post_commit_evidence', self.payload(phase='post-commit'))
        self.session.invalidate('staging-change', source='git add')
        for reference in (pre, post):
            with self.assertRaises(EvidenceError):
                self.session.resolve(reference)
        self.assertIn('pre_stage_evidence', self.session.snapshot()['issue_evidence']['mutable'])

    def test_only_affected_context_paths_are_invalidated(self):
        a = self.static('context-a', 'context_item', {'path': 'AGENTS.md', 'sha256': 'a'}, topics=['instructions'])
        b = self.static('context-b', 'context_item', {'path': 'other.md', 'sha256': 'b'}, topics=['instructions'])
        self.session.invalidate('file-change', source='edit', paths=['AGENTS.md'])
        with self.assertRaises(EvidenceError):
            self.session.resolve(a)
        self.session.resolve(b)

    def test_historical_sha_cannot_be_replaced_even_after_invalidation(self):
        self.static(topics=['scope'])
        self.session.invalidate('scope-change', source='new scope')
        with self.assertRaises(EvidenceError):
            self.static(data={'base_sha': 'b' * 40})

    def test_canonical_policy_can_be_enriched_but_not_contradicted(self):
        self.static()
        self.static(data={'base_sha': 'a' * 40, 'base_ref': 'origin/main'})
        self.assertEqual(self.session.get('canonical_base', 'static')['payload']['policy'], 'standard-main')
        with self.assertRaises(EvidenceError):
            self.static(data={'base_sha': 'a' * 40, 'base_ref': 'origin/other'})

    def test_second_canonical_key_is_not_allowed(self):
        with self.assertRaises(EvidenceError):
            self.static(key='another-base')

    def test_export_requires_explicit_authorization(self):
        self.static()
        with self.assertRaises(EvidenceError):
            self.session.export_static()

    def test_static_export_excludes_all_mutable_observations(self):
        self.static()
        self.session.record('pre_stage_evidence', self.payload())
        self.session.record('post_commit_evidence', self.payload(phase='post-commit'))
        summary = self.session.export_static(authorized=True)
        self.assertFalse(summary['mutable_state_is_current'])
        self.assertNotIn('mutable', summary)
        serialized = json.dumps(summary)
        self.assertNotIn('pre_stage_evidence', serialized)
        self.assertNotIn('post_commit_evidence', serialized)

    def test_nested_mutable_data_cannot_be_smuggled_into_static_summary(self):
        with self.assertRaises(EvidenceError):
            self.static('history', 'verification_history', {'results': {'post_commit_evidence': self.payload()}})

    def test_unknown_static_fields_are_rejected(self):
        with self.assertRaises(EvidenceError):
            self.static(data={'base_sha': 'a' * 40, 'head_sha': 'b' * 40})

    def test_scope_change_invalidates_affected_static_entry(self):
        reference = self.static('scope', 'approved_scope', {'description': 'approved'}, topics=['scope'])
        self.session.invalidate('scope-change', source='approved scope changed')
        with self.assertRaises(EvidenceError):
            self.session.resolve(reference)

    def test_returned_records_are_deep_copies(self):
        self.session.record('pre_stage_evidence', self.payload())
        record = self.session.get('pre_stage_evidence')
        record['payload']['status'] = 'FAIL'
        self.assertEqual(self.session.get('pre_stage_evidence')['payload']['status'], 'PASS')

    def test_unbound_session_cannot_export(self):
        with self.assertRaises(EvidenceError):
            EvidenceManager(75, None, 'standalone').export_static(authorized=True)

    def test_wrapped_operation_registers_once_without_reobserving(self):
        calls = []
        @managed_operation
        def observe(issue):
            calls.append(issue)
            return {'pre_stage_evidence': self.payload()}
        with using_evidence(self.session), chdir(self.repo):
            result = observe(75)
        self.assertEqual(calls, [75])
        self.assertEqual(result['evidence_registration']['status'], 'PASS')
        self.assertEqual(self.session.get('pre_stage_evidence')['payload'], result['pre_stage_evidence'])

    def test_wrapper_rejects_cross_issue_before_execution(self):
        @managed_operation
        def observe(issue):
            self.fail('Should not execute')
        with using_evidence(self.session), self.assertRaises(EvidenceError):
            observe(76)

    def test_branch_projection_survives_remote_change(self):
        p = self.payload(phase=3)
        p['git'] = {'repository_root': str(self.repo), 'changes': [], 'staged': [], 'unstaged': []}
        register_result({'branch_evidence': p}, self.session)
        self.session.invalidate('remote-change', source='observed remote mutation')
        self.session.get('working_tree_observation')
        with self.assertRaises(EvidenceError):
            self.session.get('branch_evidence')

    def test_cli_export_contains_no_session_snapshot(self):
        t = datetime.now(timezone.utc).isoformat()
        request = {'issue': 75, 'repository': str(self.repo), 'workflow_id': 'wf', 'actions': [
            {'operation': 'record', 'arguments': {'key': 'pre_stage_evidence', 'payload': self.payload()}},
            {'operation': 'record', 'arguments': {'key': 'canonical_base', 'payload': {'base_sha': 'a' * 40},
                'category': 'static', 'kind': 'canonical_base', 'source': 'approved-policy', 'phase': 3,
                'status': 'PASS', 'observed_at': t}},
            {'operation': 'export-static', 'authorized': True}]}
        before = list(self.repo.iterdir())
        process = subprocess.run([sys.executable, str(HARNESS / 'evidence_manager.py')], input=json.dumps(request),
                                 cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(process.returncode, 0, process.stderr)
        result = json.loads(process.stdout)
        self.assertNotIn('issue_evidence', result)
        self.assertNotIn('pre_stage_evidence', process.stdout)
        self.assertEqual(before, list(self.repo.iterdir()))

    def test_replaying_invalidated_observation_cannot_revive_it(self):
        payload = self.payload()
        self.session.record('pre_stage_evidence', payload)
        self.session.invalidate('file-change', source='edit')
        with self.assertRaises(EvidenceError):
            self.session.record('pre_stage_evidence', payload)
        self.session.record('pre_stage_evidence', self.payload())
        self.session.get('pre_stage_evidence')

    def test_parent_directory_change_invalidates_child_static_reference(self):
        reference = self.static('sdd','sdd_refs',{'folder':'specs/075-feature','files':{'spec.md':'a'}},topics=['sdd'])
        self.session.invalidate('sdd-change',source='renamed directory',paths=['specs/075-feature'])
        with self.assertRaises(EvidenceError):
            self.session.resolve(reference)

    def test_known_observation_dependencies_cannot_be_weakened(self):
        reference = self.session.record('post_commit_evidence', self.payload(phase='post-commit'), topics=['unrelated'])
        self.session.invalidate('staging-change', source='observed staging update')
        with self.assertRaises(EvidenceError):
            self.session.resolve(reference)

    def test_successful_commit_preserves_observed_static_file_context(self):
        context = self.static('context','context_item',{'path':'AGENTS.md','sha256':'a'},topics=['instructions'])
        result = {'commit_creation_evidence': self.payload(phase=10)}
        result['commit_creation_evidence'].update(commit_attempted=True, commit_created=True,
            checks={'unrelated_local_work_preserved':True})
        register_result(result,self.session)
        self.session.resolve(context)

    def test_superseded_payload_is_available_only_as_explicit_history(self):
        from evidence_manager import read_json
        first = self.payload()
        ref = self.session.record('pre_commit_evidence', first)
        self.session.record('pre_commit_evidence', self.payload())
        with self.assertRaises(EvidenceError):
            self.session.resolve(ref)
        with using_evidence(self.session):
            historical = read_json({'evidence_ref':ref,'historical':True})
        self.assertEqual(historical['pre_commit_evidence'], first)
        self.assertFalse(self.session.get_historical(ref)['current'])
        self.assertNotIn('superseded', self.session.export_static(authorized=True))

    def test_historical_reference_rejects_extra_or_tampered_fields(self):
        first = self.payload()
        reference = self.session.record('pre_commit_evidence', first)
        self.session.record('pre_commit_evidence', self.payload())
        for changed in (
            {**reference, 'extra': 'untrusted'},
            {**reference, 'sha256': '0' * 64},
            {**reference, 'version': reference['version'] + 1},
        ):
            with self.assertRaises(EvidenceError):
                self.session.get_historical(changed)

    def test_historical_reference_rejects_corrupted_ledger_payload(self):
        reference = self.session.record('pre_commit_evidence', self.payload())
        self.session.record('pre_commit_evidence', self.payload())
        self.session.superseded['mutable:pre_commit_evidence'][0]['payload']['status'] = 'FAIL'
        with self.assertRaises(EvidenceError):
            self.session.get_historical(reference)

    def test_successful_same_content_branch_preparation_preserves_context(self):
        context = self.static('context', 'context_item', {'path': 'AGENTS.md', 'sha256': 'a'}, topics=['instructions'])
        result = {'branch_preparation_evidence': self.payload(phase=3)}
        result['branch_preparation_evidence'].update(
            branch_mutation_attempted=True, result_branch='feat/075-test',
            previous_head='a' * 40, result_head='a' * 40,
            previous_tree='b' * 40, result_tree='b' * 40,
            previous_index_matches_head=True, result_index_matches_head=True,
            checks={'working_tree_preserved': True},
        )
        register_result(result, self.session)
        self.session.resolve(context)

    def test_branch_preparation_without_content_proof_invalidates_context(self):
        context = self.static('context', 'context_item', {'path': 'AGENTS.md', 'sha256': 'a'}, topics=['instructions'])
        result = {'branch_preparation_evidence': self.payload(phase=3)}
        result['branch_preparation_evidence'].update(
            branch_mutation_attempted=True, result_branch='feat/075-test',
            previous_head='a' * 40, result_head='a' * 40,
            checks={'working_tree_preserved': True},
        )
        register_result(result, self.session)
        with self.assertRaises(EvidenceError):
            self.session.resolve(context)
