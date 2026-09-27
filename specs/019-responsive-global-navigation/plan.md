# Plan: Navegación global responsive

## Enfoque

Mantener `AppLayout` como shell y convertir `Navbar` en un orquestador pequeño
que derive el estado autenticado del token local existente. La definición de
enlaces vivirá en un único módulo compartido y será consumida por las variantes
desktop y mobile.

La variante desktop renderizará directamente los enlaces públicos, el grupo
privado `Mi actividad` y las acciones de sesión. La variante mobile tendrá un
botón real con estado accesible y un panel de navegación separado. El panel se
cerrará al navegar.

Las páginas privadas serán componentes estructurales sin datos. Un guard de
ruta mínimo redirigirá a `/login` cuando no haya token, sin introducir una
nueva capa de autenticación ni validar sesiones contra backend.

## Componentes y archivos afectados

- `frontend/src/components/layout/Navbar.tsx`: orquestación del shell de
  navegación y estado del menú.
- `frontend/src/components/layout/navigation.ts`: configuración única de
  enlaces públicos y privados.
- `frontend/src/components/layout/NavigationLinks.tsx`: render reutilizable
  de listas de navegación.
- `frontend/src/components/layout/DesktopNavigation.tsx`: navegación desktop.
- `frontend/src/components/layout/MobileNavigation.tsx`: navegación mobile.
- `frontend/src/components/layout/MobileMenuButton.tsx`: control accesible del
  menú mobile.
- `frontend/src/components/layout/AuthActions.tsx`: login, usuario y logout.
- `frontend/src/components/auth/RequireAuth.tsx`: protección estructural de
  rutas privadas mediante el token local existente.
- `frontend/src/pages/MyWodsPage.tsx`: placeholder de Mis WODs.
- `frontend/src/pages/HistoryPage.tsx`: placeholder de Historial.
- `frontend/src/pages/PersonalBestsPage.tsx`: placeholder de Mejores marcas.
- `frontend/src/App.tsx`: registro de las rutas privadas.
- `frontend/src/index.css`: reglas mínimas desktop/mobile y foco visible.

No se modificarán APIs, `LoginPage`, contratos de backend, dependencias ni
`vite.config.ts`.

## Cambios técnicos previstos

1. Definir los enlaces públicos y privados una sola vez.
2. Implementar los componentes de navegación desktop y mobile sobre esa
   configuración.
3. Añadir `AuthActions` y derivar la visibilidad privada del token local.
4. Añadir botón con `aria-expanded`, `aria-controls` y cierre al navegar.
5. Crear `RequireAuth` y tres páginas placeholder sin acceso a datos.
6. Registrar las tres rutas privadas dentro de la definición de `Routes`.
7. Añadir CSS estructural para breakpoints, listas, panel mobile, foco y
   distribución sin rediseñar la identidad visual.

## Estrategia de verificación

- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Ejecutar `git diff --check`.
- Comprobar que no cambia `package.json`, `vite.config.ts` ni las APIs.
- Inspeccionar que cada destino está definido una sola vez y se usa en ambas
  variantes.
- Ejecutar el servidor en `5174` y comprobar las rutas públicas y privadas.
- Validar manualmente estados visitante/autenticado, menú cerrado/abierto,
  teclado, foco visible, cierre tras navegación y viewport mobile.
