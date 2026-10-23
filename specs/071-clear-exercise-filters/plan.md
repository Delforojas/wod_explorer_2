# Plan: Limpiar filtros del catálogo de ejercicios

## Enfoque

Extraer la lógica pura de filtrado y detección de filtros activos a un módulo
pequeño de la vista de ejercicios. `ExercisesList` seguirá siendo responsable
del estado local de la búsqueda y usará esa lógica para mostrar u ocultar la
acción y restablecer el estado al activarla.

## Componentes afectados

- `frontend/src/views/exercises/components/ExercisesList.tsx`: acción
  condicional y restablecimiento de la búsqueda.
- `frontend/src/views/exercises/exerciseFilters.ts`: lógica reutilizable para
  filtrar ejercicios y determinar si hay un filtro activo.
- `frontend/src/styles/exercise.css`: presentación responsive, foco visible y
  objetivo táctil de la acción.
- `frontend/src/views/exercises/exerciseFilters.test.ts`: pruebas de la lógica
  observable de filtrado y estado activo.

## Estrategia de implementación

1. Preservar la comparación actual por nombre, ignorando espacios exteriores y
   diferencias de mayúsculas/minúsculas.
2. Derivar `hasActiveFilters` desde la búsqueda normalizada para evitar estado
   duplicado.
3. Renderizar un botón nativo `type="button"` junto al campo de búsqueda solo
   cuando el filtro esté activo.
4. Limpiar la búsqueda con el manejador del botón; el filtrado derivado
   restaurará la colección completa y actualizará el contador.
5. Aplicar los patrones CSS existentes con foco visible, mínimo táctil de 44px
   y comportamiento usable en móvil y escritorio.

## Verificación

- Ejecutar `npm run test` desde `frontend/`.
- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Revisar el diff para confirmar que solo contiene cambios del frontend y del
  SDD de la Issue, manteniendo `opencode.json` fuera del commit.
