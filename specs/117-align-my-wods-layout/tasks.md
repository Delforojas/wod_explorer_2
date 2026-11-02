# Tareas

## Preparación

- [x] Confirmar el alcance de layout de la Issue #117 y la referencia visual de
      `Benchmarks` sin ampliar el comportamiento.
- [x] Confirmar las fuentes activas de `Mis WODs`, estados y handlers de CRUD.
- [x] Crear este SDD único y verificar la trazabilidad de aceptación a tareas.

## Implementación

- [x] Reorganizar `MyWodsList` en una composición ligera con cabecera, CTA,
      contador, metadatos de WOD y acciones compactas.
- [x] Mantener los destinos y handlers de Crear WOD, Resultados, Ver WOD,
      Editar y Eliminar sin modificar la lógica de página.
- [x] Asegurar una confirmación nativa antes de eliminar, manteniendo el mismo
      handler, endpoint y protecciones de ownership.
- [x] Ajustar `my-wods.css` para superficies, separadores, jerarquía naranja,
      focus-visible, wrapping y responsive móvil/tablet/desktop.
- [x] Añadir o actualizar pruebas de presentación para contenido, navegación,
      acciones, metadata y estados de carga, vacío y error.
- [x] Verificar visualmente en el código que carga, error y acciones no quedan
      fuera del dock ni pierden semántica.

## Verificación y handoff

- [x] Confirmar que no hay cambios en backend, API, rutas, schemas, entidades,
      ownership, permisos, resultados, persistencia ni `DOMAIN.md`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Sincronizar este SDD con el estado real y mantener la validación manual
      pendiente.
