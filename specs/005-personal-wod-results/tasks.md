# Tasks: Resultados, historial y mejores marcas personales

## Orden de implementación

1. Contratos y validación de resultados.
2. Persistencia y operaciones protegidas del resultado.
3. Historial y mejores marcas derivadas.
4. Tests y verificaciones del flujo completo.

## Tareas ejecutables

- [x] Crear el DTO de corrección y enriquecer el response con WOD, origen y
  modalidad sin exponer entidades JPA.
- [x] Añadir una excepción de resultado inválido y mapearla a `400` con el formato
  de error existente.
- [x] Implementar la validación de `FOR_TIME`, `AMRAP` y `EMOM`, incluyendo
  progreso, métricas incompatibles y pertenencia de `progressItemId`.
- [x] Implementar corrección transaccional de resultados propios sin cambiar la
  versión ejecutada.
- [x] Mantener creación de múltiples intentos y borrado con ownership, rechazando
  versiones personales ajenas y WOD archivados para nuevos registros.
- [x] Implementar consulta privada de historial con ordenación y filtros de WOD,
  modalidad, origen e intervalo de fechas.
- [x] Implementar consulta de mejores marcas derivada para las modalidades
  aprobadas y reglas de compatibilidad de EMOM.
- [x] Añadir tests unitarios de validación, privacidad, múltiples intentos,
  historial, `FOR_TIME`, `AMRAP`, `EMOM` y recálculo después de modificar o
  eliminar resultados.

## Verificaciones

- [x] `./mvnw -q test` desde `backend/`.
- [x] `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] `./mvnw -q package` desde `backend/`.
- [x] `git diff --check`.
- [x] `database_ping` y descripción de tablas de resultados/versiones/items.
- [x] Confirmar que no se modificó el esquema ni se añadieron secretos.
- [x] Confirmar que los cambios Git están limitados a la Issue #5 y su SDD.
