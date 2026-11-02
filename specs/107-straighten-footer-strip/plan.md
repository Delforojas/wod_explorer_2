# Plan técnico

## Enfoque

Mantener el componente `Footer` y su markup sin cambios. La causa raíz está en
`frontend/src/styles/footer.css`, donde `.delfo-footer__marquee` aplica
`transform: rotate(-1deg)`. Se eliminará únicamente esa transformación para que
la superficie, los bordes y los separadores permanezcan horizontales. La
animación seguirá perteneciendo al track interno y no se modificará.

## Componentes afectados

- `frontend/src/styles/footer.css`: retirar la rotación del strip social.
- `frontend/src/styles/footer.test.tsx`: regresión del markup y comprobación de
  los destinos de enlaces renderizados.
- `specs/107-straighten-footer-strip/`: trazabilidad de requisitos, plan y
  tareas.

## Estrategia de implementación

1. Confirmar que la inclinación procede de `transform: rotate(-1deg)` y que no
   hay otra transformación aplicada directamente al strip.
2. Eliminar esa declaración sin cambiar posición, dimensiones, overflow,
   colores, contenido ni animaciones.
3. Añadir una prueba compatible con Vitest y el entorno Node actual para
   proteger el markup y los destinos del contenido social; validar la ausencia
   de inclinación mediante revisión CSS y comprobación visual.
4. Sincronizar `tasks.md` tras implementar y verificar.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión de alcance y ausencia de cambios fuera del footer/spec.
- Validación manual pendiente: captura comparativa en desktop, tablet y móvil,
  comprobando horizontalidad, extremos, overflow, enlaces y reduced motion.
