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
- Versión: Pendiente de definir según la configuración del proyecto.
- Build tool: Pendiente de definir.
- Arquitectura: Pendiente de definir según la estructura real del frontend.
- Styling: Pendiente de definir.
- Validación: Pendiente de definir.
- Estado: Pendiente de definir.
- Testing: Pendiente de definir.
- Idioma de interfaz: español
- Ruta base API: Pendiente de definir.
- Fuente de diseño: `DESIGN.md`; detalles visuales pendientes de definir.

### Comandos

- Install: Pendiente de definir según el gestor de paquetes del proyecto.
- Run: Pendiente de definir.
- Lint: Pendiente de definir.
- Test: Pendiente de definir.
- Build: Pendiente de definir.

---

## Diseño

- Fuente de verdad: `DESIGN.md` para las decisiones de diseño; referencia visual concreta pendiente de definir.
- MCP de diseño: No configurado.
- Referencia visual: Pendiente de definir.

---

## Backend

- Lenguaje: Java
- Versión: Pendiente de definir.
- Framework: Spring Boot
- Versión del framework: Pendiente de definir.
- Build tool: Pendiente de definir.
- Arquitectura: Pendiente de definir según la especificación y la estructura real del backend.
- Persistencia: Pendiente de definir; no se ha seleccionado ORM ni framework de persistencia.
- Testing: Pendiente de definir.
- Ruta base API: Pendiente de definir.

### Comandosa

- Install: Pendiente de definir.
- Run: Pendiente de definir.
- Validate: Pendiente de definir.
- Test: Pendiente de definir.
- Build: Pendiente de definir.

---

## Database

- Motor: MySQL
- Versión: 8.4
- Nombre: Pendiente de definir.
- Servicio Docker Compose: Pendiente de definir.
- Contenedor: Pendiente de definir.
- Puerto local: Pendiente de definir.
- Puerto interno: Pendiente de definir; usar el valor estándar de MySQL solo cuando se confirme en la configuración.
- Volumen: Pendiente de definir.
- Scripts de inicialización: Pendiente de definir.
- Sistema de migraciones: Pendiente de definir.
- Fuente de verdad del esquema: Pendiente de definir; debe acordarse en `database/AGENTS.md` o en la especificación de base de datos.

---

## Herramientas

### MCP

- Repository MCP: No configurado.
- Database MCP: No configurado.
- Design MCP: No configurado.
- MCP adicionales: Ninguno configurado.

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
- Esquema de base de datos: Pendiente de definir en la configuración del área database.

---

## Inicialización

Los valores marcados como pendientes deben concretarse cuando la implementación correspondiente lo requiera, consultando la especificación activa y la configuración real del proyecto. No se deben inventar comandos, versiones, puertos, nombres de servicio ni decisiones técnicas.
