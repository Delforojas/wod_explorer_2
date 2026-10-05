# Tasks: Collapsible Animated Desktop Sidebar

- [x] 1. Crear componente `SidebarToggle` con accesibilidad (aria-label, aria-expanded, keyboard)
- [x] 2. Crear componente `DesktopSidebar` wrapper para estados expandido/colapsado
- [x] 3. Modificar `AppLayout.tsx` para manejar estado `sidebarCollapsed` (localStorage + React state)
- [x] 4. Modificar `Navbar.tsx` para recibir `sidebarCollapsed` y `onToggleSidebar`, integrar `SidebarToggle`
- [x] 5. Modificar `DesktopNavigation.tsx` para funcionar dentro del sidebar colapsable
- [x] 6. Modificar `NavigationLinks.tsx` para soportar modo colapsado (iconos + tooltips)
- [x] 7. Actualizar `navigation.css` con:
  - [x] Variables CSS para anchos sidebar
  - [x] Transiciones suaves (width, opacity, transform)
  - [x] Estilos expandido/colapsado
  - [x] Tooltips CSS para iconos colapsados
  - [x] `prefers-reduced-motion` deshabilita animaciones
  - [x] Ajuste padding-left de `.app-layout` según estado
- [x] 8. Agregar shortcut `Cmd/Ctrl + B` en `AppLayout`
- [x] 9. Verificar persistencia en `localStorage`
- [x] 10. Ejecutar verificaciones: lint, test, build
- [ ] 11. Validación manual desktop (900px, 1024px, 1440px)
- [ ] 12. Validación manual mobile (360px, 390px) - sin regresiones