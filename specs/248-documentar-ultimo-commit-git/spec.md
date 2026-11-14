# Spec - Issue #248

## Objetivo

Ampliar la guía para consultar el último commit del repositorio con los dos
comandos solicitados y ejemplos que permitan interpretar su salida.

## Alcance

- Actualizar `docs/git-last-commit.md`.
- Documentar `git log -1 --oneline` para identificar el último commit.
- Documentar `git show --stat --oneline HEAD` para consultar el resumen y los
  archivos modificados del último commit.
- Incluir un ejemplo ilustrativo de salida y una explicación del resultado para
  cada comando.

## Fuera de alcance

- Modificar código de aplicación, scripts, configuración o dependencias.
- Modificar el historial de Git, crear commits o cambiar workflows.
- Incluir `.workflow/issues/*.json` en los cambios de la Issue.

## Comportamiento esperado

La guía permite a una persona ejecutar una consulta breve para identificar el
último commit y otra para comprender qué archivos modificó y su resumen, sin
alterar el repositorio.

## Criterios de aceptación

- Existe `docs/git-last-commit.md`.
- Los comandos `git log -1 --oneline` y `git show --stat --oneline HEAD` están
  documentados correctamente.
- Cada comando incluye un ejemplo de salida ilustrativo y una explicación de
  los datos mostrados.
- No se modifica código de aplicación.
- No se incluyen archivos `.workflow/issues/*.json` en los cambios de la
  Issue.

## Restricciones

- La documentación se redacta en español.
- Se extiende el documento existente de la Issue #242; no se crea una guía
  duplicada.
- No se introducen requisitos ni comportamientos fuera de la Issue.
