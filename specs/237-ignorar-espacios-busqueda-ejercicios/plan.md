# Plan técnico

## Enfoque

El filtrado del catálogo público de ejercicios
(`frontend/src/views/exercises/exerciseFilters.ts`) ya normaliza el texto de
búsqueda con `normalizeExerciseSearch` (`trim()` + `toLowerCase()`) antes de
comparar, y esa función la usan tanto `filterExercises` como
`hasActiveExerciseFilters`. `ExercisesList.tsx` guarda el valor crudo del
input en estado (`setSearch(event.target.value)`) sin recortarlo, por lo que
el texto visible nunca se modifica automáticamente.

No se modificará código de producción: introducir un segundo `trim()` sería
redundante y contradice la restricción explícita de la Issue y el principio
de simplicidad de `docs/consitucion.md`. El trabajo se limita a añadir una
prueba de comportamiento a nivel de componente que confirme el efecto visible
de la normalización ya existente, siguiendo el mismo patrón de prueba
aplicado en la Issue #236 (`WodsList.test.tsx`) para el caso análogo de WODs.

## Componentes afectados

- `frontend/src/components/ExerciseFilter/ExercisesList.test.tsx`: nuevas
  pruebas de interacción (sin cambios en `ExercisesList.tsx`).
- Sin cambios en `frontend/src/views/exercises/exerciseFilters.ts` ni en
  `exerciseFilters.test.ts` (su cobertura actual ya es suficiente a nivel de
  función pura).

## Estrategia de implementación

1. Confirmar mediante lectura de código que `normalizeExerciseSearch` ya
   recorta y normaliza el texto de búsqueda, y que el estado del input no se
   recorta. (Hecho durante la inspección, documentado en `spec.md`.)
2. Añadir una prueba de interacción en `ExercisesList.test.tsx` que escriba
   `"  burpee  "` equivalente (`"  sentadilla  "`, dado el fixture existente)
   en el buscador y compruebe:
   - que el listado filtrado es idéntico al obtenido al escribir el término
     sin espacios,
   - que el valor del input conserva los espacios tal como se escribieron.
3. Añadir una prueba que confirme que una búsqueda formada solo por espacios
   se comporta como una búsqueda vacía a nivel de componente (todos los
   ejercicios visibles).
4. No tocar la prueba existente de Escape (`ExercisesList.test.tsx`): ya
   cubre que el atajo sigue funcionando sin cambios.
5. Ejecutar lint, tests y build del frontend.

## Verificación

- Las nuevas pruebas de `ExercisesList.test.tsx` fallarían si se eliminara la
  normalización existente (por ejemplo, si `normalizeExerciseSearch` dejase
  de aplicar `trim()`) y pasan con el código actual, confirmando que cubren
  el comportamiento real.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/` deben
  finalizar sin errores.
