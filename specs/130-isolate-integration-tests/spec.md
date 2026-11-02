# SDD 130: Aislamiento de tests de integración

## Objetivo

Hacer que la suite de tests del backend use siempre una base MySQL de pruebas efímera y separada de la base de desarrollo, de forma que `./mvnw -q test` sea repetible y no pueda escribir en `wod_explorer_2`.

## Alcance

- Añadir el perfil Spring `test` y activarlo automáticamente en las ejecuciones Maven de tests.
- Ejecutar los tests `@SpringBootTest` contra un contenedor MySQL 8.4 efímero mediante la infraestructura de tests existente.
- Inicializar el contenedor con los scripts versionados de `Docker/mysql/init` sin modificar el esquema ni el índice UNIQUE de OAuth.
- Eliminar la importación accidental del `.env` raíz durante los tests y conservarla para la ejecución local/dev mediante un perfil separado.
- Añadir un guard de seguridad que valide la conexión efectiva antes de cualquier test y rechace catálogos o endpoints distintos del contenedor de pruebas.
- Revisar todos los tests que cargan el contexto Spring y documentar prerrequisitos, comandos y diagnóstico.

Fuera de alcance:

- Cambiar la lógica de OAuth, el índice `UNIQUE` o cualquier comportamiento de producción.
- Borrar, truncar o modificar la base/volumen de desarrollo.
- Introducir una ruta de producción exclusiva para tests.
- Omitir, deshabilitar o debilitar tests existentes.

## Comportamiento esperado

- `./mvnw -q test` activa el perfil `test` sin flags manuales.
- Las pruebas de contexto arrancan un contenedor MySQL `mysql:8.4` con una base dedicada, sin volumen persistente.
- El esquema y sus datos iniciales proceden de los scripts SQL versionados del proyecto.
- El guard obtiene la conexión efectiva y verifica el catálogo esperado y el JDBC URL generado por el contenedor; una conexión a `wod_explorer_2` o al endpoint de desarrollo falla durante la creación del contexto, antes de ejecutar métodos de test que escriban datos.
- Al terminar la JVM de Maven, el contenedor efímero se elimina; una segunda ejecución comienza con un esquema limpio y el fixture fijo `expired-code` no colisiona.
- Las ejecuciones locales de la aplicación siguen pudiendo cargar `../.env` bajo el perfil dev, mientras que el perfil test solo usa valores de test y la conexión del contenedor.

## Criterios de aceptación

- `./mvnw -q test` usa únicamente el datasource de pruebas y nunca `wod_explorer_2`.
- Dos ejecuciones consecutivas de la suite completa pasan, incluida `OAuthLoginHandoffIntegrationTests`.
- `expired-code` no falla por contaminación entre ejecuciones.
- Una configuración que apunta a la base de desarrollo es rechazada antes de escribir, con un mensaje diagnóstico claro.
- Los tests no leen accidentalmente credenciales o datasource desde el `.env` raíz.
- Se conserva el índice UNIQUE y la lógica OAuth; no se omiten tests.
- La base y el volumen de desarrollo permanecen intactos y no se ejecutan operaciones destructivas contra ellos.
- La documentación explica prerrequisitos Docker, ejecución, limpieza exclusiva del entorno de test e interpretación de fallos.
- Se ejecutan `git diff --check`, tests relevantes y las verificaciones aplicables, informando cualquier limitación.
