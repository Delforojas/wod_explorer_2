# Spec: Collapsible Animated Desktop Sidebar

## Objetivo
Implementar una sidebar desktop colapsable con dos estados (expandida ~248px, colapsada ~72px) que anime suavemente la transición y mantenga la navegación existente funcional.

## Alcance
- Sidebar desktop colapsable/expandible con animación suave
- Toggle button para expandir/colapsar
- Estado expandido: logo + labels + iconos
- Estado colapsado: solo iconos + logo identificado
- Integración con arquitectura existente (navigation.ts, NavigationLinks, etc.)
- Respetar `prefers-reduced-motion`
- Shortcut opcional `Cmd/Ctrl + B`
- Mantener dock móvil intacto

## Comportamiento esperado

### Expandida (~248px)
- Logo WOD EXPLORER visible
- Navegación pública: Ejercicios, WODs
- Sección "Mi actividad": Mis WODs, Crear WOD, Historial, Mis marcas, Mejores marcas
- Zona inferior: Usuario autenticado + Cerrar sesión

### Colapsada (~72px)
- Solo logo/identificador WOD Explorer
- Iconos de cada opción
- Estado activo visible
- Toggle para expandir
- Labels ocultos (no ocupan espacio)

### Desktop
- Animación suave de ancho (transición ~300ms)
- Iconos siempre visibles
- Estado activo mantenido
- Tooltip/title en iconos cuando colapsado
- Ajuste correcto de `.app-layout` (padding-left)
- Sin saltos bruscos en contenido principal

### Mobile
- No reemplazar navegación móvil existente
- Dock glass actual mantenido
- Breakpoint 900px respetado

## Restricciones
- No Tailwind, no shadcn, no nuevas dependencias de animación
- CSS en `navigation.css` únicamente
- `index.css` sigue como entry point
- `navigation.ts` fuente de verdad
- Accesibilidad completa (teclado, aria, focus, reduced motion)
- Shortcut opcional `Cmd/Ctrl + B`

## Criterios de aceptación
- Sidebar expandida funciona
- Sidebar colapsa a icon rail
- Sidebar re-expande
- Contenido principal adapta ancho
- Sin saltos visuales bruscos
- Iconos visibles al colapsar
- Labels desaparecen al colapsar
- Ruta activa identificada
- Usuario/logout funcionan
- Navegación existente funciona
- Dock móvil sin cambios
- Menú "Más" móvil funciona
- Sin Tailwind/shadcn
- Sin duplicar rutas
- `prefers-reduced-motion` contemplado
- Sin errores consola
- lint/test/build pasan