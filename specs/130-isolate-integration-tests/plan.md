# Plan de implementación

1. Separar la importación del `.env` del perfil común de Spring y trasladarla al perfil local/dev; añadir valores seguros de test y mantener `ddl-auto=validate`.
2. Añadir las dependencias de testcontainers administradas por Spring Boot 3.5.5 y configurar Surefire para activar `test` en cada ejecución de Maven.
3. Crear una configuración base de tests de integración que declare un `MySQLContainer` `mysql:8.4` con `@ServiceConnection`, base `wod_explorer_2_test`, credenciales sintéticas y ciclo de vida efímero gestionado por Spring Boot.
4. Copiar al contenedor, en orden, los scripts existentes de `Docker/mysql/init` desde el filesystem del proyecto, evitando duplicar el esquema y manteniendo las migraciones como fuente de verdad.
5. Implementar el guard de datasource como bean de la configuración de test. Validará el catálogo, el JDBC URL esperado del contenedor y los endpoints/identificadores de la base de desarrollo mediante metadatos de conexión antes de permitir que el contexto de test se complete.
6. Aplicar la configuración base a todos los tests `@SpringBootTest` detectados: OAuth, seguridad, proveedor y carga de contexto. Mantener los tests unitarios sin infraestructura externa.
7. Añadir pruebas unitarias del guard para la conexión segura y para el rechazo de la conexión de desarrollo, sin conectarse ni escribir en la base real.
8. Documentar en `backend/README.md` o la documentación existente los prerrequisitos de Docker, el comando habitual, el ciclo de vida efímero y el diagnóstico de errores.
9. Verificar con `git diff --check`, validación Maven, dos ejecuciones consecutivas de `./mvnw -q test`, revisión de configuración y comprobación read-only de que la base de desarrollo no fue modificada.

## Decisiones de seguridad

- No se usará el `.env` raíz como fuente de configuración de tests.
- No se usará el volumen `mysql_data` ni se ejecutará `down -v`, `TRUNCATE` o `DELETE` sobre la base de desarrollo.
- El contenedor de tests no tendrá volumen persistente y utilizará una base con nombre distinto.
- El guard no dependerá únicamente del nombre de la base: combinará catálogo efectivo, URL/host/puerto y URL generada por el contenedor.
