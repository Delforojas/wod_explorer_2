# Plan técnico

## Enfoque

Limitar el cambio a `frontend/src/styles/history.css`. Se conservarán las
clases que `HistoryView` ya renderiza, de modo que la lógica, los valores
controlados, los callbacks y los resultados no cambien. Las declaraciones
locales sustituirán el fondo azul/gris y el CTA indigo por tokens oscuros y el
acento naranja que ya usa la interfaz actual.

Los controles mantendrán la altura mínima global de 44px, pero usarán una
apariencia consistente con `forms.css`: fondo de input, borde de token, radio
medio, foco con `--color-input-focus-border` y halo existente. Los selects
recibirán un chevron inline con el mismo color naranja que los controles de
selección ya existentes; los campos `date` conservarán su affordance nativa y
se ajustará el `color-scheme` para que siga siendo legible en oscuro.

## Componentes afectados

- `frontend/src/styles/history.css`: superficie, campos, botones, estados y
  responsive del filtro.
- `frontend/src/views/history/HistoryView.tsx`: solo se modificará si la
  inspección final demuestra que hace falta una clase semántica; inicialmente
  no se prevé cambio.
- `specs/100-align-history-filters/`: trazabilidad y registro de verificación.

## Estrategia de implementación

1. Confirmar este SDD y superar Planning Guard antes de editar CSS.
2. Reemplazar valores visuales locales incompatibles por tokens existentes,
   manteniendo la estructura de grid y los breakpoints actuales.
3. Añadir estados `:hover`, `:focus-visible`, `:disabled` y reduced-motion sin
   modificar los handlers ni los valores controlados.
4. Revisar especificidad/import order para que solo afecte a `.history-*` y no
   a otros formularios o listas.
5. Ejecutar lint, tests, build y `git diff --check`; revisar el diff y dejar la
   equivalencia visual final como validación manual cuando no haya navegador.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de que `HistoryView.tsx` y `HistoryPage.tsx` no cambian la
  lógica de filtros.
- Revisión manual pendiente en móvil, tablet y desktop para overflow, foco,
  teclado, estados hover/disabled y legibilidad de controles nativos.
