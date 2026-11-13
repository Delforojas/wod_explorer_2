# Plan: comprobación básica del agente Git local

## Enfoque técnico

Crear un único documento Markdown en `docs/` porque la carpeta ya existe. El
documento contendrá el título requerido, una explicación breve y práctica de
cada comando Git solicitado y una nota explícita que limite la prueba a
documentación.

No se modificarán componentes de frontend, backend, Docker, configuración,
scripts ni dependencias.

## Componentes afectados

- `docs/git-local-smoke-test.md`: nuevo documento de prueba.
- `specs/239-docs-adicionar-comprobacion-basica-del-agente-git-local/`:
  trazabilidad y estado de las tareas de esta issue.

## Estrategia de implementación

1. Crear el documento con el título exacto y una sección para cada comando.
2. Añadir la nota de no modificación de frontend, backend ni base de datos.
3. Comprobar que el diff no contiene errores de espacios con `git diff --check`.
4. Revisar el estado y el diff para confirmar que no se introdujeron cambios
   funcionales o de configuración por esta issue.

## Verificación

- Inspección de `docs/git-local-smoke-test.md` frente a los criterios de
  aceptación.
- `git diff --check` para validar el formato del diff.
- `git status --short` y revisión del diff para delimitar los cambios propios
  de la issue de los cambios preexistentes.
