# Plan de implementación

## Integración y capas

`AppLayout` contiene el único `<main className="app-main">`. Se añadirá `PulsarGridBackground` como primer hijo decorativo de ese elemento y se envolverá el contenido en una capa posicionada sobre el canvas. El sidebar permanece fuera de `main` y conserva su superficie.

`main` será el contexto de posicionamiento; el canvas usará `position: absolute; inset: 0; pointer-events: none`, mientras el contenido obtiene una capa relativa superior. La altura es la del `main` real: no se fuerza una altura de viewport ni se crea scroll adicional.

## Canvas y rendimiento

- Un `ResizeObserver` mide el contenedor `main` y genera puntos solo al cambiar ancho o alto.
- El DPR se limita a `2`; el contexto se escala a coordenadas CSS para nitidez sin coste desproporcionado.
- `mousePositionRef` se actualiza desde `pointermove`; no se usa state ni se recrean effects por movimiento.
- Un único RAF se inicia al montar cuando la animación está permitida, se cancela al desmontar y se pausa/reanuda con `visibilitychange`.
- El canvas limpia y dibuja puntos con onda primaria de baja opacidad y sin glow excesivo. Los colores se leen de las variables CSS `--color-primary-500` y `--color-bg-raised`.

## Mobile, reduced motion y accesibilidad

- En `(pointer: coarse)` y `prefers-reduced-motion: reduce`, se dibuja una textura de puntos estática sin RAF ni listener de puntero.
- El canvas lleva `aria-hidden="true"`; no participa en teclado ni recibe eventos.
- El contenido existente, surfaces y focus permanecen en la capa superior.

## Archivos afectados

| Archivo | Acción |
| --- | --- |
| `frontend/src/components/layout/PulsarGridBackground.tsx` | Añadir canvas decorativo aislado y su lifecycle. |
| `frontend/src/components/layout/AppLayout.tsx` | Integrar una instancia global detrás del contenido de main. |
| `frontend/src/index.css` | Añadir el stacking y aislamiento visual del grid sin alterar páginas. |

## Verificación

- No se añaden tests de canvas: el proyecto no tiene infraestructura de render DOM y una prueba del loop sería frágil. La limpieza y el comportamiento se validan manualmente.
- Ejecutar `21st review`, `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Validar desktop, mobile, teclado, reduced motion, interacción real y ausencia de overflow manualmente.
