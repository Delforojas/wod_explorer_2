# Auditoría de uso de CSS en mobile-dock.css (#161)

## Estado

- `main` @ `af54007ee3d0822335074078231e5a1ab14f589f`, árbol limpio salvo cambio local ajeno no versionado (`frontend/src/components/wodFilter/WodsList.tsx`).

## Selectores y evidencia

- `.mobile-navigation`, `.mobile-navigation-integrated`, `.mobile-navigation-items-N` (dinámico), `.mobile-nav-list`, `.mobile-dock-item`, `.mobile-dock-label`, `.nav-link`, `.nav-link-active`, `.nav-icon`: usados por `components/layout/*` y tests SSR.
- Estados (`:hover`, `:active`, `:focus-visible`), `prefers-reduced-motion`, media queries responsive: usados.
- Bloques `.mobile-more*`: contenedor, botón, icono, panel, lista y cierre sin consumidores en TSX/CSS funcional del dock; menu movido a patrón no consumido. Muertos para esta hoja.
- `.mobile-navigation::before/::after { display: none; }`: sin contenido generado; regla sin consumidor efectivo.

## Decisión

Retirar únicamente los bloques muertos del menú móvil (`mobile-more*`) y la regla sin contenido del pseudo-elemento, limitado al archivo `mobile-dock.css`.

## Retirada prevista

- Eliminar bloques de menú y selector con `mobile-more-button`.

## Resultado

- Verificación de lint, tests, build, `git diff --check`.
