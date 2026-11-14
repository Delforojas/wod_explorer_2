# Plan - Issue #241

## Enfoque

Crear una guia Markdown independiente en `docs/` para documentar la comprobacion local solicitada sin cambiar workflows, scripts ni configuracion.

## Componentes afectados

- `docs/workflow-git-working-tree-check.md`: nueva guia sobre cambios pendientes en el arbol de trabajo.
- `specs/241-documentar-comprobacion-de-cambios-pendientes-antes-del-commit/`: trazabilidad de la Issue.

## Estrategia de implementacion

1. Crear la guia con el titulo exacto, una explicacion breve, el comando de solo lectura y la advertencia requerida.
2. Confirmar que el documento contiene los elementos que cubren todos los criterios de aceptacion documentales.
3. Ejecutar `git diff --check` para validar el formato de los cambios.
4. Revisar el diff para confirmar que los cambios se limitan al documento y al SDD de la Issue.

## Verificacion

- Leer el documento nuevo para confirmar el titulo, el comando exacto, su finalidad y las restricciones de solo lectura.
- Ejecutar `git diff --check`.
- Revisar `git diff -- docs/workflow-git-working-tree-check.md specs/241-documentar-comprobacion-de-cambios-pendientes-antes-del-commit`.
- Revisar `git status --short` para identificar cambios preexistentes y confirmar que no se modificaron archivos funcionales, scripts, dependencias ni configuracion.
