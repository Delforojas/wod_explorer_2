# Plan técnico

## Enfoque

Añadir un contador de caracteres dentro de `WodsList.tsx`, reutilizando el
estado `search` ya existente y el contenedor `.wod-search`. No se introduce
estado nuevo: el contador se deriva directamente de `search.length` en cada
render (sin `useMemo`, dado que es una operación O(1) sobre una cadena ya en
memoria).

Se añade una función local `pluralizeCharacterCount(count)` (mismo patrón que
`pluralizeWod`) que devuelve `"1 carácter"` o `"N caracteres"`, gestionando el
cambio de acento singular/plural (`carácter` → `caracteres`) de forma
explícita (no por concatenación de sufijo).

El contador se renderiza como un `<p>` discreto justo debajo del control de
búsqueda, dentro de `.wod-search`, y solo cuando `search.length > 0`. Se
reutiliza el espaciado ya existente del contenedor (`gap: var(--space-3)`),
añadiendo una única regla CSS nueva y mínima para el tamaño/color del texto,
consistente con `.wod-count` / `.exercise-count`.

### Decisión: sin `aria-live`

A diferencia del contador de resultados (`.wod-count`, Issue #231), este
contador cambia en cada pulsación de tecla. Anunciarlo con
`role="status" aria-live="polite"` en cada carácter escrito generaría ruido
excesivo para usuarios de lectores de pantalla (que ya reciben el eco de cada
carácter tecleado por el propio control del input). Los criterios de
aceptación de la Issue no piden anuncio accesible específico para este
contador, así que se mantiene como texto visible discreto, sin región viva,
evitando ARIA no solicitado por la Issue ni justificado por un problema de
accesibilidad real.

## Componentes afectados

- `frontend/src/components/wodFilter/WodsList.tsx`: nueva función
  `pluralizeCharacterCount` y nuevo bloque JSX condicional bajo el control de
  búsqueda.
- `frontend/src/styles/resources.css`: nueva regla `.wod-search-char-count`
  (texto discreto, mismo patrón visual que `.wod-count`).
- `frontend/src/components/wodFilter/WodsList.test.tsx`: nuevas pruebas de
  comportamiento.

## Estrategia de implementación

1. Confirmar que no existe contador de caracteres equivalente (ya
   documentado en `spec.md`).
2. Añadir `pluralizeCharacterCount` en `WodsList.tsx`.
3. Renderizar el contador condicionalmente (`search.length > 0`) dentro de
   `.wod-search`, tras `.catalog-search-control`.
4. Añadir la regla CSS `.wod-search-char-count` en `resources.css`.
5. Añadir pruebas en `WodsList.test.tsx`:
   - escribir `Fran` → se muestra `4 caracteres`.
   - escribir un único carácter → se muestra `1 carácter`.
   - buscador vacío → el contador no se renderiza.
   - escribir texto y pulsar Escape → el campo y el contador se limpian.
6. Ejecutar lint, tests y build del frontend.

## Verificación

- Las nuevas pruebas fallan si el contador no se muestra, muestra el número
  incorrecto, usa mal el singular/plural, o no desaparece al limpiar (botón o
  Escape).
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/` deben
  finalizar sin errores.
