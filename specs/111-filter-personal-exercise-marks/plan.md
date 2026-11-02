# Plan técnico

## Enfoque

Conservar la carga inicial existente de resultados propios y ejercicios, y
derivar el listado visible desde un `selectedExerciseId` local de la vista.
Esta decisión evita peticiones por cambio de filtro, mantiene el orden que
entrega la API y hace que los cambios rápidos sean síncronos y deterministas.

La página conservará la responsabilidad de cargar datos y añadirá un reintento
cancelable para evitar actualizar estado tras desmontarse o después de una
carga reemplazada. La vista conservará la presentación de estados y gestionará
solo el estado de selección. Un helper puro concentrará el filtrado por ID para
que la regla sea testeable sin duplicarla en el JSX.

## Componentes afectados

- `frontend/src/pages/MyExerciseResultsPage.tsx`: encapsular la carga/reintento
  y pasar `onRetry` a la vista.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`: eliminar el
  CTA «Mejores marcas», conservar «+ Registrar marca», añadir el selector y
  renderizar los estados globales/filtrados.
- `frontend/src/views/exercise-results/MyExerciseResultsView.Types.ts`:
  declarar el callback de reintento.
- `frontend/src/views/exercise-results/exerciseResultsFilter.ts`: filtrar
  resultados por `exerciseId` y mantener el orden recibido.
- `frontend/src/styles/my-exercise-results.css`: estilos del selector, etiqueta,
  foco y estados responsive usando tokens existentes.
- `frontend/src/views/exercise-results/exerciseResultsFilter.test.ts`: pruebas
  de ID, nombres repetidos, vacío, limpieza y cambios rápidos.
- `frontend/src/views/exercise-results/myExerciseResultsPresentation.test.tsx`:
  pruebas de markup para navegación, registro y estados principales.

No se modificarán `exerciseResultsApi.ts`, `exercisesApi.ts`, backend,
`PersonalBestsPage` ni sus contratos.

## Estrategia de implementación

1. Añadir el helper puro y sus datos de prueba con resultados de ejercicios con
   nombres repetidos.
2. Cambiar la página para soportar reintento y cancelar actualizaciones de una
   carga invalidada.
3. Añadir el selector nativo con etiqueta asociada, opción global y valores ID.
4. Derivar `visibleResults` mediante el helper y distinguir el vacío global del
   vacío del ejercicio seleccionado.
5. Retirar el `NavLink` de «Mejores marcas» sin tocar la ruta ni el cálculo de
   récords.
6. Ajustar estilos mobile-first y foco visible sin alterar el formato de las
   tarjetas.
7. Ejecutar pruebas, lint, build, `git diff --check` y revisión estática del
   alcance.

## Verificación

- Helper: todos los resultados, ID seleccionado, nombres duplicados, ID sin
  resultados, limpieza y secuencia de selecciones rápidas.
- Vista: ausencia de «Mejores marcas», enlace funcional de «+ Registrar marca»,
  selector y estados de carga, error/reintento, vacío global y vacío filtrado.
- Revisión estática: no se cambia ningún contrato REST ni se elimina la ruta de
  mejores marcas; el filtrado usa `result.exerciseId === selectedExerciseId`.
- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check` y revisión de archivos pertenecientes a la Issue.
- Validación manual pendiente en sesión autenticada, recarga, móvil, tablet y
  escritorio, incluyendo teclado y recuperación de errores.
