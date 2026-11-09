# Tareas

- [x] Mapear los contratos actuales de fases 6 y 7, bloqueos, evidencias y
  decisiones de guard, incluyendo el incidente de `sdd_manager.prepare`.
- [x] Diseñar y documentar la operación explícita de recuperación técnica y
  sus precondiciones de seguridad en los contratos del workflow.
- [x] Implementar el historial versionado de decisiones de guard sin eliminar
  la decisión activa ni sus referencias.
- [x] Implementar la recuperación de un bloqueo técnico tras un reintento
  oficial `PASS`, sin avance de fase ni aprobación de guardrail.
- [x] Asegurar que la recuperación se rechaza con bloqueos restantes, guards
  pendientes, acciones prohibidas, sesión cerrada o estado de commit incierto.
- [x] Definir y aplicar el contrato de fallo preexistente y waiver delimitado
  para la verificación de fase 7, preservando el `FAIL` original.
- [x] Actualizar la documentación de `/hyssue`, guardrails y contratos
  afectados para reflejar responsabilidades y límites de recuperación.
- [x] Añadir pruebas positivas y negativas de recuperación, historial de
  guards, waiver, reproducción insuficiente, regresión y pérdida de sesión.
- [x] Ejecutar las verificaciones aplicables y revisar el diff; actualizar el
  estado de estas tareas solo tras evidencia satisfactoria.
- [x] [phase:7] Registrar `harness.test` mediante el registry existente, validar sus
  fallos de intérprete o dependencias y ejecutarlo desde fase 7.
