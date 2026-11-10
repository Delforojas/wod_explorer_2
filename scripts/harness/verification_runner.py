#!/usr/bin/env python3
"""Controlled verification execution; applicability and repairs belong to AI.

No shell command strings, repairs, installs, Git writes or implicit selection.
Project check programs are executed as approved; this is not a sandbox. Full
logs stay outside the repository. See verification_runner_contract.md.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import stat
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone


class VerificationError(Exception):
    """Unknown, changed or incomplete verification inputs."""


sys.dont_write_bytecode = True
from evidence_manager import managed_operation, read_json

def now():
    return datetime.now(timezone.utc).isoformat()


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'),
                                     ensure_ascii=True).encode()).hexdigest()


def file_digest(path):
    hasher = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            hasher.update(chunk)
    return hasher.hexdigest()


def git(root, *args):
    env = {**os.environ, 'GIT_OPTIONAL_LOCKS': '0', 'GIT_TERMINAL_PROMPT': '0'}
    process = subprocess.run(['git', '-C', str(root), *args], capture_output=True, env=env, timeout=20)
    if process.returncode:
        raise VerificationError('Cannot observe Git: ' + ' '.join(args))
    return process.stdout


def root_path(selected=None):
    return Path(os.fsdecode(git(selected or Path.cwd(), 'rev-parse', '--show-toplevel')).strip()).resolve()


def local_path(root, relative):
    if (not isinstance(relative, str) or not relative or Path(relative).is_absolute()
            or '\0' in relative or any(x in ('', '..', '.git') for x in relative.split('/'))):
        raise VerificationError('Invalid repository-relative path')
    path = root / relative
    if not path.resolve().is_relative_to(root):
        raise VerificationError('Path escapes the repository: ' + relative)
    return path


def fingerprint(root, manifest_path=None):
    """Bind evidence to tracked/nonignored local source and logical Git identity."""
    head = os.fsdecode(git(root, 'rev-parse', '--verify', 'HEAD^{commit}')).strip()
    branch = os.fsdecode(git(root, 'branch', '--show-current')).strip()
    index = git(root, 'ls-files', '--stage', '-z')
    names = set(git(root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z').split(b'\0')) - {b''}
    files = {}
    for raw in sorted(names):
        relative = os.fsdecode(raw)
        path = local_path(root, relative)
        if not os.path.lexists(path):
            files[relative] = {'exists': False}
            continue
        info = path.lstat()
        if stat.S_ISLNK(info.st_mode):
            data = os.fsencode(os.readlink(path))
            mode = 'symlink'
        elif stat.S_ISREG(info.st_mode):
            with path.open('rb') as stream:
                data = stream.read()
            mode = 'executable' if info.st_mode & 0o111 else 'file'
            after = path.lstat()
            if (info.st_ino, info.st_mtime_ns, info.st_size) != (after.st_ino, after.st_mtime_ns, after.st_size):
                raise VerificationError('Source changed during observation: ' + relative)
        else:
            raise VerificationError('Cannot fingerprint source/submodule: ' + relative)
        files[relative] = {'exists': True, 'mode': mode, 'sha256': hashlib.sha256(data).hexdigest(),
                           'mtime_ns': info.st_mtime_ns, 'identity': [info.st_dev, info.st_ino]}
    snapshot = {'head_sha': head, 'branch': branch, 'index_sha256': hashlib.sha256(index).hexdigest(), 'files': files}
    if manifest_path is not None:
        with manifest_path.open('x', encoding='utf-8') as stream:
            json.dump(snapshot, stream, ensure_ascii=True, sort_keys=True, indent=2)
    content = {name: {key: value for key, value in record.items() if key not in ('mtime_ns', 'identity')}
               for name, record in files.items()}
    return {'sha256': digest(snapshot), 'content_sha256': digest(content),
            'head_sha': head, 'branch': branch, 'files_count': len(files)}


def source_hashes(root, sources):
    result = {}
    if not isinstance(sources, list) or not sources:
        raise VerificationError('Check definitions require real source files')
    for relative in sources:
        path = local_path(root, relative)
        if path.is_symlink() or not path.is_file():
            raise VerificationError('Definition source is not a regular file: ' + relative)
        result[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def catalog(root, registry_path=None):
    checks = []

    def add(identifier, command, cwd, sources, timeout=900, details=None):
        if (not re.fullmatch(r'[a-z][a-z0-9_.-]*', identifier)
                or any(c['id'] == identifier for c in checks)
                or not isinstance(command, list) or not command
                or not all(isinstance(arg, str) and arg and '\0' not in arg for arg in command)
                or not isinstance(timeout, (int, float)) or not 0 < timeout <= 3600):
            raise VerificationError('Invalid or duplicate check definition')
        directory = root if cwd == '.' else local_path(root, cwd)
        if not directory.is_dir() or directory.is_symlink():
            raise VerificationError('Invalid check working directory')
        entry = {'id': identifier, 'command': command, 'cwd': cwd,
                 'source_hashes': source_hashes(root, sources), 'timeout_seconds': timeout,
                 'details': details or {}}
        entry['definition_sha256'] = digest(entry)
        checks.append(entry)

    package_path = root / 'frontend/package.json'
    if package_path.exists():
        if package_path.is_symlink() or not package_path.resolve().is_relative_to(root):
            raise VerificationError('package.json must be a local regular project file')
        package = json.loads(package_path.read_text(encoding='utf-8'))
        scripts = package.get('scripts', {})
        if not isinstance(scripts, dict):
            raise VerificationError('package.json scripts must be an object')
        sources = ['frontend/package.json']
        if (root / 'frontend/package-lock.json').is_file():
            sources.append('frontend/package-lock.json')
        for name, identifier in [('test', 'frontend.test'), ('lint', 'frontend.lint'),
                                 ('build', 'frontend.build'), ('typecheck', 'frontend.typecheck'),
                                 ('type-check', 'frontend.type-check'), ('test:integration', 'frontend.integration')]:
            if name in scripts:
                if not isinstance(scripts[name], str) or not scripts[name].strip():
                    raise VerificationError('Empty or invalid npm verification script')
                add(identifier, ['npm', 'run', name], 'frontend', sources,
                    details={'package_script': scripts[name], 'lifecycle_scripts':
                             {key: scripts[key] for key in ('pre' + name, 'post' + name) if key in scripts}})
    project = root / 'PROJECT.md'
    if (root / 'backend/mvnw').is_file() and (root / 'backend/pom.xml').is_file() and project.is_file():
        if project.is_symlink():
            raise VerificationError('PROJECT.md must not be a symlink')
        text = project.read_text(encoding='utf-8')
        sources = ['PROJECT.md', 'backend/mvnw', 'backend/pom.xml']
        if (root / 'backend/.mvn/wrapper/maven-wrapper.properties').is_file():
            sources.append('backend/.mvn/wrapper/maven-wrapper.properties')
        for identifier, args in [('backend.validate', ['-q', '-DskipTests', 'validate']),
                                 ('backend.test', ['-q', 'test']), ('backend.build', ['-q', 'package'])]:
            command = ['./mvnw', *args]
            if ' '.join(command) in text:
                add(identifier, command, 'backend', sources)
    if registry_path:
        registry = read_json(registry_path)
        for entry in registry['checks']:
            command, cwd = entry['command'], entry['cwd']
            if not isinstance(command, list) or not command:
                raise VerificationError('Registry commands must be argv lists')
            directory = root if cwd == '.' else local_path(root, cwd)
            executable = Path(command[0]).name
            sources = list(entry['sources'])
            if executable == 'git' and command == ['git', 'diff', '--check']:
                command = ['git', '-c', 'diff.autoRefreshIndex=false', 'diff', '--check']
            elif executable.startswith('python') and len(command) >= 2 and not command[1].startswith('-'):
                script = (directory / command[1]).resolve()
                if not script.is_relative_to(root) or not script.is_file():
                    raise VerificationError('Custom Python checks must name an existing project script')
                sources.append(str(script.relative_to(root)))
            elif command[0].startswith('./'):
                script = (directory / command[0]).resolve()
                if not script.is_relative_to(root) or not script.is_file() or script.is_symlink():
                    raise VerificationError('Custom executable must be an existing project script')
                sources.append(str(script.relative_to(root)))
            else:
                raise VerificationError('Registry supports project scripts or git diff --check, not arbitrary shell/Git commands')
            add(entry['id'], command, cwd, sorted(set(sources)), entry.get('timeout_seconds', 900))
    return checks


def discover(repo_root=None, registry_path=None):
    e = {'source': 'scripts/harness/verification_runner.py discover', 'observed_at': now(),
         'status': 'INCOMPLETE', 'errors': [], 'checks': [], 'applicability': 'not determined'}
    try:
        root = root_path(repo_root)
        checks = catalog(root, registry_path)
        e.update(repository=str(root), checks=checks, catalog_sha256=digest(checks),
                 source_fingerprint=fingerprint(root), status='PASS')
    except (VerificationError, OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
        e['errors'].append(str(error))
    return {'verification_catalog': e}


def diagnostics(stdout_path, stderr_path, findings_path):
    excerpts = []
    counts = {'error': 0, 'warning': 0}
    hasher = hashlib.sha256()
    with findings_path.open('xb') as normalized:
        for stream, path in [('stdout', stdout_path), ('stderr', stderr_path)]:
            with path.open('rb') as file:
                for number, raw in enumerate(file, 1):
                    text = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', raw.decode('utf-8', errors='replace')).rstrip('\r\n')
                    candidate = re.sub(r'\b0\s+(?:errors?|warnings?|failures?|failed)\b|\b(?:errors?|warnings?|failures?|failed):\s*0\b',
                                       '', text, flags=re.IGNORECASE)
                    if re.search(r'\berrors?\b|\berrores\b|\bfailed\b|\bfailures?\b|ERR!|Traceback \(most recent call last\)', candidate, re.IGNORECASE):
                        kind = 'error'
                    elif re.search(r'\bwarn(?:ing)?s?\b|\badvertencias?\b', candidate, re.IGNORECASE):
                        kind = 'warning'
                    else:
                        continue
                    finding = {'stream': stream, 'line': number, 'kind': kind, 'text': text}
                    encoded = (json.dumps(finding, sort_keys=True, separators=(',', ':'), ensure_ascii=True) + '\n').encode()
                    normalized.write(encoded)
                    hasher.update(encoded)
                    counts[kind] += 1
                    if counts[kind] <= 30:
                        excerpts.append({**finding, 'text': text[:1000]})
    return excerpts, counts, hasher.hexdigest()


def terminate_group(process):
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    try:
        process.wait(timeout=0.5)
    except subprocess.TimeoutExpired:
        pass
    # A child may outlive its parent or ignore SIGTERM.
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    process.wait(timeout=5)


def execute(root, check, logs):
    e = {'id': check['id'], 'command': check['command'], 'cwd': check['cwd'],
         'definition_sha256': check['definition_sha256'], 'started_at': now(), 'evidence_valid': True,
         'execution_status': 'not_executed', 'status': 'INCOMPLETE', 'exit_code': None,
         'errors': [], 'warnings': [], 'diagnostics_review': 'not_required'}
    stdout_path = logs / (check['id'] + '.stdout.log')
    stderr_path = logs / (check['id'] + '.stderr.log')
    started = time.monotonic()
    process = None
    try:
        with stdout_path.open('xb') as out, stderr_path.open('xb') as err:
            environment = {**os.environ, 'GIT_OPTIONAL_LOCKS': '0', 'GIT_TERMINAL_PROMPT': '0',
                           'CI': 'true', 'PYTHONDONTWRITEBYTECODE': '1'}
            process = subprocess.Popen(check['command'], cwd=root / check['cwd'], stdout=out, stderr=err,
                                       stdin=subprocess.DEVNULL, env=environment, start_new_session=True)
            e['execution_status'] = 'running'
            try:
                process.wait(timeout=check['timeout_seconds'])
                e['execution_status'] = 'completed'
                e['status'] = 'PASS' if process.returncode == 0 else 'FAIL'
                try:
                    os.killpg(process.pid, 0)
                except ProcessLookupError:
                    pass
                else:
                    terminate_group(process)
                    e.update(execution_status='incomplete', status='INCOMPLETE')
                    e['errors'].append('A child process remained active after the command exited')
            except subprocess.TimeoutExpired:
                terminate_group(process)
                e.update(execution_status='timed_out', status='INCOMPLETE')
                e['errors'].append('Verification timed out; process group terminated')
            except KeyboardInterrupt:
                terminate_group(process)
                e.update(execution_status='interrupted', status='INCOMPLETE')
                e['errors'].append('Verification interrupted')
            e['exit_code'] = process.returncode
    except OSError as error:
        e['errors'].append(str(error))
    e.update(duration_seconds=round(time.monotonic() - started, 6), finished_at=now())
    findings_path = logs / (check['id'] + '.diagnostics.jsonl')
    try:
        excerpts, counts, findings_hash = diagnostics(stdout_path, stderr_path, findings_path)
    except OSError as error:
        e.update(status='INCOMPLETE', diagnostics_sha256=None, logs={})
        e['errors'].append('Diagnostic logs could not be completed: ' + str(error))
        return e
    e['diagnostics_sha256'] = findings_hash
    e['diagnostic_counts'] = counts
    e['errors'].extend(f['text'] for f in excerpts if f['kind'] == 'error')
    e['warnings'] = [f['text'] for f in excerpts if f['kind'] == 'warning']
    # Diagnostic excerpts are compact; raw logs preserve every byte.
    e['errors'], e['warnings'] = e['errors'][:30], e['warnings'][:30]
    e['logs'] = {name: {'path': str(path), 'sha256': file_digest(path),
                      'bytes': path.stat().st_size} for name, path in [('stdout', stdout_path), ('stderr', stderr_path), ('diagnostics', findings_path)]}
    if e['status'] == 'FAIL' and not e['errors']:
        e['errors'].append('Command exited with code ' + str(e['exit_code']))
    if counts['error'] or counts['warning']:
        e['diagnostics_review'] = 'required'
        if e['status'] == 'PASS':
            e['status'] = 'INCOMPLETE'
    return e


@managed_operation
def run_checks(issue, workflow_id, selected, selection_path, repo_root=None,
               registry_path=None, log_dir=None, phase=7, review_path=None):
    e = {'source': 'scripts/harness/verification_runner.py run', 'phase': phase, 'issue': issue,
         'workflow_id': workflow_id, 'observed_at': now(), 'status': 'INCOMPLETE',
         'reports': [], 'errors': [], 'verification_guard': 'required',
         'all_applicable_checks_executed': False,
         'invalidated_by': ['source-index-head-branch-change', 'check-definition-change',
                           'applicability-or-workflow-context-change', 'dependency-or-service-change']}
    definitions = {}
    try:
        if not selected or len(set(selected)) != len(selected):
            raise VerificationError('Select a nonempty list of unique check IDs')
        root = root_path(repo_root)
        checks = catalog(root, registry_path)
        definitions = {c['id']: c for c in checks}
        initial = fingerprint(root)
        approval = read_json(selection_path)
        applicable = approval['applicable_checks']
        if (issue < 1 or not workflow_id.strip() or approval['status'] != 'APPROVED'
                or approval['source'] == '' or approval['issue'] != issue
                or approval['workflow_id'] != workflow_id or approval['repository'] != str(root)
                or approval['phase'] != phase or approval['checks'] != selected
                or approval['catalog_sha256'] != digest(checks)
                or approval['source_fingerprint'] != initial['sha256']
                or approval['tasks_completed'] is not True or approval['applicability_complete'] is not True
                or not isinstance(applicable, list) or len(set(applicable)) != len(applicable)
                or not set(selected) <= set(applicable) or not set(applicable) <= definitions.keys()
                or (phase == 7 and selected != applicable)
                or (phase == 8 and not approval['rerun_reason'].strip())):
            raise VerificationError('Missing, stale or mismatched workflow check selection')
        if any(identifier not in definitions for identifier in selected):
            raise VerificationError('Unknown check ID; nothing executed')
        review = read_json(review_path) if review_path else None
        if review and (review['source'] != 'verification-guard' or review['issue'] != issue
                       or review['workflow_id'] != workflow_id or review['source_fingerprint'] != initial['sha256']):
            raise VerificationError('Diagnostic review belongs to another source state/workflow')
        if log_dir and Path(log_dir).resolve().is_relative_to(root):
            raise VerificationError('Diagnostic logs must be outside the source repository')
        base_logs = Path(log_dir).resolve() if log_dir else Path(tempfile.gettempdir()).resolve()
        base_logs.mkdir(parents=True, exist_ok=True)
        logs = Path(tempfile.mkdtemp(prefix=f'verification-{issue}-', dir=base_logs))
        manifest_path = logs / 'source-manifest.json'
        if fingerprint(root, manifest_path) != initial:
            raise VerificationError('Source changed while recording the execution manifest')
        e.update(repository=str(root), source_fingerprint=initial, catalog_sha256=digest(checks), log_directory=str(logs),
                 source_manifest={'path': str(manifest_path), 'sha256': file_digest(manifest_path)})
        blocked = False
        for identifier in selected:
            if blocked:
                e['reports'].append({'id': identifier, 'status': 'INCOMPLETE', 'execution_status': 'not_executed',
                                     'errors': ['Source state changed or execution interrupted; new selection required']})
                continue
            if fingerprint(root) != initial or catalog(root, registry_path) != checks:
                raise VerificationError('Source/catalog changed before check execution')
            result = execute(root, definitions[identifier], logs)
            e['reports'].append(result)
            if result['diagnostics_review'] == 'required' and review:
                matches = [r for r in review['reviews'] if r['check_id'] == identifier
                           and r['definition_sha256'] == result['definition_sha256']
                           and r['diagnostics_sha256'] == result['diagnostics_sha256']]
                if len(matches) == 1 and isinstance(matches[0]['blocking'], bool) and matches[0]['reason'].strip():
                    result['diagnostics_review'] = matches[0]
                    if result['execution_status'] == 'completed' and result['exit_code'] == 0:
                        result['status'] = 'FAIL' if matches[0]['blocking'] else 'PASS'
            final = fingerprint(root)
            if final != initial or catalog(root, registry_path) != checks:
                blocked = True
                result['errors'].append('Source, index, HEAD or branch changed during execution')
                if result['status'] == 'PASS':
                    result['status'] = 'INCOMPLETE'
                e['errors'].append('All execution evidence invalidated by source/Git changes')
                for earlier in e['reports']:
                    earlier['evidence_valid'] = False
                    if earlier['status'] == 'PASS':
                        earlier['status'] = 'INCOMPLETE'
                        earlier['errors'].append('Evidence invalidated by a later source/Git change')
            if result['execution_status'] == 'interrupted':
                blocked = True
        missing = [identifier for identifier in applicable if identifier not in selected]
        e['coverage'] = {'applicable': applicable, 'selected': selected, 'not_run_in_this_invocation': missing}
        statuses = [r['status'] for r in e['reports']]
        e['status'] = 'FAIL' if 'FAIL' in statuses else 'INCOMPLETE' if blocked or missing or 'INCOMPLETE' in statuses else 'PASS'
        e['all_applicable_checks_executed'] = not missing and all(r['execution_status'] == 'completed' for r in e['reports'])
    except (VerificationError, OSError, ValueError, KeyError, TypeError, AttributeError, subprocess.TimeoutExpired) as error:
        e['errors'].append(str(error))
    observed = {r['id'] for r in e['reports']}
    e['reports'].extend({'id': identifier, 'status': 'INCOMPLETE', 'execution_status': 'not_executed',
                         'command': definitions.get(identifier, {}).get('command'),
                         'cwd': definitions.get(identifier, {}).get('cwd'), 'exit_code': None,
                         'errors': ['Preconditions not verified; command was not executed']}
                        for identifier in selected if identifier not in observed)
    return {'verification_evidence': e}


def main():
    parser = argparse.ArgumentParser(description='Controlled project verification runner')
    operations = parser.add_subparsers(dest='operation', required=True)
    for operation in ('discover', 'run'):
        sub = operations.add_parser(operation)
        sub.add_argument('--repo-root', default=None)
        sub.add_argument('--registry-json', default=None)
        if operation == 'run':
            sub.add_argument('--issue', type=int, required=True)
            sub.add_argument('--workflow-id', required=True)
            sub.add_argument('--phase', type=int, choices=(7, 8), default=7)
            sub.add_argument('--checks', nargs='+', required=True)
            sub.add_argument('--selection-json', required=True)
            sub.add_argument('--diagnostics-review-json', default=None)
            sub.add_argument('--log-dir', default=None)
    args = parser.parse_args()
    if args.operation == 'discover':
        result = discover(args.repo_root, args.registry_json)
    else:
        if args.issue < 1:
            parser.error('--issue must be positive')
        result = run_checks(args.issue, args.workflow_id, args.checks, args.selection_json,
                            args.repo_root, args.registry_json, args.log_dir, args.phase,
                            args.diagnostics_review_json)
    print(json.dumps(result, ensure_ascii=True, indent=2))
    return 0 if next(iter(result.values()))['status'] == 'PASS' else 1


if __name__ == '__main__':
    sys.exit(main())
