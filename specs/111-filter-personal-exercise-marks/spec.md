# SDD: Filtrar marcas personales por ejercicio

## Objetivo

Permitir que un usuario autenticado consulte sus marcas personales de un
ejercicio concreto desde la pantalla `Marcas`, manteniendo el listado completo
como estado inicial y retirando de esa pantalla el CTA «Mejores marcas».

## Alcance

- Añadir un input accesible de búsqueda por nombre de ejercicio con icono de
  lupa y acción de limpieza rápida.
- Filtrar en cliente los resultados ya cargados según coincidencias parciales
  del nombre del ejercicio, resolviendo después los resultados mediante su
  `exerciseId`.
- Restaurar el listado completo cuando el texto esté vacío o se limpie.
- Mostrar estados de carga, error con reintento, listado vacío global y listado
  vacío cuando la búsqueda no tenga coincidencias.
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
4. Sin texto de búsqueda se renderizan todas las marcas en el orden recibido.
5. Al escribir, se ignoran mayúsculas/minúsculas y los espacios exteriores; una
   coincidencia parcial como «squat» incluye «Back Squat» y «Hang Squat Clean».
6. Los resultados visibles se resuelven mediante el `exerciseId` de cada marca,
   por lo que los nombres coincidentes no mezclan datos de forma incorrecta.
7. Si no hay coincidencias, se muestra un estado vacío informativo sin
   resultados ajenos.
8. Al limpiar el texto, vuelve a mostrarse el listado completo.
9. Cada cambio de texto deriva el listado desde el estado actual y los datos
   cargados, por lo que no puede conservar resultados obsoletos.
10. La navegación conserva «+ Registrar marca» y ya no contiene «Mejores
   marcas» dentro de esta pantalla.

## Criterios de aceptación

- [ ] Sin texto se muestran todas las marcas personales disponibles.
- [ ] La búsqueda parcial por nombre resuelve resultados mediante `exerciseId`.
- [ ] La búsqueda ignora mayúsculas/minúsculas y espacios exteriores.
- [ ] Cambios rápidos entre ejercicios no muestran resultados obsoletos.
- [ ] Limpiar el texto restablece todas las marcas.
- [ ] Una búsqueda sin coincidencias muestra un estado vacío informativo sin
      resultados ajenos.
- [ ] «Mejores marcas» desaparece de esta pantalla sin interacción residual.
- [ ] «+ Registrar marca» sigue operativo.
- [ ] Las fechas, cargas, repeticiones, distancias y tiempos se conservan.
- [ ] La pantalla funciona tras recarga en sesión autenticada y mantiene el
      layout responsive y la accesibilidad del control.
- [ ] Existen pruebas para búsqueda parcial, mayúsculas/minúsculas, texto vacío,
      ausencia de resultados, limpieza, CTA y estados de recuperación.
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
