# Plan — Evitar que errores de validación de evidencia bloqueen el workflow de `/hyssue`

## Enfoque técnico

Distinguir, con un tipo de excepción dedicado, los errores de construcción
de llamada (recuperables, sin mutación de estado previa) de los fallos
reales de guard/integridad (que deben seguir bloqueando). El límite exacto
de esa distinción es el enumerado por la Issue: kind desconocido, kind no
permitido en la fase, campos no admitidos — todos detectados en
`record_static`/`EvidenceManager.record` antes de escribir ninguna entrada
en el ledger de evidencia.

## Componentes afectados

1. `scripts/harness/evidence_manager.py`
   - Nueva clase `EvidenceValidationError(EvidenceError)`.
   - En `EvidenceManager.record`, rama `category == 'static'`: separar el
     chequeo único `kind not in STATIC_FIELDS or set(data) -
     STATIC_FIELDS[kind]` en dos chequeos independientes, cada uno con su
     propio mensaje accionable, lanzando `EvidenceValidationError`:
     - kind desconocido → lista los kinds conocidos (`sorted(STATIC_FIELDS)`).
     - campos no admitidos → lista los campos permitidos para ese kind
       (`sorted(STATIC_FIELDS[kind])`).
   - El resto de chequeos de la rama estática (`check_static_values`,
     `OBSERVATION_TOPICS`, `status` verificado, inmutabilidad de
     `canonical_base`) no cambian: siguen lanzando `EvidenceError` simple.

2. `scripts/harness/workflow_controller.py`
   - Importar `EvidenceValidationError`.
   - En `WorkflowController.record_static`, cuando `kind` no está en
     `allowed.get(self.phase, set())`, lanzar `EvidenceValidationError` con
     un mensaje que incluya los kinds permitidos en la fase activa.

3. `scripts/harness/harness_mcp.py`
   - Importar `EvidenceValidationError`.
   - En `harness_call`, dentro del bloque `except`, fijar
     `_controller.status = "BLOCKED"` únicamente cuando la excepción
     capturada no sea una instancia de `EvidenceValidationError`. La
     respuesta de la llamada rechazada sigue siendo `"status": "BLOCK"`
     (la llamada en sí falló), pero el estado persistente del controlador
     (`workflow_status`, fase) no se modifica.
   - Nota en el docstring de `harness_call` documentando la distinción.

   No se modifica `workflow_controller.serve()`/`main()` (modo CLI): ya no
   mutan `controller.status` ante una excepción, por lo que no reproducen
   el defecto reportado.

4. `.opencode/commands/hyssue.md` y `.claude/commands/hyssue.md`
   (idénticos tras el cambio):
   - Nueva subsección con ejemplos literales completos de `record_static`
     para `issue_identity`, `approved_scope`, `context_item`, `decisions`,
     `dependencies`, `sdd_refs` (kind exacto, fase exacta, payload
     ilustrativo completo).
   - Nota explícita sobre `canonical_base`, `verification_history` y
     `accepted_commit`: proyectados automáticamente por el controlador,
     nunca a registrar manualmente con valores fabricados.
   - Nueva subsección "Recovering From a Validation Error" documentando el
     comportamiento resultante de este cambio: corregir y reintentar en la
     misma fase, nunca reiniciar la sesión MCP; `BLOCKED` reservado para
     fallos reales.

5. `scripts/harness/tests/`
   - `test_evidence_manager.py`: kind desconocido → `EvidenceValidationError`
     con mensaje "Unknown static evidence kind"; campos no admitidos para
     un kind conocido → `EvidenceValidationError` con mensaje "unsupported
     fields"; mensaje lista los campos permitidos exactos.
   - `test_workflow_controller.py`: kind no permitido en la fase activa es
     recuperable (fase/status sin cambio, reintento exitoso en la misma
     fase); campos no admitidos es recuperable (mismo patrón).
   - `test_harness_mcp.py` (reproduce el defecto real reportado, a través
     del adaptador MCP): kind no permitido vía `harness_call` no deja
     `workflow_status` en `BLOCKED`, y una llamada corregida subsecuente
     tiene éxito; mismo patrón para campos no admitidos; test de regresión
     confirmando que un fallo real de guard (`decide_guard` con `source`
     incorrecto) sigue fijando `workflow_status = "BLOCKED"`.

## Verificación

- Suite completa: `./.venv/bin/python -m unittest discover -s
  scripts/harness/tests -p "test_*.py"` (intérprete declarado en
  `opencode.json` para el servidor `harness`; `pytest` no está instalado en
  `.venv`, mismo criterio documentado en la Issue #205).
- Diff vacío entre `.opencode/commands/hyssue.md` y
  `.claude/commands/hyssue.md`.
- Revisión manual de que ningún `EvidenceError` fuera de los tres casos
  enumerados por la Issue se reclasificó como `EvidenceValidationError`.

## Riesgos

- Reclasificar de más (marcar como no-fatal un error que en realidad
  refleja un problema de integridad) debilitaría la protección de
  `BLOCKED`. Mitigado limitando `EvidenceValidationError` exactamente a los
  tres chequeos de construcción de llamada enumerados por la Issue, antes
  de cualquier mutación, y verificándolo con el test de regresión de fallo
  real de guard.
