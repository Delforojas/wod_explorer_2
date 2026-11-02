# SDD: Botón global «Volver arriba»

## Objetivo

Extender el patrón existente de «Volver arriba» del catálogo de WODs a las
rutas largas de la aplicación mediante una única solución compartida, sin
duplicar lógica por vista ni alterar filtros, listados, API o navegación.

## Alcance

- Extraer el comportamiento existente del catálogo a un componente global
  reutilizable integrado en `AppLayout`.
- Mostrarlo únicamente cuando `window.scrollY` supere el umbral existente de
  `400px`, en cualquier ruta que tenga contenido suficientemente largo.
- Mantener desplazamiento suave por defecto e instantáneo con
  `prefers-reduced-motion: reduce`.
- Recalcular la visibilidad al cambiar de ruta y limpiar el listener al
  desmontar el componente.
- Mantener el texto accesible «Volver arriba», botón nativo, foco visible,
  objetivo táctil mínimo y separación del dock móvil y áreas seguras.
- Reutilizar tokens y estilos del sistema oscuro/naranja, eliminando la
  instancia y estilos específicos de WODs.

## Fuera de alcance

- Cambiar filtros, resultados, APIs, rutas o lógica de negocio.
- Añadir dependencias, librerías de UI o un sistema de scroll alternativo.
- Modificar backend, base de datos, autenticación o contratos.
- Cambiar el comportamiento de scroll de las páginas automáticamente al
  navegar; solo se debe recalcular la visibilidad del control.

## Comportamiento esperado

1. Al cargar una ruta o regresar cerca del inicio, el control permanece oculto.
2. Al superar `400px` de scroll, el control aparece una sola vez como parte
   del layout global, también en Ejercicios e Historial.
3. Al pulsarlo o activarlo por teclado, la ventana vuelve a `top: 0` y el foco
   pasa al contenedor principal sin provocar un segundo desplazamiento.
4. La animación usa `smooth` salvo que el usuario solicite reducir movimiento,
   en cuyo caso usa `auto`.
5. El control se mantiene por encima del contenido sin tapar el dock inferior,
   respeta `safe-area-inset-bottom` y no genera overflow horizontal.
6. Cambiar de ruta no crea listeners adicionales ni deja estado obsoleto.

## Criterios de aceptación

- [ ] Ejercicios e Historial muestran el control tras superar el umbral en
      móvil.
- [ ] WODs conserva la funcionalidad anterior sin botón duplicado.
- [ ] Rutas largas lo muestran y rutas cortas o cercanas al inicio lo ocultan.
- [ ] La activación vuelve al inicio y restaura un foco lógico.
- [ ] Smooth scrolling se conserva y reduced motion usa scroll instantáneo.
- [ ] El control es un `button` nativo, accesible, enfocable y operable por
      teclado, con objetivo mínimo de `44px`.
- [ ] La posición funciona en móvil, tablet y escritorio junto al dock, footer,
      controles fijos y áreas seguras.
- [ ] Los estilos usan tokens y patrones existentes, sin dependencia nueva.
- [ ] Hay una única escucha activa, se limpia al desmontar y se recalcula tras
      cambios de ruta.
- [ ] Las pruebas cubren las funciones puras de visibilidad y scroll behavior;
      la interacción DOM, foco, rutas y responsive queda para validación manual
      por la infraestructura de tests existente.
- [ ] `npm run lint`, `npm run test`, `npm run build` y `git diff --check`
      pasan.
- [ ] Backend, API, base de datos y contratos permanecen sin cambios.

## Restricciones y fuentes

- GitHub Issue #102 y su referencia a #83.
- `specs/083-back-to-top-wod-catalog/`: comportamiento y decisiones previas.
- `frontend/AGENTS.md`, `PROJECT.md`, `DESIGN.md` y `docs/consitucion.md`.
- `AppLayout`, `WodsList`, `wodScroll.ts`, `wod.css`, `layout.css`,
  `mobile-dock.css` y los tokens actuales.
