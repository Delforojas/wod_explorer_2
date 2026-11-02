# Tareas

## Preparación

- [x] Confirmar la Issue #94, sus dependencias y el alcance fuera del CRUD de
      la API.
- [x] Registrar `standard-main` y crear la rama dedicada desde `origin/main`.
- [x] Crear el SDD único de la Issue #94.

## Validación y prescripciones

- [x] Completar el soporte frontend de `DISTANCE_TIME` sin cambiar el
      contrato REST.
- [x] Crear la validación pura de modalidades, mediciones y valores numéricos.
- [x] Integrarla en creación y edición con errores asociados a la prescripción.
- [x] Cubrir todos los campos requeridos de `DISTANCE_TIME` en UI,
      serialización y presentación.

## Concurrencia y submits

- [x] Bloquear creación duplicada mientras la solicitud está en curso.
- [x] Bloquear actualización duplicada mientras la solicitud está en curso.
- [x] Proteger las selecciones de ejercicios y WODs contra respuestas fuera de
      orden.
- [x] Proteger las cargas iniciales contra actualizaciones después del
      desmontaje.

## Pruebas y cierre local

- [x] Añadir pruebas de cada modalidad y combinaciones inválidas.
- [x] Añadir pruebas de doble submit y carreras asíncronas.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check` y revisar que el diff quede limitado a la
      Issue #94 y su SDD.
- [x] Actualizar este SDD con el resultado real de la implementación.
