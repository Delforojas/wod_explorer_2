# Plan

## Enfoque técnico

1. Cambiar `WorkflowController.invoke` para que solamente las fases 8 y 13
   añadan `require_completed=True` a `sdd_manager.inspect`.
2. Conservar la validación existente de `WorkflowController.advance` para las
   fases 7 y 8: exige evidencia de verificación oficial y todas las tareas del
   SDD completadas antes de avanzar.
3. Añadir una prueba de integración del controlador que reproduzca una fase 7
   con tareas de implementación completadas y una tarea `[phase:7]` pendiente:
   la inspección debe pasar, pero el avance debe bloquearse hasta completar la
   tarea.
4. Ejecutar la suite del harness para comprobar las regresiones de controlador,
   gestor SDD, política Git y runner de verificación.

## Componentes afectados

- `scripts/harness/workflow_controller.py`
- `scripts/harness/tests/test_workflow_controller.py`
- `specs/196-permitir-tareas-verificacion-pendientes/`

## Verificación

- Ejecutar las pruebas unitarias del harness.
- Confirmar el caso de fase 7 pendiente y el bloqueo de avance con pruebas de
  regresión automatizadas.
- Ejecutar `git diff --check` para detectar errores de formato de parche.
