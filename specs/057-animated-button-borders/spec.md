# Aplicar bordes luminosos animados a botones

## Objetivo

Integrar un borde luminoso animado inspirado en la referencia 21st en los botones reales de WOD Explorer, usando las variantes visuales existentes.

## Alcance y comportamiento

- Primary y submit: borde primary con highlight perimetral continuo y sobrio.
- Secondary y destructive: misma familia, pero highlight solo en hover o focus; destructive mantiene semántica error.
- Disabled y reduced motion: sin animación continua.
- Tertiary y links: sin el efecto perimetral para no competir con navegación ni contenido.
- El texto, layout, semántica, handlers, focus y estados funcionales permanecen intactos.

## Restricciones

- Solo CSS nativo: sin dependencias, loops JavaScript ni renders React.
- Usar los tokens 21st vigentes, sin cyan ni nueva paleta.
- No modificar backend, dominio, rutas, formularios, navegación ni componentes de página.

## Criterios de aceptación

- [ ] Los botones reales usan una familia visual coherente con borde dinámico perceptible en primary.
- [ ] Secondary es más discreto y destructive conserva el color error.
- [ ] Disabled no parece interactivo; focus visible sigue siendo inequívoco.
- [ ] La animación no mueve contenido ni genera layout shift, respeta reduced motion y touch.
- [ ] No se añaden dependencias ni se cambia comportamiento funcional.
- [ ] 21st review, lint, tests, build y `git diff --check` pasan.
