# Tareas

## Preparación

- [x] Confirmar contratos y flujos reales de `useMyWods`, `useHome` y `useHistory`.
- [x] Definir fixtures tipados y utilidades de promesas diferidas.

## Tests de useMyWods

- [x] Cubrir carga inicial: éxito, vacío y error.
- [x] Cubrir selección: éxito, error y respuesta obsoleta.
- [x] Cubrir guardado: éxito y error.
- [x] Cubrir borrado: cancelación, éxito y error.

## Tests de useHome

- [x] Cubrir rama anónima: destacados con datos, vacío y error.
- [x] Cubrir rama autenticada: actividad reciente, vacío y error.
- [x] Cubrir reintento y descarte de respuesta obsoleta.

## Tests de useHistory

- [x] Cubrir carga inicial: éxito, error total y error parcial.
- [x] Cubrir reintentos de WODs y ejercicios.
- [x] Cubrir aplicación/limpieza de filtros y cambio de modo.
- [x] Cubrir descarte de respuesta obsoleta al cambiar filtros.

## Verificación

- [x] Ejecutar `npm run test`, `npm run lint`, `npm run build` y `git diff --check`.
- [x] Confirmar que no hay cambios en código de producción.

## Commit y handoff

- [ ] Preparar commit local con aprobación del usuario.
