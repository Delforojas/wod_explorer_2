# Tareas

## Preparación

- [x] Confirmar el alcance de la Issue #121 y que el cambio está limitado al
      frontend de historial de resultados WOD.
- [x] Confirmar rutas, handlers, estados y campos de `WodResultResponse`.
- [x] Crear este SDD y verificar la trazabilidad Issue → spec → plan → tasks.

## Implementación

- [x] Retirar el botón/tab `Resultados` únicamente de `MyWodResultsView` y
      conservar el CTA/formulario de registro.
- [x] Alinear cabecera, CTA y contexto de la vista con Benchmarks, incluyendo
      `WOD Results`, `SEGUIMIENTO PERSONAL`, el subtítulo aprobado y `+ Add Score`.
- [x] Convertir cards de resultados en filas ligeras con metadata y acciones
      accesibles.
- [x] Conservar la representación completa de FOR_TIME, AMRAP, EMOM y progreso
      incompleto, ocultando solo `wodVersionId` de la UI general.
- [x] Alinear responsive, foco, estados y separación del dock sin cambiar lógica.
- [x] Añadir tests de presentación para contenido, navegación, eliminación y
      loading/vacío/error.

## Verificación y handoff

- [x] Confirmar que no hay cambios en API, backend, DB, ownership, permisos,
      persistencia, histórico ni `DOMAIN.md`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff, crear commit local y dejar la validación manual pendiente.
