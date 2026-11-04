"""SDD CLI tests: every filesystem/Git mutation is confined to temporary repos."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'sdd_manager.py'
if not SCRIPT.exists():
    SCRIPT = Path(__file__).with_name('sdd_manager.py')
SPEC = '''# Specification
## Objetivo
Implementar el comportamiento aprobado por la Issue.
## Alcance
Cambiar el caso de uso identificado.
## Comportamiento esperado
El usuario obtiene el resultado descrito.
## Criterios de aceptación
- [ ] El resultado cumple el comportamiento solicitado.
'''
PLAN = '# Plan\n## Enfoque\nModificar el componente existente y verificar el caso de uso.\n'
TASKS = '# Tareas\n- [ ] T1: Implementar el caso de uso y comprobar su resultado\n'


class SDDManagerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name).resolve() / 'repo'
        self.repo.mkdir()
        self.git('init', '-b', 'feat/075-example')
        self.git('config', 'user.name', 'Test')
        self.git('config', 'user.email', 'test@example.invalid')
        (self.repo / 'opencode.json').write_text('protected')
        self.git('add', 'opencode.json')
        self.git('commit', '-m', 'Initial')
        self.evidence = Path(self.tmp.name) / 'inspection.json'

    def git(self, *args):
        return subprocess.run(['git', *args], cwd=self.repo, capture_output=True, check=True,
                              env={**os.environ, 'GIT_OPTIONAL_LOCKS': '0'}).stdout

    def snapshot(self):
        return {str(p.relative_to(self.repo)): ('symlink', os.readlink(p)) if p.is_symlink() else p.read_bytes()
                for p in self.repo.rglob('*') if p.is_file() or p.is_symlink()}

    def call(self, operation, *args, cwd=None):
        before = self.snapshot()
        process = subprocess.run([sys.executable, str(SCRIPT), operation, '--issue', '75', *args],
                                  cwd=cwd or self.repo, capture_output=True, text=True)
        data = json.loads(process.stdout)
        e = next(iter(data.values()))
        self.assertEqual(process.returncode, 0 if e['status'] == 'PASS' else 1)
        after = self.snapshot()
        if operation != 'prepare':
            self.assertEqual(before, after, 'Read-only operation wrote repository bytes')
        else:
            for path, content in before.items():
                self.assertEqual(after.get(path), content, 'prepare changed existing work: ' + path)
        return e

    def folder(self, name='075-feature', spec=SPEC, plan=PLAN, tasks=TASKS):
        folder = self.repo / 'specs' / name
        folder.mkdir(parents=True)
        for filename, text in [('spec.md', spec), ('plan.md', plan), ('tasks.md', tasks)]:
            if text is not None:
                (folder / filename).write_text(text)
        return folder

    def inspect(self):
        e = self.call('inspect')
        self.evidence.write_text(json.dumps({'sdd_inspection_evidence': e}))
        return e

    def prepare(self, *args):
        return self.call('prepare', '--evidence-json', str(self.evidence), *args)

    def test_inspection_of_missing_sdd_is_complete_and_read_only(self):
        e = self.inspect()
        self.assertEqual(e['status'], 'PASS')
        self.assertEqual(e['sdd_state'], 'missing')
        self.assertFalse((self.repo / 'specs').exists())

    def test_valid_structure_preserves_pending_tasks(self):
        folder = self.folder()
        e = self.call('validate')
        self.assertEqual(e['status'], 'PASS', e)
        tasks = e['snapshot']['directories'][0]['files']['tasks.md']['tasks']
        self.assertEqual(tasks[0]['status'], 'pending')
        self.assertEqual((folder / 'tasks.md').read_text(), TASKS)
        self.assertIn('required', e['semantic_validation'])

    def test_inspect_records_full_content_and_hashes(self):
        self.folder()
        e = self.inspect()
        spec = e['snapshot']['directories'][0]['files']['spec.md']
        self.assertEqual(spec['raw'], SPEC)
        self.assertEqual(spec['sha256'], hashlib.sha256(SPEC.encode()).hexdigest())

    def test_duplicate_issue_folders_block(self):
        self.folder()
        self.folder('75-another')
        self.assertEqual(self.inspect()['status'], 'BLOCK')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_invalid_two_digit_number_is_not_ignored(self):
        self.folder('75-feature')
        self.assertEqual(self.inspect()['status'], 'BLOCK')

    def test_invalid_extra_zero_number_is_not_ignored(self):
        self.folder('0075-feature')
        self.assertEqual(self.inspect()['status'], 'BLOCK')

    def test_invalid_uppercase_slug_blocks(self):
        self.folder('075-Feature')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_empty_slug_blocks(self):
        self.folder('075-')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_other_issue_is_not_a_duplicate(self):
        self.folder()
        self.folder('175-other')
        self.assertEqual(self.call('validate')['status'], 'PASS')

    def test_missing_required_file_blocks_validation_only(self):
        self.folder(tasks=None)
        self.assertEqual(self.inspect()['status'], 'PASS')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_empty_content_blocks(self):
        self.folder(plan=' \n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_heading_only_spec_blocks(self):
        self.folder(spec='# Spec\n## Objetivo\n## Alcance\n## Comportamiento esperado\n## Criterios de aceptación\n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_placeholder_only_content_blocks(self):
        self.folder(plan='# Plan\nTODO\n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_comments_and_code_are_not_tasks(self):
        self.folder(tasks='<!-- - [x] Hidden task -->\n```md\n- [x] Example task\n```\n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_numbered_and_nested_sections_are_supported(self):
        self.folder(spec=SPEC.replace('## Objetivo', '## 1. Objetivo\n### Detalle'),
                    tasks='1. [X] T1: Verificar el resultado\n')
        self.assertEqual(self.call('validate', '--require-completed')['status'], 'PASS')

    def test_require_completed_rejects_pending_tasks(self):
        self.folder()
        self.assertEqual(self.call('validate', '--require-completed')['status'], 'BLOCK')

    def test_invalid_task_marker_blocks(self):
        self.folder(tasks='- [?] Unknown state\n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_invalid_utf8_is_reported(self):
        folder = self.folder()
        (folder / 'plan.md').write_bytes(b'\xff')
        self.assertEqual(self.inspect()['status'], 'BLOCK')

    def test_specs_symlink_is_not_followed(self):
        outside = Path(self.tmp.name) / 'outside'
        outside.mkdir()
        (self.repo / 'specs').symlink_to(outside, target_is_directory=True)
        self.assertEqual(self.inspect()['status'], 'BLOCK')
        self.assertEqual(list(outside.iterdir()), [])

    def test_required_symlink_blocks(self):
        folder = self.folder(plan=None)
        (folder / 'plan.md').symlink_to(self.repo / 'opencode.json')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_prepare_creates_empty_structure_without_inventing_content(self):
        self.inspect()
        e = self.prepare('--slug', 'approved-feature')
        self.assertEqual(e['status'], 'PASS', e)
        folder = self.repo / 'specs/075-approved-feature'
        self.assertEqual({p.name for p in folder.iterdir()}, {'spec.md', 'plan.md', 'tasks.md'})
        self.assertTrue(all(p.read_bytes() == b'' for p in folder.iterdir()))
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_prepare_only_creates_missing_files(self):
        folder = self.folder(plan=None, tasks=None)
        self.inspect()
        e = self.prepare()
        self.assertEqual(e['status'], 'PASS', e)
        self.assertEqual((folder / 'spec.md').read_text(), SPEC)
        self.assertEqual(len(e['created_paths']), 2)

    def test_prepare_reuses_complete_sdd_without_changes(self):
        self.folder()
        self.inspect()
        before = self.snapshot()
        self.assertEqual(self.prepare()['status'], 'PASS')
        self.assertEqual(before, self.snapshot())

    def test_prepare_preserves_extra_files(self):
        folder = self.folder()
        (folder / 'notes.bin').write_bytes(b'\x00\xffwork')
        self.inspect()
        self.assertEqual(self.prepare()['status'], 'PASS')
        self.assertEqual((folder / 'notes.bin').read_bytes(), b'\x00\xffwork')

    def test_prepare_rejects_stale_content(self):
        folder = self.folder()
        self.inspect()
        (folder / 'spec.md').write_text('Changed after observation')
        self.assertEqual(self.prepare()['status'], 'BLOCK')

    def test_prepare_rejects_new_duplicate(self):
        self.folder()
        self.inspect()
        self.folder('075-another')
        self.assertEqual(self.prepare()['status'], 'BLOCK')

    def test_prepare_requires_explicit_slug_for_new_folder(self):
        self.inspect()
        self.assertEqual(self.prepare()['status'], 'BLOCK')
        self.assertFalse((self.repo / 'specs').exists())

    def test_prepare_rejects_different_existing_slug(self):
        self.folder()
        self.inspect()
        self.assertEqual(self.prepare('--slug', 'different')['status'], 'BLOCK')

    def test_prepare_rejects_invalid_slug(self):
        self.inspect()
        self.assertEqual(self.prepare('--slug', '../outside')['status'], 'BLOCK')

    def test_prepare_does_not_rename_invalid_folder(self):
        folder = self.folder('75-feature')
        self.inspect()
        self.assertEqual(self.prepare('--slug', 'feature')['status'], 'BLOCK')
        self.assertTrue(folder.exists())

    def test_existing_external_lock_is_preserved(self):
        self.inspect()
        identity = hashlib.sha256((str(self.repo) + ':75').encode()).hexdigest()
        lock = Path(tempfile.gettempdir()) / ('sdd-manager-' + identity + '.lock')
        lock.write_text('another process')
        self.addCleanup(lambda: lock.unlink(missing_ok=True))
        self.assertEqual(self.prepare('--slug', 'feature')['status'], 'BLOCK')
        self.assertEqual(lock.read_text(), 'another process')

    def test_inspect_from_subdirectory_uses_repository_root(self):
        folder = self.folder()
        e = self.call('inspect', cwd=folder)
        self.assertEqual(e['repository'], str(self.repo))
        self.assertEqual(e['status'], 'PASS')

    def test_issue_over_three_digits_is_rejected(self):
        process = subprocess.run([sys.executable, str(SCRIPT), 'inspect', '--issue', '1000'],
                                  cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(process.returncode, 2)

    def test_file_named_like_sdd_directory_blocks(self):
        (self.repo / 'specs').mkdir()
        (self.repo / 'specs/075-feature').write_text('existing file')
        self.assertEqual(self.inspect()['status'], 'BLOCK')

    def test_null_bytes_are_not_valid_required_text(self):
        folder = self.folder()
        (folder / 'plan.md').write_bytes(b'plan\x00binary')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_unreadable_subdirectory_is_not_silently_omitted(self):
        folder = self.folder()
        private = folder / 'private'
        private.mkdir()
        (private / 'work.txt').write_text('preserve')
        private.chmod(0)
        self.addCleanup(lambda: private.chmod(0o700))
        e = self.inspect()
        self.assertEqual(e['status'], 'BLOCK')
        self.assertEqual(e['collection_status'], 'incomplete')

    def test_empty_task_text_blocks(self):
        self.folder(tasks='- [x] \n')
        self.assertEqual(self.call('validate')['status'], 'BLOCK')

    def test_dry_read_does_not_repair_invalid_names(self):
        folder = self.folder('075_bad-slug')
        self.assertEqual(self.call('inspect')['status'], 'BLOCK')
        self.assertTrue(folder.exists())

    def test_prepare_rejects_base_branch(self):
        self.git('checkout', '-b', 'main')
        self.inspect()
        self.assertEqual(self.prepare('--slug', 'feature')['status'], 'BLOCK')
        self.assertFalse((self.repo / 'specs').exists())

    def test_prepare_rejects_branch_change_after_inspection(self):
        self.inspect()
        self.git('checkout', '-b', 'feat/075-other')
        self.assertEqual(self.prepare('--slug', 'feature')['status'], 'BLOCK')
        self.assertFalse((self.repo / 'specs').exists())
