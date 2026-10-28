# Tasks: Contrato de resultados WOD inmutables

## Orden

1. Alinear dominio, instrucciones y Specs.
2. Retirar el contrato de correccion no soportado.
3. Ajustar tests de API y reglas de servicio.
4. Ejecutar verificaciones y sincronizar el estado real.

## Tareas ejecutables

- [x] Actualizar `DOMAIN.md` para que los resultados solo puedan consultarse y
  eliminarse por su propietario, manteniendo la version exacta y la derivacion de
  historial y mejores marcas.
- [x] Actualizar `backend/AGENTS.md` y `Docker/AGENTS.md` para eliminar la regla
  contradictoria que permite correcciones de resultados.
- [x] Anotar en `specs/005-personal-wod-results/` que la politica de correccion es
  historica y supersedida por Issue #11, y alinear su contrato y plan vigentes.
- [x] Eliminar `WodResultUpdateRequest.java`, que no tiene un endpoint consumidor.
- [x] Retirar del test de servicio las expectativas sobre `update` y añadir
  cobertura de borrado y de mejores marcas derivadas tras la eliminacion.
- [x] Añadir cobertura de ownership para impedir el borrado de resultados ajenos.
- [x] Añadir una prueba HTTP que confirme que `PUT /api/wod-results/{id}` no es
  un endpoint soportado.
- [x] Buscar referencias de correccion en el contrato de resultados y distinguir
  la evidencia historica de las operaciones vigentes.

## Verificaciones requeridas

- [x] `./mvnw -q test` desde `backend/`.
- [x] `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] `./mvnw -q package` desde `backend/`.
- [x] `git diff --check`.
- [x] Confirmar que no se modificaron SQL, Docker Compose, frontend, dependencias,
  secretos ni archivos locales preexistentes ajenos a la Issue.
- [x] Confirmar que todos los criterios de aceptacion de `spec.md` tienen una
  evidencia documental o automatizada.
