# SDD: Badges de categoría en el catálogo de WODs

## Objetivo

Mostrar la categoría real de cada WOD junto a su modalidad en el catálogo,
manteniendo ambas etiquetas legibles y sin alterar los flujos de detalle,
registro ni filtrado.

## Alcance

- Renderizar un badge de categoría junto al badge de modalidad existente.
- Presentar HYBRID en verde y CROSSTRAINING en amarillo.
- Mostrar categorías distintas o ausentes con un fallback neutro y texto.
- Reutilizar el dato `category` entregado por el contrato existente y los
  patrones visuales del catálogo.
- Mantener la alineación de acciones en móvil y escritorio.

## Comportamiento esperado

1. Cada fila del catálogo muestra modalidad, tiempo si existe y categoría, en
   ese orden.
2. HYBRID usa un estilo verde legible, CROSSTRAINING uno amarillo legible y los
   valores distintos uno neutro.
3. La ausencia de categoría no rompe el catálogo y se comunica con un texto de
   fallback.
4. Buscar, filtrar, abrir detalle y registrar resultados conserva su
   comportamiento existente.

## Criterios de aceptación

- [x] HYBRID muestra un badge verde con texto.
- [x] CROSSTRAINING muestra un badge amarillo con texto.
- [x] Modalidad y categoría conviven en los metadatos de cada WOD.
- [x] Valores futuros o ausentes se muestran sin error mediante fallback neutro.
- [x] No se depende solo del color y se preserva el contraste en tema oscuro.
- [x] Los flujos del catálogo y sus acciones conservan su funcionamiento.
- [x] Existen pruebas de renderizado y pasan lint, tests, build y revisión de
      diff.

## Restricciones

- No modificar backend, DTOs, base de datos, categorías persistidas ni filtros.
- No inferir categoría por nombre, origen o modalidad.
- No añadir dependencias ni estilos paralelos al catálogo.
