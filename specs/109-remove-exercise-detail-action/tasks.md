# Tareas

## Preparación

- [x] Confirmar Issue #109, alcance, restricciones y dependencia funcional de
      #92.
- [x] Crear el SDD único y validar su trazabilidad.

## Implementación

- [x] Retirar la acción «Ver detalle» del listado para visitantes y usuarios
      autenticados.
- [x] Simplificar `ExercisesPage`, `ExercisesView` y sus tipos eliminando el
      estado, handler y petición exclusivos del detalle.
- [x] Eliminar `ExerciseDetail` y las referencias frontend, mensajes y estilos
      que queden sin consumidores, sin tocar el backend.
- [x] Preservar el enlace autenticado de registro con el `exerciseId` correcto.
- [x] Añadir pruebas observables para ambos estados de autenticación.

## Verificación y handoff

- [x] Revisar que no queden referencias de detalle huérfanas en el catálogo.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Preparar la validación manual específica para visitante/autenticado en
      móvil/escritorio; mantenerla pendiente de aprobación del usuario.
