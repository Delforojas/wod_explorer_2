# Plan técnico

## Enfoque

`frontend/src/components/wodFilter/WodsList.tsx` mantiene `search` como estado local, mientras la categoría se deriva de `useSearchParams`. Se añadirá un manejador de teclado al input nativo que, solo ante `Escape` con texto, ejecute `setSearch("")`. No se invocará `clearFilters`, por lo que la categoría y los demás parámetros de URL permanecen intactos.

## Componentes afectados

- `WodsList.tsx`: interacción de teclado del input del catálogo público.
- `WodsList.test.tsx`: prueba de usuario del vaciado con `Escape`, lista filtrada, categoría activa y foco.

## Estrategia de implementación

1. Confirmar que `Escape` no está soportado y que la categoría está separada del estado de búsqueda.
2. Añadir la condición mínima al input, conservando el manejador de cambio actual.
3. Montar el componente con una categoría inicial, escribir una búsqueda y pulsar `Escape`; comprobar valor, resultados, categoría y foco. Cubrir también la pulsación con texto vacío.
4. Ejecutar lint, pruebas y build del frontend.

## Verificación

- La prueba de interacción dispara `Escape` en el input enfocado y comprueba que el valor queda vacío.
- La prueba confirma que la lista respeta la categoría seleccionada y que el foco no se mueve.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/` deben finalizar correctamente.
