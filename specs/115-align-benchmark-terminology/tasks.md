# Tareas

## Preparación

- [x] Confirmar el alcance de copy/UX de la Issue #115 y sus referencias #111 y
      #113.
- [x] Confirmar las fuentes de navegación y vista que se renderizan actualmente.
- [x] Crear este SDD único y verificar su trazabilidad.

## Implementación

- [x] Renombrar la entrada activa de `/my-exercise-results` a `Benchmarks` en
      sidebar y dock/navbar sin cambiar la ruta.
- [x] Cambiar el título de la pantalla a `Benchmarks`.
- [x] Cambiar el CTA a `+ Add Score` conservando `/exercise-results/new` y el
      flujo de registro.
- [x] Cambiar el selector a `All Scores` y `Personal Records` sin alterar los
      valores internos ni la lógica de modos.
- [x] Cambiar la etiqueta del buscador a `Buscar ejercicio` y conservar su
      placeholder y comportamiento.
- [x] Mantener `PR`, su nombre accesible `Récord personal` y los cálculos
      existentes.
- [x] Revisar y ajustar el layout responsive local para los textos nuevos.
- [x] Actualizar pruebas de presentación y navegación, incluyendo regresiones
      de ruta, búsqueda, estados y accesibilidad.

## Verificación y handoff

- [x] Revisar que no haya cambios en backend, API, rutas, schemas, entidades,
      consultas, cálculos PR, permisos o persistencia.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Sincronizar este SDD con el estado real y mantener la validación manual
      pendiente.
