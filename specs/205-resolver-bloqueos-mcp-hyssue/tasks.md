# Tasks — Issue #205

## 1. Código

- [x] 1.1 Añadir `build_selection` a `scripts/harness/verification_runner.py`
      (entre `execute` y `run_checks`), con validación completa según
      `plan.md`.
- [x] 1.2 Registrar `'verification_runner.build_selection'` en
      `ALLOWED[7]` y `ALLOWED[8]` de `scripts/harness/workflow_controller.py`.

## 2. Pruebas

- [x] 2.1 Añadir casos de `build_selection` a
      `scripts/harness/tests/test_verification_runner.py`:
      construcción válida fase 7; construcción válida fase 8 con
      `rerun_reason`; catálogo no `PASS`; `issue`/`workflow_id` inválidos;
      checks desconocidos/duplicados; fase 7 con subconjunto (falla); fase
      8 sin `rerun_reason`; `tasks_completed`/`applicability_complete` en
      `False`.
- [x] 2.2 Ejecutado. Desviación respecto al plan: `pytest` no está instalado
      en `./.venv` (solo `mcp`), así que se usó
      `./.venv/bin/python -m unittest discover -s scripts/harness/tests -p
      "test_*.py"`, el mismo intérprete declarado en `opencode.json` para el
      servidor `harness`. Resultado: `Ran 325 tests ... OK` (315 previos +
      10 nuevos, incluido `test_harness_mcp.py`).

## 3. Documentación de contrato

- [x] 3.1 Corregir `scripts/harness/sdd_manager_contract.md`
      (distinguir sub-orden CLI `validate` de la operación MCP
      `sdd_manager.inspect(validate=true)`).
- [x] 3.2 Añadir subsección "Productor de selección" a
      `scripts/harness/verification_runner_contract.md`.

## 4. `.opencode/commands/hyssue.md`

- [x] 4.1 §4.4: sustituir `sdd_manager.validate` por
      `sdd_manager.inspect` + `validate: true` en la vía MCP.
- [x] 4.2 Nueva sección general "Referencias de Evidencia en Memoria —
      Mandatorio" (§0.5.2, tras §0.5.1).
- [x] 4.3 §7: documentar `build_selection` y la convención de
      `registry_path`/`git diff --check` para Issues documentales.
- [x] 4.4 §8.1: aclarar que un fallo de *binding* de fase 7 no habilita
      `enter_repair`.
- [x] 4.5 §9.1: listar los cuatro argumentos reales de `review_changes`.
- [x] 4.6 §§10/11/13: referenciar la sección general en vez de repetirla.
- [x] 4.7 §13.5: enlazar el límite ya documentado en
      `docs/hyssue-audit-202.md` sobre ejecución semántica real 0–15
      (nota "Acknowledged Limit — Phases 12, 14 and 15").
- [x] 4.8 §0.2 (Session coordination): nota de precondición de entorno
      sobre el servidor MCP `harness` y el intérprete declarado en
      `opencode.json`.

## 5. Cierre

- [x] 5.1 `git diff --check` sobre los archivos modificados: sin hallazgos.
- [x] 5.2 Confirmado: `.opencode/commands/issue.md`, sus guardarails,
      código/specs de producto y `.claude/commands/` sin diff.
- [x] 5.3 Lista sincronizada con la implementación real antes de la
      revisión de cambios. Nota: `scripts/harness/tests/__pycache__/*.pyc`
      quedaron modificados en el árbol de trabajo al ejecutar los tests
      (bytecode pre-existente ya versionado en `main`, ajeno a esta Issue);
      se excluyen deliberadamente del staging/commit.
