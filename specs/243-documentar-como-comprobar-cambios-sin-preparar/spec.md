# Spec - Issue #243

## Objetivo

Documentar cómo inspeccionar cambios locales sin preparar mediante una guía Git
breve y de solo lectura.

## Alcance

- Crear `docs/git-unstaged-diff.md`.
- Incluir el título exacto `# Consultar cambios sin preparar`.
- Explicar el propósito de `git diff`.
- Distinguir `git diff` de `git diff --cached`.
- Incluir ambos comandos en un bloque de código `bash`.

## Fuera de alcance

- Realizar staging, commits, merges o modificar el comportamiento de Git.
- Modificar código funcional, scripts, configuración o dependencias.

## Comportamiento esperado

La guía permite identificar que `git diff` muestra los cambios locales sin
preparar y que `git diff --cached` muestra los cambios ya preparados para el
próximo commit, sin modificar el repositorio.

## Criterios de aceptación

- Existe `docs/git-unstaged-diff.md`.
- Incluye el título exacto, ambos comandos y una distinción correcta entre
  cambios sin preparar y preparados.
- No se modifica código funcional, scripts, configuración ni dependencias.
- `git diff --check` termina sin errores.

## Restricciones

- La documentación se redacta en español.
- Mantener la validación manual obligatoria antes del merge.
- No se introducen requisitos ni comportamientos fuera de la Issue.
