# Integrar navegación Text Roll inspirada en 21st

## Objetivo

Incorporar la interacción tipográfica Text Roll a los labels de navegación desktop reales de WOD Explorer, usando React, TypeScript y CSS estándar.

## Alcance

- Aplicar dos capas visuales por label en la sidebar desktop: la capa superior sale hacia arriba y la inferior entra desde abajo, con stagger de 35 ms por carácter desde el centro.
- Activar el efecto con hover y `focus-visible` sin sustituir el estado active ni el foco existente.
- Mantener mobile sin Text Roll para conservar una navegación táctil clara y sin dependencia de hover.
- Mantener un único nombre accesible por enlace y ocultar las copias visuales de lectores de pantalla.

## Comportamiento esperado

- Los links mantienen sus rutas, labels, semántica y navegación actual.
- Las dos capas ocupan el mismo espacio y no generan layout shift u overflow.
- Espacios, acentos y labels de varias palabras se representan carácter por carácter de forma estable.
- Con `prefers-reduced-motion: reduce`, el texto se muestra sin roll y continúan los estados hover, active y focus.

## Criterios de aceptación

- [ ] La navegación desktop usa únicamente rutas y labels reales existentes.
- [ ] Text Roll desplaza la capa superior hacia arriba y la inferior desde abajo por carácter, con 35 ms de stagger centrado.
- [ ] Active, hover, focus-visible, keyboard, texto accesible, espacios, reduced motion y estabilidad de layout se conservan.
- [ ] Mobile conserva el tratamiento actual apropiado para touch.
- [ ] No se añaden Tailwind, shadcn, `clsx`, `tailwind-merge` ni `motion`.
- [ ] Se reutilizan los tokens de #48 y pasan 21st-ui-review, lint, tests, build y `git diff --check`.

## Restricciones

- No modificar backend, dominio, rutas, handlers, permisos, contenido de páginas ni tokens globales.
- No rediseñar el sidebar ni crear una arquitectura shadcn.
