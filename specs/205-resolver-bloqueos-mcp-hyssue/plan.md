# Plan — Issue #205

## Enfoque técnico

El fix es predominantemente documental (corregir `hyssue.md` para que
describa el contrato real de `scripts/harness/`), más una adición de código
mínima y acotada (`verification_runner.build_selection`) que la Issue pide
explícitamente como "productor oficial" de `selection_path`. No se introduce
ninguna capa, módulo o abstracción nueva más allá de esa función.

## Componentes afectados

1. `scripts/harness/verification_runner.py`
   - Nueva función `build_selection(catalog_evidence, *, issue, workflow_id,
     phase, selected, applicable_checks, tasks_completed,
     applicability_complete, rerun_reason=None)`.
   - No decorada con `@managed_operation` (como `discover`): es una
     construcción pura de solo lectura, sin registrar evidencia mutable
     (`selection_approval` no pertenece a `OBSERVATION_TOPICS`).
   - Valida: catálogo observado en estado `PASS`; `issue`/`workflow_id`
     bien formados; `selected`/`applicable_checks` no vacíos, sin
     duplicados, subconjunto de los IDs del catálogo; en fase 7 exige que
     `selected` cubra exactamente `applicable_checks` (por conjunto, no por
     orden — el objeto resultante fija `applicable_checks = list(selected)`
     para garantizar la igualdad posicional exacta que exige `run_checks`);
     en fase 8 exige `rerun_reason` no vacío; `tasks_completed` y
     `applicability_complete` deben llegar como `True` explícito, nunca se
     infieren.
   - Extrae `catalog_sha256` y `source_fingerprint.sha256` directamente del
     resultado de `discover` (mismo patrón ya usado por
     `tests/test_verification_runner.py::approve`), evitando que la IA
     construya ese hash a mano.
   - Devuelve `{"selection_approval": {"status": "PASS", "source": ...,
     "observed_at": ..., "selection": <objeto exacto para selection_path>}}`,
     siguiendo la misma convención de envoltura que `discover`/`run_checks`
     (campo `status` de nivel superior consumido por
     `WorkflowController.invoke`).
   - Entradas inválidas lanzan `VerificationError`, capturado por
     `invoke()` como bloqueo con el motivo exacto (mismo comportamiento que
     el resto del módulo).

2. `scripts/harness/workflow_controller.py`
   - Añadir `'verification_runner.build_selection'` a
     `ALLOWED[7]` y `ALLOWED[8]`.

3. `scripts/harness/verification_runner_contract.md`
   - Nueva subsección "Productor de selección" documentando
     `build_selection`, sus argumentos y su salida, y la convención de
     `registry_path` para `git diff --check` en Issues documentales
     (usar los archivos reales de la SDD activa como `sources`).

4. `scripts/harness/sdd_manager_contract.md`
   - Reescribir la línea 3 y la sección "Validación de solo lectura" para
     distinguir: `validate` es una sub-orden exclusiva del CLI
     (`sdd_manager.py validate`), que internamente llama a
     `inspect(issue, repo_root, validate=True, require_completed=...)`; no
     existe una función de módulo `validate` ni una operación MCP
     `sdd_manager.validate`. La vía MCP usa siempre
     `sdd_manager.inspect` con `arguments.validate`/`arguments.require_completed`.

5. `.opencode/commands/hyssue.md`
   - §4.4: sustituir la instrucción de invocar `sdd_manager.validate` por
     `sdd_manager.inspect` con `validate: true` vía `harness_call`,
     conservando el ejemplo CLI como referencia local equivalente.
   - §7 (nueva subsección antes de "Migration Compatibility"): documentar
     `verification_runner.build_selection` como paso obligatorio previo a
     `run_checks`; documentar la convención de `registry_path` para checks
     documentales (`git diff --check`, `sources` = archivos reales de la
     SDD activa).
   - §8.1: nota explícita de que un error de *binding* de argumentos en
     fase 7 es un bloqueo de fase 7 a corregir y reintentar, nunca una
     entrada válida a `enter_repair`.
   - §9.1: listar los cuatro argumentos reales de `review_changes`
     (`spec_path`, `plan_path`, `tasks_path` como rutas reales de la SDD
     aprobada; `baseline_path` opcional como `evidence_ref` a
     `branch_evidence` de fase 3).
   - Nueva sección general (tras §0.5.1, antes de §0.6) "Referencias de
     Evidencia en Memoria — Mandatorio": documenta una sola vez que todo
     argumento `*_path` de `git_policy.py`/`verification_runner.py` acepta
     un dict inline o `{"evidence_ref": ..., "historical"?, "unwrap"?}`
     resuelto contra la sesión activa, vía `evidence_manager.read_json`;
     nunca requiere un archivo JSON intermedio en disco; las rutas SDD de
     `review_changes` (`spec_path`/`plan_path`/`tasks_path`) son la
     excepción explícita — son rutas reales de archivo, no referencias de
     evidencia, porque los documentos SDD son entregables reales, no
     evidencia de sesión.
   - §§10/11/13: añadir una referencia corta a la nueva sección general en
     vez de repetir la explicación.
   - §§12/14/15: añadir una nota explícita enlazando el límite ya
     reconocido en `docs/hyssue-audit-202.md` sobre ejecución semántica
     real 0–15 pendiente de recibos GitHub/auditoría externa.
   - Nota de entorno (hallazgo de la auditoría, no listado originalmente en
     la Issue): el servidor MCP `harness` depende del intérprete declarado
     en `opencode.json` (con el paquete `mcp` instalado en `.venv`); si el
     host de agente activo no tiene un servidor MCP equivalente configurado
     para `harness`, la fase 0 debe bloquear explícitamente por esa causa
     de entorno, nunca degradar a invención de evidencia.

6. `scripts/harness/tests/test_verification_runner.py`
   - Nuevos casos para `build_selection`: construcción válida fase 7,
     construcción válida fase 8 con `rerun_reason`, catálogo no `PASS`,
     `issue`/`workflow_id` invalidos, checks desconocidos, duplicados,
     fase 7 con subconjunto (debe fallar), fase 8 sin `rerun_reason`,
     `tasks_completed`/`applicability_complete` en `False`.

## No incluido

- No se crea ningún archivo de contrato nuevo para `git_policy.py` (no lo
  pide la Issue; el contrato vive en los docstrings y en `hyssue.md`).
- No se modifica `main()`/CLI de `verification_runner.py`: `build_selection`
  es, como `project_final`, una operación exclusivamente invocable vía
  `harness_call` (no tiene subcomando CLI), siguiendo el precedente ya
  existente en el mismo módulo.
- No se intenta una ejecución real de `/hyssue` 0–15 contra GitHub.
- No se toca `.claude/commands/` (mirror local no versionado, sin relación
  documentada con esta Issue).

## Verificación

- `python3 -m pytest scripts/harness/tests/ -q` con el intérprete de
  `./.venv` (el mismo que declara `opencode.json` para el servidor
  `harness`), para evitar el falso negativo de `test_harness_mcp.py` visto
  durante la auditoría (incompatibilidad binaria entre el `mcp` del venv y
  un intérprete de sistema distinto).
- Revisión manual de consistencia `hyssue.md` ↔ `ALLOWED`/firmas reales de
  `scripts/harness/*.py` (no hay verificación automática de ese contrato;
  se documenta como limitación, igual que hizo #202).
- `git diff --check` sobre los archivos modificados antes de cerrar la
  fase de verificación.
