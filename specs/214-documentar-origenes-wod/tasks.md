# Tasks — Documentar los orígenes de WOD (#214)

## Tareas

- [x] T1. Crear `docs/wod-origins-reference.md` con el contenido descrito en `spec.md` (diferencia genérico/personal, unicidad de nombres, un ejemplo de cada origen), basado exclusivamente en `DOMAIN.md` §4.3.
  - Dependencias: ninguna.
  - Verificación: revisión manual de longitud (8–15 líneas, 9 líneas reales) y coherencia con `DOMAIN.md` §4.3.

- [x] T2. Ejecutar `git diff --check` sobre el cambio.
  - Dependencias: T1.
  - Verificación: salida sin errores de whitespace (exit code 0, sin salida).

## Criterios de aceptación cubiertos

- AC1 (8–15 líneas) → T1.
- AC2 (coherente con DOMAIN.md) → T1.
- AC3 (sin tocar código/config/DB) → cubierto por el alcance (un único archivo nuevo en `docs/`).
- AC4 (solo verificaciones aplicables) → T2.
- AC5 (no duplicar documentación existente) → confirmado en fase de contexto (Phase 2).
