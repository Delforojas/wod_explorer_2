# Plan técnico

## Enfoque

Mantener la carga de ejercicios existente en `RegisterExerciseResultPage` y
usar la lista ya disponible para resolver el `exerciseId` de la URL. La
validación del parámetro y la resolución por ID vivirán en funciones puras
pequeñas para poder probarlas sin introducir un framework de tests de
componentes.

La selección visual del catálogo se conectará mediante el callback que ya
existe en `ExercisesPage` y `ExercisesView`. La lista ofrecerá una acción
semántica de detalle que llama al callback; la acción de registro seguirá
siendo un enlace explícito a la ruta con `exerciseId`.

## Componentes afectados

- `frontend/src/components/ExerciseFilter/ExercisesList.tsx`: recibir y
  ejecutar `onSelectExercise`.
- `frontend/src/views/exercises/ExercisesView.tsx`: propagar el callback a la
  lista.
- `frontend/src/pages/RegisterExerciseResultPage.tsx`: leer la query, validar
  el ID y seleccionar el ejercicio cargado.
- `frontend/src/utils/exerciseSelection.ts`: funciones puras de parseo y
  resolución de selección.
- `frontend/src/utils/exerciseSelection.test.ts`: cubrir parámetros y
  disponibilidad.
- `frontend/src/styles/exercise.css`: reutilizar la acción existente para la
  nueva acción de detalle si hace falta una variante mínima.

## Estrategia de implementación

1. Crear el SDD y verificar la trazabilidad de los criterios.
2. Propagar el callback de selección hasta `ExercisesList` sin cambiar el
   contrato de la API.
3. Añadir parseo y resolución puros para `exerciseId`.
4. Inicializar la selección del formulario después de cargar el catálogo y
   conservar el selector manual como fallback.
5. Añadir tests unitarios para selección válida, ausente, inválida y no
   disponible.
6. Ejecutar lint, tests, build y revisión de diff.

## Estados y accesibilidad

- La carga existente seguirá comunicándose con `role="status"`.
- Los errores de query se mostrarán con el patrón de error existente y
  permitirán recuperar la selección mediante el selector.
- La acción de detalle será un botón nativo con etiqueta explícita.
- El enlace de registro mantendrá su destino y etiqueta actuales.

## Verificación

- Tests unitarios de las funciones de selección.
- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check` y revisión manual de estados y rutas afectadas.
