# SDD: Filtrar marcas personales por ejercicio

## Objetivo

Permitir que un usuario autenticado consulte sus marcas personales de un
ejercicio concreto desde la pantalla `Marcas`, manteniendo el listado completo
como estado inicial y retirando de esa pantalla el CTA «Mejores marcas».

## Alcance

- Añadir un selector accesible de ejercicio con la opción inicial «Todos los
  ejercicios».
- Filtrar en cliente los resultados ya cargados usando `exerciseId`, no el
  nombre visible del ejercicio.
- Restaurar el listado completo al limpiar el selector.
- Mostrar estados de carga, error con reintento, listado vacío global y listado
  vacío para el ejercicio seleccionado.
- Mantener los datos, formato, orden cronológico recibido, privacidad,
  navegación y enlace «+ Registrar marca» existentes.
- Retirar únicamente el enlace «Mejores marcas» de la navegación de esta
  pantalla; la pantalla y los cálculos de mejores marcas permanecen intactos.
- Mantener el comportamiento mobile-first, responsive y accesible sin añadir
  dependencias ni cambiar contratos REST.

## Comportamiento esperado

1. La pantalla carga las marcas propias y el catálogo de ejercicios mediante
   las peticiones existentes.
2. Mientras la carga está pendiente se muestra el estado de carga actual.
3. Si falla la carga se muestra un error comprensible y un control «Reintentar»
   que vuelve a solicitar los datos.
4. Sin selección, el selector muestra «Todos los ejercicios» y se renderizan
   todas las marcas en el orden recibido.
5. Al elegir un ejercicio, solo se renderizan resultados cuyo `exerciseId`
   coincide exactamente con el ID seleccionado, incluso si hay nombres
   repetidos.
6. Si el ejercicio seleccionado no tiene resultados, se muestra un estado vacío
   específico y no se muestran resultados de otros ejercicios.
7. Al seleccionar «Todos los ejercicios», vuelve a mostrarse el listado
   completo.
8. Cambiar de ejercicio solo deriva el listado desde el estado actual y los
   datos cargados, por lo que no puede conservar resultados obsoletos de una
   selección anterior.
9. La navegación conserva «+ Registrar marca» y ya no contiene «Mejores
   marcas» dentro de esta pantalla.

## Criterios de aceptación

- [ ] Sin filtro se muestran todas las marcas personales disponibles.
- [ ] El filtro usa `exerciseId` y solo muestra las marcas del ejercicio
      seleccionado.
- [ ] Cambios rápidos entre ejercicios no muestran resultados obsoletos.
- [ ] Limpiar el filtro restablece todas las marcas.
- [ ] Un ejercicio sin marcas muestra un estado vacío informativo sin resultados
      ajenos.
- [ ] «Mejores marcas» desaparece de esta pantalla sin interacción residual.
- [ ] «+ Registrar marca» sigue operativo.
- [ ] Las fechas, cargas, repeticiones, distancias y tiempos se conservan.
- [ ] La pantalla funciona tras recarga en sesión autenticada y mantiene el
      layout responsive y la accesibilidad del control.
- [ ] Existen pruebas para filtrado por ID, nombres repetidos, ausencia de
      resultados, limpieza, cambios rápidos, CTA y estados de recuperación.
- [ ] Pasan lint, tests, build y `git diff --check`.

## Restricciones

- No cambiar endpoints, DTOs, contratos REST, autenticación ni ownership.
- No eliminar marcas, historial ni cálculos de récords personales.
- No eliminar ni rediseñar la ruta `/personal-bests`; solo retirar su CTA de
  esta pantalla.
- No añadir dependencias ni introducir una nueva librería de estado.
- No cambiar el formato de representación de los resultados.

## Fuentes

- GitHub Issue #111.
- `frontend/src/pages/MyExerciseResultsPage.tsx`.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
- `frontend/src/views/exercise-results/components/ExerciseResultsList.tsx`.
- `frontend/src/api/exerciseResultsApi.ts` y `frontend/src/api/exercisesApi.ts`.
- `frontend/src/schemas/exerciseResultSchemas.ts` y
  `frontend/src/schemas/exerciseSchemas.ts`.
- `DOMAIN.md`, `PRODUCT.md`, `PROJECT.md`, `DESIGN.md`, `AGENTS.md` y
  `frontend/AGENTS.md`.
