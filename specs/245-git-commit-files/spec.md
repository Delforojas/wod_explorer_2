# Especificación: revisar archivos de un commit

## Objetivo

Documentar cómo consultar los archivos incluidos en el commit local actual.

## Alcance

- Crear `docs/git-commit-files.md`.
- Explicar `git show --stat --oneline HEAD`.
- Explicar `git show --name-only --format= HEAD`.
- Incluir un ejemplo de revisión después de `/commit-issue`.

## Fuera de alcance

- Cambios en código de aplicación, configuración o documentos existentes.
- Automatización adicional del workflow Git.

## Comportamiento esperado

La guía presenta ambos comandos como consultas de solo lectura, describe qué
muestra cada uno y aclara su diferencia: el primero resume los archivos y sus
estadísticas; el segundo lista solamente las rutas afectadas. El ejemplo indica
cuándo ejecutar la revisión tras `/commit-issue`.

## Criterios de aceptación

- Existe `docs/git-commit-files.md`.
- Describe correctamente ambos comandos y sus diferencias.
- Incluye un ejemplo sencillo y comprensible.
- No se modifican archivos fuera del alcance, salvo este SDD requerido por el
  workflow.

## Restricciones

- Redactar la documentación en español.
- No añadir dependencias ni modificar código, configuración o documentos ya
  existentes.
