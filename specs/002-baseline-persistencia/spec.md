# SDD: Baseline ejecutable y persistencia del backend

## Objetivo

Dejar el backend y su persistencia reproducibles, coherentes y verificables antes de completar los flujos de negocio de las Issues posteriores.

La implementación debe respetar `DOMAIN.md` y las decisiones cerradas por la Issue #1, sin implementar endpoints de negocio, ownership, historial o mejores marcas.

## Alcance

- Alinear el parent y los starters de Maven con Spring Boot 3.5.5 y Java 21.
- Hacer explícitos los comandos y requisitos de configuración que existen realmente.
- Definir y registrar la fuente de verdad del esquema y una estrategia de evolución mediante scripts SQL versionados.
- Mantener una inicialización reproducible de una base MySQL 8.4 vacía mediante Docker Compose.
- Reconciliar el esquema inicial, las entidades JPA y la base real en enums, tablas, relaciones, restricciones y columnas afectadas.
- Mantener la referencia de cada resultado a la versión concreta del WOD y conservar el archivado de WOD personales con resultados.
- Mantener historial y mejores marcas como consultas derivadas, sin tablas ni columnas de resultados derivados.
- Mantener `exercise_results` fuera del alcance funcional de esta Issue; no se añaden ni se implementan capacidades para esa entidad.

## Comportamiento esperado

### Configuración y build

- `backend/pom.xml` utiliza Spring Boot 3.5.5, Java 21 y starters compatibles con esa versión.
- Maven Wrapper se ejecuta desde `backend/`.
- La aplicación local puede resolver el puerto MySQL documentado sin depender de valores secretos incluidos en Git.
- Docker Compose mantiene MySQL 8.4, el servicio `mysql`, el backend dependiente de su healthcheck y la configuración por variables de entorno.
- Hibernate valida el esquema existente, pero no lo crea ni lo modifica automáticamente.

### Fuente de verdad y evolución del esquema

- `Docker/mysql/init/` contiene scripts SQL numerados y versionados; `001_baseline.sql` es el baseline autoritativo para una base vacía.
- Docker Compose ejecuta los scripts en orden al inicializar un volumen vacío.
- Las evoluciones futuras se representan mediante nuevos scripts numerados y no se edita un script aplicado.
- La estrategia y sus límites quedan registrados en `PROJECT.md`: la inicialización de volúmenes vacíos es automática; la evolución de volúmenes existentes requiere una migración posterior explícita y no se simula como aplicada.
- No se añade Flyway, Liquibase ni otro gestor de migraciones porque no existe en el stack actual ni la Issue requiere introducir una dependencia de ese tipo.

### Persistencia de dominio

- `WodOrigin.PERSONAL` coincide con el valor `PERSONAL` almacenado en `wods.origin`.
- `user_identities` existe en el baseline y sus restricciones corresponden a la entidad JPA y a la unicidad por proveedor.
- La composición ordenada conserva una posición única por versión y referencia únicamente ejercicios existentes.
- `wod_results.user_id` y `wod_results.wod_version_id` son obligatorios y conservan ownership y versión ejecutada.
- `wods.deleted_at` permite archivar WOD personales con resultados sin perder versiones ni resultados históricos.
- No existe una segunda fuente persistida para historial o mejores marcas.
- Las tablas y entidades de `exercise_results` se conservan únicamente como legado compatible del estado actual; no se amplían ni se consideran parte de la funcionalidad de esta Issue.

## Criterios de aceptación

- [ ] Spring Boot efectivo y starters de `backend/pom.xml` están alineados con Spring Boot 3.5.5 y Java 21.
- [ ] Los comandos reproducibles de Maven Wrapper, Docker Compose y configuración local están documentados sin secretos reales.
- [ ] La fuente autoritativa del esquema y la estrategia de evolución versionada están registradas en `PROJECT.md`.
- [ ] El baseline SQL está numerado, versionado y permite inicializar una base vacía mediante Docker Compose.
- [ ] `WodOrigin.PERSONAL` y `wods.origin` usan el mismo valor persistido.
- [ ] `user_identities`, sus relaciones y restricciones están presentes tanto en el baseline como en la entidad JPA.
- [ ] Las relaciones de usuarios, WOD, versiones, composición y resultados mantienen las claves y restricciones necesarias para el dominio.
- [ ] Hibernate no genera ni modifica el esquema automáticamente y la aplicación valida el esquema configurado.
- [ ] Los resultados mantienen la versión concreta ejecutada y los WOD personales con resultados pueden conservarse archivados.
- [ ] No se incorpora funcionalidad de `exercise_results` ni una entidad persistida para historial o mejores marcas.
- [ ] Las verificaciones de build, tests, configuración, base real e integridad aplicables finalizan correctamente.

## Restricciones

- No implementar endpoints, ownership, autenticación, autorización, historial ni cálculo de mejores marcas.
- No modificar `DOMAIN.md` ni introducir decisiones de producto fuera de la Issue #1.
- No eliminar tablas, columnas, datos ni volúmenes existentes.
- No introducir Flyway, Liquibase, otro gestor de migraciones o una capa arquitectónica nueva.
- No usar `spring.jpa.hibernate.ddl-auto` como mecanismo de migración.
- No añadir secretos a archivos versionados.
- No ampliar el alcance de `exercise_results`.
