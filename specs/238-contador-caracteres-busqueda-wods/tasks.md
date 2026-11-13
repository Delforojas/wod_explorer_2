# Tareas

- [x] T1. Inspeccionar `WodsList.tsx`, el CSS asociado y el repositorio para
      confirmar que no existe ya un contador de caracteres equivalente sobre
      el input de búsqueda de WODs.
  - Dependencias: ninguna.
  - Comprobación: hallazgo documentado en `spec.md` (solo existe `.wod-count`,
    que cuenta WODs filtrados, no caracteres).
- [x] T2. Añadir `pluralizeCharacterCount(count)` y el bloque condicional del
      contador en `WodsList.tsx`, basado en `search.length`, sin alterar el
      valor del input ni las reglas de filtrado.
  - Dependencias: T1.
  - Comprobación: el contador se muestra con el texto correcto y desaparece
    con `search` vacío.
- [x] T3. Añadir la regla CSS `.wod-search-char-count` en `resources.css`,
      reutilizando el patrón visual existente (sin nuevas dependencias de
      estilos).
  - Dependencias: T2.
  - Comprobación: el contador se ve discreto, consistente con `.wod-count`.
- [x] T4. Añadir pruebas de comportamiento en `WodsList.test.tsx`: `Fran` →
      `4 caracteres`; un carácter → `1 carácter`; vacío → sin contador;
      Escape limpia campo y contador.
  - Dependencias: T2.
  - Comprobación: las pruebas pasan con el código actual y fallan si se
    revierte el cambio.
- [x] T5. Ejecutar lint, tests y build del frontend y registrar resultados.
  - Dependencias: T3, T4.
  - Comprobación: todos los comandos terminan con código de salida 0.
