# Plan - Issue #242

## Enfoque

Crear una guía Markdown independiente en `docs/` que explique la consulta local
solicitada, sin cambiar el historial Git ni ningún workflow, script o
configuración.

## Componentes afectados

- `docs/git-last-commit.md`: nueva guía sobre el último commit local.
- `specs/242-documentar-como-consultar-el-ultimo-commit-local/`: trazabilidad
  de la Issue.

## Estrategia de implementación

1. Crear la guía con el título exacto, una explicación de la salida del comando
   y su carácter de solo lectura.
2. Incluir `git log -1 --oneline` en un bloque de código etiquetado como `bash`.
3. Confirmar que el documento cubre cada criterio de aceptación documental.
4. Ejecutar `git diff --check` y revisar el diff para asegurar que los cambios
   se limitan a la documentación y al SDD.

## Verificación

- Leer `docs/git-last-commit.md` para confirmar el título exacto, el bloque
  `bash`, la explicación y la restricción de solo lectura.
- Ejecutar `git diff --check`.
- Revisar el diff de la guía y del SDD.
- Revisar el estado Git para confirmar que no se modificaron archivos
  funcionales, scripts, configuración ni dependencias.
