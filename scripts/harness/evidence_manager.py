#!/usr/bin/env python3
"""Session-only evidence ledger. Never writes files or observes Git/GitHub.

Static export is explicitly projected historical data, never a mutable snapshot.
Sessions exist only in this process (or as caller-owned in-memory objects).
"""
import argparse
from contextlib import contextmanager
from contextvars import ContextVar
from copy import deepcopy
from datetime import datetime, timezone
from functools import wraps
import hashlib
import inspect as signature_inspect
import json
from pathlib import Path
import sys
import uuid


class EvidenceError(ValueError):
    pass


STATIC_FIELDS = {
    'issue_identity': {'number', 'title', 'url', 'repository_full_name'},
    'approved_scope': {'description', 'acceptance_criteria', 'constraints', 'approved_by'},
    'decisions': {'items', 'approved_by'},
    'dependencies': {'items', 'approved_by'},
    'context_item': {'path', 'sha256', 'revision', 'applicability', 'reason'},
    'sdd_refs': {'folder', 'files', 'revisions'},
    'verification_history': {'checks', 'source_fingerprint', 'content_sha256', 'logs', 'results'},
    'accepted_commit': {'sha', 'message', 'branch', 'base_sha', 'commits', 'manifest'},
    'canonical_base': {'policy', 'base_branch', 'base_ref', 'base_remote_ref', 'base_sha',
                       'pr_target', 'pr_target_ref', 'base_remote_sha_initial', 'pr_target_sha_initial',
                       'dependency_approval', 'dependency_commits'},
}
EVENT_TOPICS = {
    'file-change': {'instructions', 'working_tree', 'pre_stage', 'pre_commit', 'post_commit', 'final', 'verification', 'sdd'},
    'sdd-change': {'instructions', 'working_tree', 'sdd', 'pre_stage', 'pre_commit', 'post_commit', 'final', 'verification'},
    'staging-change': {'index', 'git', 'pre_stage', 'pre_commit', 'post_commit', 'final'},
    'branch-change': {'branch', 'head', 'git', 'working_tree', 'index', 'pre_stage', 'pre_commit', 'post_commit', 'final'},
    'history-change': {'head', 'git', 'index', 'pre_stage', 'pre_commit', 'post_commit', 'final'},
    'remote-change': {'remote', 'post_commit', 'final'},
    'github-change': {'github', 'final'},
    'pr-change': {'pr', 'final'},
    'scope-change': {'scope', 'decisions', 'sdd', 'verification', 'pre_stage', 'pre_commit', 'post_commit', 'final'},
    'instruction-change': {'instructions', 'sdd', 'verification', 'pre_stage', 'pre_commit', 'post_commit', 'final'},
    'dependency-change': {'dependencies', 'verification', 'pre_commit', 'post_commit', 'final'},
}
OBSERVATION_TOPICS = {
    'branch_evidence': {'git', 'branch', 'head', 'working_tree', 'index', 'remote', 'scope'},
    'base_validation_evidence': {'remote', 'scope'},
    'branch_preparation_evidence': {'branch', 'head', 'scope'},
    'branch_check_evidence': {'git', 'branch', 'head', 'working_tree', 'scope'},
    'pre_stage_evidence': {'pre_stage', 'scope'},
    'staging_preparation_evidence': {'index', 'scope'},
    'pre_commit_evidence': {'pre_commit', 'scope'},
    'commit_creation_evidence': {'scope'},
    'commit_check_evidence': {'head', 'branch', 'scope'},
    'post_commit_evidence': {'post_commit', 'scope'},
    'final_check_evidence': {'final', 'scope'},
    'sdd_inspection_evidence': {'sdd', 'scope'},
    'sdd_validation_evidence': {'sdd', 'scope'},
    'sdd_preparation_evidence': {'sdd', 'scope'},
    'verification_evidence': {'verification', 'scope', 'dependencies'},
}
PROHIBITED_STATIC_KEYS = {'pre_stage_evidence', 'post_commit_evidence', 'git_state', 'working_tree',
                          'staging_state', 'active_branch', 'head', 'head_sha', 'mutable',
                          'base_remote_sha_latest', 'remote_sha_latest'}


def check_static_values(value):
    if isinstance(value, dict):
        if set(value) & PROHIBITED_STATIC_KEYS:
            raise EvidenceError('Mutable/pre-stage/post-commit payloads cannot be exported as static')
        for child in value.values():
            check_static_values(child)
    elif isinstance(value, list):
        for child in value:
            check_static_values(child)


ACTIVE = ContextVar('issue_evidence_session', default=None)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True).encode()).hexdigest()


def timestamp():
    return datetime.now(timezone.utc).isoformat()


class EvidenceManager:
    def __init__(self, issue, repository, workflow_id):
        if not isinstance(issue, int) or issue < 1 or not isinstance(workflow_id, str) or not workflow_id.strip():
            raise EvidenceError('Explicit Issue and workflow identity required')
        self.issue = issue
        self.repository = str(Path(repository).resolve()) if repository is not None else None
        self.workflow_id = workflow_id
        self.static = {}
        self.mutable = {}
        self.events = []
        self.superseded = {}
        self._versions = {}
        self._base_sha = None

    def bind_repository(self, repository):
        actual = str(Path(repository).resolve())
        if self.repository is not None and self.repository != actual:
            raise EvidenceError('Repository differs from the session scope')
        self.repository = actual

    def record(self, key, payload, *, category='mutable', kind=None, topics=None, source=None, phase=None,
               status=None, observed_at=None, paths=None):
        if category not in ('static', 'mutable') or not isinstance(payload, dict) or not isinstance(key, str) or not key:
            raise EvidenceError('Invalid evidence entry')
        if payload.get('issue', self.issue) != self.issue:
            raise EvidenceError('Evidence belongs to another Issue')
        if payload.get('workflow_id', self.workflow_id) != self.workflow_id:
            raise EvidenceError('Evidence belongs to another workflow')
        observed_repo = payload.get('repository')
        if isinstance(observed_repo, dict):
            observed_repo = observed_repo.get('root')
        git_scope = payload.get('git', {})
        if not isinstance(git_scope, dict):
            raise EvidenceError('Invalid Git scope metadata')
        observed_repo = observed_repo or git_scope.get('repository_root')
        if observed_repo:
            self.bind_repository(observed_repo)
        source = source if source is not None else payload.get('source')
        phase = phase if phase is not None else payload.get('phase')
        status = status if status is not None else payload.get('status')
        observed_at = observed_at if observed_at is not None else payload.get('observed_at')
        if not source or phase is None or not status or not observed_at:
            raise EvidenceError('Source, phase, status and observation time must be supplied, never inferred')
        parsed = datetime.fromisoformat(observed_at)
        if parsed.tzinfo is None:
            raise EvidenceError('Observation time requires a timezone')
        data = deepcopy(payload)
        if category == 'static':
            check_static_values(data)
            if kind not in STATIC_FIELDS or set(data) - STATIC_FIELDS[kind]:
                raise EvidenceError('Static evidence has unknown or mutable fields')
            if key in OBSERVATION_TOPICS:
                raise EvidenceError('Observations cannot be converted to persistent static data')
            if status not in ('PASS', 'complete'):
                raise EvidenceError('Only verified historical data may be registered as static')
            if kind == 'context_item' and not paths and data.get('path'):
                paths = [data['path']]
            if kind == 'sdd_refs' and not paths and data.get('folder'):
                paths = [data['folder'] + '/' + name for name in data.get('files', {})]
            if kind == 'canonical_base':
                if key != 'canonical_base':
                    raise EvidenceError('Exactly one canonical_base record is allowed')
                sha = data.get('base_sha')
                if not isinstance(sha, str) or len(sha) != 40 or any(c not in '0123456789abcdefABCDEF' for c in sha):
                    raise EvidenceError('Canonical historical base SHA is missing')
                sha = sha.lower()
                data['base_sha'] = sha
                if self._base_sha is not None and self._base_sha != sha:
                    raise EvidenceError('Historical base_sha is immutable for this workflow')
                previous = self.static.get(key)
                if previous and any(field in data and data[field] != value for field, value in previous['payload'].items()):
                    raise EvidenceError('Approved canonical policy cannot be silently changed')
                if previous:
                    data = {**previous['payload'], **data}
                self._base_sha = sha
        store = self.static if category == 'static' else self.mutable
        # A byte-identical valid observation is reused, without minting a new version.
        previous = store.get(key)
        if previous and not previous['valid']:
            if category == 'mutable' and previous['sha256'] == digest(data):
                raise EvidenceError('Cannot revive an invalidated observation by replaying it')
            receipt_keys = {'branch_preparation_evidence', 'staging_preparation_evidence',
                            'sdd_preparation_evidence', 'commit_creation_evidence'}
            if key not in receipt_keys and any(parsed <= datetime.fromisoformat(event['observed_at'])
                                              for event in previous['invalidated_by']):
                raise EvidenceError('Observation predates its invalidating mutation')
        if previous and previous['valid'] and previous['payload'] == data and previous['status'] == status:
            return self.reference(key, category)
        version_key = category + ':' + key
        if previous:
            self.superseded.setdefault(version_key, []).append(deepcopy(previous))
        version = self._versions.get(version_key, 0) + 1
        self._versions[version_key] = version
        store[key] = {'key': key, 'category': category, 'kind': kind, 'payload': data,
                      'source': deepcopy(source), 'phase': phase, 'status': status, 'observed_at': observed_at,
                      'registered_at': timestamp(), 'version': version, 'sha256': digest(data), 'valid': True,
                      'verified': status in ('PASS', 'complete') and data.get('collection_status', 'complete') == 'complete',
                      'topics': sorted(set(OBSERVATION_TOPICS.get(key, set())) | set(topics or {'scope'})),
                      'paths': sorted(set(paths or [])), 'invalidated_by': []}
        return self.reference(key, category)

    def reference(self, key, category='mutable'):
        entry = (self.static if category == 'static' else self.mutable).get(key)
        if not entry:
            raise EvidenceError('Missing evidence: ' + key)
        return {'key': key, 'category': category, 'version': entry['version'], 'sha256': entry['sha256'],
                'issue': self.issue, 'repository': self.repository, 'workflow_id': self.workflow_id}

    def resolve(self, reference, require_verified=True):
        if (reference.get('issue') != self.issue or reference.get('workflow_id') != self.workflow_id
                or reference.get('repository') != self.repository):
            raise EvidenceError('Evidence reference has a different session scope')
        category = reference.get('category')
        if category not in ('static', 'mutable'):
            raise EvidenceError('Invalid evidence reference category')
        entry = (self.static if category == 'static' else self.mutable).get(reference.get('key'))
        if (not entry or not entry['valid'] or entry['version'] != reference.get('version')
                or entry['sha256'] != reference.get('sha256') or (require_verified and not entry['verified'])):
            raise EvidenceError('Evidence is missing, stale, failed or invalidated: ' + str(reference.get('key')))
        return deepcopy(entry)

    def get_historical(self, reference):
        if (reference.get('issue') != self.issue or reference.get('workflow_id') != self.workflow_id
                or reference.get('repository') != self.repository):
            raise EvidenceError('Historical reference belongs to another session')
        category, key = reference.get('category'), reference.get('key')
        if category not in ('static', 'mutable'):
            raise EvidenceError('Invalid historical reference category')
        current = (self.static if category == 'static' else self.mutable).get(key)
        candidates = ([current] if current else []) + self.superseded.get(category + ':' + key, [])
        for entry in candidates:
            if entry['version'] == reference.get('version') and entry['sha256'] == reference.get('sha256'):
                return {'historical': True, 'current': False, 'entry': deepcopy(entry)}
        raise EvidenceError('Historical evidence version is unavailable')

    def get(self, key, category='mutable', require_verified=True):
        return self.resolve(self.reference(key, category), require_verified)

    def invalidate(self, event, *, source, paths=None):
        if event not in EVENT_TOPICS or not source:
            raise EvidenceError('Unknown mutation or missing source')
        changed_paths = set(paths or [])
        event_time = timestamp()
        topics = EVENT_TOPICS[event]
        affected = []
        for category, store in (('static', self.static), ('mutable', self.mutable)):
            for key, entry in store.items():
                if not entry['valid'] or not topics.intersection(entry['topics']):
                    continue
                if category == 'static':
                    if entry['kind'] == 'canonical_base' and event not in ('scope-change', 'instruction-change', 'dependency-change'):
                        continue
                    if event in ('file-change', 'sdd-change') and entry['paths'] and changed_paths and not any(a == b or a.startswith(b.rstrip('/') + '/') or b.startswith(a.rstrip('/') + '/') for a in changed_paths for b in entry['paths']):
                        continue
                    if event in ('file-change', 'sdd-change') and not entry['paths']:
                        continue
                entry['valid'] = False
                entry['invalidated_by'].append({'event': event, 'source': source, 'paths': sorted(changed_paths), 'observed_at': event_time})
                affected.append(category + ':' + key)
        self.events.append({'event': event, 'source': source, 'paths': sorted(changed_paths),
                            'observed_at': event_time, 'affected': affected})
        return affected

    def snapshot(self):
        return {'issue_evidence': {'issue': self.issue, 'repository': self.repository,
                                  'workflow_id': self.workflow_id, 'static': deepcopy(self.static),
                                  'mutable': deepcopy(self.mutable), 'superseded': deepcopy(self.superseded), 'events': deepcopy(self.events)}}

    def export_static(self, *, authorized=False):
        if authorized is not True or self.repository is None:
            raise EvidenceError('Explicit static-export authorization and repository scope required')
        return {'kind': 'historical_static_summary', 'issue': self.issue, 'repository': self.repository,
                'workflow_id': self.workflow_id, 'mutable_state_is_current': False,
                'static': {key: deepcopy(entry) for key, entry in self.static.items() if entry['valid'] and entry['verified']},
                'requires_fresh_observations': ['Git', 'working-tree', 'GitHub', 'remotes', 'PR']}


@contextmanager
def using_evidence(session):
    token = ACTIVE.set(session)
    try:
        yield session
    finally:
        ACTIVE.reset(token)


def read_json(value):
    """Read a legacy JSON path or a caller-owned in-memory object/reference."""
    if isinstance(value, dict) and 'evidence_ref' in value:
        if set(value) - {'evidence_ref', 'historical', 'unwrap'}:
            raise EvidenceError('Unknown session-reference options')
        session = ACTIVE.get()
        if session is None:
            raise EvidenceError('Session references require an active in-memory session')
        if value.get('historical') is True:
            entry = session.get_historical(value['evidence_ref'])['entry']
        else:
            entry = session.resolve(value['evidence_ref'])
        payload = deepcopy(entry['payload'])
        return payload if value.get('unwrap') is True else {entry['key']: payload}
    if isinstance(value, (dict, list)):
        return deepcopy(value)
    with Path(value).open('r', encoding='utf-8') as stream:
        return json.load(stream)


def read_message_bytes(value):
    if isinstance(value, dict):
        if set(value) != {'text'} or not isinstance(value['text'], str):
            raise EvidenceError('In-memory commit messages require an explicit text field')
        return value['text'].encode('utf-8')
    return Path(value).read_bytes()


def register_result(result, session):
    keys = [key for key in result if key in OBSERVATION_TOPICS]
    if not keys:
        return result
    references = []
    for key in keys:
        payload = result[key]
        source = payload.get('source')
        if key == 'branch_preparation_evidence' and (payload.get('result_branch') is not None or payload.get('branch_mutation_attempted') is True):
            session.invalidate('branch-change', source=source)
            if payload.get('status') != 'PASS' or payload.get('expected_head') != payload.get('result_head'):
                session.invalidate('file-change', source=source)
        elif key == 'staging_preparation_evidence' and payload.get('status') == 'PASS':
            session.invalidate('staging-change', source=source)
        elif key == 'commit_creation_evidence' and payload.get('commit_attempted'):
            session.invalidate('history-change', source=source)
            if payload.get('status') != 'PASS' or payload.get('checks', {}).get('unrelated_local_work_preserved') is not True:
                session.invalidate('file-change', source=source)
        elif key == 'sdd_preparation_evidence' and payload.get('created_paths'):
            session.invalidate('sdd-change', source=source, paths=payload['created_paths'])
        elif key == 'verification_evidence' and any(any(marker in str(error).lower() for marker in ('invalidated', 'source changed', 'source/catalog changed')) for error in payload.get('errors', [])):
            session.invalidate('file-change', source=source)
            session.invalidate('history-change', source=source)
        references.append(session.record(key, payload))
        if key == 'branch_evidence' and payload.get('git'):
            observed = payload['git']
            local = {name: deepcopy(observed[name]) for name in
                     ('repository_root', 'active_branch', 'head', 'changes', 'staged', 'unstaged',
                      'untracked', 'working_tree_clean', 'unstaged_diff', 'staged_diff') if name in observed}
            projected = {'source': deepcopy(source), 'phase': payload['phase'],
                         'observed_at': payload['observed_at'], 'status': payload['status'], 'git': local}
            references.append(session.record('working_tree_observation', projected,
                              topics=['working_tree', 'index', 'head', 'branch']))
        if key == 'base_validation_evidence' and payload.get('status') == 'PASS':
            fields = {field: payload[field] for field in STATIC_FIELDS['canonical_base'] if field in payload and payload[field] is not None}
            references.append(session.record('canonical_base', fields, category='static', kind='canonical_base',
                source=source, phase=payload['phase'], status='PASS', observed_at=payload['observed_at'],
                topics=['scope', 'instructions', 'dependencies']))
        if key == 'commit_check_evidence' and payload.get('status') == 'PASS':
            fields = {'sha': payload['commit_sha'], 'message': payload['message'], 'branch': payload['branch'],
                      'base_sha': payload['base_sha'], 'manifest': payload['commit_paths']}
            references.append(session.record('accepted_commit', fields, category='static', kind='accepted_commit',
                source=source, phase=payload['phase'], status='PASS', observed_at=payload['observed_at'], topics=['scope']))
    result = dict(result)
    result['evidence_registration'] = {'status': 'PASS', 'session_only': True,
                                       'repository_scope_observed': session.repository is not None,
                                       'references': references}
    return result


def managed_operation(function):
    signature = signature_inspect.signature(function)

    @wraps(function)
    def wrapper(*args, **kwargs):
        arguments = signature.bind(*args, **kwargs).arguments
        issue = arguments.get('issue')
        active = ACTIVE.get()
        if active:
            if issue is not None and issue != active.issue:
                raise EvidenceError('Operation belongs to another Issue')
            selected_root = arguments.get('repo_root')
            if active.repository is not None:
                execution_root = Path(selected_root).resolve() if selected_root else Path.cwd().resolve()
                if not execution_root.is_relative_to(Path(active.repository)):
                    raise EvidenceError('Operation is outside the session repository')
        session = active or (EvidenceManager(issue, None, arguments.get('workflow_id') or 'standalone-' + uuid.uuid4().hex) if issue is not None else None)
        if session is None:
            return function(*args, **kwargs)
        with using_evidence(session):
            result = function(*args, **kwargs)
            return register_result(result, session)
    return wrapper


def main():
    parser = argparse.ArgumentParser(description='In-memory issue evidence session (JSON on stdin/stdout)')
    parser.parse_args()
    try:
        request = json.load(sys.stdin)
        session = EvidenceManager(request['issue'], request['repository'], request['workflow_id'])
        results = []
        for action in request['actions']:
            operation = action['operation']
            if operation == 'record':
                results.append(session.record(**action['arguments']))
            elif operation == 'invalidate':
                results.append(session.invalidate(**action['arguments']))
            elif operation == 'export-static':
                results.append(session.export_static(authorized=action.get('authorized') is True))
            elif operation == 'get':
                results.append(session.get(**action['arguments']))
            else:
                raise EvidenceError('Unsupported evidence action')
        response = ({'status': 'PASS', 'historical_static_summary': results[-1]}
                    if request['actions'] and request['actions'][-1]['operation'] == 'export-static'
                    else {'status': 'PASS', 'results': results, **session.snapshot()})
        code = 0
    except (EvidenceError, ValueError, KeyError, TypeError, OSError) as error:
        response, code = {'status': 'BLOCK', 'errors': [str(error)]}, 1
    print(json.dumps(response, ensure_ascii=True, indent=2))
    return code


if __name__ == '__main__':
    sys.exit(main())
