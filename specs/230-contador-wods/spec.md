# Especificación: Contador de WODs filtrados en el catálogo público

## Objetivo

Mejorar la página del catálogo público de WODs mostrando, con singular/plural
correcto, el número de entrenamientos que coinciden con los filtros actuales,
sin introducir nuevas peticiones ni duplicar funcionalidad existente.

## Evidencia previa: ya existe un contador equivalente

Antes de implementar, se localizó un contador ya existente en el catálogo
público:

- `frontend/src/components/wodFilter/WodsList.tsx:137-143`:

  ```tsx
  {/* CONTADOR */}
  <p className="wod-count">
    {hasActiveFilters
      ? `${filteredWods.length} de ${wods.length} entrenamientos`
      : `${wods.length} entrenamientos disponibles`}
  </p>
  ```

- Se recalcula con `useMemo` sobre `[category, search, wods]`
  (`WodsList.tsx:44-47`), por lo que ya se actualiza al cambiar búsqueda o
  filtro de categoría.
- El estado vacío (`filteredWods.length === 0`) se renderiza aparte
  (`WodsList.tsx:147-174`) y el estado de carga/error se resuelve un nivel
  arriba, en `WodsView.tsx:8-26`, antes de que `WodsList` se monte — por lo que
  un fallo de carga nunca llega a mostrarse como "0 WODs".
- Patrón hermano idéntico (sin plural/singular) en
  `frontend/src/components/ExerciseFilter/ExercisesList.tsx:82-83`, fuera de
  alcance de esta Issue (dominio de ejercicios, no de WODs).

Conforme al criterio de aceptación de la Issue #230 ("si ya hay un contador
equivalente, detenerse y documentar la evidencia antes de introducir otro"),
**no se crea un segundo contador**. El alcance de esta spec se reduce a
**corregir el contador existente** para que cumpla los criterios de
aceptación que hoy no cumple (singular/plural, terminología "WOD"/"WODs"
consistente con `DOMAIN.md`) y a cubrirlo con pruebas si no están cubiertas.

Brecha identificada frente a los criterios de aceptación de la Issue:

- No distingue singular/plural (siempre usa "entrenamientos").
- Usa el término "entrenamientos" en lugar de "WOD"/"WODs", que es el término
  de dominio usado por `DOMAIN.md` y el literal pedido por la Issue
  (`1 WOD`, `5 WODs`, `0 WODs`).

## Alcance

- Modificar únicamente `frontend/src/components/wodFilter/WodsList.tsx` (y su
  test asociado `WodsList.test.tsx`).
- Ajustar el texto del contador existente para usar singular/plural correcto
  del término "WOD"/"WODs".
- No tocar `ExercisesList.tsx` ni ningún otro dominio: es un patrón hermano,
  no parte de esta Issue.
- No añadir peticiones nuevas: se sigue usando `wods` y `filteredWods`, ya
  calculados en el componente.
- No modificar el filtrado, el orden, los permisos ni los estados de carga o
  error (los gestiona `WodsView.tsx`, sin cambios).
- No crear un componente ni una abstracción compartida nueva: la
  pluralización se resuelve con una función auxiliar local y pequeña dentro
  de `WodsList.tsx`.

## Comportamiento esperado

- Con filtros activos: `"{filteredWods.length} de {wods.length} WOD(s)"`,
  pluralizando "WOD" según `wods.length` (el total al que se compara).
- Sin filtros activos: `"{wods.length} WOD(s) disponible(s)"`, pluralizando
  "WOD" y "disponible" según `wods.length`.
- Sin coincidencias (`filteredWods.length === 0`, con `wods.length > 0`):
  `"0 de {wods.length} WODs"`, conservando el estado vacío existente debajo
  del contador sin cambios.
- Un fallo de carga sigue representado por `WodsView.tsx` (`error`, antes de
  montar `WodsList`), nunca como `0 WODs`.

## Criterios de aceptación

- [ ] Se muestra el número real de WODs visibles en el catálogo público
      (`filteredWods.length`, ya existente).
- [ ] El contador utiliza singular/plural correctamente para "WOD"/"WODs".
- [ ] El contador se actualiza al cambiar filtros o texto de búsqueda (ya
      existente vía `useMemo`).
- [ ] Si no hay coincidencias, el contador muestra "0" junto a "WODs" y se
      conserva el estado vacío existente sin cambios.
- [ ] Un fallo de carga (`error` en `WodsView.tsx`) nunca se muestra como cero
      resultados del contador.
- [ ] No cambian los permisos, el orden ni el comportamiento de los filtros.
- [ ] Existen pruebas para el contador (singular, plural y cero) y pasan las
      comprobaciones frontend aplicables (`lint`, `test`, `build`).
- [ ] No se duplica el contador existente; esta spec documenta la evidencia y
      modifica el contador existente en lugar de introducir uno nuevo.

## Restricciones

- Mantener React, TypeScript, CSS y Vitest; no añadir dependencias.
- Reutilizar la clase `wod-count` existente (`src/styles/resources.css:509-519`).
- No introducir un endpoint, parámetro o payload nuevo.
- No modificar backend, base de datos, autenticación, WODs personales ni el
  harness.
- Sin cambios de diseño visual más allá del texto del contador.

## Referencias

- GitHub Issue #230: `feat(frontend): mostrar contador de WODs filtrados en
  el catálogo público`.
- `frontend/src/components/wodFilter/WodsList.tsx`.
- `frontend/src/views/wods/WodsView.tsx`.
- `frontend/src/components/wodFilter/WodsList.test.tsx`.
- `specs/076-clear-wod-filters/spec.md` (contador mencionado como
  comportamiento a preservar).
- `specs/082-wod-catalog-empty-state/spec.md` (estado vacío a preservar sin
  cambios funcionales).
- `DOMAIN.md` (terminología "WOD").
