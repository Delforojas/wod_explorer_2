# Spec — Evitar que errores de validación de evidencia bloqueen el workflow de `/hyssue`

## Objetivo

Que un error de validación de llamada (kind desconocido, kind no permitido
en la fase activa, o campos no admitidos para el kind indicado) en
`record_static` rechace únicamente esa llamada, sin cambiar la fase ni el
`status` del `WorkflowController` en memoria, de forma que el agente pueda
corregir y reintentar en la misma fase sin reiniciar el proceso MCP.
`BLOCKED` queda reservado para fallos reales de guard o de integridad.

## Contexto verificado (causa raíz)

Auditoría directa de código confirma la causa raíz exacta:

- `scripts/harness/harness_mcp.py`, función `harness_call`: el bloque
  `except (EvidenceError, ValueError, TypeError, KeyError, AttributeError,
  IndexError, OSError)` fija incondicionalmente
  `_controller.status = "BLOCKED"` para **cualquier** excepción, incluida
  una `EvidenceError` de construcción de llamada lanzada por
  `WorkflowController.record_static` (kind no permitido en la fase) o por
  `EvidenceManager.record` (kind desconocido o campos no admitidos para el
  kind). Como `_controller` es una variable de módulo persistente durante
  toda la vida del proceso MCP, ese `BLOCKED` es permanente: `advance`,
  `revisit_phase` y cualquier otra operación posterior lo rechazan, y la
  única salida documentada es reiniciar el proceso MCP.
- `scripts/harness/workflow_controller.py`, `WorkflowController.record_static`:
  antes de llamar a `self.evidence.record(...)`, valida que `kind` esté en
  el conjunto permitido para la fase activa (`allowed.get(self.phase,
  set())`); si no lo está, lanza `EvidenceError('Static evidence is not
  allowed at this phase')` — sin tocar `self.status` ni `self.phase`. Este
  es el caso 1 reportado en la Issue (fase 1, kind `context_item`, permitido
  solo en fase 2).
- `scripts/harness/evidence_manager.py`, `EvidenceManager.record`: para
  `category == 'static'`, si `kind not in STATIC_FIELDS` o si el payload
  contiene campos fuera de `STATIC_FIELDS[kind]`, lanza
  `EvidenceError('Static evidence has unknown or mutable fields')` — tampoco
  toca ningún estado del controlador. Este es el caso 2 reportado en la
  Issue (fase 1, key `approved_scope`, kind `issue_identity`: los campos del
  payload no son subconjunto de `STATIC_FIELDS['issue_identity']`).
- `scripts/harness/workflow_controller.py`, función `perform` (línea ~389):
  ante un `TypeError` de *binding* de argumentos (nombres de parámetro
  incorrectos para cualquier operación, no solo `record_static`), fija
  `controller.status = 'BLOCKED'` directamente. Este es un defecto análogo
  pero de una clase distinta (error de firma, no de `kind`/campos) y **no**
  corresponde a ninguno de los dos casos reportados por la Issue; queda
  fuera de alcance explícitamente (ver más abajo).
- `scripts/harness/workflow_controller.py`, modo CLI `serve()`/`main()`: ya
  no fija `controller.status = 'BLOCKED'` ante una excepción (solo
  construye la respuesta `BLOCK` para esa línea); el defecto es exclusivo
  del adaptador MCP (`harness_mcp.py`), coherente con el relato de la Issue
  ("la única salida es reiniciar el proceso MCP").

## Alcance

### Dentro de alcance

1. **Nueva excepción `EvidenceValidationError`** (subclase de
   `EvidenceError`) en `evidence_manager.py`, usada exclusivamente para
   errores de construcción de llamada que ocurren antes de cualquier
   mutación de estado:
   - `WorkflowController.record_static`: kind no permitido en la fase
     activa.
   - `EvidenceManager.record` (solo rama `category == 'static'`): kind
     desconocido (no en `STATIC_FIELDS`), o campos del payload fuera de
     `STATIC_FIELDS[kind]`.
2. **Mensajes de error accionables**: el mensaje de "kind no permitido en
   la fase" incluye los kinds permitidos en la fase activa; el mensaje de
   "campos no admitidos" incluye los campos permitidos para el kind
   indicado.
3. **`harness_mcp.py`**: en `harness_call`, el bloque `except` solo fija
   `_controller.status = "BLOCKED"` cuando la excepción capturada **no**
   es `EvidenceValidationError`. La respuesta de esa llamada concreta sigue
   siendo `"status": "BLOCK"` (la llamada fue rechazada), pero
   `workflow_status` y la fase del controlador permanecen como estaban.
4. **Ejemplos literales en `hyssue.md`**: una llamada de ejemplo completa
   por cada evidencia estática registrable directamente por el agente
   (`issue_identity`, `approved_scope`, `context_item`, `decisions`,
   `dependencies`, `sdd_refs`), con su `kind` exacto y la fase en que se
   registra; una nota explícita sobre `canonical_base`,
   `verification_history` y `accepted_commit`, que el propio controlador
   proyecta automáticamente y que no deben registrarse manualmente con
   valores fabricados; y una sección sobre cómo recuperarse de un error de
   validación (corregir y reintentar en la misma fase, nunca reiniciar la
   sesión MCP). Sincronizar `.opencode/commands/hyssue.md` y
   `.claude/commands/hyssue.md`.
5. **Tests nuevos** en `scripts/harness/tests/` cubriendo: kind desconocido
   (nivel `EvidenceManager`), campos no admitidos para un kind conocido
   (nivel `EvidenceManager`), mensaje con campos permitidos listados, kind
   no permitido en la fase activa recuperable en la misma sesión (nivel
   `WorkflowController`), campos no admitidos recuperable en la misma
   sesión (nivel `WorkflowController`), y — el caso que reproduce el
   defecto real reportado — ambos casos a través de `harness_mcp.harness_call`
   verificando que `workflow_status`/`controller.status` permanecen sin
   cambios tras el error y que una llamada corregida subsecuente tiene
   éxito, más un test de regresión que confirma que un fallo real de guard
   (`decide_guard` con `source` incorrecto) sigue fijando `BLOCKED` como
   hasta ahora.

### Fuera de alcance

- Añadir una operación genérica de "unblock" (explícitamente excluido por
  la Issue).
- Cambios en `opencode.json` o en código de producto de WOD Explorer
  (frontend/backend/Docker).
- El defecto análogo pero distinto en `workflow_controller.perform` (línea
  ~389), que fija `BLOCKED` ante un `TypeError` de *binding* de argumentos
  para **cualquier** operación (no solo `record_static`, y no por kind o
  campos, sino por nombres de parámetro incorrectos). No es ninguno de los
  dos casos reportados por la Issue ("kind desconocido, kind no permitido
  en la fase o campos no admitidos"); generalizar el arreglo a esa ruta
  ampliaría el alcance sin autorización explícita.
- Los demás chequeos de `EvidenceManager.record` para evidencia estática
  (`check_static_values` sobre `PROHIBITED_STATIC_KEYS`,
  `OBSERVATION_TOPICS`, `status` no verificado, inmutabilidad de
  `canonical_base`): se mantienen como `EvidenceError` que sigue
  bloqueando, al no estar entre los tres casos enumerados explícitamente
  por la Issue y relacionarse con integridad, no con construcción de la
  llamada.
- El límite ya reconocido de las fases 12, 14 y 15 (sin cambio aquí).

## Comportamiento esperado

- Un `record_static` con `kind` no permitido en la fase activa invocado vía
  `harness_call` devuelve `{"status": "BLOCK", "error": "..."}` para esa
  llamada, pero `workflow_status` y la fase del controlador permanecen
  iguales a como estaban antes de la llamada.
- Un `record_static` con campos no admitidos para el `kind` indicado tiene
  el mismo comportamiento.
- En ambos casos, una llamada corregida inmediatamente después, en la misma
  fase y la misma sesión, se registra con éxito.
- Los mensajes de error de ambos casos listan explícitamente los kinds
  válidos para la fase activa o los campos válidos para el kind indicado.
- Un fallo real de guard (por ejemplo, `decide_guard` con `source`
  incorrecto) sigue fijando `workflow_status = "BLOCKED"` de forma
  persistente, igual que antes de este cambio.
- La suite completa de `scripts/harness/tests/` permanece en `OK`.
- `.opencode/commands/hyssue.md` y `.claude/commands/hyssue.md` son
  idénticos tras el cambio.

## Restricciones

- No se añaden dependencias, servicios ni capas nuevas.
- No se debilita ningún guard existente ni la semántica de `BLOCKED` para
  fallos reales.
- No se falsifica evidencia, aprobación ni procedencia.
- `.pyc`, `__pycache__/` y archivos ajenos no entran al commit.
