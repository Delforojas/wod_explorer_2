# Issue #235: Limpiar la búsqueda de WODs con Escape

## Objetivo

Permitir borrar el texto del buscador del catálogo público de WODs pulsando `Escape` mientras el campo tiene el foco.

## Alcance

- Modificar únicamente el buscador del catálogo público de WODs en el frontend.
- Vaciar el estado de búsqueda ante `Escape` cuando contenga texto.
- Mantener la categoría activa, el foco del campo y la navegación.
- Añadir una prueba de interacción observable.

## Fuera de alcance

- Backend, API, base de datos, autenticación, navegación y dependencias.
- Cambios en otros buscadores, filtros o utilidades compartidas.

## Comportamiento esperado

- Con texto en el campo, `Escape` lo deja vacío y el listado se actualiza mediante la lógica de filtrado existente.
- La categoría seleccionada en la URL permanece activa tras limpiar el texto.
- Con el campo vacío, `Escape` no altera el estado ni provoca acciones adicionales.
- El resto de interacciones de teclado mantiene su comportamiento actual.

## Criterios de aceptación

1. Escribir una búsqueda y pulsar `Escape` elimina el texto y actualiza el listado.
2. Pulsar `Escape` con el campo vacío no provoca errores ni cambios inesperados.
3. Los filtros distintos del texto no se reinician.
4. El control sigue siendo accesible con teclado.
5. Se añaden o adaptan pruebas de interacción; lint, tests y build aplicables pasan.

## Restricciones

- Cambio mínimo y solo frontend.
- Reutilizar estado y componentes existentes, sin dependencias ni abstracciones nuevas.
- Mantener semántica, accesibilidad y diseño existentes.
