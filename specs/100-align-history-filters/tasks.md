# Tareas

## Preparación

- [x] Confirmar la Issue #100 y su alcance visual sin cambios de lógica.
- [x] Superar Context Guard y crear la rama dedicada bajo la política
      `standard-main`, desde el SHA verificado de `origin/main`.
- [x] Auditar `HistoryView`, `HistoryPage`, `history.css`, tokens y patrones de
      formularios.
- [x] Crear el SDD único de la Issue #100.

## Estilos del filtro

- [x] Alinear la superficie del panel con el canvas, tokens, bordes y radios.
- [x] Unificar labels, selects y fechas con alturas, fondos, bordes y focus
      visibles coherentes.
- [x] Integrar affordance de selects y legibilidad del control nativo de fecha.
- [x] Alinear Aplicar/Limpiar con la jerarquía primaria/secundaria naranja.
- [x] Añadir estados hover, disabled, focus-visible y reduced-motion sin tocar
      la lógica de filtros.
- [x] Verificar composición mobile-first y ausencia de overflow mediante revisión
      estática de reglas y breakpoints.

## Verificación y cierre local

- [x] Revisar que no cambian `HistoryPage`, `HistoryView` ni contratos de API.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check` y revisión de alcance.
- [x] Preparar el contenido para un único commit local de la Issue #100.

## Registro de verificación

- `npm run lint`: correcto.
- `npm run test`: 11 archivos y 44 tests correctos.
- `npm run build`: correcto con TypeScript y Vite.
- `git diff --check`: correcto.
- Producto modificado: `frontend/src/styles/history.css`.
- `HistoryPage.tsx`, `HistoryView.tsx` y clientes API permanecen sin cambios.
- Validación visual real, overflow y teclado en navegador: pendientes.
