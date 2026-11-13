# Plan: Contador de WODs filtrados en el catálogo público

## Enfoque técnico

Corregir, en el sitio donde ya vive, el contador existente de
`WodsList.tsx` para que use singular/plural correcto del término "WOD",
en lugar de crear un componente o lógica nueva. No se toca la arquitectura
existente (pages/views/components), ni el flujo de datos, ni el filtrado.

## Componentes afectados

- `frontend/src/components/wodFilter/WodsList.tsx`
  - Añadir una función pura local `pluralizeWod(count: number): string`
    (p. ej. `` `${count} WOD${count === 1 ? "" : "s"}` ``) junto a los demás
    helpers del archivo (`formatWodType`, `getWodCategoryBadge`).
  - Sustituir el bloque `{/* CONTADOR */}` (líneas 137-143) para:
    - Con filtros activos: `` `${filteredWods.length} de ${pluralizeWod(wods.length)}` ``.
    - Sin filtros activos: `` `${pluralizeWod(wods.length)} disponible${wods.length === 1 ? "" : "s"}` ``.
  - No se modifica `hasActiveFilters`, `hasFilteredResults`,
    `shouldShowSearchClear`, `shouldShowEmptyClear`, el `useMemo` de
    `filteredWods`, ni el bloque del estado vacío (147-174).
- `frontend/src/components/wodFilter/WodsList.test.tsx`
  - Añadir casos para: 1 WOD (singular, sin filtro), varios WODs (plural, sin
    filtro), filtro activo con coincidencias (singular y plural), filtro
    activo sin coincidencias (0 WODs, conserva estado vacío).

## Fuera de alcance (confirmado)

- `frontend/src/components/ExerciseFilter/ExercisesList.tsx` tiene el mismo
  patrón sin plural/singular, pero es otro dominio (ejercicios) y no está
  mencionado por la Issue #230; no se modifica.
- No se extrae ningún util compartido: `pluralizeWod` es local a
  `WodsList.tsx` porque hoy solo tiene un consumidor real dentro del alcance
  aprobado (regla "extraer solo cuando hay reutilización real").
- No se toca `WodsPage.tsx` ni `WodsView.tsx`: loading/error ya están
  resueltos ahí, sin relación con el texto del contador.

## Estrategia de verificación

1. `npm run lint` (frontend).
2. `npm run test` (frontend) — incluye `WodsList.test.tsx` actualizado y el
   resto de la suite para detectar regresiones en filtros/estado vacío.
3. `npm run build` (frontend) — verifica TypeScript y build de producción.
4. Revisión manual de accesibilidad: el contador sigue siendo un `<p>` de
   texto plano dentro de `wod-count`, sin cambios de semántica, foco ni
   contraste.

## Riesgos / decisiones

- Cambiar "entrenamientos" por "WOD/WODs" es un cambio de copy visible. Se
  justifica porque: (a) es el término de dominio (`DOMAIN.md`), (b) es el
  literal que pide la Issue (`1 WOD`, `5 WODs`, `0 WODs`), y (c) el título de
  la página ya usa "WODs" (`<h1>WODs</h1>`). No se toca ningún otro texto de
  la página (descripción, empty state, etc.).
