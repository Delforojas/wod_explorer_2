# Tareas

## Preparación

- [x] Confirmar Issue #113, dependencia #111 y alcance de mejores marcas de
      `ExerciseResult`.
- [x] Auditar los campos reales, contratos API, validaciones y esquema vivo.
- [x] Confirmar las reglas de agrupación, comparación, empate y exclusión con
      el usuario.
- [x] Crear el SDD único y verificar su trazabilidad.

## Backend

- [x] Implementar el cálculo autenticado de mejores marcas en
      `ExerciseResultService`.
- [x] Agrupar `WEIGHT` por `exerciseId` y `reps`, y `REPS` por `exerciseId`.
- [x] Aplicar ganador por valor y desempate por `performedAt` e ID.
- [x] Excluir `TIME`, `DISTANCE` y `WEIGHT_DISTANCE`.
- [x] Añadir `DISTANCE_TIME` por `exerciseId` y distancia positiva, con menor
      duración como ganador.
- [x] Exponer `GET /api/exercise-results/personal-bests` usando
      `ExerciseResultResponse`.
- [x] Añadir pruebas backend de agrupación, ganadores, empates, ownership y
      mediciones excluidas.
- [x] Añadir pruebas `DISTANCE_TIME` de agrupación, empates, distancias
      diferentes, valores inválidos y ownership.

## Frontend

- [x] Añadir el endpoint y cliente autenticado para mejores marcas.
- [x] Cargar historial y mejores marcas conservando estados de error, carga y
      reintento.
- [x] Añadir toggle accesible entre Todas las marcas y Mejores marcas.
- [x] Mantener el término de búsqueda y aplicar el filtro al modo activo.
- [x] Diferenciar vacíos globales, vacíos de mejores marcas y búsquedas sin
      coincidencias.
- [x] Mantener `+ Registrar marca`, navegación, privacidad y responsive.
- [x] Añadir pruebas frontend de cambio de modo, filtro combinado, estados y
      regresiones.

## Verificación y handoff

- [x] Revisar que no haya cambios de esquema ni reutilización de
      `WodResultService`.
- [x] Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] Ejecutar `./mvnw -q test` desde `backend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Sincronizar este SDD con el estado real antes de revisión y mantener la
      validación manual pendiente.
