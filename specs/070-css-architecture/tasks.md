# Tareas: Auditoria y refactorizacion de arquitectura CSS

- [x] Confirmar baseline, commit base, working tree e imports CSS.
- [x] Identificar el trabajo CSS historico ya integrado en `main`, incluido
      PR #88 y la rama historica de #70.
- [x] Documentar consumidores, rutas reales y candidatos de duplicacion.
- [x] Registrar limitaciones de captura visual y los estados que requieren
      validacion manual.
- [x] Añadir tokens solo para valores con equivalencia semantica demostrable.
- [x] Sustituir usos equivalentes conservando valores computados.
- [x] Eliminar reglas CSS exactamente redundantes con evidencia de cascada.
- [x] Verificar media queries repetidas y mantenerlas separadas si no son
      equivalentes.
- [x] Confirmar que no quedan imports CSS inexistentes o duplicados.
- [x] Recalcular archivos, lineas y media queries con el alcance del baseline.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [ ] Verificar Home, Exercises, WOD Catalog, My WODs, Create WOD, Register
      Exercise Result, My Exercise Results, Register WOD Result, My WOD Results,
      History y Personal Bests.
- [x] Revisar diff, alcance y archivos protegidos antes de commit.
- [x] Recalcular y documentar el informe final de metricas, reglas eliminadas,
      tokens, validaciones, limitaciones y deuda tecnica.
- [x] Preparar checklist de validacion manual especifica para #70.

## Registro de verificacion

- Baseline: 37 CSS, 9.292 lineas, 102 `@media`.
- Resultado: 37 CSS, 9.281 lineas, 102 `@media`.
- Imports: 36 unicos, resolubles y cargados desde `index.css`.
- `npm run lint`: correcto.
- `npm run test`: 5 archivos y 18 tests correctos.
- `npm run build`: correcto con TypeScript y Vite.
- `git diff --check`: correcto.
- Cambios CSS: dos tokens semanticos, 18 sustituciones equivalentes y una
  regla redundante eliminada.
- No se consolidaron media queries porque sus selectores y cascada son locales.
- La captura visual y la navegacion real por teclado quedan pendientes de
  validacion manual.

## Validacion manual pendiente

- [ ] Comparar Home, catalogos, resultados, historial, Create WOD y Personal
      Bests en escritorio, tablet y movil.
- [ ] Confirmar foco visible, teclado, hover, reduced motion y reduced
      transparency.
- [ ] Confirmar ausencia de overflow horizontal y preservacion de estados
      loading, error, empty y success.
