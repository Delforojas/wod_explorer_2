# Cobertura y lagunas

## Cobertura añadida

`frontend/src/pages/MyWodsPage.test.tsx` (17 tests, jsdom + Testing Library).

### Carga

- Estado de carga mientras las peticiones iniciales están pendientes.
- Listado con WODs y recuento visible.
- Estado vacío sin WODs personales.
- Error de carga inicial con `role="alert"`.

### Selección

- Apertura del detalle del WOD seleccionado (`getWodById` + composición).
- Error al cargar el detalle.
- Descarte de una respuesta de selección obsoleta que resuelve después de
  una más reciente.
- Vuelta al listado desde el detalle.

### Edición

- Precarga de nombre, modalidad, rondas, tiempo límite, ejercicio y
  repeticiones.
- Cancelación sin llamada a `updateWod`.
- Cambio de modalidad FOR_TIME → AMRAP y campos visibles resultantes.
- Validación previa: nombre vacío muestra error y no llama a `updateWod`.
- Actualización correcta y reflejo en el listado.
- Error de actualización: mensaje y formulario abierto.

### Borrado

- Cancelación de `window.confirm`: no llama a `deleteWod`.
- Confirmación: llama a `deleteWod` y el WOD desaparece del listado.
- Error de borrado: mensaje visible.

## Comportamiento observado

- Ante un error de borrado, `MyWodsView` prioriza el estado de error sobre el
  listado, por lo que la fila no es visible mientras el error está activo.
  El test verifica el error y la llamada a la API, no la persistencia visual
  de la fila.
- Los mocks y helpers son locales al archivo y reutilizables por tests futuros
  de la misma página.

## Lagunas documentadas

- **Autenticación/permisos**: no hay lógica en `MyWodsPage`; `RequireAuth` y
  la configuración de rutas (`App.tsx`) son responsables. No se simulan
  escenarios de sesión a nivel de página.
- **Doble envío concurrente**: existen `createSubmissionGuard` y `deletingId`,
  pero probarlos exigiría controlar el orden exacto de resolución; se omite
  para no acoplar los tests a la implementación.
- **Reintento de carga, confirmación inline de borrado y paginación**: no
  implementados en la página.
- **Detalle tras borrar el WOD seleccionado**: no es alcanzable desde la UI
  porque el detalle sustituye al listado.

## Infraestructura

- Nuevas `devDependencies`: `jsdom`, `@testing-library/react`,
  `@testing-library/dom`. Solo test; no afectan al bundle.
- Entorno DOM declarado por archivo (`// @vitest-environment jsdom`); no se
  modifica la configuración global ni los tests SSR existentes.
