# Spec: registro de auditoría de acciones del harness

## Objetivo

Hacer que el harness genere de forma autónoma el registro de acciones que
requiere `final-check` en la fase 13 de `/hyssue`, sin ofrecer al modelo una
operación para escribirlo o modificarlo.

## Alcance

- Añadir al controlador o adaptador MCP un registro en memoria de cada
  operación recibida mediante `harness_call`, con una secuencia contigua desde
  `issue-start` y los datos de resultado exigidos por el contrato.
- Entregar el registro generado al `final-check` que se invoca desde el
  controlador y validarlo con `workflow_audit.validate_action_log`.
- Establecer una observación independiente de referencias remotas al inicio y
  al final para detectar un `push`; si una condición no puede comprobarse de
  forma fiable, documentar el límite sin simular un resultado.
- Añadir un diagnóstico automatizado del inventario de comprobaciones y fallos
  de `final_check` antes de introducir el registro generado.
- Actualizar el contrato, la auditoría de `/hyssue` y los dos archivos
  `hyssue.md` de manera idéntica.

## Fuera de alcance

- Relajar, desactivar o falsear comprobaciones de `final-check`.
- Añadir una operación MCP que permita al modelo editar la auditoría.
- Modificar `opencode.json` o el producto WOD Explorer.
- Aprobar manualmente, ejecutar `/finish-issue`, hacer push, merge o cerrar la
  Issue.

## Comportamiento esperado

Al iniciar una sesión, el harness crea el primer evento `issue-start`. Cada
operación recibida por `harness_call` se registra internamente con su resultado
real y mantiene la secuencia. Los eventos de creación de commit y documentación
de GitHub conservan respectivamente el SHA de commit y el identificador del
comentario cuando la operación termina correctamente. El modelo solo puede
leer el estado generado por el harness, nunca suministrar ni mutar eventos.

La fase 13 usa este registro generado y bloquea eventos prohibidos o
desconocidos. La comprobación de referencias remotas reporta un bloqueo si
detecta diferencias atribuibles a un push durante la sesión; sus límites se
documentan explícitamente.

## Criterios de aceptación

- AC1: Existe un test diagnóstico que inventaría los `checks` y `failures` de
  `final_check` con un registro de prueba, antes de cambiar la producción.
- AC2: El harness genera un registro que `validate_action_log` acepta sin
  intervención del modelo.
- AC3: No existe una operación MCP para escribir o modificar el registro.
- AC4: Un push durante el workflow bloquea mediante una observación
  independiente, o el límite no verificable queda documentado explícitamente.
- AC5: Hay pruebas en `scripts/harness/tests/` para AC1-AC4.
- AC6: La suite completa del harness termina correctamente.
- AC7: Una ejecución real de `/hyssue` sobre una Issue pequeña alcanza
  `AWAITING_MANUAL_VALIDATION` sin evidencia fabricada, o los bloqueos restantes
  de las fases 13-15 quedan documentados.
- AC8: `.opencode/commands/hyssue.md` y `.claude/commands/hyssue.md` son
  idénticos.

## Restricciones

- Conservar la evidencia de auditoría en memoria y gestionada exclusivamente
  por el harness.
- Mantener las validaciones y límites de confianza existentes.
- Usar los contratos y operaciones actuales del harness; no añadir
  dependencias.
