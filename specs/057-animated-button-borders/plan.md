# Plan de implementación

## Inventario real

| Consumidor | Variante actual | Objetivo | Animación |
| --- | --- | --- | --- |
| Crear/guardar/login/registrar | submit o primary | primary | continua, sobria |
| Añadir, cancelar, ver detalle | secondary | secondary | hover/focus |
| Eliminar WOD o ejercicio | destructive | destructive | hover/focus error |
| Volver | tertiary | tertiary | sin borde animado |

## Técnica CSS

Se evoluciona la primitive global `button` con un pseudo-elemento `::before`: un `conic-gradient` primario o error se recorta por máscara para mostrar solo el borde y rota mediante `transform`. El contenido queda estable porque la capa es absoluta y el botón conserva su geometría actual. Primary anima el highlight; secondary/destructive lo activan únicamente al interactuar. Todos los colores provienen de custom properties existentes.

`focus-visible` conserva su outline y shadow actual, separado del highlight. Disabled pausa la animación. En reduced motion se desactiva la animación y se conserva el borde estático. En touch no se depende de hover.

## Rendimiento y Pulsar Grid

La implementación usa únicamente una animación CSS de `transform`, sin listeners ni React state. El primary mantiene brillo controlado para no competir con el Pulsar Grid; secondary y destructive no animan constantemente.

## Verificación

Ejecutar 21st review, lint, tests, build y `git diff --check`; validar manualmente formularios, botones de lista, teclado, touch y reduced motion.
