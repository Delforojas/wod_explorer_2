# Plan: Accesibilidad del contador de WODs

## Enfoque técnico

Añadir semántica ARIA mínima (`role="status"`, `aria-live="polite"`) al
elemento del contador ya existente en `WodsList.tsx`, reutilizando el patrón
ya presente en el resto del proyecto. No se reimplementa el contador ni se
toca su lógica de cálculo o su texto (trabajo de #230).

## Componentes afectados

- `frontend/src/components/wodFilter/WodsList.tsx`
  - Añadir `role="status"` y `aria-live="polite"` al `<p className="wod-count">`
    (líneas 143-149 en el estado actual de la rama).
  - No se modifica el contenido del `<p>`, ni `pluralizeWod`, ni
    `hasActiveFilters`, ni el bloque `wod-empty-state` (154-180), que
    conserva su propia región de estado independiente.
- `frontend/src/components/wodFilter/WodsList.test.tsx`
  - Añadir aserciones sobre `role="status"` y `aria-live="polite"` en el
    contador para los casos ya cubiertos por #230 (con filtros, sin
    filtros, singular, cero coincidencias), sin duplicar los tests de texto
    ya existentes: se extienden los tests existentes con una aserción de
    atributos, en vez de crear tests paralelos.

## Fuera de alcance (confirmado)

- No se toca `WodsView.tsx` ni `WodsPage.tsx`: loading/error se resuelven ahí
  y nunca llegan a montar el contador.
- No se toca el bloque `wod-empty-state`: ya tiene su propia región de
  estado desde antes de #230/#231.
- No se extrae ningún hook o componente de accesibilidad compartido: es un
  atributo puntual sobre un elemento ya existente, consistente con "extraer
  solo cuando hay reutilización real".
- No se modifica `ExercisesList.tsx` (mismo patrón visual pero dominio de
  ejercicios, fuera del alcance de #230 y #231).

## Estrategia de verificación

1. `npm run lint` (frontend).
2. `npm run test` (frontend) — incluye `WodsList.test.tsx` actualizado y el
   resto de la suite, para detectar regresiones en filtros, texto del
   contador (#230) y estado vacío.
3. `npm run build` (frontend) — verifica TypeScript y build de producción.
4. Revisión manual: confirmar que `role="status"`/`aria-live="polite"` no
   se renderizan nunca durante `loading`/`error` (inspección de
   `WodsView.tsx`, sin necesidad de cambios) y que no hay dos regiones
   anunciando el mismo texto literal a la vez.

## Riesgos / decisiones

- Dos regiones de estado (`wod-count` y `wod-empty-state`) pueden "sonar"
  en el mismo render cuando los resultados pasan a cero. Se acepta porque
  anuncian contenidos distintos (el número y la explicación textual) y
  ambas ya son necesarias por separado (#230 y la empty-state previa); no
  se fusionan para no modificar el comportamiento de #230 fuera de alcance.
