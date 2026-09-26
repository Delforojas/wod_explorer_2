# Tasks: Ciclo de vida de WOD personales

## Implementación

- [x] Crear DTOs integrados para definición de WOD, elementos de composición y respuesta agregada.
- [x] Crear la excepción de definición inválida y respuestas `400` consistentes para reglas de negocio de composición.
- [x] Añadir el servicio de agregado con creación transaccional de WOD, versión inicial y elementos.
- [x] Validar propietario autenticado, ejercicios activos, prescripciones, modalidad y composición no vacía.
- [x] Implementar consulta agregada de WOD genéricos visibles y WOD personales propios con composición ordenada.
- [x] Implementar modificación que actualice el nombre y cree una nueva versión sin alterar versiones históricas.
- [x] Mantener el archivado de WOD personales y bloquear nuevas operaciones sobre WOD archivados.
- [x] Retirar las escrituras independientes de versiones y elementos de los controllers públicos.
- [x] Añadir tests de creación, validación de ejercicios, posiciones repetidas, ownership, versionado y archivado.

## Verificación

- [x] `./mvnw -q test` desde `backend/` con JDK 21 y MySQL 8.4.
- [x] `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] `./mvnw -q package` desde `backend/`.
- [x] `git diff --check`.
- [x] `database_ping` y comprobación de tablas afectadas mediante MCP.
- [x] Revisar que no se modificó el esquema, no se añadieron secretos y no hay cambios fuera de la Issue.
