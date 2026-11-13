# Tasks: comprobación básica del agente Git local

## Tareas

- [x] T1. Crear `docs/git-local-smoke-test.md` con el título exacto y
  explicaciones breves de `git status --short` y `git branch --show-current`.
  Dependencias: ninguna.
- [x] T2. Añadir al documento la nota que prohíbe modificar frontend, backend
  y base de datos durante esta prueba. Dependencias: T1.
- [x] T3. Verificar el contenido, revisar que no hay cambios funcionales o de
  configuración atribuibles a la issue y ejecutar `git diff --check`.
  Dependencias: T1, T2.

## Comprobaciones requeridas

- El documento contiene el título y los dos comandos solicitados.
- El documento contiene la restricción sobre frontend, backend y base de
  datos.
- `git diff --check` finaliza con código de salida 0.
