# Plan de implementación

## Dirección seleccionada

**Bitácora de rendimiento**, elegida por el usuario tras explorar referencias con 21st. Convierte la interfaz en una lectura operativa y editorial: título y métrica primero, metadata como texto breve y acciones que aparecen como affordances ligeras.

## Exploración visual

Se consultó 21st con `mobile fitness workout tracker compact exercise list activity history personal records typography`.

| Alternativa | Decisión | Adaptación |
| --- | --- | --- |
| Bitácora de rendimiento | Adoptada | Filas compactas, mayor jerarquía tipográfica, métricas tabulares y acciones discretas. |
| Tablero de sesión | Descartada | Da demasiado protagonismo a paneles de sesión y no beneficia los catálogos. |
| Catálogo técnico | Descartada | Aumenta comparabilidad, pero una tabla dominante reduce la personalidad editorial en móvil. |
| Workout Card, Activity Card y Tracker Card | Adoptar patrones parciales | Se toma su densidad y orden de información, no sus cards ni su decoración. |
| Weekly Fitness Card, Sleep Tracker Card y Apple Activity Ring | Descartadas | Introducen dashboard, gráficos o gamificación fuera del alcance. |

## Componentes afectados

- `frontend/src/index.css`: variants editoriales de encabezado, navegación, filas, metadata, métricas y acciones.
- `frontend/src/components/layout/`: integración visual de navegación móvil y sidebar sin modificar destinos.
- `frontend/src/views/`: composición específica de ejercicios, WODs, historial, resultados, formularios, acceso y estados existentes.

## Cambios técnicos previstos

1. Reducir el tratamiento rectangular de metadata, filas y acciones secundarias con reglas CSS basadas en tokens existentes.
2. Reorganizar el markup visual de las vistas sin cambiar callbacks ni datos renderizados.
3. Mantener controles nativos; cuando una fila tenga acción de detalle, usar un control semántico de tamaño táctil adecuado con tratamiento ligero.
4. Ajustar móvil y escritorio de manera independiente usando los breakpoints ya definidos.

## Estrategia de verificación

- Ejecutar `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Ejecutar `21st-ui-review` y el detector Impeccable al finalizar.
- Revisar el diff para confirmar ausencia de cambios de rutas, handlers, contratos o dependencias.
