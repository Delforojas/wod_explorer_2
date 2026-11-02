# Plan técnico

## Enfoque

Mantener la carga inicial del catálogo y la estructura visual existente, pero
retirar el camino completo de detalle que parte de `ExercisesPage`. La acción
de registro autenticado seguirá siendo un `Link` independiente con su query
`exerciseId`, por lo que no se modificará el flujo de #92.

La eliminación se hará desde el componente compartido `ExercisesList` y se
propagará hacia arriba: se quitarán `onSelectExercise`, `selectedExercise`, la
carga `getExerciseById` y el render de `ExerciseDetail`. Después se eliminarán
solo las referencias cliente y estilos que queden sin consumidores, dejando el
endpoint backend intacto.

## Componentes afectados

- `frontend/src/components/ExerciseFilter/ExercisesList.tsx`: eliminar la
  acción de detalle y conservar el enlace autenticado de registro.
- `frontend/src/views/exercises/ExercisesView.tsx` y `.Types.ts`: simplificar
  las props y retirar el render del detalle.
- `frontend/src/pages/ExercisesPage.tsx`: retirar estado, handler, refs,
  petición por ID e imports exclusivos del detalle.
- `frontend/src/components/ExerciseFilter/ExerciseDetail.tsx`: eliminar el
  componente sin consumidores.
- `frontend/src/api/exercisesApi.ts`, `apiEndpoints.ts` y `apiError.ts`:
  retirar únicamente la función, endpoint y mensaje frontend sin consumidores.
- `frontend/src/styles/exercise.css` y `styles/resources.css`: retirar solo
  reglas exclusivas de `.exercise-detail`.
- `frontend/src/components/ExerciseFilter/ExercisesList.test.tsx`: comprobar
  la ausencia de detalle en visitante y autenticado, y la preservación del
  enlace de registro.

## Estrategia de implementación

1. Confirmar la trazabilidad del SDD y clasificar cada referencia de detalle.
2. Simplificar tipos, página, vista y lista sin cambiar el contrato de
   `getExercises` ni el flujo `exerciseId` de resultados.
3. Eliminar el componente y las referencias cliente/estilos exclusivamente
   dedicados al detalle.
4. Añadir pruebas de markup observable para ambos estados de autenticación.
5. Revisar referencias residuales y ejecutar las verificaciones del frontend.

## Verificación

- Prueba de `ExercisesList` para visitante: no detalle ni navegación de
  resultados.
- Prueba de `ExercisesList` para usuario autenticado: no detalle y enlace de
  registro con el ID correcto.
- Búsqueda estática de `Ver detalle`, `ExerciseDetail`, `getExerciseById` y
  `.exercise-detail` en el catálogo y cliente frontend.
- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check` y revisión de alcance.
- Validación manual pendiente en visitante/autenticado, móvil/escritorio,
  incluyendo filtros, foco, registro y ausencia de rutas/acciones de detalle.
