# Plan: Auditoria y refactorizacion de arquitectura CSS

## Base tecnica

Trabajar sobre `main` en `c8d84a14` mediante una rama dedicada. El checkpoint
`checkpoint/070-before-css-refactor` preserva el estado previo. El refactor
mantiene CSS nativo, el entrypoint global y las clases existentes.

## P0: auditoria y baseline

1. Usar el inventario reproducible de la Issue para registrar archivos, lineas
   y ocurrencias de `@media`.
2. Revisar `index.css`, `tokens.css`, `base.css`, `styles/README.md` y los
   consumidores React reales.
3. Confirmar que PR #88 ya traslado los componentes publicos y que no requiere
   mover hojas CSS.
4. Clasificar valores repetidos, reglas compartidas, media queries y reglas
   potencialmente obsoletas.
5. Separar candidatos seguros de diferencias intencionadas.

## P1: consolidacion segura

1. Añadir solo tokens para valores con el mismo significado visual y uso
   repetido comprobado.
2. Sustituir los usos equivalentes sin cambiar valores computados.
3. Retirar reglas exactamente redundantes cuando una regla de menor
   especificidad ya produce el mismo resultado.
4. No mover reglas locales ni media queries sin prueba de equivalencia.

## P2: integridad y consumidores

1. Verificar que cada import de `index.css` existe y aparece una sola vez.
2. Revisar que las rutas actuales de `ExerciseFilter`, `wodFilter`, resultados,
   historial y Create WOD siguen siendo las reales.
3. Confirmar que las clases afectadas conservan consumidores React y estados
   condicionales.
4. Actualizar el README de estilos solo si la implementacion cambia las
   responsabilidades documentadas.

## P3: validacion

1. Recalcular el inventario final con el mismo alcance y procedimiento.
2. Ejecutar lint, tests, build y `git diff --check`.
3. Revisar el diff para asegurar que solo contiene CSS, SDD y referencias
   directamente relacionadas.
4. Preparar validacion manual de rutas, viewport, foco, teclado y estados.

## Cambios previstos

- `frontend/src/styles/tokens.css`: tokens para roles repetidos demostrables.
- `frontend/src/styles/surfaces.css`: eliminacion de una regla glass redundante
  si la comprobacion de cascada confirma equivalencia.
- Hojas CSS que consuman esos tokens, sin alterar valores efectivos.
- `specs/070-css-architecture/`: trazabilidad y resultados del workflow.

## Limitaciones

No hay navegador o capturas automatizadas disponibles en este entorno. La
equivalencia visual, overflow y navegacion real por teclado se mantendran como
validacion manual pendiente.
