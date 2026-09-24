# AGENTS.md — Backend

<backend_language>

<language_version>

<backend_framework>

<framework_version>

<build_tool>

<build_command>

<persistence_framework>

<database_engine>

<api_base_path>

<test_framework>

<database_mcp>

<repository_mcp>

## Ámbito

Este archivo aplica a todo el contenido dentro de `backend/`.

Las reglas globales definidas en el `AGENTS.md` raíz siguen siendo obligatorias.

Si existe conflicto entre este archivo y el `AGENTS.md` raíz, prevalecen las reglas globales salvo que una spec autorice explícitamente una excepción.

Las reglas relacionadas específicamente con persistencia y base de datos deben respetar también `database/AGENTS.md` cuando exista.

---

## Tecnología y configuración

Configuración del backend de WOD Explorer 2.0. La configuración real del repositorio y `PROJECT.md` son la fuente de verdad para versiones y dependencias instaladas. Si difieren de lo indicado aquí, documentar la discrepancia antes de cambiar el stack.

- Lenguaje: `Java`
- Versión del lenguaje: `21`
- Framework: `Spring Boot`
- Versión del framework: `3.5.5`
- Gestor de dependencias / build: `Maven Wrapper`
- Framework de persistencia: `Spring Data JPA / Hibernate`
- Base de datos: `MySQL 8.4`
- Framework de testing: `JUnit 5 + Spring Boot Test`
- Ruta base de la API: `/api`

No asumir tecnologías que no hayan sido definidas por el proyecto.

No asumir dependencias que no estén presentes en `pom.xml`. Utilizar Maven Wrapper (`./mvnw` desde el directorio que lo contiene), sin asumir una instalación global de Maven.

---

## Arquitectura

Respetar la arquitectura definida por el proyecto.

Arquitectura backend sencilla por capas:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Spring Data JPA / Hibernate
     ↓
MySQL 8.4
```

Los DTOs definen la entrada y salida de los controllers; la validación se aplica en la entrada y las reglas de negocio en los servicios. Utilizar mappers para Entity ↔ DTO cuando sea necesario. La seguridad controla el acceso y la autorización cuando la funcionalidad esté requerida.

No introducir arquitectura hexagonal, Clean Architecture, ports/adapters, CQRS ni capas adicionales salvo que la spec activa lo requiera y se respeten los guardrails arquitectónicos.

Cada capa debe mantener responsabilidades claramente separadas.

### Entrada / Controller

Cuando la arquitectura utilice controllers o una capa equivalente:

- Recibir requests.
- Validar datos de entrada.
- Delegar la ejecución en la capa correspondiente.
- Construir respuestas.

Evitar introducir lógica de negocio directamente en esta capa.

### Service / Application

Cuando exista una capa de servicios o aplicación:

- Implementar y coordinar casos de uso.
- Aplicar reglas de negocio.
- Coordinar acceso a persistencia.
- Realizar transformaciones necesarias.
- Gestionar transacciones cuando corresponda.

La lógica reutilizable debe permanecer fuera de las capas de transporte.

### Repository / Persistence

Cuando exista una capa de repositorios o persistencia:

- Acceder a datos.
- Ejecutar consultas.
- Persistir y recuperar información.

No introducir lógica de negocio en esta capa salvo que la arquitectura definida por el proyecto establezca explícitamente otro patrón.

### Modelo de persistencia

Los modelos de persistencia representan los datos almacenados.

No utilizar directamente modelos internos de persistencia como contratos públicos de la API cuando pueda producir:

- acoplamiento innecesario;
- exposición de campos internos;
- problemas de seguridad;
- dificultad para evolucionar la API.

### DTO / Contracts

Cuando el stack utilice DTOs o contratos equivalentes:

- separar modelos de entrada y salida cuando aporte claridad;
- mantener contratos explícitos;
- evitar exponer información interna;
- favorecer estructuras inmutables cuando el lenguaje y framework lo permitan.

---

## Lenguaje

Utilizar características compatibles con:

```text
Java 21
```

Priorizar:

- código legible;
- nombres descriptivos;
- funciones y métodos pequeños;
- responsabilidad única;
- inmutabilidad cuando sea apropiada;
- tipado claro cuando el lenguaje lo permita;
- soluciones simples antes que abstracciones innecesarias.

Evitar:

- funciones o métodos excesivamente largos;
- módulos o clases con múltiples responsabilidades;
- duplicación innecesaria;
- abstracciones prematuras;
- metaprogramación o reflection salvo necesidad justificada;
- complejidad accidental.

Seguir las convenciones idiomáticas del lenguaje utilizado.

---

## Framework

Framework principal:

```text
Spring Boot 3.5.5
```

Seguir las convenciones oficiales y patrones establecidos por el framework.

Preferir mecanismos estándar del framework frente a implementaciones personalizadas cuando resuelvan correctamente el problema.

No añadir dependencias nuevas salvo que:

1. sean necesarias para cumplir la spec activa;
2. exista una justificación técnica clara;
3. no exista ya una solución adecuada en el stack actual.

No sustituir componentes fundamentales del stack sin autorización explícita.

## Persistencia

Tecnología de persistencia:

```text
Spring Data JPA / Hibernate
```

Base de datos:

```text
MySQL 8.4
```

El código debe respetar el esquema y las reglas de persistencia definidas por el proyecto.

`DOMAIN.md` define las reglas funcionales y relaciones conceptuales del dominio. `database/AGENTS.md` define las reglas específicas de esquema, migraciones, integridad y operaciones sobre la base de datos.

No utilizar generación automática de esquema de Hibernate como sustituto del mecanismo de migraciones definido por el proyecto.

No asumir:

- tablas;
- columnas;
- tipos;
- índices;
- constraints;
- relaciones;
- datos existentes.

Cuando una tarea dependa del estado real de la base de datos, utilizar las herramientas de inspección disponibles.

No modificar automáticamente el esquema desde el backend salvo que el proyecto defina explícitamente ese mecanismo.

Todo cambio relacionado con esquema, migraciones o datos debe respetar `database/AGENTS.md` cuando exista.

---

## API

Ruta base:

```text
<api_base_path>
```

Mantener contratos y rutas consistentes.

Cuando se utilice HTTP:

- utilizar métodos HTTP apropiados;
- utilizar códigos de estado coherentes;
- validar correctamente los datos de entrada;
- mantener una estructura consistente para errores;
- evitar exponer detalles internos de implementación.

No devolver respuestas exitosas cuando la operación haya fallado.

No introducir cambios incompatibles en contratos públicos existentes sin autorización o sin que la spec lo requiera.

---

## Validación

Validar datos en los límites apropiados del sistema.

Cuando el framework proporcione mecanismos declarativos de validación, preferirlos frente a validaciones repetitivas implementadas manualmente.

Separar:

```text
Validación estructural / entrada
              ↓
      Reglas de negocio
```

Las reglas de negocio deben permanecer en la capa correspondiente y no dispersarse entre controllers, handlers o adaptadores.

No confiar únicamente en validaciones realizadas por el cliente.

---

## Gestión de errores

Utilizar el mecanismo de gestión de errores recomendado por `Spring Boot`.

Centralizar el tratamiento de errores cuando el framework lo permita.

Evitar:

- `try/catch` repetitivos;
- ignorar excepciones silenciosamente;
- devolver stack traces al cliente;
- exponer información interna;
- convertir todos los errores en una misma respuesta genérica.

Los errores públicos deben mantener una estructura consistente cuando el proyecto exponga una API.

---

## Seguridad

Nunca:

- almacenar contraseñas en texto plano;
- devolver hashes de contraseñas;
- registrar secretos;
- incluir tokens o credenciales en logs;
- versionar credenciales reales;
- exponer stack traces o información sensible;
- desactivar mecanismos de seguridad para facilitar una implementación.

Para contraseñas utilizar algoritmos específicamente diseñados para password hashing cuando la funcionalidad exista.

Aplicar el principio de mínimo privilegio.

No introducir:

- autenticación;
- autorización;
- roles;
- tokens;
- sesiones;
- mecanismos equivalentes;

salvo que estén definidos por la spec activa o por la arquitectura del proyecto.

---

## Testing

Toda funcionalidad nueva debe incluir tests proporcionales a su impacto.

Framework de testing:

```text
JUnit 5 + Spring Boot Test
```

Priorizar, cuando correspondan:

- tests unitarios;
- tests de componentes o módulos;
- tests de API;
- tests de persistencia;
- tests de integración;
- tests end-to-end cuando aporten valor real.

Los tests unitarios no deben depender innecesariamente de infraestructura externa.

No eliminar, desactivar o debilitar tests existentes únicamente para conseguir que una implementación pase.

Un test debe comprobar comportamiento relevante, no simplemente aumentar cobertura.

---

## Comandos

Herramienta principal:

```text
Maven Wrapper
```

Comandos del proyecto (pendientes de verificar y configurar):

```text
Install: pendiente de verificar en la configuración real
Validate: pendiente de verificar en la configuración real
Test: pendiente de verificar en la configuración real
Build: pendiente de verificar en la configuración real
Run: pendiente de verificar en la configuración real
```

Antes de completar esta lista, inspeccionar `pom.xml`, Maven Wrapper, módulos, perfiles, plugins y configuración de CI disponibles. Confirmar el directorio de ejecución y los requisitos de entorno. No inventar objetivos, opciones ni perfiles Maven. Si la configuración no está disponible, mantener los comandos pendientes y reportar la verificación no realizada.

Utilizar los comandos definidos por el proyecto.

No asumir que herramientas globales están instaladas cuando el proyecto proporciona wrappers o mecanismos reproducibles.

Antes de considerar una tarea completada, ejecutar los comandos de validación aplicables.

---

## Skills

Las skills locales del backend se encuentran bajo `.agents/skills/backend/`, con rutas relativas a la raíz del repositorio, no a `backend/`. Leer el `SKILL.md` correspondiente antes de aplicarlo y utilizar únicamente las skills necesarias para la tarea activa.

### `java-springboot`

Ruta: `.agents/skills/backend/java-springboot/SKILL.md`.

Utilizar para desarrollo general con Java y Spring Boot: configuración, controllers, services, inyección de dependencias, DTOs, validación, gestión de errores, logging y testing general del backend.

### `springboot-patterns`

Ruta: `.agents/skills/backend/springboot-patterns/SKILL.md`.

Utilizar para estructura Controller → Service → Repository, APIs REST, DTOs y contratos, transacciones, paginación, manejo centralizado de errores y patrones de Spring Boot.

No introducir caching, procesamiento asíncrono, mensajería, rate limiting u otros mecanismos descritos por la skill salvo que la spec activa los requiera.

### `spring-data-jpa`

Ruta: `.agents/skills/backend/spring-data-jpa/SKILL.md`.

Utilizar para entidades JPA, relaciones, repositories, queries, estrategias de carga, transacciones, paginación, índices relacionados con consultas, problemas N+1 y comportamiento de cascadas.

Respetar `DOMAIN.md` en las decisiones funcionales del modelo y `database/AGENTS.md` en los cambios físicos de esquema o migraciones. No exponer entidades JPA directamente como contratos públicos de la API.

### `spring-boot-security-jwt`

Ruta: `.agents/skills/backend/spring-boot-security-jwt/SKILL.md`.

Utilizar únicamente cuando la tarea afecte a autenticación, autorización, Spring Security, JWT, filtros de seguridad, usuarios autenticados, protección de endpoints, ownership de recursos o tests de seguridad.

La existencia de esta skill no obliga a usar JWT ni autoriza a introducir OAuth2, RBAC, ABAC, Redis, refresh tokens, blacklisting u otros mecanismos no requeridos por la spec activa.

---

### Reglas de uso

Las skills no son requisitos funcionales y no autorizan por sí mismas a añadir dependencias, cambiar arquitectura, modificar el modelo de dominio o el esquema, introducir infraestructura ni ampliar el alcance de la spec.

Si varias skills son aplicables, utilizar únicamente las necesarias y resolver cualquier conflicto mediante la jerarquía de instrucciones definida en el `AGENTS.md` raíz. Si falta un archivo de skill, comunicarlo sin asumir su contenido.

Las skills proporcionan patrones y conocimiento técnico especializado.

No pueden contradecir:

1. la spec activa;
2. este `AGENTS.md`;
3. el `AGENTS.md` raíz;
4. los guardrails aplicables.

Si una skill no es relevante para la tarea actual, no debe utilizarse innecesariamente.

---

## MCP y herramientas externas

Herramientas disponibles:

```text
Database MCP: database
Repository MCP: github
Documentation MCP: context7
```

Utilizar únicamente las herramientas configuradas y disponibles en el proyecto.

### Base de datos

Cuando exista `database`, puede utilizarse para:

- inspeccionar tablas;
- comprobar columnas;
- revisar relaciones;
- consultar índices;
- validar datos existentes;
- verificar resultados.

Las operaciones destructivas deben respetar los guardrails de `database/AGENTS.md`.

### Repositorio

Cuando exista `github`, puede utilizarse para:

- consultar Issues;
- comprobar requisitos;
- revisar Pull Requests;
- consultar ramas;
- comprobar estado remoto;
- verificar que una implementación cubre el trabajo solicitado.

---

### Documentación

Cuando esté configurado y disponible, utilizar `context7` para consultar documentación de Java, Spring Boot, Spring Data JPA/Hibernate y otras bibliotecas realmente utilizadas por el proyecto, priorizando las versiones instaladas.

La documentación consultada no autoriza a añadir dependencias, actualizar versiones, cambiar arquitectura ni ampliar el alcance de la spec.

No realizar acciones destructivas o irreversibles mediante herramientas externas sin autorización cuando estén protegidas por los guardrails.

---

## Specs

La spec activa define el alcance de implementación.

No implementar funcionalidad fuera de la spec aunque:

- parezca necesaria;
- exista una Issue relacionada;
- pueda ser útil posteriormente;
- facilite una implementación futura.

Si se detecta una contradicción entre la spec y otra fuente de requisitos, detener la implementación y documentar el conflicto.

No ampliar silenciosamente el alcance.

---

## Guardrails

El agente debe detenerse y solicitar autorización antes de:

- introducir cambios incompatibles en contratos públicos existentes;
- eliminar endpoints o funcionalidades existentes;
- cambiar decisiones arquitectónicas fundamentales;
- sustituir tecnologías principales del backend;
- introducir o sustituir mecanismos de autenticación o autorización;
- modificar configuración de seguridad sensible;
- realizar operaciones que puedan provocar pérdida de datos;
- realizar cambios destructivos o irreversibles;
- realizar cambios fuera del alcance de la spec activa.

El agente nunca debe:

- introducir secretos o credenciales reales;
- desactivar mecanismos de seguridad para resolver una tarea;
- eliminar validaciones únicamente para evitar errores;
- desactivar o eliminar tests únicamente para conseguir que el build pase;
- ocultar errores de compilación, testing o ejecución;
- declarar una tarea completada cuando las verificaciones obligatorias fallen.

Los cambios relacionados con persistencia deben respetar además los guardrails definidos en `database/AGENTS.md`.

Los guardrails globales definidos en el `AGENTS.md` raíz siguen teniendo prioridad.

---

## Verificación final

Antes de considerar una tarea backend completada:

1. Revisar los cambios realizados.
2. Comprobar que la implementación respeta la arquitectura definida.
3. Ejecutar las validaciones aplicables.
4. Ejecutar los tests relevantes.
5. Ejecutar el build cuando corresponda.
6. Comprobar que no existen secretos o credenciales versionados.
7. Comprobar que no se ha ampliado el alcance de la tarea.
8. Verificar el cumplimiento de la spec activa.
9. Comprobar que no se han violado los guardrails.
10. Reportar cualquier error o verificación que no haya podido completarse.

Una tarea no debe considerarse completada si una verificación obligatoria falla.
