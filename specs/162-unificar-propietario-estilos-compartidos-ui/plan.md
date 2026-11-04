# Plan técnico

## Enfoque

Consolidar el propietario único de los estilos genéricos compartidos `.ui-*`
basado en el hallazgo F3 de la auditoría #157 y la recomendación 4 del roadmap
incremental.

## Estrategia

1. Definir el propietario único: `frontend/src/styles/surfaces.css` es la hoja
   responsable de los estilos compartidos de estados `.ui-error`, `.ui-empty`,
   `.ui-success` y `.ui-loading`.
2. Consolidar las declaraciones en `surfaces.css`: panel de estados
   (`.ui-error`, `.ui-empty`, `.ui-success`) y reset/panel de `.ui-loading`.
3. Eliminar los grupos genéricos `.ui-*` de `frontend/src/styles/forms.css`.
4. Documentar la ubicación responsable en `frontend/src/styles/README.md`.
5. Verificar consumidores y overrides contextuales antes/después.

## Verificación

- Desde `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
- `git diff --check`.
- Revisión del diff para confirmar que solo se movieron declaraciones entre
  hojas sin cambios de valor.
