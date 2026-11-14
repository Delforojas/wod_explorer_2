# Spec - Issue #244

## Objetivo

Documentar una comprobación breve para determinar si la referencia local de
`main` coincide con la referencia remota local `origin/main`.

## Alcance

- Crear `docs/git-main-sync-check.md`.
- Incluir el título exacto `# Comprobar sincronización de main`.
- Explicar qué muestran `git rev-parse main` y `git rev-parse origin/main`.
- Indicar que la comparación consulta referencias locales.
- Explicar que `git fetch origin main` actualiza la información de la rama
  remota sin integrar commits en la rama actual.
- Incluir un ejemplo de consulta en un bloque de código `bash`.

## Fuera de alcance

- Ejecutar `git push`, modificar ramas o cambiar políticas de merge y cierre.
- Modificar código funcional, scripts, configuración o dependencias.

## Comportamiento esperado

La guía permite comparar los hashes de las referencias locales `main` y
`origin/main`: coinciden cuando ambas referencias apuntan al mismo commit. La
guía aclara que `origin/main` puede requerir una actualización con `git fetch
origin main` antes de realizar una comprobación actualizada y que dicha consulta
no integra commits en la rama actual.

## Criterios de aceptación

- Existe `docs/git-main-sync-check.md` con el título exigido.
- Incluye ambos comandos `git rev-parse` y explica cuándo sus hashes deben
  coincidir.
- Distingue la referencia remota local de una comprobación tras `git fetch`.
- No modifica código funcional, scripts, configuración ni dependencias.
- `git diff --check` termina sin errores.

## Restricciones

- La documentación se redacta en español.
- Mantener la comprobación como guía informativa; no ejecutar operaciones de
  publicación ni integración.
- No se introducen requisitos ni comportamientos fuera de la Issue.
