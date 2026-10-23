# Plan: Limpiar filtros del catálogo público de WODs

## Enfoque

Extraer la lógica pura de normalización, detección de filtros activos y
filtrado por nombre a un módulo pequeño de la vista WOD. `WodsList` seguirá
siendo responsable del estado local de la búsqueda y usará esa lógica para
mostrar u ocultar la acción y restablecer el estado al activarla.

## Componentes afectados

- `frontend/src/views/wods/components/WodsList.tsx`: acción condicional,
  filtrado derivado y restablecimiento de la búsqueda.
- `frontend/src/views/wods/wodFilters.ts`: lógica reutilizable para filtrar
  WODs y determinar si hay un filtro activo.
- `frontend/src/styles/wod.css`: presentación de la acción, foco visible y
  comportamiento responsive.
- `frontend/src/views/wods/wodFilters.test.ts`: pruebas de normalización,
  filtrado, visibilidad condicional y restablecimiento del listado.

## Estrategia de implementación

1. Preservar la comparación actual por nombre, ignorando espacios exteriores y
   diferencias de mayúsculas/minúsculas.
2. Derivar `hasActiveFilters` desde la búsqueda normalizada para evitar estado
   duplicado.
3. Renderizar un botón nativo `type="button"` junto al campo de búsqueda solo
   cuando el filtro esté activo.
4. Limpiar la búsqueda con el manejador del botón; el filtrado derivado
   restaurará la colección completa y actualizará el contador.
5. Reutilizar el patrón de foco visible y objetivo táctil mínimo de 44px,
   adaptando colores y superficies a los estilos existentes de WOD.

## Verificación

- Ejecutar `npm run test` desde `frontend/`.
- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Revisar los cambios para confirmar que solo afectan al frontend y al SDD de
  la Issue, manteniendo `opencode.json` fuera del commit.
- Derivar validación manual de la visibilidad, activación por teclado y
  comportamiento responsive.
