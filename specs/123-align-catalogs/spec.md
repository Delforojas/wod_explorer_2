# SDD: Alinear catálogos públicos con Benchmarks

## Objetivo

Unificar la presentación visual de `/exercises` y `/wods` con el lenguaje
oscuro, ligero y orientado a listas usado por Benchmarks y Mis WODs, sin
cambiar datos, filtros, rutas, autorización ni contratos de API.

## Alcance

- Reutilizar los tokens y patrones existentes de `resources.css`.
- Mantener cabeceras centradas con título, descripción y contador.
- Alinear el buscador con Benchmarks: superficie oscura, icono naranja, foco
  visible, ancho responsive y limpieza accesible.
- Sustituir las tarjetas voluminosas por filas ligeras con separadores finos.
- Mantener en ejercicios nombre, categoría, tipo de medición y el enlace de
  registro solo para usuarios autenticados.
- Mantener en WODs nombre, modalidad, tiempo límite cuando exista, `Ver` para
  cualquier visitante y registro solo para usuarios autenticados.
- Mantener los estados de carga, error, vacío y ausencia de coincidencias.
- Conservar el detalle público de WOD y su CTA condicionado por autenticación.
- Garantizar layout usable en móvil, tablet y desktop, incluyendo el espacio
  inferior del dock y foco de teclado.

## Comportamiento esperado

1. Los catálogos siguen cargando los mismos datos mediante las páginas y APIs
   actuales.
2. La búsqueda conserva la normalización, el filtrado, el contador y los
   botones de limpieza existentes.
3. Un visitante puede consultar y buscar ejercicios, abrir WODs y consultar su
   detalle; no ve ningún CTA de registro.
4. Un usuario autenticado ve los CTA de registro y estos conservan exactamente
   `/exercise-results/new?exerciseId=<id>` y
   `/my-wod-results/new?wodId=<id>`.
5. La restauración de sesión no añade estado asíncrono nuevo: `AuthProvider`
   inicializa la sesión desde el almacenamiento de forma síncrona y las vistas
   siguen renderizando solo según `isAuthenticated`.
6. Ningún texto, acción o metadato esencial se corta, desborda o solapa el dock
   en los breakpoints soportados.

## Criterios de aceptación

- [ ] `/exercises` y `/wods` usan listas/filas ligeras y comparten el lenguaje
      visual de Benchmarks.
- [ ] Buscadores y contadores conservan su comportamiento y son accesibles.
- [ ] Se conserva todo el contenido requerido de ejercicios y WODs.
- [ ] La visibilidad guest/auth de cada acción es correcta.
- [ ] El detalle público de WOD conserva su CTA condicionado por sesión.
- [ ] Loading, error, vacío y sin coincidencias mantienen semántica accesible.
- [ ] No hay overflow horizontal ni acciones inutilizables en móvil, tablet o
      desktop.
- [ ] No hay cambios en backend, BD, API, dominio, ownership ni formularios.
- [ ] Pasan lint, tests, build y `git diff --check`.

## Restricciones

- No añadir endpoints, rutas, dependencias, filtros ni flujos nuevos.
- No modificar `DOMAIN.md`, backend, persistencia, autorización o formularios
  de resultados.
- No rediseñar Benchmarks, Mis WODs ni el detalle de WOD fuera de lo necesario
  para conservar la integración visual del CTA.
- No introducir un nuevo sistema de estilos; reutilizar CSS existente.

## Fuentes

- GitHub Issue #123.
- `DESIGN.md`, `PROJECT.md`, `AGENTS.md` y `frontend/AGENTS.md`.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
- `frontend/src/styles/my-exercise-results.css`.
- `frontend/src/styles/resources.css`.
- `frontend/src/components/ExerciseFilter/ExercisesList.tsx`.
- `frontend/src/components/wodFilter/WodsList.tsx`.
- `frontend/src/components/wodFilter/WodDetail.tsx`.
