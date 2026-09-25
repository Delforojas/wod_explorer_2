# Plan: Baseline ejecutable y persistencia del backend

## Enfoque

Aplicar el cambio mínimo sobre la configuración existente y el esquema SQL actual para que el backend use Spring Boot 3.5.5, valide un esquema explícito y pueda reconstruir una base vacía desde un baseline versionado. Mantener la arquitectura `Controller → Service → Repository → JPA → MySQL` y no implementar casos de uso de Issues posteriores.

La estrategia de esquema será SQL versionado dentro de `Docker/mysql/init/`, usando scripts numerados ejecutados por Docker Compose durante la inicialización de un volumen vacío. Se documentará explícitamente que la evolución de volúmenes existentes requiere scripts posteriores y una ejecución de migración explícita; esta Issue no introduce un gestor de migraciones.

## Componentes y archivos afectados

- `backend/pom.xml`: parent y starters compatibles con Spring Boot 3.5.5.
- `backend/src/main/resources/application.properties`: puerto local documentado y validación Hibernate del esquema.
- `backend/src/main/java/.../entity/WodOrigin.java`: alineación del enum con el valor persistido.
- `backend/src/main/java/.../entity/Exercise.java`: longitudes explícitas compatibles con MySQL.
- `Docker/mysql/init/001_baseline.sql`: baseline SQL versionado, `user_identities` y restricciones existentes coherentes.
- `docker-compose.yml`: conservar la ejecución ordenada del directorio de inicialización y la configuración existente.
- `.env.example`: placeholders seguros y valores de puerto coherentes con Compose.
- `PROJECT.md`: registrar comandos reales, configuración Docker y fuente/estrategia del esquema.
- `specs/002-baseline-persistencia/`: contrato, plan y tasks de la Issue.

No se modificarán `DOMAIN.md`, endpoints, servicios de negocio, autenticación, frontend ni otras Issues.

## Cambios técnicos previstos

1. Cambiar Spring Boot 4.1.1 por 3.5.5 y sustituir únicamente los starters que no existen o no corresponden al baseline 3.5.5.
2. Configurar `spring.jpa.hibernate.ddl-auto=validate` y un valor por defecto local para `MYSQL_PORT`, sin incluir credenciales.
3. Renombrar el dump de inicialización a `001_baseline.sql` y conservar sus datos de catálogo existentes.
4. Añadir `user_identities` con las dos restricciones únicas ya declaradas por `UserIdentity`.
5. Mantener las relaciones de WOD, versiones, composición y resultados, incluyendo `deleted_at`, `wod_version_id` y las claves de composición.
6. Alinear `WodOrigin` con `PERSONAL` y las longitudes de enums de `Exercise` con el esquema.
7. Registrar en `PROJECT.md` la estrategia SQL versionada y los comandos reales obtenidos de la configuración.

## Estrategia de verificación

- Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- Ejecutar `./mvnw -q test` desde `backend/`.
- Ejecutar `./mvnw -q package` desde `backend/` si el build permite completarlo con la configuración disponible.
- Ejecutar `docker compose config` para validar Compose y sus variables requeridas sin iniciar ni destruir servicios.
- Verificar mediante `database` que MySQL 8.4 está accesible y que tablas, columnas, claves, relaciones e índices afectados coinciden con el baseline.
- Consultar la integridad referencial de WOD, versiones, composición, resultados e identidades sin modificar datos.
- Ejecutar `git diff --check` y revisar que no haya secretos ni cambios fuera del alcance.
