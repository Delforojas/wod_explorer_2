# Tasks: Baseline ejecutable y persistencia del backend

## Orden y dependencias

1. Baseline de configuración y comandos.
2. Baseline SQL y estrategia documentada.
3. Reconciliación de entidades y esquema.
4. Verificación de aplicación, Compose y base real.
5. Revisión, commit y documentación de la Issue.

Las tareas 2 y 3 dependen de la configuración y decisiones documentadas en la tarea 1. La tarea 4 depende de las tres anteriores.

## Tareas ejecutables

- [x] Alinear `backend/pom.xml` con Spring Boot 3.5.5, Java 21 y starters compatibles, sin añadir dependencias innecesarias.
- [x] Configurar validación explícita del esquema mediante Hibernate y documentar el puerto local resuelto por defecto.
- [x] Corregir `.env.example` para usar placeholders no sensibles y valores coherentes con Docker Compose.
- [x] Renombrar el SQL inicial a `Docker/mysql/init/001_baseline.sql` sin perder los datos de catálogo existentes.
- [x] Añadir `user_identities` al baseline con su relación a `users` y restricciones únicas por proveedor.
- [x] Revisar las restricciones y relaciones del baseline para usuarios, WOD, versiones, composición y resultados sin eliminar datos ni ampliar `exercise_results`.
- [x] Alinear `WodOrigin` con `PERSONAL` y los metadatos de columnas de enums con el esquema real.
- [x] Registrar en `PROJECT.md` el estado confirmado de Java, Maven Wrapper, Compose, MySQL y la estrategia SQL versionada.
- [x] Verificar que la aplicación compila, los tests existentes pasan y Hibernate puede validar el esquema accesible.
- [x] Verificar mediante `database` las tablas, columnas, claves, relaciones, índices y conteos relevantes sin ejecutar operaciones destructivas.
- [x] Revisar el diff, separar cualquier cambio ajeno y actualizar esta lista solo con tasks realmente completadas.

## Verificaciones

- [x] `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] `./mvnw -q test` desde `backend/`.
- [x] `./mvnw -q package` desde `backend/`, si el build es ejecutable con el entorno disponible.
- [x] `docker compose config`.
- [x] `database_ping` y `database_server_info` confirman MySQL 8.4 accesible.
- [x] `database` confirma el esquema y la integridad referencial relevantes.
- [x] `git diff --check`.
- [x] Revisión de secretos, alcance y estado Git antes y después del commit.
