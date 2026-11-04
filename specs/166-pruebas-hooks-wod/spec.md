# SDD: Pruebas de flujo fetch/error/mutación en hooks de WOD

## Contexto

Auditoría #157, recomendación 8: proteger con tests los flujos de datos tras las
extracciones de hooks. Las dependencias ya están integradas en `main`:

- #159 añade pruebas de comportamiento de `MyWodsPage` (antes de extraer).
- #164 extrae `useMyWods`.
- #165 extrae `useHome` y `useHistory`.

## Objetivo

Añadir pruebas deterministas sobre los hooks reales extraídos para cubrir carga
inicial, estados vacíos, error, recuperación/reintento cuando existe, mutaciones
y condiciones de carrera ya contempladas por cada hook, sin modificar código de
producción.

## Alcance

- `frontend/src/views/my-wods/useMyWods.ts`: carga inicial, selección, guardado
  y borrado (éxito/error/cancelación) y descarte de selección obsoleta.
- `frontend/src/views/home/useHome.ts`: rama anónima (destacados) y autenticada
  (actividad), estados vacío/error, reintento y descarte de respuesta obsoleta.
- `frontend/src/views/history/useHistory.ts`: carga de WODs y resultados de
  ejercicios, estados de error independientes, reintentos, aplicación/limpieza
  de filtros, modo y descarte de respuestas obsoletas al cambiar filtros.
- Mocks exclusivamente en la frontera de API (`wodsApi`, `wodsResultsApi`,
  `exercisesApi`, `exerciseResultsApi`) y de autenticación (`useAuth`).
- Tests con Vitest + Testing Library en entorno `jsdom` por archivo.

## Fuera de alcance

- Cambios en hooks, páginas, vistas, API, esquemas, tipos o CSS.
- Duplicar pruebas de presentación o de interacción de página ya aportadas por
  #159 sin valor añadido para el contrato del hook.
- Introducir features, temporizadores reales, red externa o nuevas
  dependencias.
- Probar comportamientos que los hooks no implementan (abort real, paginación,
  reintentos inexistentes).

## Comportamiento esperado

- Cada hook se prueba directamente con sus valores y acciones reales.
- Una regresión en fetch, error, reintento, mutación o descarte de respuestas
  obsoletas hace fallar los tests.
- Los mocks son deterministas y no dependen del orden entre archivos.

## Decisiones técnicas

- `renderHook` de `@testing-library/react` para observar el contrato del hook.
- Para la mutación de guardado se usa un componente de prueba mínimo que
  envía el formulario real, evitando stubs de eventos.
- `// @vitest-environment jsdom` por archivo, sin alterar la configuración
  global ni los tests que corren en entorno node.
- Promesas diferidas (`deferred`) para controlar el orden de resolución en las
  pruebas de carrera.
- Sin `vi.useFakeTimers`: los hooks no dependen de temporizadores.

## Criterios de aceptación

- [x] Casos de fetch, error y mutación verificados sobre hooks reales.
- [x] Regresiones de estados/contratos detectables con tests deterministas.
- [x] Sin duplicar pruebas de presentación de #159 sin valor añadido.
- [x] `npm run lint`, `npm run test`, `npm run build` y `git diff --check`
      correctos.
- [x] Sin cambios en código de producción.

## Restricciones

- Detenerse para aprobación del usuario antes de commit, push, PR, merge o
  cierre.
