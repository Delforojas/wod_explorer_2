# Issue #238: Contador de caracteres en la búsqueda de WODs

## Objetivo

Mostrar discretamente, en el buscador del catálogo público de WODs, cuántos
caracteres contiene el texto introducido cuando el campo no esté vacío, para
validar el nuevo flujo `/merge-issue` ejecutado mediante `git-local`.

## Alcance

- Mostrar un contador de caracteres junto al buscador de WODs
  (`frontend/src/components/wodFilter/WodsList.tsx`).
- El contador refleja la longitud real del texto visible en el input,
  incluidos los espacios, sin recortarlo ni modificarlo.
- El contador desaparece cuando el campo está vacío, incluido tras limpiar
  con el botón de limpiar o con Escape (comportamiento existente de #234/#235).
- Reutilizar el componente (`WodsList`) y el contenedor `.wod-search`
  existentes; sin nuevas dependencias.

## Fuera de alcance

- Backend, API, base de datos, autenticación.
- Reglas de filtrado de WODs (`wodFilters.ts`).
- El contador de resultados filtrados ya existente (`.wod-count`, Issues
  #230/#231), que cuenta WODs, no caracteres.
- El buscador de ejercicios (`ExercisesList.tsx`), fuera del dominio de WODs.

## Hallazgo de inspección

Se revisó `WodsList.tsx` y el CSS asociado (`resources.css`, `wod.css`):

- Existe un contador (`.wod-count`, `WodsList.tsx:148-154`) que muestra
  cuántos WODs coinciden con los filtros activos (Issue #230/#231). No tiene
  relación con la longitud del texto de búsqueda.
- No existe en el proyecto ningún contador de caracteres sobre el valor de un
  input de búsqueda (`grep -i "caracter"` en `src/` solo encuentra mensajes de
  validación de formularios no relacionados: username, password, nombre de
  WOD).
- El input de búsqueda (`#wod-search-input`, `WodsList.tsx:93-105`) guarda el
  valor crudo en estado (`setSearch(event.target.value)`), sin recortarlo. El
  atajo Escape ya limpia `search` a `""` (`WodsList.tsx:99-103`).

Por lo tanto, no existe un contador equivalente que evite la implementación:
se procede a añadir el contador de caracteres.

## Comportamiento esperado

- Al introducir `Fran`, se muestra `4 caracteres`.
- Al introducir un único carácter, se muestra `1 carácter`.
- Con el buscador vacío, no se muestra el contador.
- Al pulsar Escape, el campo y el contador se limpian (reutilizando el
  comportamiento existente de limpieza).
- El contador cuenta la longitud real de `search` (incluye espacios) sin
  alterar el valor del input.

## Criterios de aceptación

1. Tras introducir `Fran`, se muestra `4 caracteres`.
2. Tras introducir un único carácter, se muestra `1 carácter`.
3. Con el buscador vacío, no se muestra el contador.
4. Al pulsar Escape, la búsqueda y el contador se limpian de acuerdo con el
   comportamiento existente.
5. No se modifican las reglas de filtrado, el backend ni la API.
6. Pasan los tests aplicables, lint y build.

## Restricciones

- Dificultad mínima y solo frontend.
- Reutilizar `WodsList.tsx` y el contenedor `.wod-search`; no duplicar el
  contador de resultados existente (`.wod-count`).
- Sin nuevas dependencias ni frameworks.
