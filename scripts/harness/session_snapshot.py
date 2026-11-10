#!/usr/bin/env python3
"""Private, integrity-protected storage for harness workflow snapshots."""
from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import tempfile
import time
import uuid


SCHEMA_VERSION = 1
RETENTION = 5
SENSITIVE_NAMES = {'secret', 'token', 'password', 'authorization', 'cookie', 'credential'}


class SnapshotError(ValueError):
    pass


def canonical_bytes(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'),
                      ensure_ascii=True).encode()


def authenticate(value, key):
    if not isinstance(key, bytes) or len(key) < 32:
        raise SnapshotError('Snapshot authentication key must contain at least 32 bytes')
    return hmac.new(key, canonical_bytes(value), hashlib.sha256).hexdigest()


def _contains_sensitive(value):
    if isinstance(value, dict):
        return any(str(key).casefold() in SENSITIVE_NAMES or _contains_sensitive(item)
                   for key, item in value.items())
    if isinstance(value, list):
        return any(_contains_sensitive(item) for item in value)
    return False


def default_directory(repository):
    return Path(repository) / '.harness-snapshots'


def _snapshot_prefix(issue, workflow_id):
    digest = hashlib.sha256(workflow_id.encode('utf-8')).hexdigest()[:16]
    return f'issue-{issue:03d}-{digest}-'


def new_snapshot_id():
    return f'{time.time_ns():x}{uuid.uuid4().hex}'


def snapshot_path(directory, issue, workflow_id, snapshot_id=None):
    identifier = snapshot_id or new_snapshot_id()
    return Path(directory) / f'{_snapshot_prefix(issue, workflow_id)}{identifier}.json'


def write_snapshot(repository, issue, workflow_id, runtime, git_context, state, key, directory=None,
                   snapshot_id=None):
    """Atomically persist an authenticated state without accepting arbitrary paths."""
    if _contains_sensitive(state):
        raise SnapshotError('Refusing to persist a snapshot containing sensitive fields')
    root = Path(directory).resolve() if directory else default_directory(repository)
    root.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(root, 0o700)
    payload = {
        'schema_version': SCHEMA_VERSION,
        'issue': issue,
        'workflow_id': workflow_id,
        'repository': str(Path(repository).resolve()),
        'runtime': deepcopy(runtime),
        'git_context': deepcopy(git_context),
        'created_at': datetime.now(timezone.utc).isoformat(),
        'state': deepcopy(state),
    }
    envelope = {'payload': payload, 'hmac_sha256': authenticate(payload, key)}
    path = snapshot_path(root, issue, workflow_id, snapshot_id)
    fd, temporary = tempfile.mkstemp(prefix='.pending-', dir=root)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as stream:
            json.dump(envelope, stream, sort_keys=True, separators=(',', ':'))
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, 0o600)
        os.replace(temporary, path)
        os.chmod(path, 0o600)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    _prune(root, issue, workflow_id)
    return path


def _prune(directory, issue, workflow_id):
    # Current filenames are stable; retain historical versions if one is added later.
    candidates = sorted(directory.glob(_snapshot_prefix(issue, workflow_id) + '*.json'),
                        key=lambda candidate: candidate.name, reverse=True)
    for stale in candidates[RETENTION:]:
        stale.unlink()


def read_snapshot(path, repository, issue, workflow_id, runtime, git_context, key):
    """Read and validate a snapshot before it can reach a controller."""
    candidate = Path(path).resolve()
    if not candidate.is_file() or candidate.is_symlink():
        raise SnapshotError('Snapshot is missing or unsafe')
    mode = candidate.stat().st_mode & 0o777
    if mode & 0o077:
        raise SnapshotError('Snapshot permissions are not private')
    try:
        envelope = json.loads(candidate.read_text(encoding='utf-8'))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise SnapshotError('Snapshot is corrupt') from error
    if not isinstance(envelope, dict) or set(envelope) != {'payload', 'hmac_sha256'}:
        raise SnapshotError('Snapshot envelope is invalid')
    payload = envelope['payload']
    expected_authentication = authenticate(payload, key)
    if not hmac.compare_digest(envelope['hmac_sha256'], expected_authentication):
        raise SnapshotError('Snapshot authentication check failed')
    expected = {'schema_version', 'issue', 'workflow_id', 'repository', 'runtime', 'git_context', 'created_at', 'state'}
    if not isinstance(payload, dict) or set(payload) != expected:
        raise SnapshotError('Snapshot schema is incompatible')
    if payload['schema_version'] != SCHEMA_VERSION:
        raise SnapshotError('Snapshot schema version is incompatible')
    if (payload['issue'] != issue or payload['workflow_id'] != workflow_id
            or payload['repository'] != str(Path(repository).resolve())):
        raise SnapshotError('Snapshot identity does not match the requested session')
    if payload['runtime'] != runtime:
        raise SnapshotError('Snapshot runtime is incompatible with the loaded harness')
    if payload['git_context'] != git_context:
        raise SnapshotError('Snapshot Git context is no longer valid')
    if _contains_sensitive(payload['state']):
        raise SnapshotError('Snapshot contains sensitive fields')
    return payload
