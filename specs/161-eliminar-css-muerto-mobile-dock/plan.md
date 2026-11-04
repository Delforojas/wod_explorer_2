# Plan técnico

## Enfoque

1. Auditoría por selector de `frontend/src/styles/mobile-dock.css`.
2. Clasificación: usado / no usado / estatal / responsive / dinámico.
3. Retirada selectiva de bloques muertos.
4. Verificación.

## Auditoría

| Selector / bloque | Evidencia de uso | Decisión |
|---|---|---|
| `.mobile-navigation` | `MobileNavigation.tsx` | Usado |
| `.mobile-navigation-integrated` | `MobileNavigation.tsx` | Usado |
| `.mobile-navigation-items-N` | Generación dinámica (`mobile-navigation-items-${navigationItems.length}`) | Usado (N dinámico) |
| `.mobile-nav-list`, `.mobile-dock-item`, `.mobile-dock-label` | `NavigationLinks.tsx` | Usado |
| `.nav-link`, `.nav-link-active` | `NavigationLinks.tsx` | Usado |
| `.nav-icon` | `NavigationLinks.tsx` | Usado |
| `:hover`, `:active`, `:focus-visible`, reduced-motion | estados | Usado |
| media queries (hover/reduced/max-599/max-380/min-900) | responsive | Usado |
| `.mobile-more`, `.mobile-more-button`, `.mobile-more-icon`, `.mobile-more-menu`, `.mobile-more-list`, `.mobile-more-close` | Sin consumidores en TSX/CSS de esta hoja dejan de usarse para el dock actual | Muerto |
| `.mobile-navigation::before/::after { display: none; }` | Sin contenido generado | Muerto (considerar) |

## Retirada prevista

- Bloques del menú móvil (`mobile-more*`).
- Selector compartido con `.mobile-more-button` (dejar solo `.nav-link`).

## Verificación

- `npm run lint`, `npm run test`, `npm run build`, `git diff --check`.
- Revisión del diff limitada al archivo CSS.

## Riesgos

- Remover bloques no consumidos sin cambiar layout: verificado por árbol de clases.
- Validación manual: dock en móvil y escritorio, estados activos/hover/focus, auth.
