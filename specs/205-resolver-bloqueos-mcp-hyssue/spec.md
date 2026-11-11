# Spec — Resolver bloqueos de integración MCP y evidencias en `/hyssue` (fases 4–15)

## Objetivo

Corregir las incompatibilidades reales entre `.opencode/commands/hyssue.md` y la
implementación real de `scripts/harness/` (fases 4–15) que bloquearon la
ejecución real de `/hyssue 204`, sin modificar `/issue`, sus guards, ni
funcionalidad de producto de WOD Explorer.

## Contexto verificado

La Issue #205 describe un conjunto de incompatibilidades observadas al
ejecutar `/hyssue 204` (bloqueado en fase 7) y, mediante inspección estática,
en fases 8–15. Una auditoría de código directa sobre `scripts/harness/`
(workflow_controller.py, evidence_manager.py, sdd_manager.py,
verification_runner.py, git_policy.py) confirma que:

1. Dos defectos son reales y reproducibles por invocación directa.
2. La "causa transversal" que la Issue atribuye al controlador (evidencias en
   memoria vs. scripts que exigen rutas JSON) **ya tiene solución en el
   código**: `evidence_manager.read_json()` acepta un dict inline, una
   referencia `{"evidence_ref": ...}` resuelta contra la sesión activa
   (`ContextVar ACTIVE`), o — como compatibilidad heredada — una ruta de
   archivo. Ningún `*_path` de `git_policy.py`/`verification_runner.py`
   exige un archivo JSON en disco. Lo que falta es que `hyssue.md` documente
   este mecanismo fase por fase; su ausencia es lo que llevó a la sesión
   bloqueada a intentar operaciones inexistentes o incompletas.
3. Un productor oficial de `selection_path` (fase 7), solicitado
   explícitamente por la Issue, no existe todavía como código.

## Alcance

### Dentro de alcance

- `.opencode/commands/hyssue.md`: documentar correcciones de contrato fase
  por fase (4, 7, 8, 9, 10/11/13) y una sección general sobre referencias de
  evidencia en memoria.
- `scripts/harness/sdd_manager_contract.md`: corregir la descripción de las
  operaciones MCP disponibles en fase 4.
- `scripts/harness/verification_runner.py` y
  `scripts/harness/verification_runner_contract.md`: añadir `build_selection`,
  el productor oficial de `selection_path` que exige la Issue, y documentarlo.
- `scripts/harness/workflow_controller.py`: registrar `build_selection` en
  `ALLOWED` para fases 7 y 8.
- Pruebas nuevas para `build_selection` en
  `scripts/harness/tests/test_verification_runner.py`.
- Documentar explícitamente, en `hyssue.md`, los límites de fases 12/14/15 ya
  reconocidos en `docs/hyssue-audit-202.md` (no se puede fabricar evidencia de
  publicación GitHub real ni auditoría externa completa de ausencia de push).

### Fuera de alcance

- `.opencode/commands/issue.md` y sus guardarails (la Issue lo exige
  explícitamente intacto).
- Cualquier funcionalidad de dominio/producto de WOD Explorer
  (frontend/backend/Docker).
- Issues relacionadas abiertas no cubiertas por la tabla de fases de #205:
  #191 (ya implementada, no se debilita), #192 (entorno Python por worktree,
  no mencionado en la tabla de #205), #200 (invalidación de `context` en
  `prepare_branch`, fase 3, fuera de la tabla de #205).
- Una ejecución semántica real end-to-end de las 15 fases contra GitHub real:
  no hay productor de recibo de publicación/lectura GitHub verificable ni
  auditoría externa completa de acciones disponible en este entorno; se
  documenta como límite pendiente, no se simula ni se declara PASS.
- Sincronizar el directorio `.claude/commands/` (mirror local no versionado
  de `.opencode/commands/`, hallado como preexistente y sin relación
  documentada con esta Issue); no se modifica.

## Comportamiento esperado por fase

### Fase 4 — SDD

**Defecto confirmado por código:** `workflow_controller.ALLOWED[4]` solo
permite `sdd_manager.inspect` y `sdd_manager.prepare`; no existe
`sdd_manager.validate` como función de módulo ni como operación MCP
permitida. `hyssue.md` §4.4 instruye literalmente a invocar
`sdd_manager.py validate`, lo que una sesión MCP bloquea con
"Operation is not allowed in the active phase" o, si se fuerza, con
`AttributeError`.

**Comportamiento esperado:** `hyssue.md` debe instruir, para la vía MCP,
invocar `sdd_manager.inspect` con `arguments.validate: true` (y
`arguments.require_completed` cuando aplique), documentando la equivalencia
exacta con la sugar CLI `sdd_manager.py validate`. `sdd_manager_contract.md`
debe aclarar que `validate` es una sub-orden exclusiva del CLI, no una
operación MCP independiente.

### Fase 7 — Verificación

**Defecto confirmado por código:** no existe una función que construya el
objeto `selection_path` exigido por `verification_runner.run_checks`
(`status`, `issue`, `workflow_id`, `repository`, `phase`, `checks`,
`applicable_checks`, `catalog_sha256`, `source_fingerprint`,
`tasks_completed`, `applicability_complete`, `rerun_reason` en fase 8). La IA
debe ensamblarlo a mano a partir de la salida de `discover`, con riesgo real
de error (p. ej. confundir `source_fingerprint` completo con su campo
`sha256`).

**Comportamiento esperado:**
- Nueva operación `verification_runner.build_selection`, invocable vía
  `harness_call` en fases 7 y 8, que construye y valida el objeto de
  selección a partir del resultado de `discover` y de las decisiones
  explícitas de aplicabilidad/completitud de tareas de la IA. Nunca inventa
  aplicabilidad ni completitud: ambas deben llegar como argumentos explícitos
  en `true`.
- `hyssue.md` documenta esta operación como el productor oficial exigido por
  la Issue, y aclara que `git diff --check` ya es un check de catálogo
  soportado vía `registry_path` (objeto `{"checks": [...]}` inline); para una
  Issue puramente documental, `sources` debe listar los archivos reales de
  la SDD activa (`spec.md`, `plan.md`, `tasks.md`).

### Fase 8 — Reparación

**Aclaración documental (sin cambio de código):** un error de *binding* de
argumentos al invocar una operación de fase 7 (antes de que `run_checks`
registre `verification_evidence`) es un bloqueo de fase 7 que debe
corregirse y reintentarse; nunca es una entrada válida a `enter_repair`, que
exige una `verification_evidence` real con estado `FAIL`/`INCOMPLETE`.
`hyssue.md` debe decirlo explícitamente para que la IA no intente abrir
reparación sin evidencia.

### Fase 9 — Revisión de cambios

**Defecto confirmado por código:** `git_policy.review_changes` exige
`spec_path`, `plan_path`, `tasks_path` (rutas reales relativas al
repositorio) y acepta opcionalmente `baseline_path`. `hyssue.md` §9.1 no
menciona ninguno de los cuatro.

**Comportamiento esperado:** `hyssue.md` debe listar los cuatro argumentos
exactos: `spec_path`/`plan_path`/`tasks_path` como las rutas reales conocidas
desde la carpeta SDD aprobada en fase 4 (`specs/<carpeta>/spec.md`, etc.);
`baseline_path` como `{"evidence_ref": <referencia a branch_evidence de fase
3>}`, reutilizando la observación en memoria sin crear ningún archivo.

### Fase 9 — Adopción de cambios preexistentes

Sin cambio: `propose_preexisting_adoption`/`validate_preexisting_adoption`
ya existen, exigen correctamente un `authorization_path` externo verificable
y `hyssue.md` §9.2 ya lo documenta de forma compatible con #191. Se mantiene
como riesgo condicionado real (depende de un verificador de procedencia
externo que no existe en este entorno), no como defecto a corregir.

### Fases 10, 11, 13 — Staging, commit, post-commit, final

**Patrón confirmado por código:** todas las operaciones
(`prepare_staging`, `pre_commit_check`, `create_commit`, `check_commit`,
`post_check_commit`, `final_check`) aceptan cada argumento `*_path` como dict
inline, `{"evidence_ref": ...}` o ruta de archivo legada, vía el mismo
`evidence_manager.read_json`. No falta código; falta que `hyssue.md`
documente el mecanismo una sola vez de forma general y lo referencie en cada
fase, en vez de dejar que la IA asuma que necesita archivos JSON manuales.

### Fases 12, 14, 15

Sin cambio de código. `hyssue.md` ya documenta correctamente que estas fases
dependen de evidencia real de GitHub/aprobación manual del usuario. Se añade
una referencia explícita al límite ya documentado en
`docs/hyssue-audit-202.md`: una ejecución semántica real de 0–15 requiere
recibos de GitHub y auditoría externa que el controlador no puede fabricar;
esta Issue no declara ese límite resuelto.

## Criterios de aceptación

- [ ] `hyssue.md` ya no referencia `sdd_manager.validate` como operación MCP;
      usa `sdd_manager.inspect` con `validate`/`require_completed`.
- [ ] `sdd_manager_contract.md` distingue explícitamente sub-orden CLI vs.
      operación MCP para `validate`.
- [ ] `verification_runner.build_selection` existe, está registrado en
      `ALLOWED[7]` y `ALLOWED[8]`, y pruebas unitarias cubren: construcción
      válida en fase 7 y 8, catálogo incompleto, issue/workflow_id
      inconsistentes, checks desconocidos o duplicados, fase 7 con
      selección parcial (debe fallar), fase 8 sin `rerun_reason`,
      `tasks_completed`/`applicability_complete` en `false`.
- [ ] `hyssue.md` documenta `build_selection` y la convención de
      `registry_path` para `git diff --check` en Issues documentales.
- [ ] `hyssue.md` aclara que un fallo de *binding* en fase 7 no habilita
      `enter_repair`.
- [ ] `hyssue.md` §9.1 enumera los cuatro argumentos reales de
      `review_changes`.
- [ ] `hyssue.md` incluye una sección general sobre referencias de evidencia
      en memoria (`evidence_ref`/dict inline) aplicable a fases 9–13,
      sustituyendo la suposición de archivos JSON manuales.
- [ ] La suite existente de `scripts/harness/tests/` sigue en PASS (315+
      pruebas) tras los cambios; se ejecuta con el intérprete del `.venv`
      declarado en `opencode.json`.
- [ ] No se modifica `.opencode/commands/issue.md` ni sus guardarails.
- [ ] No se modifica código ni specs de producto de WOD Explorer.
- [ ] No se declara una ejecución semántica real de 0–15 contra GitHub como
      completada; se documenta explícitamente como límite pendiente.

## Restricciones

- No se añaden dependencias, servicios ni capas nuevas.
- No se debilita ningún guard existente (Issue, Context, Branch, SDD,
  Planning, Implementation, Verification, Repair, Change Review, Commit,
  Post-Commit, GitHub Documentation, Final Workflow, Manual Validation,
  Workflow Handoff).
- No se falsifica evidencia, aprobación ni procedencia.
- `.pyc`, `__pycache__/`, `audit/` y archivos ajenos no entran al commit.
