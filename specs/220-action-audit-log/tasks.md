# Tasks: registro de auditoría de acciones del harness

- [x] T1. Añadir la prueba diagnóstica e inventariar los fallos de
  `final_check` con un registro de prueba. Dependencia: ninguna. Verificación:
  prueba diagnóstica de `final_check`.
- [x] T2. Implementar el registro interno y secuencial de operaciones del
  harness, con eventos de inicio, commit y documentación. Dependencia: T1.
  Verificación: pruebas de `workflow_audit`, controlador y MCP.
- [x] T3. Integrar el registro generado en la fase 13 y añadir la detección
  independiente de cambios de referencias remotas. Dependencia: T2.
  Verificación: pruebas de `final_check` y controlador.
- [x] T4. Actualizar contratos y documentación, incluidos ambos comandos
  idénticos, con el procedimiento de bloqueo y los límites observables.
  Dependencia: T3. Verificación: comparación byte a byte de los comandos.
- [x] T5. Ejecutar la suite completa del harness, validación SDD y
  `git diff --check`. Dependencia: T1-T4. Verificación: comandos documentados
  en `plan.md`.
