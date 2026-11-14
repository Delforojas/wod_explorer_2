# Plan - Issue #243

## Enfoque

Crear una guía Markdown independiente en `docs/` que diferencie las consultas
locales de cambios sin preparar y preparados, sin alterar el estado del
repositorio ni modificar código, scripts o configuración.

## Componentes afectados

- `docs/git-unstaged-diff.md`: nueva guía sobre inspección de diffs locales.
- `specs/243-documentar-como-comprobar-cambios-sin-preparar/`: trazabilidad de
  la Issue.

## Estrategia de implementación

1. Crear la guía con el título exacto y una explicación de que `git diff`
   muestra los cambios sin preparar.
2. Incluir `git diff` y `git diff --cached` en un bloque de código etiquetado
   como `bash`, aclarando que el segundo consulta los cambios preparados.
3. Indicar que ambas consultas son de solo lectura y que la revisión manual
   sigue siendo necesaria antes de un merge.
4. Confirmar que la documentación cubre cada criterio de aceptación sin tocar
   archivos funcionales, scripts, configuración o dependencias.

## Verificación

- Leer `docs/git-unstaged-diff.md` para confirmar el título exacto, ambos
  comandos, el bloque `bash` y la distinción entre los dos estados de cambios.
- Ejecutar `git diff --check`.
- Revisar el diff y el estado Git para confirmar que los cambios se limitan a
  la guía y al SDD.
