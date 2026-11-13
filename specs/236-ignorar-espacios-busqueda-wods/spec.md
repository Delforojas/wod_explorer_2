# Issue #236: Ignorar espacios al inicio y final en la búsqueda de WODs

## Objetivo

Que la búsqueda del catálogo público de WODs ignore los espacios sobrantes al
principio y al final del texto introducido, sin alterar el texto que el
usuario escribe en el input.

## Alcance

- Inspeccionar el filtrado existente del catálogo público de WODs.
- Normalizar el texto solo para la búsqueda (no para el valor del input).
- Conservar el comportamiento del resto de filtros y del atajo Escape (#235).
- Añadir una prueba de comportamiento que cubra el caso.

## Fuera de alcance

- Backend, API, base de datos, autenticación y dependencias nuevas.
- Cambios en otros buscadores, filtros o utilidades compartidas.

## Hallazgo de inspección

`frontend/src/views/wods/wodFilters.ts` ya normaliza el texto de búsqueda con
`normalizeWodSearch`, que aplica `search.trim().toLowerCase()` antes de
comparar contra el nombre del WOD. Esta función la usan tanto `filterWods`
como `hasActiveWodFilters`, y `WodsList.tsx` nunca modifica el valor crudo del
input (`setSearch(event.target.value)`).

Por lo tanto:

- Los criterios de aceptación 1, 2 y 3 ya se cumplen con el código actual.
- No se requiere ni se introduce código de producción nuevo o redundante,
  conforme a la restricción de la Issue.
- `frontend/src/views/wods/wodFilters.test.ts` ya cubre la normalización y el
  caso de búsqueda formada solo por espacios a nivel de función pura.
- Falta una prueba de comportamiento a nivel de componente (`WodsList`) que
  confirme el efecto visible end-to-end: mismos resultados con y sin espacios,
  input sin auto-recorte y filtros (categoría) conservados.

## Comportamiento esperado

- Buscar `Fran` y `  Fran  ` produce el mismo conjunto de WODs, con los mismos
  filtros activos.
- Una búsqueda formada únicamente por espacios se comporta como una búsqueda
  vacía.
- El texto del input no cambia automáticamente al escribir espacios.
- El atajo Escape y los demás filtros siguen funcionando.

## Criterios de aceptación

1. Buscar `Fran` y `  Fran  ` produce el mismo conjunto de WODs, con los
   mismos filtros activos.
2. Una búsqueda formada únicamente por espacios se comporta como una búsqueda
   vacía.
3. El texto del input no cambia automáticamente al escribir espacios.
4. El atajo Escape y los demás filtros siguen funcionando.
5. Pasan los tests relevantes, lint y build del frontend.

## Restricciones

- Dificultad mínima; frontend solamente.
- Sin nuevas dependencias, cambios de API, backend, base de datos o
  refactorizaciones amplias.
- No introducir código redundante dado que el filtrado ya normaliza
  correctamente los espacios.
