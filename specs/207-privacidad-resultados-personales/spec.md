# Issue #207: guía breve de privacidad de resultados personales

## Objetivo

Crear documentación breve, en español, sobre la visibilidad de los resultados personales en WOD Explorer 2, fiel a las reglas ya definidas en `DOMAIN.md`.

## Alcance

- Crear un único archivo `docs/personal-results-visibility.md`.
- Contenido de 8 a 15 líneas, en español.
- Explicar que los resultados de WOD y de ejercicios son privados, que cada usuario consulta únicamente su propio historial y sus propias mejores marcas, y que solo puede eliminar sus propios resultados (no se permite editarlos una vez registrados).
- Basarse exclusivamente en reglas ya existentes en `DOMAIN.md` (secciones 3, 6 y 7.1), sin inventar comportamiento nuevo.

## Fuera de alcance

- Cualquier cambio de código, base de datos, `DOMAIN.md`, archivos de configuración, comandos de OpenCode o scripts del harness.
- Nuevas funcionalidades, mecanismos de edición de resultados o cambios de modelo de dominio.

## Comportamiento esperado

El documento `docs/personal-results-visibility.md` debe afirmar, sin ambigüedad:

- Los resultados de WOD y de ejercicios son privados y no accesibles por otros usuarios.
- Cada usuario autenticado consulta únicamente su propio historial y sus propias mejores marcas.
- Un usuario solo puede eliminar sus propios resultados; no existe edición de resultados ya registrados.

## Criterios de aceptación

1. Existe un único documento Markdown (`docs/personal-results-visibility.md`), breve y fiel al dominio.
2. Los puntos de privacidad, historial personal y eliminación de resultados propios están expresados con claridad.
3. `git diff --check` y las verificaciones documentales aplicables retornan PASS.
4. La ejecución de `/hyssue` respeta todas las fases, evidencias y guards; cualquier BLOCK queda documentado con su fase y causa.

## Restricciones

- No modificar código, base de datos, `DOMAIN.md`, configuración, comandos de OpenCode ni scripts del harness.
- No inventar requisitos ni funcionalidad no presente en `DOMAIN.md`.
