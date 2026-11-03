# Plan técnico

## Enfoque

Un único archivo de test de página, `frontend/src/pages/MyWodsPage.test.tsx`,
que renderiza la página real en un DOM de jsdom, mockea los módulos de API y
ejercita los recorridos mediante interacciones de usuario (Testing Library).
La página no se modifica.

## Infraestructura de test

1. Añadir `devDependencies`:
   - `jsdom` (entorno DOM para Vitest).
   - `@testing-library/react` y `@testing-library/dom` (render, consultas y
     eventos).
2. Declarar `// @vitest-environment jsdom` al inicio del archivo para no tocar
   la configuración global ni los tests SSR existentes.
3. Ejecutar `npm install` dentro de `frontend/` y confirmar lockfile coherente.

## Estrategia de mocks

- `vi.mock("../api/wodsApi")` con `getMyWods`, `getWodById`, `updateWod` y
  `deleteWod`.
- `vi.mock("../api/exercisesApi")` con `getExercises`.
- Factories de datos para `WodAggregateResponse` y `ExerciseResponse` derivadas
  de los tipos reales; sin campos inventados fuera del contrato.
- `window.confirm` stubeado por test.
- Helpers locales solo si reducen duplicación real: render de la página y
  fábricas de datos.

## Matriz de cobertura

| Comportamiento | Estímulo | Observación |
|---|---|---|
| Carga en progreso | promesas pendientes | mensaje de carga con `role="status"` |
| Carga con datos | resolución de `getMyWods`/`getExercises` | nombres y recuento visibles |
| Carga vacía | `getMyWods` → `[]` | estado vacío |
| Error de carga | rechazo de `getMyWods` | alerta con mensaje implementado |
| Selección | clic en "Ver WOD" | `getWodById` y detalle con composición |
| Error de selección | rechazo de `getWodById` | alerta "No se pudo cargar el WOD" |
| Selección obsoleta | dos selecciones resueltas en orden inverso | prevalece la última solicitud |
| Volver | clic en "← Volver" | vuelve al listado |
| Edición precargada | clic en "Editar" | formulario con nombre/modalidad/ejercicios |
| Cancelar edición | clic en "Cancelar" | vuelve al listado |
| Cambio de modalidad | FOR_TIME → AMRAP | desaparecen "Rondas", aparece duración |
| Validación | guardar con nombre vacío | error mostrado; `updateWod` no llamado |
| Guardado correcto | guardar datos válidos | `updateWod` llamado; listado actualizado |
| Error de guardado | rechazo de `updateWod` | alerta; formulario permanece |
| Borrado cancelado | `confirm` → `false` | `deleteWod` no llamado; fila permanece |
| Borrado correcto | `confirm` → `true` | `deleteWod` llamado; fila desaparece |
| Error de borrado | rechazo de `deleteWod` | alerta; fila permanece |

## Verificación

- `npm run test` (todos los tests, incluido el nuevo).
- `npm run lint`.
- `npm run build` (type-check + bundle).
- `git diff --check`.
- Revisión del diff para confirmar que no hay cambios de producción.

## Riesgos y mitigación

- Advertencias de `act` en React 19: usar `findBy*`/`waitFor` de Testing
  Library y resolver promesas dentro de esas esperas.
- Efectos asíncronos y orden de resolución: usar promesas controladas
  (deferred) en los casos de concurrencia; no temporizadores arbitrarios.
- Acoplamiento a textos: se usan roles accesibles y etiquetas estables; los
  textos decorativos no se asertan.
- Dependencias nuevas: son solo de test y se justifican en el SDD; se validan
  con build y lint.

## Lagunas conocidas (documentadas, no inventadas)

- Autenticación/permisos: viven en `RequireAuth`/`App.tsx`, no en la página.
- Doble envío concurrente de guardado/borrado: los guards existen, pero
  probarlos requeriría controlar el orden exacto de resolución; se documenta
  como no cubierto para no acoplar el test a la implementación.
- Estados no implementados: reintento de carga, confirmación inline de borrado
  y paginación.
