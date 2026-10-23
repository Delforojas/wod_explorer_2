# Plan de implementación

## Contexto revisado

- `DOMAIN.md`, `PRODUCT.md`, `DESIGN.md`, `frontend/AGENTS.md`, `frontend/package.json` y `frontend/src/index.css`.
- El frontend usa React, TypeScript, Vite y CSS estándar. No dispone de Tailwind ni de una estrategia de carga local o remota de fuentes.
- Los consumidores reales incluyen botones, inputs, badges, cards/surfaces, sidebar desktop, bottom navigation y estados de error/éxito.

## Mapeo 21st → WOD Explorer

| Token 21st | Valor | Token/selector WOD Explorer | Decisión |
| --- | --- | --- | --- |
| `primary-500` | `#3758f9` | `--color-accent`, primary, navegación activa | ADOPTAR |
| `primary-600` | `#2237ee` | hover primary | ADOPTAR |
| `primary-300` | `#91aeff` | borde de foco de inputs | ADOPTAR |
| `neutral-brand-color` | `#7592ff` | referencia secundaria primary | ADOPTAR |
| `background-50` | `#030712` | `--color-bg`, fondo de la aplicación | ADOPTAR |
| `background-100` | `#111827` | `--color-bg-raised`, fondo de navegación | ADOPTAR |
| `background-soft-200` | `#1f2937` | `--color-surface-raised` | ADOPTAR |
| `card-100` | `#1e2634` | `--color-surface` | ADOPTAR |
| `card-200` | `#ffffff08` | superficie interactiva | ADOPTAR |
| `border-base-50` | `#1f2937` | borde estándar | ADOPTAR |
| `title-50` | `#ffffffcc` | texto principal | ADOPTAR |
| `text-50` | `#9ca3af` | texto secundario | ADOPTAR |
| `text-200` | `#6b7280` | texto tenue y placeholders | ADOPTAR |
| `error-500` | `#ef4444` | error | ADOPTAR |
| `success-500` | `#22c55e` | éxito | ADOPTAR |
| `warning-500` | `#eab308` | advertencia | ADOPTAR |
| `info-500` | `#0ea5e9` | información y enlaces | ADOPTAR |
| primary button | valores provistos | `.button-primary` | ADOPTAR |
| outline/disabled/error buttons | valores provistos | botones base, secundarios, disabled y destructivos | ADOPTAR |
| input | valores provistos | `input`, `select`, `textarea`, labels y foco | ADOPTAR |
| sidebar | valores provistos | `.site-navbar`, `.nav-link` desktop | ADOPTAR |
| mobile navigation | valores provistos | `.mobile-navigation`, enlaces y estado activo | ADOPTAR |
| badges base/primary/error/warning/success | valores provistos | `.badge` y variantes con uso semántico | ADOPTAR |
| shadows | escala provista | `--shadow-surface`, `--shadow-raised`, `--shadow-modal` | ADOPTAR |
| `font-sans` | `"DM Sans", sans-serif` | `--font-sans` | ADAPTAR: se declara con fallbacks del sistema; no existe infraestructura de fuentes y no se añade una importación remota. |
| tabs, checkboxes, dropdowns, toggle, skeleton y animación | valores provistos | sin consumidor real actual | DESCARTAR: la Issue prohíbe trasladar tokens sin correspondencia semántica real. |
| light theme y tokens marketing | valores provistos | fuera del sistema actual | DESCARTAR: el producto mantiene únicamente el tema oscuro y no tiene esos consumidores. |

## Cambios previstos

- `frontend/src/index.css`: redefinir tokens globales y sus consumidores compartidos sin cambiar estructura o comportamiento.
- `DESIGN.md`: sustituir la tabla de roles visuales, sombras y patrones de controles por las decisiones adoptadas.

## Corrección tras validación manual no aprobada

La primera validación determinó que el cambio era poco perceptible: los tokens estaban declarados, pero los submits y acciones existentes seguían usando el control genérico, las listas no consumían surfaces y sidebar/bottom navigation compartían el mismo fondo que el canvas.

- Los submits existentes pasan a usar primary; las acciones existentes de soporte usan outline y las eliminaciones ya existentes usan destructive, sin modificar handlers.
- El canvas principal usa el nivel dark elevado, mientras sidebar y bottom navigation mantienen el nivel base. Los resource rows, formularios y detalles consumen surface.
- El estado activo de navegación móvil añade un fondo primary translúcido, además del color e indicador existentes.
- Error y éxito usan fondo semántico translúcido, borde y texto.
- Se carga DM Sans mediante el stylesheet oficial de Google Fonts con `display=swap`; no se añade ninguna dependencia de styling.

## Verificación

- Ejecutar `21st review` sobre los archivos modificados, `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Revisar manualmente móvil, tablet y escritorio para navegación, formularios, botones, focus-visible y ausencia de overflow horizontal.
