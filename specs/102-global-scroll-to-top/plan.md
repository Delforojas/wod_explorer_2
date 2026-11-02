# Plan técnico

## Enfoque

Extraer el patrón local de #83 a un componente compartido montado una sola vez
en `AppLayout`. El componente escuchará el scroll de la ventana con una única
suscripción pasiva, limpiará el listener al desmontarse y observará la clave de
ubicación de React Router para volver a evaluar la visibilidad cuando cambie la
ruta. No modificará la posición de scroll automáticamente durante la
navegación.

Las decisiones deterministas de umbral y `ScrollBehavior` se moverán a
`src/utils/scrollToTop.ts`, junto con sus pruebas, para eliminar la dependencia
del componente global respecto de la feature de WODs. `WodsList` conservará
solo su listado y filtros.

## Componentes y archivos afectados

- `frontend/src/components/layout/ScrollToTopButton.tsx`: componente global,
  listener, visibilidad, activación y restauración de foco.
- `frontend/src/components/layout/AppLayout.tsx`: montaje único del control.
- `frontend/src/utils/scrollToTop.ts`: umbral y funciones puras compartidas.
- `frontend/src/utils/scrollToTop.test.ts`: pruebas de umbral y reduced motion.
- `frontend/src/components/wodFilter/WodsList.tsx`: eliminar estado, listener,
  handler y botón duplicado.
- `frontend/src/styles/scroll-to-top.css`: estilos compartidos, estados,
  responsive, dock móvil, safe area y reduced motion.
- `frontend/src/styles/wod.css`: retirar estilos exclusivos del botón de WODs.
- `frontend/src/index.css`: importar los estilos compartidos.
- `frontend/src/views/wods/wodScroll.ts` y su test: retirar el módulo específico
  una vez que no tenga consumidores.
- `specs/102-global-scroll-to-top/`: trazabilidad de la Issue.

## Estrategia de implementación

1. Crear las funciones puras compartidas manteniendo el umbral de `400px` y la
   traducción `smooth`/`auto` existente.
2. Crear `ScrollToTopButton` con `useLocation`, estado inicial seguro para la
   ventana, actualización pasiva del scroll y cleanup.
3. En la activación usar `window.scrollTo({ top: 0, behavior })` y enfocar
   `#main-content` con `preventScroll: true`, conservando la semántica global
   ya existente de `AppLayout`.
4. Montar el componente una sola vez dentro de `AppLayout`, eliminar la
   implementación de `WodsList` y retirar el módulo/estilos específicos de WODs.
5. Reubicar los estilos existentes en una hoja compartida, manteniendo tokens,
   foco, tamaño táctil, z-index y separación móvil del dock.
6. Ejecutar las verificaciones del frontend y revisar que la diff no incluya
   backend, API, contratos ni archivos protegidos.

## Verificación

- `npm run test` desde `frontend/`.
- `npm run lint` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de una sola instancia global, un único listener y cleanup.
- Revisión de alcance y manifiesto de archivos.
- Validación manual en móvil, tablet y escritorio: umbral, rutas Ejercicios,
  Historial y WODs, click/teclado, foco, reduced motion, dock, footer,
  safe-area y rutas cortas.
