# Tareas

## Preparación

- [x] Confirmar requisitos de la Issue #123 y su independencia de #121, #117 y
      #119.
- [x] Confirmar el patrón visual de Benchmarks, Mis WODs y `resources.css`.
- [x] Verificar la fuente centralizada de autenticación y las rutas actuales.
- [x] Crear este SDD y comprobar la base `origin/main`.

## Implementación

- [x] Convertir el listado de ejercicios a filas ligeras reutilizando patrones
      compartidos.
- [x] Convertir el listado de WODs a filas ligeras manteniendo `Ver WOD` público y
      registro autenticado.
- [x] Alinear ambos buscadores, contadores, estados, foco y responsive.
- [x] Añadir o actualizar pruebas de presentación de filtros, contenido,
      navegación y visibilidad guest/auth.

## Verificación y handoff

- [ ] Revisar que no existan cambios en backend, API, dominio, ownership,
      persistencia o formularios.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [ ] Revisar diff final y crear commit local sin push.
- [ ] Dejar validación visual manual pendiente si no hay navegador disponible.
