# Issue #237: Ignorar espacios al buscar ejercicios

## Objetivo

Que la búsqueda del catálogo público de ejercicios ignore los espacios
sobrantes al principio y al final del texto introducido, sin alterar el
texto que la persona usuaria escribe en el input.

## Alcance

- Inspeccionar el filtrado existente del catálogo público de ejercicios.
- Normalizar el texto solo para la búsqueda (no para el valor del input).
- Conservar el comportamiento del resto de filtros y del atajo Escape (#234).
- Añadir una prueba de comportamiento que cubra el caso.

## Fuera de alcance

- Backend, API, base de datos, autenticación y dependencias nuevas.
- Cambios en otros buscadores, filtros o utilidades compartidas (por ejemplo
  los de WODs, ya resueltos en la Issue #236).

## Hallazgo de inspección

`frontend/src/views/exercises/exerciseFilters.ts` ya normaliza el texto de
búsqueda con `normalizeExerciseSearch`, que aplica `search.trim().toLowerCase()`
antes de comparar contra el nombre del ejercicio. Esta función la usan tanto
`filterExercises` como `hasActiveExerciseFilters`, y
`ExercisesList.tsx` nunca modifica el valor crudo del input
(`setSearch(event.target.value)`).

Por lo tanto:

- Los criterios de aceptación 1, 2 y 3 ya se cumplen con el código actual.
- No se requiere ni se introduce código de producción nuevo o redundante,
  conforme a la restricción de la Issue y al principio de simplicidad de
  `docs/consitucion.md`.
- `frontend/src/views/exercises/exerciseFilters.test.ts` ya cubre la
  normalización y el caso de búsqueda formada solo por espacios a nivel de
  función pura.
- Falta una prueba de comportamiento a nivel de componente (`ExercisesList`)
  que confirme el efecto visible end-to-end: mismos resultados con y sin
  espacios, input sin auto-recorte, y atajo Escape sin cambios (ya cubierto
  por una prueba existente que no se modifica).

## Comportamiento esperado

- Buscar `burpee` y `  burpee  ` produce el mismo conjunto de ejercicios.
- Una búsqueda formada únicamente por espacios se comporta como una búsqueda
  vacía.
- El texto del input no cambia automáticamente al escribir espacios.
- El atajo Escape y los demás filtros siguen funcionando.

## Criterios de aceptación

1. Buscar `burpee` y `  burpee  ` devuelve los mismos resultados con los
   mismos filtros.
2. Escribir únicamente espacios equivale a una búsqueda vacía.
3. El texto visible del campo de búsqueda no se recorta mientras se escribe.
4. Los filtros restantes y el atajo Escape no cambian de comportamiento.
5. Pasan los tests aplicables, lint y build del frontend.

## Restricciones

- Dificultad mínima; frontend solamente.
- Sin nuevas dependencias, cambios de API, backend, base de datos o
  refactorizaciones amplias.
- No introducir código redundante dado que el filtrado ya normaliza
  correctamente los espacios.
