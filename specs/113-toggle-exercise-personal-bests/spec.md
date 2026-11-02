# SDD: Alternar mejores marcas en marcas de ejercicios

## Objetivo

Permitir que un usuario autenticado alterne dentro de la pantalla `Marcas`
entre el historial completo de `ExerciseResult` y sus mejores marcas personales,
manteniendo la búsqueda textual por ejercicio y el enlace `+ Registrar marca`.

## Alcance

- Añadir un control accesible para alternar entre `Todas las marcas` y
  `Mejores marcas` sin cambiar de pantalla.
- Mantener el buscador actual en ambos modos, incluyendo coincidencias parciales,
  insensibles a mayúsculas/minúsculas, limpieza rápida y persistencia del término
  al cambiar de modo.
- Añadir `GET /api/exercise-results/personal-bests`, autenticado y restringido al
  usuario actual, reutilizando `ExerciseResultResponse`.
- Calcular en backend mejores marcas de mediciones comparables:
  - `WEIGHT`: agrupar por `exerciseId` y `reps`; gana el mayor `weightKg`.
  - `REPS`: agrupar por `exerciseId`; gana el mayor `reps`.
  - `DISTANCE_TIME`: agrupar por `exerciseId` y `distanceM`; solo considerar
    `distanceM` y `durationSeconds` positivos; gana la menor duración.
- Resolver empates con `performedAt` más reciente y, si coincide, con el ID
  mayor como criterio determinista.
- Mantener récords `DISTANCE_TIME` independientes para cada distancia y no
  comparar distancias diferentes.
- Excluir `TIME`, `DISTANCE` y `WEIGHT_DISTANCE` del endpoint de mejores marcas.
- Mantener privacidad, ownership, historial, datos existentes, navegación y
  `+ Registrar marca`.
- No modificar el esquema de base de datos ni reutilizar la lógica de récords de
  `WodResult`.

## Comportamiento esperado

1. La pantalla carga inicialmente las marcas propias, las mejores marcas propias
   y el catálogo de ejercicios mediante solicitudes independientes, usando los
   contratos autenticados existentes o el nuevo endpoint específico.
2. El modo inicial es `Todas las marcas` y muestra el historial recibido sin
   alterar sus datos ni su orden.
3. El modo `Mejores marcas` muestra los ganadores devueltos por backend y puede
   mostrar varias marcas del mismo ejercicio cuando corresponden a distintos
   números de repeticiones en `WEIGHT` o distintas distancias en
   `DISTANCE_TIME`.
4. El texto de búsqueda se conserva al cambiar de modo y filtra el conjunto
   activo mediante `exerciseId`.
5. Los estados de carga, error con reintento y vacío distinguen entre historial
   completo, mejores marcas y búsquedas sin coincidencias.
6. Los resultados pertenecen únicamente al usuario autenticado y ningún cambio
   de modo modifica resultados persistidos.
7. El control de modo es usable con teclado, tiene foco visible, nombres
   accesibles y mantiene el layout responsive.

## Criterios de aceptación

- [ ] Se puede alternar entre Todas las marcas y Mejores marcas sin salir de la pantalla.
- [ ] El buscador filtra ambos modos y conserva su valor al alternar.
- [ ] `WEIGHT` se agrupa por ejercicio y repeticiones y selecciona la mayor carga.
- [ ] `REPS` se agrupa por ejercicio y selecciona el mayor número de repeticiones.
- [ ] Los empates se resuelven por fecha descendente y después por ID descendente.
- [ ] `TIME`, `DISTANCE` y `WEIGHT_DISTANCE` no aparecen como mejores marcas.
- [ ] `DISTANCE_TIME` agrupa por ejercicio y distancia, selecciona la menor
      duración, conserva distancias independientes y exige valores positivos.
- [ ] No se muestran marcas de otros usuarios ni se modifican resultados históricos.
- [ ] Los estados vacíos y de error distinguen entre modos y búsqueda combinada.
- [ ] `+ Registrar marca` y la navegación responsive continúan operativos.
- [ ] El control de modo funciona con teclado y expone su estado accesiblemente.
- [ ] Existen pruebas de agrupación, ganadores, empates, ownership, exclusiones,
      cambio de modo y filtro combinado.
- [ ] Pasan lint, tests, build y `git diff --check`.

## Restricciones y decisiones pendientes

- No cambiar el esquema de base de datos ni los DTOs existentes.
- No cambiar la lógica ni el endpoint de mejores marcas de `WodResult`.
- No calcular mejores marcas de `TIME` porque el modelo no distingue ejecución de
  duración mantenida.
- No calcular mejores marcas de `DISTANCE` porque el modelo no registra las
  condiciones necesarias para demostrar comparabilidad.
- `DISTANCE_TIME` sí es comparable por distancia exacta y duración positiva;
  no se compara entre distancias diferentes.

## Fuentes

- GitHub Issue #113.
- Decisiones de dominio confirmadas por el usuario antes de implementar.
- `DOMAIN.md`, `PRODUCT.md`, `PROJECT.md`, `DESIGN.md`, `AGENTS.md`.
- `frontend/AGENTS.md` y `backend/AGENTS.md`.
- `frontend/src/pages/MyExerciseResultsPage.tsx`.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
- `backend/src/main/java/com/wodexplorer2/backend/service/ExerciseResultService.java`
  y sus contratos asociados.
- Esquema vivo de `wod_explorer_2.exercise_results` y `exercises`.
