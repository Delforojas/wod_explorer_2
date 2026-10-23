# Plan de implementación

## Enfoque

Extender los tokens CSS existentes con roles de glass derivados de las superficies azuladas actuales. Aplicar `.glass-panel` a las listas de catálogo y al formulario, y limitar las reglas de filas glass a dichos paneles para no rediseñar otras vistas.

## Capas afectadas

| Área | Cambio |
| --- | --- |
| `frontend/src/index.css` | Tokens, primitive glass, fallback, transparencia reducida, listas, filas y campos de formulario. |
| `ExercisesView.tsx` | Marcar el contenedor de lista como panel glass. |
| `WodsView.tsx` | Marcar el contenedor de lista como panel glass. |
| `CreateWodView.tsx` | Marcar el formulario como panel glass. |
| `DESIGN.md` | Registrar la variante compartida Liquid Glass autorizada por la Issue. |

## Decisiones

- Un único `backdrop-filter` por panel; las filas solo usan separadores y una capa de interacción para evitar filtros apilados.
- Inputs y selects usan una superficie interior más opaca, conservando el focus ring existente.
- La decoración se hace con pseudo-elemento no interactivo y sin animación continua.
- Un `@supports` aplica una superficie opaca cuando no existe soporte de blur; `prefers-reduced-transparency` hace lo mismo.

## Verificación

- Revisar las tres vistas en escritorio y móvil; comprobar foco, formulario, select, acciones y ausencia de overflow.
- Ejecutar `21st review`, detector Impeccable, lint, tests, build y `git diff --check`.
