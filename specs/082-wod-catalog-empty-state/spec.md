# Especificacion: Estado vacio del catalogo publico de WODs

## Objetivo

Mejorar el estado vacio del catalogo publico de WODs para que explique el
motivo de la ausencia de resultados, mantenga la identidad visual existente y
ofrezca una continuacion clara cuando una busqueda activa no encuentra
coincidencias.

## Alcance

- Modificar unicamente el frontend del catalogo publico de WODs.
- Actualizar el estado vacio renderizado por `WodsList`.
- Diferenciar entre un catalogo sin WODs y una busqueda sin coincidencias.
- Reutilizar la busqueda, el filtrado y la accion existente `Limpiar filtros`.
- Mostrar una unica accion de limpieza en el buscador cuando hay resultados y
  dentro del estado vacio cuando una busqueda activa deja cero coincidencias.
- Mantener la seleccion de WOD, el registro de resultados, el contador y el
  boton `Volver arriba` sin cambios funcionales.
- Mantener el comportamiento responsive, el foco visible y la navegacion por
  teclado.
- No modificar backend, API, base de datos, autenticacion ni dependencias.

## Comportamiento esperado

### Catalogo sin WODs

- Mostrar un estado vacio visualmente integrado con el catalogo.
- Explicar que no hay entrenamientos disponibles.
- No mostrar una accion para limpiar filtros porque no hay resultados de
  catalogo que recuperar.

### Busqueda sin coincidencias

- Mostrar un estado vacio distinto del catalogo sin WODs.
- Explicar que no se encontraron entrenamientos con los criterios seleccionados.
- Mostrar `Limpiar filtros` dentro del estado vacio.
- Al activar la accion, vaciar la busqueda y recuperar el listado completo.

### Busqueda con resultados

- Conservar `Limpiar filtros` en el area de busqueda cuando la busqueda activa
  produce resultados.
- No alterar la logica existente de filtrado ni el contador.

## Criterios de aceptacion

- [ ] Cuando el catalogo no devuelve resultados, se muestra un estado vacio
      claro y visualmente integrado.
- [ ] El mensaje diferencia entre catalogo sin WODs y busqueda sin
      coincidencias.
- [ ] La accion `Limpiar filtros` aparece en el estado vacio solo cuando hay
      WODs disponibles y una busqueda activa no devuelve coincidencias.
- [ ] Al limpiar los filtros desde el estado vacio, vuelve a mostrarse el
      listado completo de WODs.
- [ ] La accion existente sigue disponible con una busqueda activa que conserva
      resultados.
- [ ] El estado vacio usa estructura semantica, nombre comprensible y foco
      visible para controles interactivos.
- [ ] El estado vacio funciona en movil y escritorio sin overflow horizontal.
- [ ] No se modifican la busqueda, el filtrado, la seleccion, la navegacion ni
      el registro de resultados.
- [ ] No se introducen dependencias nuevas ni cambios fuera del frontend.

## Restricciones

- Mantener React, TypeScript, CSS y Vitest.
- Reutilizar las clases, tokens, colores, tipografia y patrones responsive del
  catalogo WOD existente.
- No crear un componente global ni una abstraccion compartida sin otro
  consumidor real.
- No cambiar contratos de API, rutas ni datos del dominio.
- La validacion visual y de interaccion queda pendiente de aprobacion manual
  porque el proyecto no dispone de un harness DOM para este catalogo.

## Referencias

- GitHub Issue #82: `Mejorar el estado vacío del catálogo de WODs`.
- `frontend/src/components/wodFilter/WodsList.tsx`.
- `frontend/src/views/wods/wodFilters.ts`.
- `frontend/src/styles/wod.css`.
- `specs/076-clear-wod-filters/spec.md`.
- `specs/083-back-to-top-wod-catalog/spec.md`.
