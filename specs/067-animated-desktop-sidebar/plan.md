# Plan: Collapsible Animated Desktop Sidebar

## Enfoque de implementación

1. **Estado global del sidebar** - Usar `localStorage` para persistir el estado colapsado/expandido, con estado React en `AppLayout` para controlar la UI

2. **Componentes nuevos**:
   - `SidebarToggle` - Botón de expandir/colapsar con aria-label y aria-expanded
   - `DesktopSidebar` - Wrapper que maneja los dos estados visuales

3. **Modificaciones a componentes existentes**:
   - `Navbar.tsx` - Integrar toggle y mover DesktopNavigation al sidebar
   - `AppLayout.tsx` - Manejar estado del sidebar, pasarlo a Navbar, ajustar padding
   - `DesktopNavigation.tsx` - Adaptar para funcionar dentro del sidebar colapsable
   - `NavigationLinks.tsx` - Soportar modo colapsado (solo iconos + tooltips)

4. **CSS en `navigation.css`**:
   - Variables CSS para anchos (--sidebar-width-expanded, --sidebar-width-collapsed)
   - Transiciones suaves para width, opacity, transform
   - Media query @media (min-width: 900px) para desktop
   - `prefers-reduced-motion` para deshabilitar animaciones
   - Tooltips CSS para iconos en estado colapsado

5. **Integración**:
   - `AppLayout` maneja estado `sidebarCollapsed`
   - `Navbar` recibe `sidebarCollapsed` y `onToggleSidebar`
   - Persistencia en `localStorage` (clave: `sidebar-collapsed`)

## Capas afectadas
- `frontend/src/components/layout/Navbar.tsx`
- `frontend/src/components/layout/AppLayout.tsx`
- `frontend/src/components/layout/DesktopNavigation.tsx`
- `frontend/src/components/layout/NavigationLinks.tsx`
- `frontend/src/components/layout/SidebarToggle.tsx` (nuevo)
- `frontend/src/components/layout/DesktopSidebar.tsx` (nuevo)
- `frontend/src/styles/navigation.css`

## Estrategia de verificación
1. `npm run lint` - Sin errores
2. `npm run test` - Tests pasan
3. `npm run build` - Build exitoso
4. Validación manual en 900px, 1024px, 1440px
4. Validación manual en 360px, 390px (mobile sin regresiones)
5. Verificar `prefers-reduced-motion`
6. Verificar shortcut `Cmd/Ctrl + B`