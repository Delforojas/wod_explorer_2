# Plan — Issue #207

## Enfoque técnico

Tarea puramente documental: redactar un único archivo Markdown en `docs/`, reutilizando la convención ya presente en ese directorio (`docs/consitucion.md`, `docs/google-auth-architecture.md`, `docs/hyssue-audit-202.md`). No se requiere ningún cambio de código, esquema ni configuración.

## Componentes afectados

- `docs/personal-results-visibility.md` (nuevo archivo).

Ningún componente de `backend/`, `frontend/`, `Docker/` ni `scripts/` resulta afectado.

## Fuente de verdad del contenido

El contenido se basa directamente en `DOMAIN.md`:

- Sección 3 (Registered User): los usuarios autenticados consultan su propio historial y marcas, y solo eliminan sus propios resultados.
- Sección 6 (Workout Results): los resultados son privados, no accesibles por otros usuarios; solo se permite ver y eliminar resultados propios; no se permite editarlos.
- Sección 7.1 (Personal History): el historial es una vista derivada de los resultados propios del usuario.

No se interpretan ni extienden estas reglas; se resumen fielmente.

## Estrategia de implementación

1. Redactar el archivo `docs/personal-results-visibility.md` en español, 8–15 líneas, cubriendo privacidad, historial y eliminación (sin edición).
2. Verificar que el contenido no contradice `DOMAIN.md` ni introduce funcionalidad no existente.

## Verificación

- `git diff --check` sobre el archivo añadido (detecta problemas de espacios en blanco/EOL).
- Revisión manual de fidelidad al dominio (Planning Guard / SDD Guard / Verification Guard del workflow `/hyssue`).

No aplican checks de build, lint de código, ni suites de test de backend/frontend, ya que no se modifica código.
