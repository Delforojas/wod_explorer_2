# Spec - Issue #242

## Objetivo

Documentar cómo consultar de forma local el último commit mediante una guía Git
breve y de solo lectura.

## Alcance

- Crear `docs/git-last-commit.md`.
- Incluir el título exacto `# Consultar el último commit`.
- Explicar qué muestra `git log -1 --oneline`.
- Identificar la consulta como una operación de solo lectura.
- Incluir el comando en un bloque de código `bash`.

## Fuera de alcance

- Modificar el historial de Git, crear commits o cambiar el workflow.
- Modificar código funcional, scripts, configuración o dependencias.

## Comportamiento esperado

La guía permite consultar de forma concisa el último commit local y entender que
la operación no altera el repositorio.

## Criterios de aceptación

- Existe `docs/git-last-commit.md` con el título indicado.
- El documento explica `git log -1 --oneline` e incluye el comando en un bloque
  `bash`.
- El documento identifica la consulta como una operación de solo lectura.
- No se modifican código funcional, scripts, configuración ni dependencias.
- `git diff --check` termina sin errores.

## Restricciones

- La documentación se redacta en español.
- No se introducen requisitos ni comportamientos fuera de la Issue.
