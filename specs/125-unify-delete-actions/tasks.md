# Tareas

## Preparación

- [x] Confirmar requisitos de la Issue #125 y su independencia de #123.
- [x] Confirmar las reglas de ownership y PR en `DOMAIN.md` y la spec #113.
- [x] Confirmar el endpoint existente y los estados actuales de borrado.
- [x] Crear este SDD sobre la base verificada de `origin/main`.

## Implementación

- [x] Crear el control compartido de borrado solo-icono con estados accesibles.
- [x] Aplicar el control a Mis WODs conservando confirmación, permisos y
      actualización tras éxito.
- [x] Añadir borrado de resultados de ejercicio en Benchmarks usando el cliente
      existente y confirmación previa.
- [x] Refrescar historial y Personal Records tras éxito sin perder modo ni
      búsqueda, y comunicar errores sin retirar datos prematuramente.
- [x] Cubrir All Scores, Personal Records y búsqueda activa con el mismo
      control y layout responsive.
- [x] Añadir o actualizar pruebas de presentación, confirmación/cancelación,
      éxito/error, loading, PR y prevención de duplicados.

## Verificación y handoff

- [x] Revisar que no existan cambios en backend, API, dominio, ownership,
      persistencia ni cálculos de PR.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff final y crear commit local sin push.
- [x] Preparar checklist de validación manual sin marcarla como aprobada.
