# Plan técnico

## Enfoque

Mantener `AuthActions` como frontera compartida para desktop y mobile, y
extraer su rama autenticada a un único `UserMenu`. El componente gestionará
solo el estado efímero de apertura y reutilizará el callback `onLogout` que ya
limpia la sesión y navega a `/`. No se tocará `AuthContext`, `authSession` ni
el contrato de las rutas privadas.

El panel se posicionará relativo al trigger mediante una prop explícita:
`bottom` para la Navbar superior/sidebar, con ancho máximo compatible con el
viewport. El dock mobile no renderizará acciones de cuenta y el CSS no cambiará
la dirección de forma automática según el espacio disponible.
El CSS reutilizará tokens y estados de navegación existentes, con una variante
mobile que conserva el tamaño de los botones del dock y una variante desktop
que muestra `Mi cuenta`.

## Componentes afectados

- `frontend/src/components/layout/AuthActions.tsx`: conservar login guest y
  delegar la rama autenticada al menú compartido.
- `frontend/src/components/layout/UserMenu.tsx`: trigger, panel, logout,
  placement, manejo de foco, Escape, clic fuera y cambio de ruta.
- `frontend/src/styles/navigation.css`: superficie, trigger, panel desktop,
  estados y reduced motion.
- `frontend/src/styles/mobile-dock.css`: mantener únicamente las acciones de
  navegación del dock mobile sin estilos residuales del menú de cuenta.
- `frontend/src/components/layout/AuthActions.test.tsx` o un test de
  presentación equivalente: ramas guest/autenticada y contrato accesible del
  menú cerrado, según las capacidades actuales de Vitest.
- `frontend/src/components/layout/UserMenu.test.tsx` o helpers de presentación:
  cubrir la lógica verificable sin introducir dependencias de testing nuevas.
- `specs/105-authenticated-user-dropdown/tasks.md`: sincronización final con el
  estado real.

## Estrategia de implementación

1. Confirmar la estructura actual de AuthActions, Navbar, MobileNavigation y
   rutas privadas antes de editar.
2. Implementar `UserMenu` con `useState`, refs, `useEffect` y `useId`; cerrar
   por Escape, fuera y logout, restaurando foco al trigger cuando corresponda.
   Hacer que `AuthActions` remonte el menú cuando cambia la ubicación para cerrar
   también al navegar sin duplicar estado de ruta dentro del menú.
3. Integrarlo en `AuthActions` sin cambiar la rama guest ni duplicar el
   callback de logout.
4. Añadir estilos desktop/mobile con tokens existentes, selectores explícitos de
   placement, focus-visible, estados hover apropiados y `prefers-reduced-motion`.
5. Añadir pruebas compatibles con el entorno actual. Las interacciones que no
   puedan ejecutarse en el entorno Node sin DOM se dejarán como validación
   manual explícita, sin añadir una dependencia solo para ocultar esa
   limitación.
6. Sincronizar `tasks.md` después de la implementación real y antes de revisar
   o commitear.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión de alcance y estados staged/unstaged.
- Validación manual en desktop y mobile: guest, autenticado, apertura/cierre,
  Escape, clic fuera, navegación, logout, foco, overflow y reduced motion.
