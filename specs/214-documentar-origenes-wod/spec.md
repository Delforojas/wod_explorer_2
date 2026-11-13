# Spec — Documentar los orígenes de WOD (#214)

## Objetivo

Documentar brevemente, en español, los dos orígenes de WOD soportados por el dominio (genérico y personal) en un único documento de referencia. Esta es una tarea documental pequeña e independiente, usada para probar de principio a fin el workflow `/hyssue`.

## Alcance

- Crear **un único archivo**: `docs/wod-origins-reference.md`.
- Explicar la diferencia entre:
  - WOD **genérico**: propiedad del sistema, visibilidad pública, gestionado solo por el sistema.
  - WOD **personal**: propiedad de un usuario registrado, visibilidad privada, gestionado solo por su propietario.
- Mencionar que los nombres de WOD no son únicos, ni siquiera dentro de la colección personal de un usuario.
- Incluir un ejemplo sencillo de cada origen.
- Basarse exclusivamente en la sección 4.3 de `DOMAIN.md`; no inventar reglas nuevas.

## Fuera de alcance

- Cualquier cambio de código, configuración o base de datos.
- Cualquier otro archivo de documentación distinto de `docs/wod-origins-reference.md`.
- Nuevas reglas de dominio no presentes en `DOMAIN.md` §4.3.

## Comportamiento esperado

Tras la implementación, debe existir el archivo `docs/wod-origins-reference.md` con un texto en español de 8 a 15 líneas que:

- Describa el origen **genérico** (propiedad del sistema, visibilidad pública, gestión exclusiva del sistema).
- Describa el origen **personal** (propiedad de un usuario registrado, visibilidad privada, gestión exclusiva de su propietario).
- Indique explícitamente que los nombres de WOD no son únicos, ni siquiera dentro de la colección personal de un usuario.
- Incluya un ejemplo breve de un WOD genérico y uno de un WOD personal.

No debe alterarse ningún otro archivo del repositorio.

## Criterios de aceptación

1. Documento Markdown en español de 8–15 líneas.
2. Contenido coherente con `DOMAIN.md`.
3. Sin modificar código, configuración ni base de datos.
4. Ejecutar únicamente las verificaciones aplicables (p. ej. `git diff --check`).
5. No duplicar documentación existente.

## Restricciones

- Fuente única de verdad: `DOMAIN.md` sección 4.3 (WOD).
- Idioma: español (según `AGENTS.md` §9 y la Constitución §12).
- No se requiere ninguna verificación de build, test o lint: es un cambio puramente documental.
