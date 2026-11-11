# Spec: Auditar y estabilizar `/hyssue`

## Objetivo

Corregir defectos comprobados del harness híbrido para que sus contratos, evidencias y transiciones permitan recorrer el workflow sin convertir errores reales en aprobaciones.

## Alcance

- Auditar y alinear el comportamiento de `evidence_manager.py`, `workflow_controller.py`, `git_policy.py`, `sdd_manager.py`, `verification_runner.py`, el adaptador MCP y sus contratos Markdown.
- Corregir la invalidación espuria producida durante una preparación de rama satisfactoria sin cambios de contenido.
- Mantener el bloqueo conservador cuando faltan datos, la operación falla o cambian HEAD, índice o contenido.
- Validar el acceso histórico a evidencia superseded sin aceptar referencias manipuladas.
- Producir o validar de forma explícita la proyección necesaria para que las verificaciones se relacionen con el árbol candidato del commit final.
- Corregir incoherencias de nombres de operaciones y documentación detectadas durante la auditoría.
- Añadir pruebas unitarias, negativas e integración con repositorios Git temporales para los flujos corregidos.
- Documentar la matriz de fases y los hallazgos priorizados de la auditoría.

## Fuera de alcance

- Cambios a frontend, backend, dominio, persistencia o Docker.
- Reintroducir de forma masiva versiones históricas del harness.
- Relajar guardrails, aceptar evidencia incompleta, eliminar bloqueos legítimos o inventar aprobaciones.
- Push, merge, cierre del Issue o aprobación de validación manual.

## Comportamiento esperado

1. Una `branch_preparation_evidence` PASS compara los campos realmente emitidos y no dispara `file-change` solo porque un campo inexistente sea comparado con `result_head`.
2. Una preparación de rama que cambia contenido, tiene resultado incompleto o no puede demostrar conservación de contenido invalida de forma conservadora las evidencias afectadas.
3. La evidencia superseded se recupera únicamente cuando la referencia conserva el mismo ámbito, versión y hash registrados; una referencia alterada se bloquea.
4. La evidencia de verificación final se deriva o valida contra los artefactos reales del runner, el árbol del commit y los hashes SDD, sin reemplazar campos históricos a mano.
5. Los nombres de las operaciones expuestas, sus comandos CLI y los contratos Markdown coinciden y los contratos distinguen datos internos del controlador de auditoría externa obligatoria.
6. Las pruebas demuestran tanto los caminos PASS como los bloqueos frente a cambios reales, evidencia incompleta o manipulada, y contratos incompatibles.

## Criterios de aceptación

- AC1: Existe un informe de auditoría con matriz de las 15 fases, evidencia, dependencias, invalidaciones, guard y transición/recuperación, además de hallazgos priorizados.
- AC2: Se reproducen y corrigen los defectos críticos de #199/#200/#201, incluida la preparación de rama sin invalidación espuria, con pruebas de regresión y negativas.
- AC3: Los contratos Markdown, el controlador y los scripts Python utilizan campos y nombres de operación existentes y coherentes.
- AC4: Las verificaciones del harness, incluidas pruebas de integración de las fases soportadas y negativas pertinentes, pasan sin relajar validaciones.
- AC5: Se intenta una ejecución real posterior de `/hyssue` sobre una Issue pequeña mediante los guards y fases reales; cualquier límite externo o no automatizable queda documentado como pendiente, no como éxito.
- AC6: El cambio no incluye trabajo de frontend/backend de #195/#199/#201, secretos, bytecode, `audit/` ni stashes.

## Restricciones

- Esta Issue se desarrolla con `/issue`, no con `/hyssue`.
- La rama parte de `main` limpio y conserva historial, ramas y stashes existentes.
- Los cambios deben ser mínimos, incrementales y trazables al Issue.
- Los logs de verificación permanecen fuera del árbol fuente cuando el runner lo requiera.
- AC5 se verifica después de integrar esta corrección mediante la Issue #201; su
  estado pendiente no equivale a una aprobación de `/hyssue` ni de la auditoría
  externa completa.
