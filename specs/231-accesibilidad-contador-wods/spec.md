# Especificación: Accesibilidad del contador de WODs

## Objetivo

Hacer que los cambios del contador de WODs del catálogo público
(introducido en la Issue #230, commit `a177fc2` en `feat/230-contador-wods`)
sean detectables por tecnología de asistencia cuando el usuario cambia la
búsqueda o el filtro de categoría, sin alterar su texto, su lógica ni su
aspecto visual.

## Dependencia

Esta Issue se desarrolla sobre el trabajo ya confirmado de la Issue #230:

- Rama `feat/231-accesibilidad-contador-wods` creada a partir de
  `feat/230-contador-wods` (verificado: `git merge-base --is-ancestor
  feat/230-contador-wods HEAD` → ancestro confirmado).
- El contador y su pluralización (`pluralizeWod`) ya existen en
  `frontend/src/components/wodFilter/WodsList.tsx:143-149` y no se
  reimplementan ni se duplican.

## Evidencia previa: estado actual de accesibilidad del contador

- El contador (`<p className="wod-count">`, `WodsList.tsx:143-149`) **no**
  tiene `role` ni `aria-live`: hoy un cambio de texto (p. ej. al filtrar) no
  se anuncia a lectores de pantalla.
- El bloque de estado vacío que convive con el contador (`WodsList.tsx:154`,
  `<div className="wod-empty-state" role="status" aria-live="polite">`) **sí**
  ya usa región de estado, pero es un elemento distinto que solo se renderiza
  cuando `filteredWods.length === 0`; no cubre el texto del contador cuando
  hay resultados (incluyendo cuando pasa de, p. ej., 5 a 3 WODs).
- El patrón `role="status" aria-live="polite"` para texto dinámico ya es la
  convención establecida del proyecto (ejemplos: `HomeView.tsx:172`,
  `MyWodResultsView.tsx:54`, `MyExerciseResultsView.tsx:171`,
  `GoogleCallbackPage.tsx:92`). No se introduce un mecanismo nuevo.
- No existe ya una región accesible equivalente aplicada al propio contador
  de WODs: no hay funcionalidad duplicada que impida avanzar. Conforme al
  criterio de aceptación de la Issue #231 ("si el comportamiento ya existe,
  documentar evidencia y detenerse antes de duplicarlo"), se documenta esta
  comprobación y se procede a añadir la región sobre el elemento existente.
- Carga y error se resuelven un nivel arriba, en `WodsView.tsx:8-26`, antes
  de que `WodsList` (y por tanto el contador) se monte; una región de estado
  en el contador nunca puede anunciar un estado de carga o error porque el
  componente ni siquiera está montado en esos casos.

## Alcance

- Modificar únicamente el elemento del contador en
  `frontend/src/components/wodFilter/WodsList.tsx` para añadir
  `role="status"` y `aria-live="polite"`, siguiendo la convención ya usada en
  el resto del proyecto.
- No modificar el texto, la pluralización, el cálculo de `filteredWods` ni
  `hasActiveFilters`/`hasFilteredResults`/`shouldShowSearchClear`/
  `shouldShowEmptyClear`.
- No modificar el bloque de estado vacío (`wod-empty-state`), que ya tiene su
  propia región de estado y queda intacto.
- No tocar `WodsView.tsx`, `WodsPage.tsx`, `ExercisesList.tsx`, backend, API,
  base de datos, autenticación ni dependencias.
- Añadir pruebas sobre la semántica accesible del contador en
  `WodsList.test.tsx`.

## Comportamiento esperado

- El `<p className="wod-count">` se renderiza con `role="status"` y
  `aria-live="polite"`.
- Al cambiar búsqueda o categoría, el texto del contador cambia dentro del
  mismo nodo (misma convención ya usada: `useMemo` sobre `filteredWods`), por
  lo que la región de estado permite a un lector de pantalla detectar la
  actualización.
- Cuando `filteredWods.length === 0`, el contador sigue mostrando
  "0 de N WODs" (texto de #230 sin cambios) dentro de su propia región de
  estado, y el bloque `wod-empty-state` mantiene la suya por separado; ambas
  regiones anuncian contenidos distintos (un número y una explicación), no
  un mensaje duplicado.
- Ningún estado de carga o error pasa por esta región, porque `WodsList` no
  se monta mientras `WodsView` resuelve `loading`/`error`.

## Criterios de aceptación

- [ ] La actualización del contador al cambiar filtros o búsqueda es
      detectable por tecnología de asistencia mediante una región semántica
      adecuada (`role="status"` + `aria-live="polite"` en el contador).
- [ ] La región no anuncia un estado erróneo durante carga/error ni genera
      duplicaciones evitables (verificado: el contador no se monta durante
      `loading`/`error`, resueltos en `WodsView.tsx`).
- [ ] Se conserva el texto singular/plural introducido en #230, incluyendo
      cero coincidencias, sin cambios de copy.
- [ ] El aspecto visual y la lógica del filtrado permanecen intactos (sin
      cambios de CSS ni de `wodFilters.ts`).
- [ ] Las pruebas cubren la semántica accesible del contador (`role`,
      `aria-live`) y pasan los checks frontend aplicables (`lint`, `test`,
      `build`).
- [ ] Se documenta evidencia de que no existe ya una región accesible
      equivalente en el contador antes de añadirla (ver sección "Evidencia
      previa").

## Restricciones

- Mantener React, TypeScript, CSS y Vitest; no añadir dependencias.
- Reutilizar el patrón `role="status"` / `aria-live="polite"` ya existente en
  el proyecto; no introducir una librería o abstracción de accesibilidad
  nueva.
- No modificar backend, base de datos, autenticación, WODs personales ni el
  harness.
- No integrar, fusionar ni publicar nada: el alcance de `/dev-issue` para
  esta Issue es solo fases 4–9.

## Referencias

- GitHub Issue #231: `feat(a11y): anunciar cambios del contador de WODs a
  lectores de pantalla`.
- GitHub Issue #230 (dependencia, ya commiteada en `feat/230-contador-wods`,
  commit `a177fc2`).
- `frontend/src/components/wodFilter/WodsList.tsx`.
- `frontend/src/components/wodFilter/WodsList.test.tsx`.
- `specs/230-contador-wods/spec.md` (contador base, no se reimplementa).
- Convención de accesibilidad existente: `frontend/src/views/home/HomeView.tsx`,
  `frontend/src/views/wod-results/MyWodResultsView.tsx`,
  `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
