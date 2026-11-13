# Plan — Documentar los orígenes de WOD (#214)

## Enfoque técnico

Tarea puramente documental. No hay componentes de código, frontend, backend ni base de datos afectados.

1. Releer `DOMAIN.md` sección 4.3 (WOD) como única fuente de contenido.
2. Redactar `docs/wod-origins-reference.md` en español, 8–15 líneas, cubriendo:
   - Diferencia entre origen genérico y personal (propietario, visibilidad, gestión).
   - Que los nombres de WOD no son únicos (ni dentro de la colección personal de un usuario).
   - Un ejemplo breve de WOD genérico y uno de WOD personal.
3. Verificar que ningún documento existente en `docs/` ya cubre este contenido (confirmado en fase de contexto: no hay duplicados).

## Componentes afectados

- `docs/wod-origins-reference.md` (nuevo archivo, único cambio).

## Estrategia de implementación

Archivo único, redacción directa basada en `DOMAIN.md` §4.3. Sin abstracciones, sin dependencias nuevas, sin refactors.

## Verificación

- `git diff --check` sobre el cambio (verifica que no haya conflictos de espacio en blanco/whitespace en el diff).
- Revisión manual de coherencia con `DOMAIN.md` §4.3 y de que el documento tiene entre 8 y 15 líneas.

No aplican checks de build, lint, tests unitarios ni de integración: no se modifica código ejecutable.
