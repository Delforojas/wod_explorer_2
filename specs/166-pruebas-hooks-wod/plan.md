# Plan técnico

## Enfoque

Probar cada hook extraído directamente contra sus contratos públicos, mockeando
solo las fronteras externas (API y auth), sin tocar producción.

## Archivos

- `frontend/src/views/my-wods/useMyWods.test.tsx`
- `frontend/src/views/home/useHome.test.ts`
- `frontend/src/views/history/useHistory.test.ts`

## Estrategia por hook

### useMyWods

- Carga inicial: éxito con datos, vacío y error; `loading` pasa a `false`.
- Selección: éxito, error y respuesta obsoleta (la última petición gana).
- Guardado: éxito actualiza la lista y cierra edición; error conserva edición y
  muestra mensaje.
- Borrado: cancelación sin llamada API, éxito que elimina de la lista y error
  con mensaje.

### useHome

- Anónimo: destacados con datos, vacío y error; no llama a la API de actividad.
- Autenticado: actividad limitada a recientes, vacío y error; no llama a la API
  de WODs destacados.
- Reintento de actividad/destacados y descarte de la respuesta anterior cuando
  llega después del reintento.

### useHistory

- Carga inicial: éxito combinado y ordenado, error total y error parcial
  independiente por recurso.
- Reintentos de WODs y ejercicios: recuperación tras fallo y fallo al reintentar.
- Filtros: aplicación traduce fechas a `from`/`to` de API, reinicia carga y
  cierra el panel; limpieza restaura valores y vuelve a consultar.
- Modo: cambia el filtrado sin peticiones adicionales.
- Carrera: al cambiar filtros, la respuesta del filtro anterior se descarta.

## Fixtures

Constructores mínimos y tipados para `WodAggregateResponse`,
`WodResultResponse`, `ExerciseResultResponse` y `ExerciseResponse`, reutilizando
los contratos de `src/schemas/`.

## Verificación

- `cd frontend && npm run test`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`
- `git diff --check`
- Revisión del diff para confirmar que solo se añaden archivos de test.
