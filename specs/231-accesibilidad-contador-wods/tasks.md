# Tareas: Accesibilidad del contador de WODs

- [x] T1. Verificar la dependencia con #230 (rama ancestro, contador ya
      commiteado) y documentar evidencia de que no existe ya una región
      accesible equivalente en el contador. Depende de: ninguna.
- [x] T2. Añadir `role="status"` y `aria-live="polite"` al `<p
      className="wod-count">` en `WodsList.tsx`, sin tocar texto ni lógica.
      Depende de: T1.
- [x] T3. Verificar manualmente que la región no se monta durante
      `loading`/`error` (`WodsView.tsx`) y que no duplica el anuncio del
      bloque `wod-empty-state`. Depende de: T2.
- [x] T4. Añadir/extender pruebas en `WodsList.test.tsx` verificando
      `role="status"` y `aria-live="polite"` en el contador para los casos
      existentes (con filtro, sin filtro, singular, cero coincidencias).
      Depende de: T2.
- [x] T5. Ejecutar `npm run lint`, `npm run test`, `npm run build` en
      `frontend/` y registrar resultados. Depende de: T2, T4.
- [x] T6. Revisar el diff final contra el alcance aprobado (sin tocar
      `WodsView.tsx`, `wod-empty-state`, `ExercisesList.tsx`, backend, ni
      dependencias). Depende de: T5.
