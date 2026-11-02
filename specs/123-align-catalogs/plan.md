# Plan técnico

## Enfoque

Cambiar únicamente la presentación de los dos listados y sus buscadores.
Ambos componentes conservarán el estado local, las funciones de filtrado, los
datos recibidos y los handlers actuales. El marcado usará las clases de lista
compartidas ya definidas en `resources.css`, con modificadores locales solo
para diferencias de catálogo.

## Componentes afectados

- `frontend/src/components/ExerciseFilter/ExercisesList.tsx`: buscador con
  control visual compartido, filas de ejercicios y CTA autenticado.
- `frontend/src/components/wodFilter/WodsList.tsx`: buscador, filas de WODs,
  acciones públicas/autenticadas y estado vacío existente.
- `frontend/src/styles/resources.css`: patrón compartido de filas de catálogo,
  buscador, acciones, foco y responsive.
- `frontend/src/styles/exercise.css` y `frontend/src/styles/wod.css`: se
  conservan como fuentes de estilos de página y detalle; no se duplican nuevas
  reglas de filas en ellos.
- Tests de presentación de ambos componentes/listados para cubrir contenido,
  búsqueda y visibilidad de acciones.

No se modificarán páginas, APIs, tipos de dominio, rutas, `AuthProvider`,
backend, base de datos ni formularios de resultados.

## Estrategia

1. Confirmar el patrón de Benchmarks y de `resources.css` como fuente visual.
2. Sustituir las tarjetas por filas semánticas con nombres, metadatos y
   acciones colocadas junto al recurso.
3. Añadir icono de búsqueda decorativo y botón de limpieza con nombre accesible,
   manteniendo el input y el filtrado existentes.
4. Ajustar breakpoints para apilar contenido y acciones en pantallas pequeñas.
5. Añadir regresiones de renderizado guest/auth, rutas, metadatos y acciones.
6. Ejecutar lint, tests, build y `git diff --check`.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática para confirmar que no hay cambios fuera del frontend,
  specs y archivos de prueba del alcance.
- Validación manual pendiente en 320–599 px, 600–899 px y desktop, con estados
  guest/auth y detalle público de WOD.
