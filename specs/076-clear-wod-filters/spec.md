# Especificación: Limpiar filtros del catálogo público de WODs

## Objetivo

Permitir que los usuarios restauren rápidamente el listado completo de WODs
desde el catálogo público mediante una acción explícita.

## Alcance

- Modificar únicamente el frontend del catálogo público de WODs.
- Reutilizar el estado y la lógica de búsqueda existentes en `WodsList`.
- Considerar como filtro activo la búsqueda de texto no vacía que ya existe en
  el catálogo.
- Limpiar la búsqueda y cualquier filtro WOD activo disponible en el catálogo.
- Mantener la presentación responsive y la navegación mediante teclado.
- Añadir o actualizar pruebas del comportamiento observable.
- No modificar backend, API, base de datos, autenticación ni dependencias.

## Comportamiento esperado

- La página muestra una acción nativa de botón con el texto "Limpiar filtros"
  únicamente cuando existe una búsqueda o filtro WOD activo.
- El botón tiene un nombre accesible mediante su texto visible y puede
  activarse con teclado.
- Al activar el botón, se vacía la búsqueda y el listado vuelve a mostrar todos
  los WODs disponibles.
- El contador del catálogo vuelve al estado correspondiente al listado completo.
- La acción conserva los patrones visuales existentes y un objetivo táctil y
  foco visible adecuados en tamaños responsive.
- Cuando no hay búsqueda ni filtros activos, la acción no se renderiza.

## Criterios de aceptación

- [ ] Con una búsqueda WOD activa, la acción se muestra.
- [ ] Al activar la acción, se elimina la búsqueda y se restauran todos los
      filtros WOD activos.
- [ ] El listado completo de WODs vuelve a mostrarse después de limpiar.
- [ ] Sin búsqueda ni filtros activos, la acción no se muestra.
- [ ] La acción tiene nombre accesible, funciona con teclado y conserva el
      comportamiento responsive.
- [ ] Las pruebas cubren la visibilidad condicional y el restablecimiento del
      listado.

## Restricciones

- Mantener la arquitectura basada en React, TypeScript, CSS y Vitest.
- Reutilizar los patrones existentes del catálogo de ejercicios cuando sean
  aplicables, adaptándolos a los estilos del catálogo WOD.
- No introducir dependencias nuevas.
- No cambiar contratos de API ni realizar llamadas adicionales.
- No añadir nuevos tipos de filtros ni cambiar el contrato de búsqueda.
