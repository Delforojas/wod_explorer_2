# PROJECT.md

Configuración central del proyecto WOD Explorer 2.0. Este archivo registra las tecnologías y herramientas decididas y señala los detalles aún pendientes. No se deben asumir valores marcados como pendientes.

---

## Producto

- Nombre: WOD Explorer 2.0
- Descripción: aplicación web para explorar ejercicios y WOD de CrossFit, crear WOD personales y registrar resultados e historial.
- Idioma principal: español
- Dominio funcional: `DOMAIN.md`

---

## Frontend

- Framework: React
- Lenguaje: TypeScript
- Versión: TypeScript 5.x
- Build tool: Vite
- Arquitectura: feature-based
- Styling: CSS
- Validación: Zod
- Estado: React (`useState`, `useReducer` y Context cuando corresponda)
- Testing: Vitest
- Idioma de interfaz: español
- Ruta base API: `/api`
- Fuente de diseño: `DESIGN.md`

La arquitectura y las reglas específicas del frontend están definidas en `frontend/AGENTS.md`.

### Comandos frontend

- Install: `npm install`
- Run: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`

Los scripts definidos en `frontend/package.json` son la fuente de verdad para los comandos disponibles.

## Diseño

- Fuente de verdad: `DESIGN.md` para las decisiones de diseño; referencia visual concreta pendiente de definir.
- MCP de diseño: No configurado.
- Referencia visual: Pendiente de definir.

---

## Backend

- Lenguaje: Java
- Versión: 21
- Framework: Spring Boot
- Versión del framework: 3.5.5
- Build tool: Maven Wrapper.
- Arquitectura: capas sencillas `Controller → Service → Repository → Spring Data JPA/Hibernate → MySQL`; DTOs para los contratos de la API y validación en la entrada. Mantener esta arquitectura simple y no añadir capas o patrones sin necesidad de la spec activa.
- Persistencia: Spring Data JPA / Hibernate.
- Base de datos: MySQL 8.4.
- Testing: JUnit 5 + Spring Boot Test.
- Ruta base API: `/api`.

### Comandos backend

- Install: Pendiente de definir.
- Preparación local: crear `../.env` desde `.env.example` y completar sus variables requeridas; `application.properties` importa ese archivo opcionalmente cuando Maven se ejecuta desde `backend/`.
- Run: `./mvnw spring-boot:run` desde `backend/`, con `../.env` configurado o las variables de entorno exportadas.
- Validate: `./mvnw -q -DskipTests validate` desde `backend/`, con `../.env` configurado o las variables de entorno exportadas.
- Test: `./mvnw -q test` desde `backend/`, con `../.env` configurado o las variables de entorno exportadas.
- Build: `./mvnw -q package` desde `backend/`, con `../.env` configurado o las variables de entorno exportadas.

Maven no carga automáticamente el archivo `.env` por sí mismo. La aplicación importa `../.env` para las ejecuciones locales desde `backend/`; las variables exportadas explícitamente y las variables inyectadas por Docker Compose tienen prioridad. `JWT_SECRET`, `MYSQL_USER`, `MYSQL_PASSWORD`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` deben estar definidos antes de ejecutar tests o la aplicación.

---

## Database

- Motor: MySQL
- Versión: 8.4
- Nombre: `wod_explorer_2`.
- Servicio Docker Compose: `mysql`.
- Imagen: `mysql:8.4`.
- Puerto local: `${MYSQL_PORT:-3309}`.
- Puerto interno: `3306`.
- Volumen: `mysql_data`.
- Scripts de inicialización: `Docker/mysql/init/NNN_*.sql`.
- Sistema de migraciones: scripts SQL versionados y numerados, ejecutados en orden por Docker Compose al inicializar un volumen vacío.
- Fuente de verdad del esquema: `Docker/mysql/init/001_baseline.sql` y los scripts numerados posteriores.
- Evolución: los scripts aplicados no se editan; una evolución de un volumen existente requiere un script posterior y una ejecución de migración explícita. No se introduce un gestor de migraciones en esta Issue.

---

## Herramientas

## MCPs

- `database`: acceso e inspección del estado real de MySQL.
- `github`: acceso al repositorio remoto, Issues, Pull Requests, Actions y otros recursos de GitHub.
- `context7`: consulta de documentación técnica actualizada de librerías, frameworks, SDKs, APIs y herramientas.

---

## Fuentes de verdad

- Dominio y reglas de negocio: `DOMAIN.md`
- Producto y alcance: `PRODUCT.md`
- Configuración técnica: `PROJECT.md`
- Diseño visual: `DESIGN.md`
- Reglas globales de trabajo: `AGENTS.md`
- Reglas frontend: `frontend/AGENTS.md`
- Reglas backend: `backend/AGENTS.md`
- Reglas de base de datos: `Docker/AGENTS.md`
- Especificaciones: `specs/`
- Esquema de base de datos: `Docker/mysql/init/001_baseline.sql` y los scripts numerados posteriores.

---

## Inicialización

Los valores marcados como pendientes deben concretarse cuando la implementación correspondiente lo requiera, consultando la especificación activa y la configuración real del proyecto. No se deben inventar comandos, versiones, puertos, nombres de servicio ni decisiones técnicas.
