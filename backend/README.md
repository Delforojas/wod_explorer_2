# Backend

## Prerequisitos

- Java 21.
- Docker Desktop iniciado y accesible desde la terminal de macOS.
- Ejecutar los comandos desde `backend/` usando `./mvnw`.

## Tests

```bash
./mvnw -q test
```

Maven fuerza el perfil Spring `test`. Los tests que cargan el contexto arrancan un contenedor MySQL 8.4 efímero mediante Testcontainers, usan la base `wod_explorer_2_test` y cargan los scripts versionados de `../Docker/mysql/init`. No se reutiliza el volumen `mysql_data` ni se importa el `.env` raíz en este perfil.

El contenedor no tiene volumen persistente y el ciclo de vida lo gestiona Spring Boot/Testcontainers. Una ejecución nueva de Maven crea un esquema limpio; no es necesario ejecutar `docker compose down -v`. La base de desarrollo `wod_explorer_2` no debe borrarse, truncarse ni limpiarse para resolver fallos de tests.

## Diagnóstico

- `Could not find a valid Docker environment`: iniciar Docker Desktop y repetir el comando.
- `Datasource de tests rechazado`: revisar que el test no esté activando `dev` ni inyectando una URL externa; el guard compara el catálogo y el endpoint efectivos con el contenedor creado por Testcontainers.
- Error durante la inicialización SQL: revisar los scripts de `../Docker/mysql/init` y la salida de Maven; no ejecutar esos scripts contra la base de desarrollo.

El guard se ejecuta al crear el contexto de Spring y solo consulta metadatos de la conexión. Si detecta `wod_explorer_2` o un endpoint distinto del contenedor efímero, aborta antes de que comiencen los métodos de test que escriben datos.
