"""Persistence and runtime-safety tests for authenticated harness snapshots."""
from datetime import datetime, timezone
import json
from pathlib import Path
import sys
import tempfile
import unittest


HARNESS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HARNESS))
sys.dont_write_bytecode = True

from evidence_manager import EvidenceError
from session_snapshot import SnapshotError, read_snapshot, write_snapshot
from workflow_controller import WorkflowController


class SessionSnapshotTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name).resolve()
        self.runtime = {'modules': {'workflow_controller.py': 'a' * 64}, 'sha256': 'b' * 64}
        self.git = {'head': 'c' * 40, 'branch': 'feat/189-test', 'status_sha256': 'd' * 64}
        self.key = b'snapshot-test-key-must-be-at-least-thirty-two-bytes'
        self.controller = WorkflowController(189, self.repo, 'snapshot-test')
        self.controller.phase = 4
        self.controller.evidence.record('sdd_validation_evidence', {
            'source': 'test', 'phase': 4, 'issue': 189, 'repository': str(self.repo),
            'workflow_id': 'snapshot-test', 'status': 'PASS',
            'observed_at': datetime.now(timezone.utc).isoformat(),
        })
        self.controller.history.append({'phase': 4, 'status': 'PASS'})

    def write(self):
        return write_snapshot(self.repo, 189, 'snapshot-test', self.runtime, self.git,
                               self.controller.persistent_state(), self.key)

    def test_round_trip_preserves_history_and_invalidates_mutable_evidence(self):
        path = self.write()
        payload = read_snapshot(path, self.repo, 189, 'snapshot-test', self.runtime, self.git,
                                self.key)
        restored = WorkflowController.from_persistent_state(payload['state'])

        invalidated = restored.restored('test restore')

        self.assertIn('mutable:sdd_validation_evidence', invalidated)
        self.assertEqual(restored.history[-1]['status'], 'RESTORED')
        self.assertEqual(restored.guards, {})
        with self.assertRaises(EvidenceError):
            restored.evidence.get('sdd_validation_evidence')

    def test_corrupt_payload_is_rejected_before_restoration(self):
        path = self.write()
        envelope = json.loads(path.read_text())
        envelope['payload']['state']['phase'] = 99
        path.write_text(json.dumps(envelope))

        with self.assertRaisesRegex(SnapshotError, 'authentication'):
            read_snapshot(path, self.repo, 189, 'snapshot-test', self.runtime, self.git, self.key)

    def test_wrong_key_is_rejected(self):
        path = self.write()

        with self.assertRaisesRegex(SnapshotError, 'authentication'):
            read_snapshot(path, self.repo, 189, 'snapshot-test', self.runtime, self.git,
                          b'another-test-key-that-is-at-least-thirty-two-bytes')

    def test_incompatible_runtime_and_git_context_are_rejected(self):
        path = self.write()

        with self.assertRaisesRegex(SnapshotError, 'runtime'):
            read_snapshot(path, self.repo, 189, 'snapshot-test',
                          {'modules': {}, 'sha256': 'other'}, self.git, self.key)
        with self.assertRaisesRegex(SnapshotError, 'Git context'):
            read_snapshot(path, self.repo, 189, 'snapshot-test', self.runtime,
                          {**self.git, 'head': 'e' * 40}, self.key)

    def test_sensitive_snapshot_state_is_rejected(self):
        state = self.controller.persistent_state()
        state['evidence']['mutable']['sdd_validation_evidence']['payload']['token'] = 'secret'

        with self.assertRaisesRegex(SnapshotError, 'sensitive'):
            write_snapshot(self.repo, 189, 'snapshot-test', self.runtime, self.git, state,
                           self.key)

    def test_private_permissions_are_required_on_restore(self):
        path = self.write()
        path.chmod(0o644)

        with self.assertRaisesRegex(SnapshotError, 'permissions'):
            read_snapshot(path, self.repo, 189, 'snapshot-test', self.runtime, self.git,
                          self.key)

    def test_retention_preserves_the_newest_snapshots(self):
        paths = [self.write() for _ in range(6)]

        retained = list((self.repo / '.harness-snapshots').glob('*.json'))

        self.assertEqual(len(retained), 5)
        self.assertNotIn(paths[0], retained)
