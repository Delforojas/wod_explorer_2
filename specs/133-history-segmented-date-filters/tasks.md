# Tareas

## Preparación

- [x] Confirmar Issue #133, su dependencia fusionada #129 y el alcance solo
  frontend.
- [x] Verificar arquitectura, tokens, patrón segmentado de Benchmarks y estados
  existentes de Historial.
- [x] Crear este SDD sobre `main` en `0a389795`.

## Historial

- [x] Reducir el modelo de filtros a `Desde` y `Hasta`.
- [x] Retirar estado, carga y UI de WOD, modalidad y origen.
- [x] Conservar el rango al cambiar de modo y filtrar ambos tipos por fecha.
- [x] Validar y comunicar rangos inválidos sin aplicarlos.
- [x] Alinear el selector de modos con el control segmentado de Benchmarks.
- [x] Renderizar filas integradas sin panel negro, tarjetas pesadas ni IDs
  técnicos de versión.
- [x] Mantener formatos, orden, estados parciales, vacío y reintentos de #129.
- [x] Mantener accesibilidad, responsive y navegación inferior sin overflow.

## Pruebas

- [x] Actualizar pruebas de presentación para fechas y eliminar expectativas de
  filtros WOD.
- [x] Actualizar pruebas de render para selector, campos visibles, filas y
  ausencia de IDs técnicos.
- [x] Añadir cobertura para rango inválido y conservación del rango entre modos.

Comprobación dirigida: `npm run test -- src/views/history/HistoryView.test.tsx
src/views/history/historyPresentation.test.ts` pasó (2 archivos, 9 tests).

## Verificación y handoff

- [x] Revisar que no haya cambios backend, DB, API, dominio, auth, Benchmarks o
  acciones destructivas.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [ ] Revisar diff final y crear commit local sin push.
- [ ] Documentar la Issue con el commit y dejar validación manual pendiente.

## Resultado de verificación

- `npm run lint` desde `frontend/`: correcto.
- `npm run test` desde `frontend/`: correcto, 27 archivos / 105 tests.
- `npm run build` desde `frontend/`: correcto.
- `git diff --check`: correcto.
- La revisión estática confirma cambios solo en Historial frontend, pruebas y
  SDD; no hay cambios backend, DB, API, dominio, auth, Benchmarks ni acciones
  destructivas.
- La validación visual manual comparativa con Benchmarks sigue pendiente de
  aprobación explícita.
