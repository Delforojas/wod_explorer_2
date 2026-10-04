# Refinar la dirección artística y humanizar la interfaz

## Objetivo

Evolucionar las vistas existentes hacia una Bitácora de rendimiento: una composición editorial, compacta y deportiva donde el nombre del recurso y la métrica dominan, la metadata acompaña sin parecer un control y las acciones secundarias no compiten con el contenido.

## Alcance

- Refinar los primitives CSS, la navegación y las vistas de catálogo, detalle, historial, formularios y acceso existentes.
- Dar composiciones diferenciadas a ejercicios, WODs, resultados e introducción, preservando el sistema visual compartido.
- Reducir la repetición de filas, bordes, badges y botones visualmente pesados.
- Mantener semántica, foco visible, objetivos táctiles, responsive y handlers actuales.

## Comportamiento esperado

- Ejercicios se muestran como filas compactas y navegables mediante una affordance accesible y discreta.
- Las métricas de tiempo, rondas y resultados destacan mediante tipografía tabular, no cajas decorativas.
- Móvil prioriza lectura y densidad; escritorio usa el espacio para jerarquía y comparación, sin ensanchar artificialmente filas móviles.

## Criterios de aceptación

- [ ] La exploración 21st y las alternativas están documentadas en `plan.md`.
- [ ] Las listas, especialmente Ejercicios, abandonan el patrón nombre, badges y botón dominante.
- [ ] Las acciones secundarias y metadata tienen menor peso visual que el contenido principal.
- [ ] Cada categoría de pantalla tiene una composición apropiada a su contenido.
- [ ] Navegación móvil, accesibilidad, responsive, rutas, contratos y handlers se preservan.
- [ ] Se ejecutan 21st-ui-review, lint, tests y build correctamente.

## Restricciones

- No modificar dominio, backend, base de datos, endpoints, contratos API, rutas, handlers ni comportamiento funcional.
- No añadir dependencias, tema claro, gamificación, funcionalidades sociales o rankings.
- Respetar tokens y principios de `DESIGN.md`.
