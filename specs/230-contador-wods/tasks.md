# Tareas: Contador de WODs filtrados en el catálogo público

- [x] T1. Documentar evidencia del contador existente y confirmar que no se
      introduce un contador duplicado (ver `spec.md`, sección "Evidencia
      previa"). Depende de: ninguna.
- [x] T2. Añadir `pluralizeWod` en `WodsList.tsx` y sustituir el bloque del
      contador para usar singular/plural de "WOD" (con y sin filtros
      activos). Depende de: T1.
- [x] T3. Verificar manualmente que el estado vacío, el estado de carga y el
      estado de error (`WodsView.tsx`) no cambian de comportamiento.
      Depende de: T2.
- [x] T4. Añadir/actualizar pruebas en `WodsList.test.tsx` cubriendo: 1 WOD
      (singular), N WODs (plural), filtro con coincidencias, filtro sin
      coincidencias (0 WODs). Depende de: T2.
- [x] T5. Ejecutar `npm run lint`, `npm run test`, `npm run build` en
      `frontend/` y registrar resultados. Depende de: T2, T4.
- [x] T6. Revisar el diff final contra el alcance aprobado (sin tocar
      `ExercisesList.tsx`, backend, auth, ni dependencias). Depende de: T5.
