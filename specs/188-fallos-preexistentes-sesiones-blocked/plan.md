# Enfoque técnico

## Recuperación del controlador

Inspeccionar `WorkflowController.invoke`, `decide_guard`, `advance`,
`revisit_phase` y el registro de evidencias para separar el bloqueo técnico de
la operación del estado global de la sesión. Añadir una ruta explícita de
recuperación que opere sobre la misma sesión, preserve historial y evidencias,
compruebe la identidad y permita eliminar únicamente un bloqueo técnico cuya
operación se haya repetido con `PASS`.

La ruta debe calcular si la sesión puede volver a `RUNNING`: no debe haber
bloqueadores restantes de la fase activa, guards con resultado distinto de
`PASS` en la fase activa, acción prohibida, handoff cerrado o incertidumbre de
commit. Debe añadir un evento de historial que identifique la operación
resuelta y las condiciones comprobadas. No debe avanzar la fase ni modificar
guard decisions.

## Historial de decisiones y evidencias

Conservar versiones previas de guard decisions en una colección de historial
del controlador antes de reemplazar la entrada activa. Conservar las
referencias, fuente, razón, fase y resultado originales. Mantener el modelo de
versionado de `EvidenceManager` para que una nueva evidencia no borre la
observación `BLOCK` anterior.

Revisar las invalidaciones producidas por operaciones del harness para que una
mutación conocida invalide solo las observaciones afectadas y no destruya el
historial requerido para diagnóstico y recuperación.

## Fallos preexistentes y waivers

Definir en los contratos de verificación una representación explícita distinta
de `PASS` para un fallo preexistente. Debe incluir el check, el identificador
del fallo, comando y entorno, resultados sobre base y rama, logs, comparación
de diff, SHA base, SHA de rama, responsable, motivo, alcance y caducidad del
waiver. El runner conserva el `FAIL`; el guard semántico decide si puede
continuar con un waiver vigente. Cualquier diferencia de diagnóstico o falta
de evidencia mantiene el bloqueo.

## Archivos previstos

- `.opencode/commands/hyssue.md` y los guards o contratos afectados: describir
  la recuperación y el traslado de verificación de fase 6 a fase 7.
- `scripts/harness/workflow_controller.py`: recuperación técnica y versiones
  de decisiones de guard.
- `scripts/harness/evidence_manager.py`: tipos y validación de evidencia
  histórica requeridos por la recuperación o waiver.
- `scripts/harness/verification_runner.py`: datos verificables para la
  clasificación de fallo preexistente, si corresponde a su responsabilidad.
- Contratos y pruebas del harness afectados.
- `scripts/harness/verification-registry.json` y su wrapper local: registrar
  la suite Python del harness sin rutas absolutas ni un sistema paralelo.

## Estrategia de pruebas

Primero añadir pruebas unitarias de controlador para una operación bloqueada
que se repite exitosamente, múltiples bloqueos, guard pendiente, sesión
prohibida o cerrada, y preservación de decisiones previas. Añadir pruebas de
contrato y runner para waiver válido, ausente, vencido, reproducción de base
incompleta y regresión distinta. Ejecutar los tests dirigidos, después el
conjunto aplicable del harness, lint, build y revisión de diff configurados.

## Riesgos y límites

La recuperación no puede inferir que el resultado `PASS` resuelve un guard
semántico. La clasificación de un fallo como preexistente depende de evidencia
reproducible y autorización humana específica; si no está disponible, el
resultado debe permanecer bloqueante.
