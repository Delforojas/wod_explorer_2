# Especificación: Limpiar filtros del catálogo de ejercicios

## Objetivo

Permitir que los usuarios restauren rápidamente el listado completo de
ejercicios desde la página del catálogo.

## Alcance

- Modificar únicamente el frontend del catálogo de ejercicios.
- Reutilizar el estado y la lógica de búsqueda existentes.
- Considerar como filtro activo la búsqueda de texto no vacía que ya existe en
  el catálogo.
- No añadir nuevos tipos de filtros.
- No modificar backend, base de datos, autenticación ni dependencias.

## Comportamiento esperado

- La página muestra una acción nativa de botón con el texto "Limpiar filtros"
  únicamente cuando la búsqueda contiene un filtro activo.
- El botón tiene un nombre accesible mediante su texto visible y puede
  activarse con teclado.
- Al activar el botón, la búsqueda se vacía y el listado vuelve a mostrar todos
  los ejercicios disponibles.
- El contador del catálogo vuelve al estado correspondiente al listado completo.
- La acción conserva la estética existente y mantiene un objetivo táctil y un
  foco visible adecuados en tamaños responsive.
- Cuando no hay búsqueda activa, la acción no se renderiza.

## Criterios de aceptación

- [ ] Con búsqueda activa, la acción elimina la búsqueda.
- [ ] Con filtros activos, la acción restablece todos los filtros disponibles.
- [ ] Con búsqueda y filtros combinados, elimina ambos cuando esos filtros
      estén disponibles en el catálogo.
- [ ] Sin filtros activos, la acción no aparece.
- [ ] No introduce regresiones en el catálogo existente.
- [ ] Se añaden o actualizan las pruebas correspondientes.

## Restricciones

- Mantener la arquitectura basada en React, TypeScript, CSS y Vitest.
- No introducir dependencias nuevas.
- No cambiar contratos de API ni realizar llamadas adicionales.
