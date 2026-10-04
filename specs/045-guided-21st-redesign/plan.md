# Plan de implementación

## Exploración y selección

| Área | Consulta 21st | Alternativas | Selección | Adaptación |
| --- | --- | --- | --- | --- |
| Ejercicios | `exercise list`, `workout exercise library`, `fitness mobile list`, `sports training list`, `compact editorial list` | Fila editorial, ficha de rendimiento, resumen de sesión | Fila editorial, elegida por el usuario | Tomar densidad y orden de información de Workout Card/Activity Card sin sus cards; nombre dominante, metadata inline y affordance ligera. |
| Navegación móvil | `mobile bottom navigation`, `fitness app navigation`, `sports app bottom navigation` | Barra integrada, pestañas segmentadas, dock flotante | Barra integrada, elegida por el usuario | Tomar la jerarquía de Bottom Nav Bar sin flotación ni nueva dependencia; indicador fino y etiquetas existentes. |

Se descartan Weekly Fitness Card, Apple Activity Ring y dock flotante por introducir dashboard, gamificación o superficies innecesarias. No se añaden dependencias.

## Cambios previstos

- `frontend/src/index.css`: reglas de fila editorial, metadata inline e indicador activo de navegación.
- `frontend/src/views/exercises/ExercisesView.tsx`: estructura visual de la fila, sin alterar `onSelectExercise`.
- `frontend/src/components/layout/MobileNavigation.tsx`: clase de presentación para la barra integrada, sin alterar destinos o estado.

## Verificación

- Ejecutar `21st-ui-review`, detector Impeccable, `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Revisar manualmente navegación táctil, foco visible, densidad y overflow en móvil y escritorio.
