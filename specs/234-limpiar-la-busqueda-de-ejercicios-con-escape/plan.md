# Plan técnico

## Enfoque

`frontend/src/components/ExerciseFilter/ExercisesList.tsx` mantiene localmente el estado `search` y ya deriva la lista visible mediante `filterExercises`. Se añadirá un manejador de teclado al input nativo que, exclusivamente ante `Escape` con una búsqueda no vacía, establezca `search` en una cadena vacía. No se modificarán otros estados, filtros, foco ni rutas.

## Componentes afectados

- `ExercisesList.tsx`: interacción de teclado del input del catálogo público.
- `ExercisesList.test.tsx`: prueba de usuario del vaciado con `Escape`, la lista derivada y la preservación del foco.

## Estrategia de implementación

1. Confirmar que el comportamiento no está implementado y que la prueba puede montar el componente con filtros activos.
2. Añadir la condición mínima en el input, preservando el manejador de cambio actual.
3. Cubrir que `Escape` borra solo la búsqueda y restaura la lista derivada existente; cubrir que con búsqueda vacía no hay cambio observable adverso. El componente no tiene otros filtros que preservar.
4. Ejecutar lint, pruebas y build del frontend.

## Verificación

- La prueba de interacción dispara `Escape` en el input enfocado y comprueba su valor y la lista renderizada.
- La prueba comprueba que el foco sigue en el input y que el contenido de la lista responde al estado de búsqueda existente.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/` deben finalizar correctamente.
