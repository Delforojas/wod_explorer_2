# Tareas

- [x] T1. Inspeccionar `WodsList` y sus pruebas para confirmar que `Escape` no está soportado y que la categoría se deriva por separado del texto.
  - Dependencias: ninguna.
  - Comprobación: el componente identifica estados y filtros que deben preservarse.
- [x] T2. Implementar el vaciado de `search` con `Escape` en el input del catálogo sin alterar parámetros de URL, foco ni navegación.
  - Dependencias: T1.
  - Comprobación: el cambio se limita al componente afectado y al evento de teclado requerido.
- [x] T3. Añadir una prueba de interacción para el vaciado, la lista actualizada, la conservación de la categoría y el foco; comprobar también el caso vacío.
  - Dependencias: T2.
  - Comprobación: la prueba falla sin el comportamiento y pasa con él.
- [x] T4. Ejecutar las verificaciones frontend aplicables y registrar los resultados.
  - Dependencias: T3.
  - Comprobación: lint, test y build terminan con código de salida 0.
