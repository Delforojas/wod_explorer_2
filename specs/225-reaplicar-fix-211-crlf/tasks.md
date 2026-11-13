# Tasks - Issue #225

## 1. Verificación previa

- [x] 1.1 Confirmar que `verification_runner.py` y
  `verification_runner_contract.md` no cambiaron en `main` desde la base de
  `fc45d8c` (`git merge-base fix/211-normalizar-huellas-git main` = `eb5cdc3`,
  sin commits posteriores sobre esos archivos).
- [x] 1.2 Identificar la divergencia real en `test_workflow_audit.py`: las
  pruebas de `ActionAudit` añadidas por #220 no existían en la base de
  `fc45d8c`.

## 2. Reaplicación del arreglo

- [x] 2.1 Reaplicar en `verification_runner.py` el cálculo de `git_blob_oid`
  en `fingerprint`, el `object_id` en `_tree_files` y la comparación canónica
  en `project_final` (incluido el `BLOCK` explícito cuando falta evidencia
  canónica).
- [x] 2.2 Reaplicar en `verification_runner_contract.md` la documentación del
  criterio `git_blob_oid` y sus límites.
- [x] 2.3 Fusionar `test_workflow_audit.py`: conservar las pruebas e imports
  de `ActionAudit`/#220 y añadir los auxiliares y las pruebas nuevas de
  `fc45d8c` (CRLF sin cambio semántico, LF modificado legítimamente,
  alteración semántica bloqueada, evidencia canónica ausente bloqueada).

## 3. SDD

- [x] 3.1 Crear `specs/225-reaplicar-fix-211-crlf/spec.md`, `plan.md` y
  `tasks.md` propios, citando a #211 y `fc45d8c` como origen.
- [x] 3.2 Confirmar que no se añade `specs/211-normalizar-huellas-git/`.

## 4. Verificación

- [x] 4.1 Ejecutado `./.venv/bin/python -m unittest discover -s
  scripts/harness/tests -p "test_*.py"`: `Ran 340 tests in 216.308s`, `OK`.
- [x] 4.2 Ejecutado `git diff --check`: sin salida, PASS.
