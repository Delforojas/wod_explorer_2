# Integrar Pulsar Grid ambiental en main

## Objetivo

Integrar un único fondo Pulsar Grid ambiental detrás del contenido global de `main`, inspirado en la referencia 21st y adaptado al sistema dark/primary existente de WOD Explorer.

## Alcance

- Añadir un componente de canvas decorativo en `components/layout` e integrarlo una sola vez en `AppLayout`.
- Usar el primary y los fondos actuales sin introducir cyan, tokens visuales nuevos ni dependencias.
- Mantener surfaces, navegación, contenido, rutas y comportamiento funcional existentes.
- Soportar puntero desktop, redimensionamiento del contenedor, HiDPI, mobile, reduced motion y visibilidad de página.

## Comportamiento esperado

- El canvas queda detrás de los hijos de `main`, cubre su viewport visual sin modificar altura, scroll ni ancho del documento y no se extiende al sidebar.
- En desktop, una onda sutil responde a la posición del puntero sin renders React por movimiento ni reinicios del loop.
- En touch o movimiento reducido, el grid queda estático y el canvas sigue siendo decorativo.
- El canvas no recibe eventos, no entra en el orden de tabulación y no interfiere con foco, clicks, scroll ni lectura.

## Restricciones

- No modificar páginas, formularios, navegación, backend, dominio, contratos API ni dependencias.
- No instalar Tailwind, shadcn, framer-motion, librerías de canvas o UI.
- No crear un canvas por página ni aplicar el efecto al sidebar.

## Criterios de aceptación

- [ ] Un único Pulsar Grid global se muestra detrás de `main`, separado del sidebar.
- [ ] El grid usa los tokens de background y primary vigentes; no introduce cyan.
- [ ] Las surfaces y controles siguen siendo legibles y funcionales.
- [ ] El canvas usa `pointer-events: none` y `aria-hidden`.
- [ ] La posición del puntero usa refs, no React state; hay un único RAF que se limpia al desmontar.
- [ ] Los puntos se regeneran solo por resize relevante y no por `mousemove`.
- [ ] El tamaño del canvas sigue al contenedor, limita DPR y no produce overflow ni scroll adicional.
- [ ] Mobile y reduced motion usan una representación estática; la pestaña oculta no consume el loop.
- [ ] No se cambian rutas, navegación, comportamiento funcional, backend, dominio ni dependencias.
- [ ] `21st-ui-review`, lint, tests, build y `git diff --check` pasan.
