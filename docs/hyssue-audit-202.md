# Auditoría de `/hyssue` - Issue #202

## Matriz de fases

| Fase | Evidencia principal | Dependencias e invalidación | Guard/recuperación |
| --- | --- | --- | --- |
| 0 | Sesión MCP | Reinicio o sesión ajena bloquea | `advance` a 1 |
| 1 | Issue GitHub | Cambios GitHub invalidan | Issue Guard |
| 2 | Contexto estático | Cambios de instrucciones/alcance invalidan | Context Guard |
| 3 | Base y rama | Git, remoto o árbol cambian la evidencia | Branch Guard |
| 4 | SDD estructural | Cambios SDD invalidan | SDD Guard |
| 5 | SDD validado | Cambios SDD/decisiones invalidan | Planning Guard |
| 6 | Evidencia de implementación | Cambios locales invalidan | Implementation Guard |
| 7 | Verificaciones | Fuente, índice, HEAD o catálogo invalidan | Verification Guard |
| 8 | Reparación y verificaciones | Requiere fallo y Repair Guard previos | Verification Guard |
| 9 | Revisión pre-stage | Cambios locales o staging invalidan | Change Review Guard |
| 10 | Staging, pre-commit y commit | Índice, historial o alcance invalidan | Commit Guard |
| 11 | Observación post-commit | Referencias, árbol o staging invalidan | Post-Commit Guard |
| 12 | Documentación GitHub | Cambio GitHub invalida | GitHub Documentation Guard |
| 13 | Final check y verificaciones | Git, SDD, GitHub o auditoría invalidan | Final Workflow Guard |
| 14 | Plan manual pendiente | Aprobación manual no permitida | Manual Validation Guard |
| 15 | Evidencia final y plan manual | Mutaciones posteriores bloquean | Workflow Handoff Guard |

## Hallazgos y correcciones

1. Alta, reproducible: `branch_preparation_evidence` comparaba `expected_head`, que no se emitía, con `result_head`; por tanto clasificaba una preparación satisfactoria como `file-change`. La corrección compara HEAD, árbol e índice realmente observados y falla cerrada si falta cualquiera de esas pruebas.
2. Alta, reproducible: una referencia superseded aceptaba objetos con campos adicionales y no comprobaba de nuevo el digest almacenado. Ahora exige la forma canónica completa y valida el digest del payload antes de devolver la versión histórica.
3. Media: el nombre CLI documentado para fase 11 no coincidía con el parser. La documentación ahora usa `post-check-commit`.
4. Media: los contratos de sesión/final describían estado histórico obsoleto. Se actualizaron para reflejar la implementación actual y el límite explícito de la auditoría externa.
5. Alta, reproducible: la fase 13 requería `tree_sha` y hashes SDD, pero el runner solo producía una huella anterior al commit. `verification_runner.project_final` conserva los informes originales y produce evidencia nueva únicamente cuando el manifiesto externo, el árbol confirmado y la observación post-commit coinciden.
6. Media: el contrato exigía observaciones GitHub y una auditoría completa sin disponer de validadores locales de esquema. `workflow_audit.py` normaliza la forma de esas entradas y rechaza secuencias incompletas, operaciones externas no clasificadas y acciones prohibidas; no certifica la procedencia de un caller.

## Registro de acciones y límite residual

El controlador mantiene en memoria un registro secuencial de cada llamada
`harness_call`, iniciado con `issue-start`. El modelo no dispone de una
operación para crear ni modificar los eventos. Antes de `final-check`, el
controlador compara las referencias `origin` observadas al inicio y al final;
un cambio bloquea la sesión como posible push.

La comparación no demuestra la autoría del cambio, no cubre referencias que no
se observaron y no prueba acciones externas al proceso. Cuando esa observación
no está disponible, el workflow debe detenerse en fase 13 y entregar un
handoff manual que indique el límite, sin fabricar evidencia ni marcar PASS.

La ejecución real de `/hyssue 201` permanece pendiente hasta que esta corrección esté integrada en `main`: la Issue #201 exige partir de `main` limpio y no puede validar legítimamente una corrección no integrada desde este árbol con cambios de #202.

El seguimiento no duplica la Issue #201 ni afirma que su validación haya
pasado. La tarea local de #202 es registrar la dependencia; la obligación de
ejecutar y documentar el resultado real permanece abierta en #201.
