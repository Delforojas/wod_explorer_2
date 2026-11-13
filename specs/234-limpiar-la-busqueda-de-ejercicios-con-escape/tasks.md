# Tareas

- [x] T1. Inspeccionar `ExercisesList` y sus pruebas para confirmar que `Escape` no está soportado y localizar el filtro activo que debe preservarse.
  - Dependencias: ninguna.
  - Comprobación: el componente y las pruebas existentes identifican el estado de búsqueda y filtros aplicables.
- [x] T2. Implementar el vaciado de `search` al pulsar `Escape` en el input del catálogo, sin modificar otros estados ni navegación.
  - Dependencias: T1.
  - Comprobación: el cambio se limita al componente afectado y respeta la semántica del input nativo.
- [x] T3. Añadir una prueba de interacción que pruebe el vaciado con `Escape`, la actualización de la lista y la conservación del foco; comprobar también el caso vacío.
  - Dependencias: T2.
  - Comprobación: la prueba falla sin el comportamiento y pasa con él.
- [x] T4. Ejecutar las verificaciones frontend aplicables y registrar los resultados.
  - Dependencias: T3.
  - Comprobación: lint, test y build terminan con código de salida 0.
