# Spec - Issue #240

## Objetivo

Documentar la comprobación de la rama Git activa antes de trabajar en una Issue.

## Alcance

- Crear `docs/workflow-git-branch-check.md`.
- Incluir el titulo `# Comprobación de rama activa`.
- Explicar el uso de `git branch --show-current` para comprobar la rama activa antes de trabajar en una Issue.
- Incluir una consulta de solo lectura con el comando exacto.

## Fuera de alcance

- Modificar la politica de ramas, scripts, automatizaciones, harness, codigo funcional, dependencias o configuracion.

## Comportamiento esperado

El documento permite identificar la rama local activa y comprobar que corresponde a la Issue antes de iniciar trabajo.

## Criterios de aceptacion

- Existe `docs/workflow-git-branch-check.md` con el titulo requerido.
- El documento incluye `git branch --show-current` y una explicacion de su utilidad.
- El documento muestra una consulta de solo lectura con ese comando.
- La Issue no modifica scripts, codigo funcional, dependencias ni archivos de configuracion.
- `git diff --check` no informa errores.

## Restricciones

- La documentacion se redacta en espanol.
- No se introducen requisitos ni comportamiento fuera de la Issue.
