# Especificación

## Objetivo

Eliminar la contradicción que impide inspeccionar un SDD válido al iniciar la
fase 7 cuando todavía tiene tareas de verificación explícitamente anotadas con
`[phase:7]`.

## Alcance

- Ajustar la precondición de `sdd_manager.inspect` en el controlador del
  workflow para la fase 7.
- Mantener las condiciones de cierre de las fases 7, 8 y 13 que requieren que
  todas las tareas estén completadas cuando corresponda.
- Añadir pruebas de regresión del controlador y, si es necesario, del gestor
  de SDD.
- Mantener intactos el código de producto y el SDD de la Issue #195.

## Comportamiento esperado

Al entrar en la fase 7, el controlador debe validar estructuralmente el SDD sin
forzar `require_completed`, permitiendo que una tarea válida `[phase:7]` siga
pendiente mientras se ejecutan y revisan los checks oficiales. No debe inferir
ni completar tareas automáticamente.

Antes de avanzar desde las fases 7 u 8, el controlador debe seguir exigiendo
evidencia oficial de verificación válida, `implementation_tasks_completed:
true`, `tasks_completed: true` y todas las tareas del SDD completadas. La fase
13 conserva su requisito de inspección con tareas completadas.

## Criterios de aceptación

- [ ] La inspección de SDD en fase 7 acepta una tarea válida `[phase:7]`
  pendiente cuando las tareas de implementación están completadas.
- [ ] Una tarea `[phase:7]` pendiente sigue bloqueando el avance desde fase 7.
- [ ] Tras completar la tarea de verificación y registrar evidencia válida, el
  avance de fase 7 permanece permitido.
- [ ] Las anotaciones de tareas inválidas continúan bloqueando la validación.
- [ ] Las fases 8 y 13 mantienen las condiciones que requieren tareas
  completadas.
- [ ] La corrección no modifica el código de producto ni el SDD de #195.

## Restricciones

- No desactivar guardrails ni relajar las comprobaciones de cierre de fase.
- No añadir dependencias ni cambiar la arquitectura del harness.
- Mantener el cambio acotado a la contradicción de fase 7 y sus pruebas.
