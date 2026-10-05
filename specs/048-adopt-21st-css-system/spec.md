# Adoptar el sistema visual CSS seleccionado de 21st

## Objetivo

Adoptar los valores del sistema CSS 21st seleccionado como base visual global de WOD Explorer, manteniendo la arquitectura, rutas, datos y comportamiento actuales.

## Alcance

- Actualizar tokens CSS globales, controles compartidos, superficies, navegación desktop y navegación móvil.
- Aplicar la escala primary, jerarquía dark y estados semánticos proporcionados.
- Sincronizar `DESIGN.md` con los valores finales adoptados.

## Restricciones

- No instalar Tailwind, `@tailwindcss/forms`, shadcn ni librerías UI o de styling.
- No modificar backend, dominio, API, rutas, handlers, autenticación, contratos ni lógica de negocio.
- No rediseñar compositivamente páginas existentes.
- Mantener tema oscuro, breakpoints, accesibilidad, foco visible y reduced motion.

## Criterios de aceptación

- [ ] Existe una tabla 21st → WOD Explorer clasificada como ADOPTAR, ADAPTAR o DESCARTAR antes de cambiar CSS.
- [ ] Primary, jerarquía dark, estados semánticos, controles, surfaces y navegaciones usan el nuevo sistema.
- [ ] No se añaden dependencias ni comportamiento funcional.
- [ ] `DESIGN.md` documenta el sistema adoptado.
- [ ] 21st-ui-review, lint, tests, build y `git diff --check` pasan.
