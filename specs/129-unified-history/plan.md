# Plan técnico

## Enfoque

Mantener `/history` como una vista de consulta y ampliar su capa de datos para
combinar los dos recursos privados existentes. El backend solo enriquecerá el
DTO de ejercicios y hará determinista su orden; el frontend resolverá el rango
de fechas de ejercicios y la unión visual, sin crear un endpoint nuevo.

## Backend

- Añadir `exerciseName` y `measurementType` a `ExerciseResultResponse`.
- Actualizar `ExerciseResultMapper` para tomar ambos valores de la entidad
  asociada, incluyendo ejercicios inactivos.
- Ajustar `ExerciseResultRepository` a
  `performedAt DESC, id DESC`.
- Mantener `ExerciseResultService.findAll()` limitado al usuario autenticado.
- Actualizar esquema Zod/tipos frontend del contrato.
- Añadir pruebas de mapper/servicio/repositorio o controller según el patrón
  existente, cubriendo orden, ejercicio inactivo y propiedad del resultado.

## Frontend

- Ampliar `HistoryPage` con estados independientes para WODs y ejercicios,
  cargas y reintentos por fuente.
- Crear una utilidad pura de Historial para normalizar, filtrar, ordenar y
  formatear la unión discriminada.
- Reutilizar `getWodResultLines`, `formatWodResultDate`, `formatWodType` y
  `formatWodOrigin` para WODs.
- Extraer o reutilizar un formateador puro de resultados de ejercicio sin llevar
  al Historial la eliminación ni el distintivo PR de Benchmarks.
- Añadir el selector `Todos/WODs/Ejercicios`, filtros WOD condicionales y rango
  de fechas común.
- Renderizar filas con badge de tipo, nombre, fecha y puntuación.
- Mantener estados de carga, vacío, error total y error parcial con reintento.
- Reutilizar `resource-list`, `resource-row`, `resource-meta`, tokens y reglas
  responsive de `history.css`, `resources.css`, `my-wods-results.css` y
  `my-exercise-results.css`.

## Verificación

- Frontend: `npm run lint` desde `frontend/`.
- Frontend: `npm run test` desde `frontend/`.
- Frontend: `npm run build` desde `frontend/`.
- Backend: `./mvnw -q test` desde `backend/`.
- Revisión: `git diff --check`.
- Revisión estática: solo cambios de Historial, contrato ExerciseResult, tests y
  SDD; sin SQL, endpoint `/history`, autorización nueva ni acciones destructivas.
- Validación manual pendiente: datos mixtos, filtros, cronología, ejercicios
  inactivos, estados parciales, responsive y teclado.
