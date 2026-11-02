# SDD: Unificar acciones de borrado de resultados

## Objetivo

Unificar la acción destructiva de resultados personales en Mis WODs y
Benchmarks con un control compacto de solo icono, manteniendo la confirmación,
la autorización existente y la consistencia de los listados y récords tras
eliminar un resultado.

## Alcance

- Crear un único control visual reutilizable de borrado con icono de papelera,
  fondo oscuro, borde rojo tenue, foco visible y estados disabled/loading.
- Aplicar el control a cada WOD personal de Mis WODs sin cambiar su flujo de
  confirmación ni el comportamiento de permisos.
- Aplicar el mismo control a cada resultado visible de Benchmarks, tanto en
  All Scores como en Personal Records.
- Reutilizar `deleteExerciseResult` y su endpoint existente
  `DELETE /api/exercise-results/{id}`.
- Confirmar antes de borrar, ignorar cancelaciones y prevenir solicitudes
  duplicadas durante la petición.
- Tras borrar correctamente un resultado de ejercicio, volver a cargar el
  historial y los récords personales desde el servidor para promover el
  siguiente resultado comparable o retirar el PR cuando corresponda.
- Mantener búsqueda, modo activo, contenido, ownership backend y layout
  responsive existentes.
- Comunicar errores sin retirar el resultado de forma prematura.

## Comportamiento esperado

1. Cada acción destructiva se muestra como un botón de 44px mínimo, solo con
   icono de papelera, `aria-label` contextual y tooltip nativo.
2. El botón conserva foco de teclado, contraste, estado disabled y anuncio de
   loading sin mostrar texto visible.
3. En Mis WODs, cancelar la confirmación no cambia la lista ni realiza una
   petición; confirmar mantiene el borrado actual y elimina el WOD solo tras
   éxito.
4. En Benchmarks, cancelar no cambia ninguna lista; confirmar llama al cliente
   de borrado para el resultado seleccionado.
5. Mientras un borrado está en curso, no se aceptan nuevos borrados y el
   control correspondiente comunica que está eliminando.
6. Un borrado exitoso de Benchmarks refresca All Scores y Personal Records con
   datos del servidor sin recargar la página ni perder búsqueda o modo.
7. Los errores mantienen los resultados visibles y muestran un mensaje
   accesible.
8. Las reglas de ownership y comparación de récords siguen perteneciendo al
   backend y a `DOMAIN.md`; no se modifican entidades, endpoints, tablas ni
   cálculos de dominio.

## Criterios de aceptación

- [ ] Mis WODs muestra el botón destructivo compacto de solo icono, sin texto
      visible, con nombre accesible y estados interactivos.
- [ ] Benchmarks muestra exactamente el mismo control en cada resultado de
      All Scores y Personal Records.
- [ ] Se elimina únicamente el resultado o WOD seleccionado mediante los
      clientes y endpoints existentes.
- [ ] Cancelar la confirmación no modifica datos ni estado visible.
- [ ] El éxito actualiza la lista personal y los récords sin recargar la página.
- [ ] Eliminar un PR permite que el servidor promocione el siguiente resultado
      comparable o deje el modo sin PR cuando no exista otro.
- [ ] Los errores no eliminan prematuramente registros y los envíos duplicados
      quedan bloqueados.
- [ ] La acción funciona con búsqueda activa, en ambos modos y sin overflow en
      móvil o desktop.
- [ ] El control es accesible por teclado, tiene foco visible, etiqueta
      contextual, contraste y estado disabled/loading.
- [ ] Existen regresiones para confirmación/cancelación, éxito/error, ambos
      modos, PR y presentación del control; pasan lint, tests, build y
      `git diff --check`.
- [ ] No hay cambios en entidades, tablas, cálculos de dominio, otros
      endpoints ni reglas de `DOMAIN.md`.

## Restricciones

- No eliminar ejercicios de catálogo, WODs públicos ni resultados ajenos.
- No añadir endpoints ni duplicar el servicio de borrado existente.
- No modificar las reglas de comparabilidad de #113.
- No rediseñar por completo Benchmarks, Mis WODs ni los formularios de
  resultados.
- No añadir dependencias ni cambiar el sistema visual aprobado.

## Fuentes

- GitHub Issue #125.
- `DOMAIN.md`, `PROJECT.md`, `DESIGN.md`, `AGENTS.md` y `frontend/AGENTS.md`.
- `specs/113-toggle-exercise-personal-bests/spec.md`.
- `frontend/src/api/exerciseResultsApi.ts`.
- `frontend/src/pages/MyExerciseResultsPage.tsx`.
- `frontend/src/views/exercise-results/`.
- `frontend/src/pages/MyWodsPage.tsx`.
- `frontend/src/views/my-wods/`.
