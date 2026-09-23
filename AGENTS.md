# AGENTS.md — wod-explorer

## Proyecto

Aplicación web Full Stack para explorar WODs y ejercicios de CrossFit, registrar resultados de usuarios y consultar evolución y marcas personales.

El frontend está desarrollado con React + TypeScript.

La persistencia principal se realiza en MySQL 8.4 ejecutado mediante Docker Compose.

El backend se implementará con Java + Spring Boot cuando la spec correspondiente lo solicite.

Los archivos JSON existentes pertenecen a la versión inicial del proyecto y no deben considerarse la fuente de verdad una vez que la funcionalidad sea migrada a la base de datos.

`DOMAIN.md` define el dominio funcional de WOD Explorer 2.0. Debe consultarse antes de diseñar o modificar el modelo de datos. No debe modificarse salvo petición expresa.

## Stack

### Frontend

- Framework o librería principal: `<framework>`

- Lenguaje de programación: `<lenguaje>`

- Sistema de estilos: `<sistema-de-estilos>`

- Validación y tipado de dato

Lee también:
`frontend/AGENTS.md`
Sus reglas son obligatorias para cualquier cambio relacionado con frontend.
El lenguaje, framework, herramientas y arquitectura utilizados deben obtenerse
de `frontend/AGENTS.md` y de la configuración real del proyecto.
No asumas un stack frontend concreto desde este archivo raíz.

### Backend

Para cualquier trabajo relacionado con:

- código del backend;
- lógica de negocio;
- APIs y servicios;
- acceso y persistencia de datos;
- configuración del backend;
- dependencias y herramientas de build;
- seguridad y autenticación;
- tests del backend;
- arquitectura del backend;

lee también:
`backend/AGENTS.md`
Sus reglas son obligatorias para cualquier cambio relacionado con backend.
El lenguaje, framework, herramientas y arquitectura utilizados deben obtenerse
de `backend/AGENTS.md` y de la configuración real del proyecto.
No asumas un stack backend concreto desde este archivo raíz.

### Base de datos

- Sistema de gestión de base de datos: MySQL 8.4.
- Herramientas de infraestructura y ejecución: Docker Compose.
- Gestión de esquema y migraciones.
- Persistencia e integridad de datos.
- MCP disponible para inspección de la base de datos real: `database`.

Para cualquier trabajo relacionado con base de datos o persistencia:

1. Lee también `database/AGENTS.md`.
2. Sus reglas son obligatorias para cualquier cambio relacionado con base de datos o persistencia.
3. Usa el MCP `database` cuando sea necesario conocer o verificar el estado real de la base de datos.
4. No asumas que el estado de la base de datos coincide con entidades, scripts, migraciones o documentación: compruébalo cuando sea relevante.

La estrategia de migraciones y la arquitectura de persistencia deben obtenerse de `database/AGENTS.md` y de la configuración real del proyecto.

El motor es MySQL 8.4 y el entorno de ejecución es Docker Compose.

No sustituyas MySQL 8.4 ni Docker Compose por otra tecnología sin autorización explícita.

## Ejecución de comandos

Antes de ejecutar cualquier comando, identifica el área del proyecto en la que estás trabajando y consulta sus instrucciones específicas:

- Para frontend, lee `frontend/AGENTS.md`.

- Para backend, lee `backend/AGENTS.md`.

- Para base de datos o persistencia, lee `Docker/AGENTS.md`.

Los comandos, herramientas, gestores de paquetes, sistemas de build y procedimientos de ejecución deben obtenerse del `AGENTS.md` específico del área y de la configuración real del proyecto.

Usa únicamente comandos soportados realmente por el proyecto.

No asumas herramientas, gestores de paquetes, sistemas de build ni comandos que no estén definidos o presentes en el proyecto.

## Estructura

Mantén una separación clara de responsabilidades entre las distintas áreas del proyecto.
Organiza el código según la arquitectura, convenciones y estructura definidas por el proyecto.
Cuando corresponda, separa adecuadamente:

- interfaz y presentación;
- lógica de aplicación y negocio;
- datos y modelos;
- tipos y contratos;
- validación;
- utilidades compartidas;
- acceso a datos y persistencia;
- configuración e infraestructura;
- tests.

Evita colocar lógica compleja en capas cuya responsabilidad principal sea la presentación.
Mantén desacopladas las distintas áreas del sistema y evita dependencias innecesarias entre ellas.
Respeta la arquitectura existente antes de introducir nuevas capas, abstracciones o patrones.
No introduzcas capas adicionales únicamente por seguir un patrón arquitectónico si no aportan una responsabilidad real al proyecto.

Para reglas específicas de estructura y arquitectura:

- Para frontend, consulta `frontend/AGENTS.md`.
- Para backend, consulta `backend/AGENTS.md`.
- Para base de datos o persistencia, consulta `Docker/AGENTS.md`.
  Las reglas específicas definidas en estos archivos son obligatorias dentro de su área correspondiente.

## Datos y persistencia

Respeta la estrategia de persistencia y las fuentes de datos definidas por el proyecto.
No asumas un motor de base de datos, sistema de almacenamiento, ORM o mecanismo de persistencia concreto.
No modifiques el esquema, modelo de datos, migraciones o estructura de persistencia sin que el alcance de la tarea o la spec activa lo autorice.
Evita mantener múltiples fuentes de verdad para los mismos datos.
Cuando una fuente de datos sea sustituida o migrada, utiliza la fuente definida como principal por la arquitectura del proyecto y elimina dependencias obsoletas cuando el alcance de la tarea lo permita.
Valida los datos en las fronteras correspondientes de la aplicación.
Mantén separadas, cuando corresponda, la lógica de negocio y la lógica de acceso a datos.
Para cualquier trabajo relacionado con base de datos o persistencia, consulta:
`database/AGENTS.md`

Sus reglas son obligatorias para cualquier cambio relacionado con datos y persistencia.
La tecnología, herramientas, estrategia de migraciones, modelo de datos y procedimientos específicos deben obtenerse de `database/AGENTS.md` y de la configuración real del proyecto.

## Skills

Las skills proporcionan conocimiento especializado, buenas prácticas y criterios técnicos para ayudar al agente durante el desarrollo.

Las skills no sustituyen ni pueden contradecir las decisiones definidas por:

1. la constitución del proyecto;
2. la spec activa;
3. las reglas del `AGENTS.md` raíz;
4. las reglas del `AGENTS.md` específico del área.

No es obligatorio utilizar todas las skills disponibles en cada tarea.

Antes de utilizar una skill:

- identifica el área y el alcance real de la tarea;
- consulta el `AGENTS.md` específico del área correspondiente;
- identifica las skills definidas como relevantes para esa tecnología o tipo de trabajo;
- utiliza únicamente las skills que aporten conocimiento necesario para la tarea.

Las skills específicas de tecnologías, lenguajes, frameworks, herramientas o disciplinas deben declararse en el `AGENTS.md` del área correspondiente.

Por ejemplo:

- las skills relacionadas con frontend deben definirse en `frontend/AGENTS.md`;
- las skills relacionadas con backend deben definirse en `backend/AGENTS.md`;
- las skills relacionadas con base de datos y persistencia deben definirse en `database/AGENTS.md`.

Una skill no autoriza por sí sola a:

- introducir nuevas dependencias;
- cambiar versiones;
- modificar la arquitectura;
- introducir patrones o abstracciones innecesarias;
- ampliar el alcance de una tarea;
- modificar decisiones establecidas por la spec.

Utiliza las skills como conocimiento especializado, no como fuente de requisitos.

## Reglas generales

- Lee `docs/constitution.md` antes de realizar cambios en el proyecto.
- Lee la spec activa dentro de `specs/` antes de implementar una funcionalidad.
- La spec activa es la fuente de verdad funcional para el trabajo definido en ella.
- No implementes funcionalidades fuera del alcance de la spec activa.
- No modifiques archivos dentro de `specs/` salvo petición explícita o cuando el workflow definido por el proyecto lo requiera.
- No añadas dependencias sin una necesidad técnica clara y relacionada con la tarea.
- No introduzcas nuevas capas, servicios, sistemas de autenticación, infraestructura o integraciones externas fuera del alcance de la spec activa.
- No modifiques modelos, esquemas o estructuras de persistencia fuera del alcance de la spec activa.
- No realices refactors amplios que no sean necesarios para completar la tarea actual.
- No introduzcas patrones arquitectónicos, patrones de diseño o abstracciones sin una necesidad concreta.
- No cambies versiones principales de lenguajes, frameworks, dependencias o herramientas sin autorización explícita.
- No realices commits, push, merge, creación de PR o cierre de Issues automáticamente salvo que el workflow correspondiente o una instrucción explícita lo autorice.

cuta únicamente las verificaciones aplicables a las áreas del proyecto modificadas.

Las verificaciones concretas deben obtenerse de la configuración real del proyecto y del `AGENTS.md` específico de cada área.

## Al terminar cualquier tarea

Ejecuta únicamente las verificaciones aplicables a las áreas del proyecto modificadas.
Las verificaciones concretas deben obtenerse de la configuración real del proyecto y del `AGENTS.md` específico de cada área.

### Si se modifica frontend

Consulta:
`frontend/AGENTS.md`
Ejecuta las verificaciones de tests, lint, tipado, build y otras comprobaciones definidas allí que sean aplicables a la tarea.

### Si se modifica backend

Consulta:
`backend/AGENTS.md`
Ejecuta las verificaciones de tests, compilación, build, ejecución y otras comprobaciones definidas allí que sean aplicables a la tarea.

### Si se modifica base de datos o persistencia

Consulta:
`database/AGENTS.md`
Ejecuta las verificaciones de esquema, migraciones, integridad, persistencia y otras comprobaciones definidas allí que sean aplicables a la tarea.

### Reglas generales de verificación

- No inventes comandos de verificación que no existan en el proyecto.
- No omitas una verificación obligatoria definida para el área modificada.
- Si una verificación falla, no declares la tarea como completada.
- Informa claramente de cualquier verificación que no haya podido ejecutarse y del motivo.

### Siempre

- Indica claramente qué archivos has creado, modificado o eliminado.

- Indica qué verificaciones has ejecutado y su resultado.

- Si algún requisito de la spec no se ha podido cumplir, indícalo explícitamente.

- No marques una tarea como terminada si las verificaciones aplicables fallan.

## Documentación obligatoria

Antes de modificar código:

1. Lee `docs/constitution.md` para respetar los principios no negociables.

2. Lee la spec activa dentro de `specs/`.

3. Lee `PRODUCT.md` para entender el propósito y las restricciones del producto.

4. Lee `DOMAIN.md` antes de realizar tareas que afecten al dominio o a la base de datos.

5. Lee este `AGENTS.md`.

6. Lee los `AGENTS.md` específicos del área afectada.

7. Lee `DESIGN.md` cuando la tarea afecte a interfaz, UX o diseño visual.

8. Lee las skills locales relevantes dentro de `.agents/skills/`.

No es necesario leer skills que no tengan relación con la tarea actual.
Si alguno de estos archivos no existe, no asumas su contenido ni inventes reglas en su nombre.

## Prioridad de instrucciones

Cuando varias fuentes de instrucciones sean aplicables, utiliza el siguiente orden de prioridad:

1. `docs/constitution.md`

2. spec activa

3. `PRODUCT.md`

4. `DOMAIN.md` para las decisiones funcionales y de datos

5. `AGENTS.md` específico del área afectada

6. `DESIGN.md`, cuando aplique

7. skills relevantes

La constitución define los principios no negociables del proyecto.

La spec activa define el comportamiento, alcance y requisitos funcionales del trabajo que debe realizarse.

`PRODUCT.md` define el propósito, contexto y restricciones generales del producto.

El `AGENTS.md` raíz define las reglas generales de trabajo y comportamiento del agente.

Los `AGENTS.md` específicos definen las reglas técnicas y convenciones aplicables a cada área del proyecto.

`DESIGN.md` define las decisiones de diseño e identidad visual cuando la tarea afecte a interfaz, UX o experiencia visual.

Las skills aportan conocimiento técnico y buenas prácticas, pero no pueden modificar ni ampliar por sí mismas el alcance de una tarea ni contradecir instrucciones de mayor prioridad.

Si existe una contradicción entre instrucciones de distinto nivel, prevalece la de mayor prioridad.

Si el conflicto no puede resolverse aplicando esta jerarquía o existe una ambigüedad que impide continuar de forma segura, no improvises: detén la implementación e indica claramente el conflicto.

## Guardrails

Estas reglas se aplican a cualquier trabajo realizado en el proyecto.

El agente debe detenerse y solicitar autorización antes de:

- realizar cambios destructivos o irreversibles;

- eliminar archivos o recursos relevantes del proyecto;

- modificar secretos, credenciales o configuración sensible;

- cambiar decisiones arquitectónicas fundamentales;

- realizar cambios fuera del alcance de la tarea activa;

- sobrescribir trabajo existente cuya finalidad no esté clara.

El agente nunca debe:

- introducir secretos o credenciales reales en Git;

- desactivar tests, validaciones o mecanismos de seguridad para hacer pasar una tarea;

- ignorar errores conocidos y declarar una tarea como completada;

- realizar cambios no relacionados con la tarea actual.

Los `AGENTS.md` especializados pueden añadir guardrails adicionales para su ámbito.

## Configuración del proyecto

`PROJECT.md` es la fuente de verdad de la configuración técnica del proyecto.

Los `AGENTS.md` especializados deben consultar `PROJECT.md` para conocer las tecnologías, versiones, herramientas, comandos, MCPs y fuentes de verdad configuradas.

Los valores `<...>` representan placeholders de la plantilla.

Durante la inicialización de un proyecto, los placeholders necesarios deben sustituirse por valores concretos.

No asumir valores para placeholders que todavía no hayan sido resueltos.
