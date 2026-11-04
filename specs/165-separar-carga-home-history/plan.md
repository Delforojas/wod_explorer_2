# Plan técnico

## Enfoque

Analizar los flujos de datos de Home (anónima/autenticada) e History, identificar evidencia de carga mezclada con composición y extraer lógica de datos sin rediseñar UI.

## Estrategia

- Extraer fetch y estados asíncronos de Home e History según evidencia.
- Preservar UX, filtros, auth, errores, vacíos y paginación.

## Verificación

- Tests existentes y nuevos relevantes, lint, build, `git diff --check`, revisión visual desktop/móvil.
