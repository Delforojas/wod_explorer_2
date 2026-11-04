# SDD: Unificar propietario de estilos compartidos `.ui-*`

## Objetivo

Establecer un único propietario responsable para los estilos genéricos compartidos
de estado de interfaz (`.ui-error`, `.ui-empty`, `.ui-success` y `.ui-loading`)
detectados en la auditoría #157 (hallazgo F3) y consolidar las declaraciones
dispersas entre hojas CSS, preservando los valores calculados y los contextos de
uso.

## Alcance

- Inventario de reglas, orden de importación, usos reales y consumidores de los
  selectores `.ui-*` en `frontend/src/styles` y `frontend/src`.
- Definición del propietario único: `frontend/src/styles/surfaces.css`.
- Consolidación de los estilos de estado compartidos en ese propietario.
- Preservación de overrides contextuales acotados (por ejemplo, en
  `history.css`).

## Fuera de alcance

- Duplicación de campos de resultado AMRAP/EMOM/For Time entre
  `preferences.css`, `forms.css` y hojas por tipo (roadmap #5 de la auditoría).
- Cambios visuales, tokens, breakpoints, movimiento, foco o accesibilidad.
- Modificación de componentes, contratos, auth, rutas, persistencia o workflow.

## Comportamiento esperado

- Los estados compartidos se declaran una sola vez, en la hoja responsable.
- Los valores calculados de error, éxito, vacío y carga permanecen equivalentes.
- Los consumidores TSX mantienen las mismas clases y no requieren cambios.

## Criterios de aceptación

- [ ] Existe una ubicación responsable documentada para estilos `.ui-*` compartidos.
- [ ] Sin selectores genéricos redefinidos accidentalmente en varias hojas.
- [ ] Comparación visual de estados error/success/empty y formularios en desktop/móvil.
- [ ] Lint, tests, build y `git diff --check` pasan.

## Restricciones

- No introducir framework CSS nuevo ni tokens nuevos.
- No rediseñar ni ampliar el alcance.
- No tocar contratos Zod/#155, auth, rutas, persistencia ni documentación de proceso.
