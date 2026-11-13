# Especificacion: contratos de las fases 12 y 13

## Objetivo

Investigar y documentar las incompatibilidades verificables entre la documentacion de GitHub de la fase 12 y `final_check` de la fase 13 de `/hyssue`.

## Alcance

- Crear un unico informe Markdown en `docs/hyssue-phase12-13-contract-analysis.md`.
- Reconstruir el flujo real y citar los seis archivos obligatorios del Issue.
- Contrastar la equivalencia de `.opencode/commands/hyssue.md` y `.claude/commands/hyssue.md`.
- Analizar los tests pertinentes solo como sustento del diagnostico.
- Presentar una matriz de contratos, alternativas viables, recomendacion, plan y pruebas futuras.

## Fuera de alcance

- Cambiar codigo, configuracion, contratos o comportamiento del harness.
- Relajar `final_check`, regenerar evidencia historica o forzar una sesion bloqueada.
- Ejecutar `/finish-issue`, hacer push, merge o cerrar Issues.

## Comportamiento esperado

El informe separa hechos observados de hipotesis, identifica productor y consumidor de cada evidencia relevante, y no presenta como implementada una operacion que no este disponible en el MCP controlado.

## Criterios de aceptacion

- [ ] AC1: Cita los seis archivos obligatorios con rutas y funciones concretas.
- [ ] AC2: Distingue hechos verificados de supuestos y no afirma causas sin respaldo.
- [ ] AC3: La matriz cubre documentacion, `comment_id`, `body_sha256`, bloque JSON, action log y entrega a `final_check`.
- [ ] AC4: Propone alternativas concretas, incluido un adaptador, con trade-offs.
- [ ] AC5: La recomendacion define cambios por archivo, contratos de entrada/salida y responsables de evidencia.
- [ ] AC6: Describe duplicados, timeout, fallos parciales, reintentos y `BLOCK` sin perder auditoria.
- [ ] AC7: Define pruebas futuras para OpenCode y Claude Code.
- [ ] AC8: No reduce guardrails ni autoriza falsificacion de evidencia.
- [ ] AC9: No modifica codigo, configuracion, contratos ni comportamiento del harness.
- [ ] AC10: El Markdown supera `git diff --check`.

## Restricciones

El informe debe limitarse a evidencia de codigo y pruebas existentes; las decisiones de diseno se presentan como recomendacion para una Issue posterior, no como cambios aprobados.
