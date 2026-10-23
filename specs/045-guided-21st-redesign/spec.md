# Rediseñar componentes visuales mediante selección guiada con 21st

## Objetivo

Adaptar el catálogo de Ejercicios y la navegación inferior móvil mediante patrones seleccionados explícitamente con 21st, conservando Bitácora de rendimiento, funcionalidad y accesibilidad.

## Alcance

- Convertir Ejercicios en una fila editorial compacta, con metadata discreta y affordance accesible de bajo peso.
- Refinar la navegación inferior como barra integrada de borde con indicador de destino activo.
- Consolidar reglas CSS reutilizables que mantengan coherencia con las demás vistas.

## Restricciones

- No modificar backend, dominio, API, rutas, handlers, comportamiento, dependencias ni `DOMAIN.md`.
- No copiar componentes 21st literalmente ni añadir cards, gradientes, glassmorphism o docks flotantes.

## Criterios de aceptación

- [ ] La exploración y selección de referencias 21st están documentadas.
- [ ] Ejercicios usa una composición editorial compacta, sin acción dominante ni metadata con apariencia de control.
- [ ] La navegación móvil mantiene destinos y comportamiento con una barra integrada más coherente.
- [ ] Se mantienen accesibilidad y responsive.
- [ ] 21st-ui-review, lint, tests y build pasan.
