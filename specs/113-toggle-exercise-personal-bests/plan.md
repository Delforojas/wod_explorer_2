# Plan técnico

## Enfoque

Implementar la comparación en `ExerciseResultService`, usando únicamente los
resultados propios cargados por el repositorio y las reglas aprobadas para
`WEIGHT` y `REPS`. El endpoint nuevo devolverá el DTO existente, sin introducir
campos persistidos ni duplicar la lógica de `WodResultService`.

La vista cargará en paralelo el historial completo y la lista de mejores marcas.
El estado local conservará el modo seleccionado y el texto de búsqueda. El
helper existente filtrará el conjunto activo por IDs de ejercicio, de modo que
el cambio de modo no borre ni reinicie el término buscado.

## Componentes afectados

### Backend

- `ExerciseResultService`: cálculo de mejores marcas propias y ownership mediante
  `CurrentUserService`.
- `ExerciseResultController`: endpoint `GET /personal-bests`.
- `ExerciseResultServiceTest`: agrupación, ganadores, empates y exclusiones.

No se modificarán entidades, esquema SQL, `ExerciseResultResponse`, ni el
endpoint existente de historial.

### Frontend

- `apiEndpoints.ts`: endpoint de mejores marcas de ejercicios.
- `exerciseResultsApi.ts`: función autenticada y parseada para el nuevo endpoint.
- `MyExerciseResultsPage.tsx`: cargar ambos conjuntos, conservar estados y
  reintento.
- `MyExerciseResultsView.Types.ts`: props del conjunto de mejores marcas.
- `MyExerciseResultsView.tsx`: toggle accesible, selección del conjunto activo y
  estados vacíos por modo.
- `my-exercise-results.css`: estilos responsive, foco y estados del toggle.
- Pruebas de presentación y filtrado: cambio de modo, búsqueda combinada y
  regresiones del CTA.

## Estrategia de implementación

1. Crear el SDD con las decisiones de comparabilidad aprobadas.
2. Añadir en backend un endpoint autenticado que recupere solo resultados
   propios y conserve el ganador por clave comparable.
3. Aplicar el desempate por valor, `performedAt` e ID, sin incluir mediciones
   excluidas ni registros incompletos.
4. Añadir pruebas unitarias backend para agrupación, selección, empate,
   ownership y mediciones excluidas.
5. Añadir el cliente frontend para el endpoint sin cambiar contratos DTO.
6. Añadir el toggle nativo con `aria-pressed`, foco visible y tamaño táctil
   acorde con `DESIGN.md`.
7. Derivar el listado visible desde el modo activo y el helper de búsqueda
   existente, conservando el término entre modos.
8. Añadir pruebas de interacción/presentación para modos, filtro, vacíos, error,
   reintento y `+ Registrar marca`.
9. Ejecutar verificaciones frontend y backend aplicables, además de revisión de
   alcance y `git diff --check`.

## Verificación

- Backend: `./mvnw -q test` desde `backend/`.
- Backend: `./mvnw -q -DskipTests validate` desde `backend/`.
- Frontend: `npm run lint` desde `frontend/`.
- Frontend: `npm run test` desde `frontend/`.
- Frontend: `npm run build` desde `frontend/`.
- Revisión: `git diff --check` y manifiesto de archivos de la Issue.
- Revisión estática: endpoint autenticado, ownership, ausencia de cambios SQL,
  exclusión de tipos no aprobados y preservación de `/personal-bests` de WOD.
- Validación manual pendiente: alternancia, búsqueda combinada, resultados
  `WEIGHT` por repeticiones, `REPS`, vacíos, errores, teclado y responsive.
