# Plan: Estado vacio del catalogo publico de WODs

## Enfoque

Implementar la mejora en el componente que ya controla la busqueda y el
listado, sin cambiar contratos ni extraer nuevas abstracciones.

1. Mantener `filterWods` y `hasActiveWodFilters` como unica fuente de verdad
   para el estado de busqueda.
2. Derivar en `WodsList` los estados de catalogo vacio y busqueda sin
   coincidencias a partir de `wods.length`, `filteredWods.length` y
   `hasActiveFilters`.
3. Renderizar un estado vacio semantico con icono decorativo, titulo y
   explicacion en espanol.
4. Reubicar visualmente la accion existente `Limpiar filtros` dentro del estado
   vacio cuando la busqueda activa no tiene coincidencias, manteniendola en el
   buscador cuando la busqueda conserva resultados.
5. Añadir estilos locales en `wod.css` para panel, icono, jerarquia tipografica,
   foco, objetivo tactil y comportamiento movil.
6. Mantener sin cambios la seleccion de WOD, los enlaces autenticados, el
   contador, el scroll-to-top y la logica de filtrado.

## Archivos previstos

- `frontend/src/components/wodFilter/WodsList.tsx`: estado derivado y marcado
  accesible del estado vacio.
- `frontend/src/styles/wod.css`: presentacion visual y responsive del estado.
- `specs/082-wod-catalog-empty-state/spec.md`: requisitos y restricciones.
- `specs/082-wod-catalog-empty-state/plan.md`: enfoque y verificaciones.
- `specs/082-wod-catalog-empty-state/tasks.md`: tareas trazables.

## Verificacion

- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run test` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Ejecutar `git diff --check`.
- Revisar imports, archivos afectados y ausencia de cambios backend/API.
- Validar manualmente en movil y escritorio el catalogo vacio, la busqueda sin
  coincidencias, el foco/teclado y la limpieza de filtros.

## Riesgos y mitigaciones

- Riesgo: duplicar la accion de limpieza. Mitigacion: renderizarla en un solo
  lugar segun el estado del listado.
- Riesgo: confundir catalogo vacio con busqueda sin coincidencias. Mitigacion:
  derivar el mensaje usando el total recibido y el total filtrado.
- Riesgo: romper el boton fijo de navegacion o los controles moviles.
  Mitigacion: reutilizar el layout existente, mantener minimos tactiles y
  revisar el breakpoint movil definido en `wod.css`.
- Riesgo: validar solo logica y no presentacion. Mitigacion: dejar la
  validacion visual y de teclado como paso manual pendiente.
