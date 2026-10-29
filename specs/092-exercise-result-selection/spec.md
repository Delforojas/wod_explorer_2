# Issue #92: Selección de ejercicio para registrar resultados

## Objetivo

Conectar la selección del catálogo de ejercicios con el flujo de registro de
marcas, haciendo que `exerciseId` sea leído, validado y reflejado en el
formulario de registro.

## Alcance

- Propagar `onSelectExercise` desde `ExercisesPage` hasta `ExercisesView` y la
  lista de ejercicios.
- Mantener una acción accesible para consultar el detalle del ejercicio desde
  el catálogo.
- Leer `exerciseId` desde la query de `/exercise-results/new`.
- Validar IDs ausentes, vacíos, no numéricos, no enteros o no positivos.
- Seleccionar automáticamente el ejercicio disponible indicado por la query.
- Informar cuando el ejercicio indicado no existe o no está disponible.
- Mantener el selector manual como fallback cuando no existe una selección en
  la URL o cuando la selección no es válida.

## Comportamiento esperado

- La acción de registro del catálogo navega a
  `/exercise-results/new?exerciseId=<id>`.
- El formulario carga los ejercicios y selecciona el ejercicio indicado por
  `exerciseId` cuando el ID es válido y está disponible.
- Un `exerciseId` inválido muestra un mensaje claro y permite elegir otro
  ejercicio manualmente.
- Un `exerciseId` válido pero no disponible muestra un mensaje recuperable y
  permite elegir otro ejercicio manualmente.
- Sin `exerciseId`, el formulario conserva el selector vacío y usable.
- Los estados de carga, error y éxito existentes siguen siendo deterministas.

## Criterios de aceptación

- [ ] Seleccionar un ejercicio del catálogo abre el registro con el ejercicio
      correcto.
- [ ] La página de registro no ignora `exerciseId`.
- [ ] Los IDs ausentes o inválidos producen un estado claro y recuperable.
- [ ] Los estados de carga, error y éxito son deterministas.
- [ ] Existen tests para la propagación de selección, parámetros de ruta, IDs
      ausentes o inválidos y contexto de registro correcto.

## Dependencias

- #26 proporciona el cliente HTTP y el comportamiento común de errores.
- #28 proporciona el contrato del catálogo de ejercicios y su detalle.

El código necesario de ambas dependencias ya está disponible en `main`.

## Restricciones

- No cambiar el contrato REST ni implementar filtros de servidor.
- No rediseñar el catálogo de ejercicios.
- No añadir dependencias de testing o de estado.
- Mantener la arquitectura React + hooks existente y la UI en español.
