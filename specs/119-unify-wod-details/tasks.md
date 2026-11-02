# Tareas

## Preparación

- [x] Confirmar el alcance visual de la Issue #119 y la independencia de #117.
- [x] Confirmar las estructuras públicas/personales, rutas, handlers y campos
      de prescripción existentes.
- [x] Crear este SDD único y verificar la trazabilidad de aceptación a tareas.

## Implementación

- [x] Crear el componente presentacional compartido de detalle con CTA opcional,
      metadata y composición ordenada.
- [x] Convertir los detalles público y personal en wrappers del componente común,
      conservando Volver, rutas y contextos de autorización.
- [x] Rediseñar `wod-detail.css` con filas ligeras, separadores, badges, CTA
      naranja, focus-visible y responsive sin overflow.
- [x] Alinear los wrappers de estados de carga/error/ vacío sin cambiar sus
      mensajes ni lógica.
- [x] Añadir tests de presentación para ambos tipos, rutas, CTA, orden,
      prescripciones simples/compuestas y estados.

## Verificación y handoff

- [x] Confirmar que no hay cambios en API, backend, DB, entidades, ownership,
      permisos, versionado, resultados ni `DOMAIN.md`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Sincronizar este SDD con el estado real y mantener la validación manual
      pendiente.
