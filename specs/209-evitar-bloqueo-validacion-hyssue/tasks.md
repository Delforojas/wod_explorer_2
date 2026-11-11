# Tasks — Evitar que errores de validación de evidencia bloqueen el workflow de `/hyssue`

## 1. Excepción de validación no fatal

- [x] 1.1 Añadir `EvidenceValidationError(EvidenceError)` en
      `scripts/harness/evidence_manager.py`.
- [x] 1.2 En `EvidenceManager.record` (rama `category == 'static'`),
      separar el chequeo de kind desconocido y el de campos no admitidos
      en dos `EvidenceValidationError` independientes, cada uno con el
      listado correspondiente (kinds conocidos / campos permitidos para el
      kind). Verificación: `test_unknown_static_kind_is_a_non_fatal_validation_error`,
      `test_unsupported_static_fields_for_a_known_kind_is_a_non_fatal_validation_error`,
      `test_static_validation_error_lists_allowed_fields` en
      `test_evidence_manager.py`.
- [x] 1.3 En `WorkflowController.record_static`
      (`scripts/harness/workflow_controller.py`), lanzar
      `EvidenceValidationError` cuando el `kind` no está permitido en la
      fase activa, listando los kinds permitidos en el mensaje.
      Verificación: `test_record_static_kind_not_allowed_at_phase_is_recoverable`
      en `test_workflow_controller.py`.
- [x] 1.4 Confirmar que el resto de chequeos de evidencia estática
      (`check_static_values`, `OBSERVATION_TOPICS`, status no verificado,
      inmutabilidad de `canonical_base`) permanecen como `EvidenceError`
      simple, sin reclasificar. Verificación: tests preexistentes
      (`test_unknown_static_fields_are_rejected`,
      `test_second_canonical_key_is_not_allowed`,
      `test_nested_mutable_data_cannot_be_smuggled_into_static_summary`)
      siguen en PASS sin modificación.

## 2. Adaptador MCP — causa raíz real

- [x] 2.1 En `harness_mcp.py`, `harness_call`: en el bloque `except`, fijar
      `_controller.status = "BLOCKED"` solo cuando la excepción no es
      `EvidenceValidationError`. Documentar la distinción en el docstring.
      Verificación: `test_record_static_validation_error_does_not_block_the_workflow`,
      `test_record_static_unsupported_fields_does_not_block_the_workflow`
      en `test_harness_mcp.py`.
- [x] 2.2 Test de regresión: un fallo real de guard (`decide_guard` con
      `source` incorrecto) sigue fijando `workflow_status = "BLOCKED"`.
      Verificación: `test_a_real_guard_failure_still_blocks_the_workflow`.
- [x] 2.3 Confirmar que, tras el error de validación, una llamada corregida
      en la misma fase y sesión se registra con éxito (cubierto por los
      mismos tests de 2.1, que encadenan la llamada corregida).

## 3. Documentación `hyssue.md`

- [x] 3.1 Añadir ejemplos literales completos de `record_static` para
      `issue_identity`, `approved_scope` (Fase 1), `context_item` (Fase 2),
      `decisions` (Fase 2/5), `dependencies` (Fase 2), `sdd_refs` (Fase
      4/5), cada uno con su `kind` exacto y la fase en que se registra.
- [x] 3.2 Añadir nota explícita sobre `canonical_base`,
      `verification_history` y `accepted_commit`: proyectados
      automáticamente por el controlador, nunca a registrar manualmente
      con valores fabricados.
- [x] 3.3 Añadir sección "Recovering From a Validation Error" describiendo
      el comportamiento resultante de la Tarea 2: corregir y reintentar en
      la misma fase, nunca reiniciar la sesión MCP.
- [x] 3.4 Sincronizar `.opencode/commands/hyssue.md` y
      `.claude/commands/hyssue.md` (diff vacío). Verificación: `diff`.

## 4. Verificación completa

- [x] 4.1 Ejecutar la suite completa de `scripts/harness/tests/` con el
      intérprete declarado en `opencode.json`
      (`./.venv/bin/python -m unittest discover -s scripts/harness/tests -p
      "test_*.py"`). Resultado: `Ran 333 tests ... OK` (325 previos + 8
      nuevos).
- [x] 4.2 Verificar diff vacío entre los dos `hyssue.md`.
