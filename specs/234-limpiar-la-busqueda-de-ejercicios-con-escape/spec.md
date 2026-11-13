# Issue #234: Limpiar la búsqueda de ejercicios con Escape

## Objetivo

Permitir que una persona borre el texto del buscador del catálogo público de ejercicios pulsando `Escape` mientras el campo tiene el foco.

## Alcance

- Modificar únicamente el buscador del catálogo público de ejercicios en el frontend.
- Vaciar el estado de búsqueda cuando se pulse `Escape` y el campo tenga texto.
- Conservar sin cambios los demás filtros, el foco y la navegación.
- Añadir una prueba de interacción observable.

## Fuera de alcance

- Backend, API, base de datos, autenticación y dependencias.
- Cambios en otros buscadores o filtros.

## Comportamiento esperado

- Con texto en el campo, `Escape` lo deja vacío y la lista vuelve a usar el filtrado existente para una búsqueda vacía.
- Con el campo vacío, `Escape` no cambia estado ni provoca acciones adicionales.
- El resto de entradas de teclado y el comportamiento de búsqueda existente permanecen intactos.

## Criterios de aceptación

1. Al introducir texto y pulsar `Escape`, el campo queda vacío y la lista se actualiza según el filtrado existente.
2. Pulsar `Escape` con el campo vacío no produce errores ni acciones adicionales.
3. Los demás filtros activos permanecen intactos.
4. El funcionamiento normal del teclado y del buscador no cambia.
5. Existe al menos una prueba de interacción y pasan las verificaciones frontend aplicables.

## Restricciones

- Cambio mínimo y solo frontend.
- Reutilizar el estado y componentes actuales; sin utilidades genéricas ni dependencias nuevas.
- Mantener la semántica, accesibilidad y diseño existentes.
