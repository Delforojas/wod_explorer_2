# SDD: Barra de filtro por categoría en el catálogo de WODs

## Objetivo

Permitir filtrar el catálogo público y autenticado de `/wods` mediante una
barra segmentada con las opciones Todos, CROSSTRAINING e HYBRID.

## Alcance

- Mostrar la barra debajo del buscador y antes del contador del catálogo.
- Usar el parámetro de URL `category` ya empleado por las tarjetas de Home.
- Combinar el filtro de categoría con la búsqueda por nombre existente.
- Mantener los badges, acciones, orden, permisos y estados actuales del
  catálogo.
- Reutilizar el patrón visual y de interacción de la barra de Historial sin
  modificar Historial ni Home.

## Comportamiento esperado

1. Sin una categoría válida en la URL, Todos queda seleccionado y se muestran
   todos los WODs disponibles.
2. CROSSTRAINING y HYBRID muestran solo los WODs cuya categoría del contrato
   coincide exactamente con la pestaña seleccionada.
3. Cambiar de pestaña actualiza `category` en la URL; Todos lo elimina. La
   navegación atrás/adelante refleja la pestaña y los resultados correctos.
4. La búsqueda y la categoría se aplican simultáneamente. El contador y el
   estado vacío reflejan el resultado combinado.
5. La barra es operable con teclado, muestra el estado activo mediante texto y
   estilo, mantiene foco visible y se adapta a móvil sin desbordar.

## Criterios de aceptación

- [ ] `/wods` muestra Todos, CROSSTRAINING e HYBRID con el patrón segmentado.
- [ ] Cada pestaña filtra solo la categoría correspondiente y Todos restaura la
      lista completa.
- [ ] Búsqueda, contador y estado vacío reflejan los filtros combinados.
- [ ] Los enlaces de Home con `?category=` seleccionan la pestaña correcta y la
      URL se mantiene coherente al cambiar de filtro o navegar por el historial.
- [ ] Badges, acciones, permisos, orden y estados existentes se conservan.
- [ ] La barra funciona en móvil y escritorio con semántica, teclado y foco
      visible.
- [ ] Existen pruebas pertinentes y pasan lint, tests, build y revisión de
      diff.

## Restricciones

- No modificar backend, base de datos, modelos ni categorías de ejercicios.
- No crear consultas adicionales ni un esquema de URL paralelo.
- No añadir filtros para otras categorías ni dependencias nuevas.
- No modificar Home ni Historial salvo que una incompatibilidad verificada lo
      requiera; el contrato URL existente evita ese cambio.
