# Spec - Issue #241

## Objetivo

Documentar la comprobacion de cambios pendientes en el arbol de trabajo antes de seleccionar archivos para un commit.

## Alcance

- Crear `docs/workflow-git-working-tree-check.md`.
- Incluir el titulo `# Comprobación de cambios pendientes`.
- Explicar brevemente que muestra `git status --short`.
- Incluir el comando exacto y advertir que su salida debe revisarse antes de seleccionar archivos para un commit.
- Aclarar que la consulta es de solo lectura y no autoriza ejecutar `git add` ni `git commit` automaticamente.

## Fuera de alcance

- Modificar comandos de Git, scripts Python, MCP, comportamiento de la aplicacion, dependencias o configuracion.

## Comportamiento esperado

El documento permite identificar de forma concisa los cambios pendientes locales y recordar su revision antes de seleccionar archivos para un commit, sin efectuar operaciones de escritura en Git.

## Criterios de aceptacion

- Existe `docs/workflow-git-working-tree-check.md` con el titulo requerido.
- El documento incluye `git status --short` y explica su finalidad.
- El documento indica que la salida se revisa antes de seleccionar archivos para un commit.
- El documento identifica la consulta como de solo lectura y no autoriza `git add` ni `git commit` automaticamente.
- No se modifican codigo funcional, scripts, dependencias ni configuracion.
- `git diff --check` no informa errores.

## Restricciones

- La documentacion se redacta en espanol.
- No se introducen requisitos ni comportamientos fuera de la Issue.
