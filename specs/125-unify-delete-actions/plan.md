# Plan técnico

## Enfoque

Extraer un control presentacional pequeño y reutilizable para que Mis WODs y
Benchmarks compartan exactamente el mismo marcado y estilos destructivos. La
lógica de confirmación y petición permanecerá en cada página, junto a su
estado de borrado, para no mezclar responsabilidades entre presentación y
acceso a datos.

Benchmarks conservará el modo y la búsqueda local. Después de borrar un
resultado, la página reiniciará ambos recursos de resultados a loading y
relanzará las solicitudes existentes de historial y mejores marcas; así el
servidor seguirá siendo la fuente de verdad para promoción de PR y reglas de
comparabilidad.

## Componentes afectados

- `frontend/src/components/DeleteIconButton.tsx`: control compartido de icono,
  etiqueta accesible, tooltip, disabled y loading.
- `frontend/src/views/my-wods/components/MyWodsList.tsx`: usar el control
  compartido en cada WOD y conservar acciones existentes.
- `frontend/src/views/my-wods/MyWodsView.Types.ts` y `MyWodsView.tsx`: prop de
  borrado en curso.
- `frontend/src/pages/MyWodsPage.tsx`: bloquear solicitudes concurrentes y
  comunicar loading del borrado actual.
- `frontend/src/views/exercise-results/components/ExerciseResultCard.tsx` y
  `ExerciseResultsList.tsx`: mostrar el control en cada resultado de ambos
  modos.
- `frontend/src/views/exercise-results/MyExerciseResultsView.Types.ts` y
  `MyExerciseResultsView.tsx`: propagar borrado, error y estado loading.
- `frontend/src/pages/MyExerciseResultsPage.tsx`: confirmar, borrar con el
  cliente existente y refrescar historial/PR.
- `frontend/src/styles/resources.css`, `my-wods.css` y
  `my-exercise-results.css`: patrón visual compartido y layout de acción.
- Tests de presentación y estados de las vistas/componentes afectados.
- `specs/125-unify-delete-actions/`: SDD y trazabilidad.

No se modificarán backend, contratos API, entidades, tablas, reglas de dominio
ni cálculos de personal records.

## Estrategia

1. Confirmar el contrato existente de `deleteExerciseResult` y los estados de
   borrado de Mis WODs.
2. Crear el control de icono con semántica nativa, foco visible, `aria-label`,
   `title`, `disabled` y `aria-busy` durante loading.
3. Sustituir el texto visible de eliminación de Mis WODs sin cambiar su
   confirmación ni su actualización local posterior al éxito.
4. Añadir estado y handler de eliminación a Benchmarks, manteniendo modo y
   búsqueda, y refrescando ambas fuentes tras éxito.
5. Añadir pruebas de ambos modos, PR, error/loading, cancelación representada
   por la ausencia de petición en el handler y presentación accesible.
6. Ejecutar lint, tests, build, `git diff --check` y revisión de alcance.

## Verificación

- Frontend: `npm run lint` desde `frontend/`.
- Frontend: `npm run test` desde `frontend/`.
- Frontend: `npm run build` desde `frontend/`.
- Revisión: `git diff --check`.
- Revisión estática: endpoint existente, estado de confirmación, bloqueo de
  duplicados, refresco de ambas listas y ausencia de cambios backend/domain.
- Validación manual aprobada por el usuario: icono Trash2 y variante destructive,
  tooltip, foco, confirmación/cancelación, éxito/error, promoción de PR,
  búsqueda, ambos modos y responsive.
