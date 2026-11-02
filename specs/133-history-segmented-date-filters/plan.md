# Plan técnico

## Enfoque

Aplicar el ajuste como una modificación frontend localizada sobre el Historial
existente de #129. Se eliminará el estado exclusivo de filtros WOD, se
conservará el filtro inclusivo por fecha y se alineará la presentación con el
control segmentado y las filas ligeras que ya usa Benchmarks/recursos.

## Componentes afectados

- `frontend/src/pages/HistoryPage.tsx`: estado de filtros, carga de WODs y
  conservación del rango entre modos.
- `frontend/src/views/history/HistoryView.Types.ts`: contrato reducido a
  filtros de fecha y props necesarias.
- `frontend/src/views/history/historyPresentation.ts`: filtrado por modo y
  fechas, incluyendo detección de rango inválido.
- `frontend/src/views/history/HistoryView.tsx`: selector segmentado, campos de
  fecha, mensaje de validación y filas sin ID técnico ni panel exterior.
- `frontend/src/styles/history.css`: control segmentado, formulario de dos
  fechas y lista/filas integradas con responsive y foco.
- Pruebas de presentación y render del Historial.

## Implementación

1. Verificar que la dependencia #129 está fusionada en `main` y partir de ese
   SHA sin recrear cambios anteriores.
2. Reducir `HistoryFilterValues` a `from` y `to`; mantener `toApiFilters` solo
   con el rango para WODs y dejar el filtrado de ejercicios en memoria.
3. Retirar `getAvailableWods`, opciones WOD y limpieza de filtros específicos;
   `handleModeChange` solo cambia el modo.
4. Reutilizar el patrón `.exercise-results-mode-toggle` /
   `.exercise-results-mode-button` en una variante específica de Historial,
   manteniendo `aria-pressed`, foco visible y botones nativos.
5. Reemplazar el wrapper `resource-list glass-panel` por una lista propia de
   filas ligeras y retirar `wodVersionId` de la salida visual.
6. Añadir validación pura de `from > to`, mensaje accesible y prevención de
   aplicación de rangos inválidos.
7. Actualizar pruebas para modos, fechas, invalidación, etiquetas visibles,
   ausencia de filtros WOD, filas y estados existentes.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática: solo frontend de Historial, pruebas y SDD; sin backend,
  DB, API, dominio, auth ni Benchmarks.
- Validación manual pendiente: comparación visual con Benchmarks en móvil,
  tablet y escritorio; teclado/foco; cambio de modo conservando fechas; rango
  inválido; estados loading, vacío, parcial y reintento.
