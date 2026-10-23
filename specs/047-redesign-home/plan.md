# Plan de implementación

## Exploración y selección

Se consultó 21st con `fitness app home workout dashboard training overview athlete performance training journal mobile`.

| Dirección | Decisión | Adaptación |
| --- | --- | --- |
| Punto de partida | Adoptada por el usuario | Titular compacto, acción primaria hacia WODs y rutas secundarias como enlaces editoriales. |
| Cuaderno de entrenamiento | Descartada | Aporta explicación, pero ralentiza la orientación hacia las rutas reales. |
| Índice de rendimiento | Descartada | Aporta densidad técnica, pero no es el mejor primer punto de entrada público. |
| Health Stat, Weekly Fitness y Workout Summary Cards | Descartadas como composición | Requieren métricas o actividad personal inexistentes y favorecen un dashboard de cards. |

## Cambios previstos

- `frontend/src/views/home/HomeView.tsx`: enlaces reales y estructura semántica de la Home.
- `frontend/src/index.css`: reglas locales de composición para Home, basadas en tokens existentes.

## Verificación

- Ejecutar 21st-ui-review, `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Revisar manualmente jerarquía, enlaces, foco visible y composición en móvil y desktop.
