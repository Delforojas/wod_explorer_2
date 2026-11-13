# Plan - Issue #240

## Enfoque

Crear un documento Markdown independiente en `docs/` para no alterar workflows ni configuracion existente. El contenido se limita a la comprobacion local solicitada.

## Componentes afectados

- `docs/workflow-git-branch-check.md`: nueva guia de comprobacion de rama activa.
- `specs/240-documentar-verificacion-de-rama-activa-para-el-workflow-git/`: trazabilidad de la Issue.

## Estrategia de implementacion

1. Crear la guia con el titulo exacto, una explicacion breve y el comando de solo lectura.
2. Comprobar que el documento contiene los elementos exigidos.
3. Ejecutar `git diff --check` para validar el formato del cambio.

## Verificacion

- Buscar el titulo y el comando exacto en el documento nuevo.
- Ejecutar `git diff --check`.
- Revisar el diff para confirmar que solo se agregan el documento y el SDD de la Issue.
