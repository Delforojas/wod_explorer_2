# Tareas

- [x] T1. Inspeccionar `exerciseFilters.ts` y `ExercisesList.tsx` para
      confirmar si el filtrado ya normaliza los espacios al inicio y al
      final del texto de búsqueda.
  - Dependencias: ninguna.
  - Comprobación: se identifica que `normalizeExerciseSearch` ya aplica
    `trim()` y que el input no se recorta automáticamente.
- [x] T2. Documentar el hallazgo en `spec.md`/`plan.md` y confirmar que no se
      requiere código de producción nuevo, conforme a la restricción de la
      Issue de no introducir código redundante.
  - Dependencias: T1.
  - Comprobación: el spec refleja el hallazgo y el alcance real del cambio.
- [x] T3. Añadir pruebas de comportamiento en `ExercisesList.test.tsx` que
      confirmen, a nivel de componente: mismos resultados con y sin
      espacios, búsqueda solo de espacios equivalente a vacía, e input sin
      auto-recorte.
  - Dependencias: T2.
  - Comprobación: las pruebas pasan con el código actual.
- [x] T4. Ejecutar lint, tests y build del frontend y registrar resultados.
  - Dependencias: T3.
  - Comprobación: todos los comandos terminan con código de salida 0.
