# Plan - Issue #225

## Enfoque técnico

1. Verificar que `scripts/harness/verification_runner.py` y
   `scripts/harness/verification_runner_contract.md` no cambiaron en `main`
   desde la base del commit `fc45d8c` (base real: `eb5cdc3`, confirmado por
   `git merge-base`). Al no haber divergencia, reaplicar en esos dos archivos
   el mismo parche de `fc45d8c` tal cual, sin adaptación.
2. En `scripts/harness/tests/test_workflow_audit.py` sí existe divergencia:
   la Issue #220 añadió `test_controller_owned_audit_starts_with_a_continuous_valid_log`
   y `test_remote_reference_check_blocks_when_the_observation_changes` (con el
   import de `ActionAudit` y `mock`) después de la base de `fc45d8c`. Fusionar
   manualmente: conservar esas pruebas e importaciones de #220 y añadir, sin
   eliminarlas, los métodos auxiliares (`project_final`, `new_repo`) y las
   pruebas nuevas de `fc45d8c` (CRLF, LF, alteración semántica, evidencia
   canónica ausente), adaptando `test_final_projection_binds_runner_manifest_to_committed_tree`
   a los mismos auxiliares.
3. Crear el SDD propio en `specs/225-reaplicar-fix-211-crlf/`, citando a #211 y
   `fc45d8c` como origen, sin copiar `specs/211-normalizar-huellas-git/`.
4. Ejecutar la suite completa del harness con el intérprete configurado en
   `opencode.json` y revisar que no haya regresiones en las pruebas de #220 ni
   en el resto de la suite.

## Componentes afectados

- `scripts/harness/verification_runner.py`
- `scripts/harness/verification_runner_contract.md`
- `scripts/harness/tests/test_workflow_audit.py`
- `specs/225-reaplicar-fix-211-crlf/` (nuevo)

## Verificación

- `./.venv/bin/python -m unittest discover -s scripts/harness/tests -p "test_*.py"`
  (suite completa del harness, incluye las pruebas de `ActionAudit` de #220 y
  las nuevas de `project_final`).
- `git diff --check` sobre los cambios de la Issue.
- Revisión manual de que `specs/211-normalizar-huellas-git/` no aparece en el
  commit.

## Límites

Esta corrección no toca `final_check_contract.md` ni resuelve límites de
auditoría GitHub de la fase 13 ajenos al criterio de huellas Git; eso quedó
fuera del alcance original de #211 y sigue fuera del alcance de #225.
