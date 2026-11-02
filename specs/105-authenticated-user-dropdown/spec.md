# SDD: Menú de cuenta autenticada

## Objetivo

Dar a los usuarios autenticados un único menú de cuenta reutilizable en la
navegación desktop y mobile para ejecutar `Cerrar sesión`, manteniendo las
acciones públicas para visitantes y la lógica de sesión existente.

## Alcance

- Reutilizar `AuthProvider/useAuth` y el callback de logout existente.
- Sustituir el control de logout aislado por un `UserMenu` compartido dentro de
  `AuthActions`.
- Mostrar el menú solo cuando `isAuthenticated` sea verdadero.
- Usar un trigger con avatar circular, texto `Mi cuenta` cuando el layout lo
  permita y chevron; el panel solo tendrá `Cerrar sesión`.
- Recibir un `placement` explícito en `UserMenu`: `bottom` para la Navbar
  superior/sidebar; el dock inferior no renderiza acciones de cuenta.
- Cerrar el panel al ejecutar logout, pulsar `Escape`, hacer clic fuera o
  cambiar de ruta.
- Mantener la redirección existente a `/` y la protección de rutas privadas.
- Aplicar tokens, superficies, focus ring y tamaños táctiles del sistema actual
  en desktop y mobile.
- Mantener el panel dentro del viewport mobile y evitar controles duplicados.
- Respetar `prefers-reduced-motion`.

## Comportamiento esperado

1. Un visitante ve las acciones públicas actuales y no ve el menú de cuenta.
2. Un usuario autenticado local o de Google ve el mismo `UserMenu` compartido
   en el sidebar desktop o en la Navbar superior responsive.
3. Al abrirlo aparece únicamente `Cerrar sesión`, con icono y nombre accesible.
4. El trigger expone `aria-expanded` y `aria-controls`; el foco permanece
   visible y el primer control del panel puede operarse con teclado.
5. `Escape`, clic fuera y navegación cierran el panel; `Escape` devuelve el foco
   al trigger.
6. `Cerrar sesión` llama una sola vez a `useAuth().signOut()` a través del
   callback existente y navega a `/`.
7. Tras cerrar sesión, el menú desaparece y `RequireAuth` continúa bloqueando
   las rutas privadas.
8. El layout no desborda ni corta el panel en desktop, mobile o safe area.

## Criterios de aceptación

- [ ] Los visitantes no ven el menú de cuenta y conservan login.
- [ ] Los autenticados ven un menú de cuenta consistente en el sidebar desktop y
      la Navbar superior responsive.
- [ ] El panel contiene solo `Cerrar sesión`.
- [ ] Logout limpia la sesión local y navega a `/` sin revocar la sesión global
      de Google.
- [ ] Una ruta privada exige autenticación después del logout.
- [ ] Escape, clic fuera, navegación y teclado funcionan con foco accesible.
- [ ] La orientación es `bottom` en Navbar/sidebar responsive y el dock no
      contiene ninguna acción de cuenta, sin depender de posicionamiento
      automático.
- [ ] El menú es responsive, no se duplica y no se corta en el viewport.
- [ ] No se modifican endpoints, JWT, backend ni reglas de dominio.
- [ ] Las verificaciones automáticas y la validación manual específica pasan.

## Restricciones

- No añadir rutas de perfil, preferencias ni acciones ficticias.
- No introducir otra librería de UI, estado o iconos.
- No cambiar el contrato de autenticación ni el almacenamiento JWT.
- No rediseñar la navbar/sidebar fuera de los estilos necesarios para el menú.

## Fuentes

- GitHub Issue #105.
- `frontend/src/auth/AuthContext.tsx` y `frontend/src/auth/useAuth.ts`.
- `frontend/src/components/layout/AuthActions.tsx`.
- `frontend/src/components/layout/Navbar.tsx`.
- `frontend/src/components/layout/MobileNavigation.tsx`.
- `frontend/src/components/auth/RequireAuth.tsx`.
- `DESIGN.md` y `frontend/AGENTS.md`.
