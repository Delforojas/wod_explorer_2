# Issue #247: Documentar archivos sin seguimiento en Git

## Objetivo

Documentar cómo identificar archivos nuevos sin seguimiento para evitar incluir
archivos temporales en los commits.

## Alcance

- Crear `docs/git-untracked-files.md`.
- Explicar el comando `git status --short --untracked-files=all`.
- Explicar que el prefijo `??` identifica archivos sin seguimiento.
- Incluir `.workflow/issues/NNN.json` como ejemplo de estado temporal que no
  debe incluirse en commits de issues.
- Advertir contra el uso indiscriminado de `git add .`.

## Fuera de alcance

- Modificar código de aplicación, configuración, pruebas u otros documentos.
- Preparar archivos, crear commits, hacer push o modificar la Issue remota.
- Cambiar el comportamiento de los workflows existentes.

## Comportamiento esperado

La guía debe mostrar el comando de Git, describir que `--untracked-files=all`
incluye todos los archivos sin seguimiento y aclarar que `??` los identifica en
la salida corta. Debe usar `.workflow/issues/NNN.json` como ejemplo de archivo
temporal que debe revisarse y excluirse de los commits de issues. También debe
recomendar seleccionar rutas concretas en lugar de ejecutar `git add .`.

## Criterios de aceptación

- Existe `docs/git-untracked-files.md`.
- Explica `git status --short --untracked-files=all` y `??` con un ejemplo
  breve.
- Advierte de no usar `git add .` para incluir archivos indiscriminadamente.
- No hay cambios fuera del alcance, salvo los documentos SDD requeridos.

## Restricciones

- Redactar la documentación en español y mantener el estilo conciso de las
  guías Git existentes en `docs/`.
- No añadir dependencias, requisitos funcionales ni decisiones arquitectónicas.
- El JSON local de preparación `.workflow/issues/247.json` es evidencia del
  workflow y no forma parte de la implementación de la Issue.
