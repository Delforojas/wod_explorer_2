# Plan técnico

## Enfoque

El filtrado del catálogo público de WODs (`frontend/src/views/wods/wodFilters.ts`)
ya normaliza el texto de búsqueda con `normalizeWodSearch` (`trim()` +
`toLowerCase()`) antes de comparar, y esa función la usan tanto `filterWods`
como `hasActiveWodFilters`. `WodsList.tsx` guarda el valor crudo del input en
estado (`setSearch(event.target.value)`) sin recortarlo, por lo que el texto
visible nunca se modifica automáticamente.

No se modificará código de producción: introducir un segundo `trim()` sería
redundante y contradice la restricción explícita de la Issue. El trabajo se
limita a añadir una prueba de comportamiento a nivel de componente que
confirme el efecto visible de la normalización ya existente, siguiendo el
mismo patrón de prueba de interacción usado en la Issue #235
(`WodsList.test.tsx`).

## Componentes afectados

- `frontend/src/components/wodFilter/WodsList.test.tsx`: nueva prueba de
  interacción (sin cambios en `WodsList.tsx`).
- Sin cambios en `frontend/src/views/wods/wodFilters.ts` ni en
  `wodFilters.test.ts` (su cobertura actual ya es suficiente a nivel de
  función pura).

## Estrategia de implementación

1. Confirmar mediante lectura de código que `normalizeWodSearch` ya recorta y
   normaliza el texto de búsqueda, y que el estado del input no se recorta.
2. Añadir una prueba de interacción en `WodsList.test.tsx` que, con una
   categoría activa, escriba `"  morning  "` en el buscador y compruebe:
   - que el listado filtrado es idéntico al obtenido al escribir `"morning"`,
   - que el valor del input conserva los espacios tal como se escribieron,
   - que la categoría activa (filtro) se mantiene.
3. Añadir una prueba (o aserción) que confirme que una búsqueda formada solo
   por espacios se comporta como una búsqueda vacía a nivel de componente.
4. Ejecutar lint, tests y build del frontend.

## Verificación

- La nueva prueba de `WodsList.test.tsx` falla si se elimina la normalización
  existente (por ejemplo, si `normalizeWodSearch` dejase de aplicar `trim()`)
  y pasa con el código actual, confirmando que cubre el comportamiento real.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/` deben
  finalizar sin errores.
