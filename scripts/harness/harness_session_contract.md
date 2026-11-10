# Sesión de evidencias y controlador del workflow

Los módulos `evidence_manager.py` y `workflow_controller.py` implementan el
soporte de fase 0. No sustituyen los guardrails semánticos ni ejecutan Markdown.
Los módulos Git/SDD/verificación registran sus resultados mediante
`@managed_operation`, conservando las claves y objetos de evidencia originales.

## Estado en memoria

Una sesión está identificada por Issue, repositorio y `workflow_id`. El ID debe
ser único para la ejecución. Los registros guardan fuente, fase, estado, hora,
versión, hash, dependencias, rutas y condiciones de invalidación. El manager no
hace consultas Git/GitHub ni escribe archivos de evidencia. La sesión desaparece
al terminar su proceso si no existe un snapshot autorizado.

## Persistencia y reinicio

El MCP puede crear un snapshot explícito mediante `harness_snapshot`. Requiere
que el proceso reciba `HARNESS_SNAPSHOT_HMAC_KEY` desde una fuente protegida
externa al repositorio; debe contener al menos 32 bytes y nunca se escribe ni se
deriva automáticamente. El archivo se guarda en `.harness-snapshots/` bajo la
raíz del repositorio, con directorio `0700`, archivo `0600`, escritura temporal
seguida de reemplazo atómico y autenticación HMAC-SHA-256 del payload canónico.
Cada snapshot tiene un identificador hexadecimal único y la retención conserva
los cinco más recientes de esa sesión, sin eliminar snapshots de otras sesiones.

El snapshot contiene el estado completo del controlador y del ledger, pero se
rechaza si incluye campos sensibles conocidos (`secret`, `token`, `password`,
`authorization`, `cookie` o `credential`). No sustituye `export_static`, que
sigue siendo solo un resumen histórico.

Después de detener o reiniciar el proceso MCP, `harness_restore(issue,
workflow_id, snapshot_id)` puede restaurar solamente el snapshot explícitamente
seleccionado para esa identidad. La restauración requiere que no haya una sesión
activa y verifica esquema, HMAC, identidad, permisos, runtime y contexto Git
(HEAD, rama y manifiesto de estado), además de la estructura completa del
ledger, eventos, versiones, referencias de guard y su historia. Un snapshot
rechazado nunca instala ni altera una sesión. `SNAPSHOT_WRITTEN` forma parte del
estado persistido. Una restauración válida conserva el historial, añade un evento
`RESTORED`, invalida todas las observaciones mutables y elimina aprobaciones de
guards activas; las fases, gates y bloqueadores se deben revalidar oficialmente.

Al cargar el MCP se calcula un fingerprint de los módulos relevantes del harness.
`harness_status` expone el fingerprint cargado, el observado en disco y su
coincidencia. Cuando difieren, se bloquean las operaciones mutables, incluidas
las que generarían nueva evidencia; permanecen disponibles diagnóstico,
`snapshot()` y `export_static` para salida segura. Reiniciar el MCP con el código
vigente es necesario antes de continuar operaciones mutables.

- `static`: identidad/alcance aprobados, decisiones, dependencias, referencias de
  contexto/SDD, verificaciones históricas y commit/rango aceptados.
- `mutable`: observaciones actuales con su fuente y validez. Los datos no
  observados permanecen ausentes; no se inventan valores ni autorizaciones.

El `base_sha` canónico queda bloqueado para toda la sesión, incluso después de
invalidar una decisión. Puede completarse una política con campos observados
que faltaban; no puede contradecirse ni reemplazar el SHA histórico por HEAD o
por una referencia remota posterior. La fase 3 exige la política completa y el
SHA remoto inicial documentado; una proyección parcial no basta para avanzar.

`invalidate(event, source=..., paths=...)` marca únicamente registros dependientes
de los temas afectados. Las rutas estáticas permiten invalidación selectiva,
incluidos cambios de una carpeta padre. No borra evidencia ni cambia Git.

Eventos admitidos: `file-change`, `sdd-change`, `staging-change`, `branch-change`,
`history-change`, `remote-change`, `github-change`, `pr-change`, `scope-change`,
`instruction-change`, `dependency-change`.

Cada operación integrada notifica las mutaciones que pudo producir antes de
registrar su resultado. Los intentos de commit también invalidan observaciones:
un hook fallido puede haber cambiado el estado. Un cambio remoto no invalida
la proyección local independiente del working tree ni sustituye la base histórica.
Reenviar una observación invalidada no la hace válida: hace falta una nueva.

Las mutaciones realizadas fuera de estos módulos deben notificarse por el
workflow. El manager no es un monitor automático del sistema de archivos,
remotos ni conectores. Las referencias/hashes protegen integridad y versiones;
no autentican recibos externos ni detectan acciones que el workflow no comunica.

## Exportación autorizada

`session.export_static(authorized=True)` devuelve solo datos históricos estáticos
verificados y válidos, con `mutable_state_is_current: false`. Aplica una lista
permitida de tipos/campos y rechaza payloads mutables anidados. No escribe un
archivo. El caller decide dónde guardar ese resumen autorizado.

`pre_stage_evidence` y `post_commit_evidence` siempre permanecen como observaciones
de sesión. No se incluyen en la exportación. Una solicitud CLI de exportación
termina con una respuesta que contiene únicamente el resumen estático, nunca
un dump mutable acompañado que pueda confundirse con el archivo a guardar.

Después de aprobar los guardrails correspondientes, el controlador conserva
proyecciones históricas de referencias SDD, verificaciones y el rango aceptado.
La proyección del rango contiene commits/manifiestos, no pendientes, staging,
working tree ni el objeto post-commit completo. El resumen nunca sustituye una
nueva observación mutable en una frontera posterior.

## Integración Python

```python
from evidence_manager import EvidenceManager, using_evidence
import git_policy

session = EvidenceManager(75, "/ruta/canonica/al/repositorio", "issue-75-ejecucion-unica")
with using_evidence(session):
    result = git_policy.review_changes(75, "specs/075-feature/spec.md",
                                       "specs/075-feature/plan.md",
                                       "specs/075-feature/tasks.md")
reference = session.reference("pre_stage_evidence")
```

Los argumentos JSON pueden ser objetos/listas en memoria, además de las rutas
CLI existentes. Una referencia de sesión tiene esta forma:

```json
{"evidence_ref":{"key":"pre_stage_evidence","category":"mutable","version":1,"sha256":"<hash>","issue":75,"repository":"/ruta/canonica/al/repositorio","workflow_id":"<sesion>"}}
```

`read_json` la resuelve sin crear archivos. `unwrap: true` devuelve el objeto
interior (por ejemplo una política estática); por defecto conserva el envelope
con su clave. `historical: true` permite usar explícitamente una versión anterior
como baseline o autorización histórica, nunca como certificado del estado actual.
Las versiones sustituidas permanecen solo en memoria. Los guardrails y los gates
siguen exigiendo referencias actuales: este modo histórico no puede eludirlos.
Los mensajes de commit admiten `{"text":"mensaje aprobado (#75)\n"}`. La
integración prueba toda la secuencia controlada de commit sin archivos JSON de
evidencia intermedios; los únicos commits de prueba están en repositorios temporales.

La anotación `evidence_registration` se añade fuera del objeto de evidencia
original: no cambia los hashes de los contratos previos. No repite observaciones.
Las CLI individuales usan una sesión efímera si no hay una activa. Si una
operación no observó el repositorio, lo indica mediante
`repository_scope_observed: false`; esa sesión no puede exportarse. Para
coordinación entre fases se usa una única sesión explícita.

## Controlador: sesión interactiva sin archivos de estado

Desde la raíz del repositorio:

```sh
python3 scripts/harness/workflow_controller.py --serve
```

Entrada/salida JSON por líneas. La primera solicitud es:

```json
{"operation":"start","issue":75,"repository":"/ruta/canonica/al/repositorio","workflow_id":"issue-75-ejecucion-unica"}
```

Después:

```json
{"operation":"advance"}
{"operation":"snapshot"}
```

El primer `advance` consume las reglas de fase 0 y entra en fase 1. Las solicitudes
siguientes pueden depender de las referencias retornadas por respuestas previas.
No se reemplaza una sesión activa con otro `start`. EOF termina el proceso y
pierde el estado mutable; no se guardan snapshots de sesión para persistencia.
También existe API Python `WorkflowController` y un modo batch con
`{issue, repository, workflow_id, actions: [...]}` por stdin.

Operaciones del protocolo (argumentos dentro de `arguments`):

- `record_external(key, payload)`: recibos de Issue, implementación, reparación,
  documentación GitHub o plan manual, únicamente en su fase. Deben contener
  `source`, `phase`, `observed_at` con zona, `status`, Issue y scope coherentes.
  Los recibos GitHub deben normalizar el repositorio local en `repository`;
  la identidad remota se conserva dentro de sus datos, no se confunde con una ruta.
- `record_static(key, payload, kind, source, observed_at, ...)`: hechos estáticos explícitos.
  Tipos y campos permitidos se definen en `STATIC_FIELDS`. `observed_at` debe
  proceder de la fuente observada; no se sustituye por la hora de registro.
  No valida semántica.
- `decide_guard(name, status, source, references, reason)`: resultado real de
  aplicar un guardrail. `source` debe ser exactamente
  `.opencode/commands/guardarails/<name>.md`. Un `PASS` requiere referencias
  vigentes y verificadas; no puede anular un `FAIL` técnico. `repair` puede
  referenciar el fallo observado que justifica corregirlo.
- `invoke(operation, arguments)`: ejecuta una función local explícitamente
  seleccionada y permitida en la fase. Ejemplos: `git_policy.inspect`,
  `sdd_manager.inspect`, `verification_runner.run_checks`. Acepta nombres con
  guiones o guiones bajos. Se usan los argumentos documentados por cada módulo;
  sus aprobaciones/manifiestos siguen siendo obligatorios. Una transición no
  ejecuta por sí misma ninguna de estas funciones.
- `notify(event, source, paths)`: comunica una mutación observada para invalidar
  datos. `push`, `merge`, `close-issue`, `finish-issue`, `manual-approval` bloquean
  el workflow de desarrollo; el controlador nunca ejecuta esas acciones.
- `enter_repair()`: entra en fase 8 solo después de un fallo/incompletitud real y
  `Repair Guard` aprobado. No modifica código ni decide la reparación.
- `revisit_phase(target, reason)`: vuelve explícitamente a una fase anterior para
  revalidar; no salta fases futuras ni reescribe historia. Las aprobaciones desde
  esa fase se vuelven a exigir. Si ya existe un commit o su resultado es incierto,
  no permite volver a crear otro. Las fases posteriores al commit sí pueden
  revalidarse sin repetirlo.
- `recover(operation)`: elimina el bloqueo técnico de una operación de la fase
  activa solo después de que la misma operación se haya repetido oficialmente
  con evidencia vigente `PASS` o `complete`. Conserva ambas evidencias y añade
  un evento `RECOVERED`; no avanza de fase ni aprueba guardrails. Rechaza la
  recuperación cuando queda otro bloqueo activo, una decisión de guard no
  aprobada, una acción prohibida, un handoff cerrado o incertidumbre de commit.
- `advance()`: comprueba las evidencias y el guardrail obligatorios de la fase;
  consume referencias exactas y avanza solo si todo pasa. Una operación local
  fallida debe resolverse con evidencia nueva, no con un `PASS` manual.
- `export_static(authorized=True)`: devuelve solo el resumen histórico.
- `snapshot()`: muestra estado de sesión para el caller; no es una exportación
  persistente ni una certificación del estado real de Git/GitHub posterior.

## Fases y fronteras

| Fase | Gate obligatorio |
|---|---|
| 1 | Issue observado + Issue Guard |
| 2 | Contexto observado + Context Guard |
| 3 | Política histórica completa + check-branch + Branch Guard |
| 4 | Validación SDD + SDD Guard |
| 5 | SDD vigente + Planning Guard |
| 6 | Implementación completa + todas las tareas sin anotación (fase 6) completadas + Implementation Guard |
| 7 | SDD revalidado, verificaciones completas y todas las tareas `[phase:7]` completadas + Verification Guard |
| 8 | Repair Guard previo, reparación, SDD revalidado, verificaciones y todas las tareas obligatorias completadas + Verification Guard |
| 9 | Única pre_stage_evidence + verificaciones vigentes + Change Review Guard |
| 10 | prepare-staging → pre-commit-check → create-commit → check-commit + Commit Guard |
| 11 | Única post_commit_evidence + Post-Commit Guard |
| 12 | Recibo de documentación GitHub + GitHub Documentation Guard |
| 13 | final-check + verificaciones vigentes + Final Workflow Guard |
| 14 | Plan de validación manual pendiente + Manual Validation Guard |
| 15 | Evidencias finales vigentes + Workflow Handoff Guard |

La fase 8 es condicional: sin fallos se registra `NOT_APPLICABLE`, nunca un
`PASS` ficticio de reparación. Las fases consumidas quedan como historia, no se
presentan como observaciones actuales. Un guardrail posterior exige nuevamente
las referencias que necesita y bloquea si han cambiado.

Las tareas sin anotación pertenecen a fase 6. La única anotación admitida es
`[phase:7]`; anotaciones desconocidas, repetidas o mal formadas bloquean la
validación SDD. La evidencia distingue `implementation_tasks_completed` de
`tasks_completed`: la segunda no puede declararse completa hasta que la tarea
de verificación correspondiente y el SDD actualizado hayan sido revalidados.

Tras la fase 15 el estado es `AWAITING_MANUAL_VALIDATION`. El controlador no
reabre esa entrega aprobándose de nuevo un guardrail, no aprueba la validación
manual, no ejecuta `/finish-issue`, no publica ni cierra la Issue.

Las decisiones semánticas y lecturas MCP siguen correspondiendo al workflow.
El historial de este controlador solo contiene sus acciones observadas; no se
puede presentar como auditoría completa de acciones externas para afirmar que
no hubo push. El contrato de `final-check` sigue exigiendo esa evidencia fiable.

Cada reevaluación de un guard conserva una entrada inmutable en
`guard_history`, incluso cuando reemplaza la decisión activa del mismo guard.
Las referencias y razones del `BLOCK` original no se eliminan.

## Pruebas y limitaciones conocidas

Los tests de sesión/controlador cubren invalidación, proyecciones, exportación,
fases, guardrails, recuperación y orden de commit. Los de integración ejecutan
observaciones Git/SDD y verificaciones controladas en repositorios temporales,
sin consultas redundantes ni escrituras en el repositorio de trabajo real.
Una secuencia completa con recibos sintéticos prueba el estado final; no afirma
haber implementado una Issue real o aplicado sus guardrails semánticos.

El defecto conocido de `git_policy.py check-branch` al avanzar `origin/main`
permanece: el controlador conserva ese bloqueo y no lo convierte en éxito.
