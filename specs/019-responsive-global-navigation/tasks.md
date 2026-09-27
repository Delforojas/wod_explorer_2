# Tasks: Navegación global responsive

## Orden y dependencias

1. Definir los destinos compartidos de navegación.
2. Implementar las variantes desktop/mobile y las acciones de sesión.
3. Crear las páginas placeholder y su protección de ruta.
4. Integrar rutas y estilos estructurales.
5. Ejecutar verificaciones automáticas y revisión de alcance.

La tarea 2 depende de la tarea 1. La tarea 3 puede prepararse en paralelo, pero
la integración de rutas de la tarea 4 depende de ambas. La tarea 5 depende de
todas las anteriores.

## Tareas ejecutables

- [x] Crear una única configuración para enlaces públicos y privados.
- [x] Crear `NavigationLinks` reutilizable para desktop y mobile.
- [x] Separar `DesktopNavigation`, `MobileNavigation`, `AuthActions` y
  `MobileMenuButton` de `Navbar`.
- [x] Mostrar la navegación pública para visitantes.
- [x] Mostrar `Mi actividad` y sus tres destinos solo con token local.
- [x] Implementar apertura/cierre del menú mobile y cierre al navegar.
- [x] Añadir estado accesible al botón mobile con `aria-expanded` y
  `aria-controls`.
- [x] Añadir foco visible y estructura semántica de navegación.
- [x] Crear `RequireAuth` sin llamadas API ni autenticación nueva.
- [x] Crear placeholders para Mis WODs, Historial y Mejores marcas.
- [x] Registrar `/my-wods`, `/history` y `/personal-bests`.
- [x] Añadir CSS estructural responsive sin diseño visual definitivo.
- [x] Confirmar que no se modifican APIs, dependencias ni rutas públicas.

## Verificaciones

- [x] `npm run lint` desde `frontend/`.
- [x] `npm run build` desde `frontend/`.
- [x] `git diff --check`.
- [x] Confirmar que las opciones de navegación se definen una sola vez.
- [x] Confirmar que visitantes no ven enlaces privados.
- [x] Confirmar que usuarios con token ven los tres destinos privados.
- [x] Confirmar que las rutas privadas redirigen a `/login` sin token.
- [x] Confirmar respuesta HTTP del servidor en `5174` para rutas públicas y
  privadas.
- [ ] Validar manualmente desktop y mobile, incluyendo menú abierto/cerrado.
- [ ] Validar manualmente teclado, foco visible y cierre tras navegación.
- [x] Revisar que el diff no contiene lógica de negocio, APIs ni diseño final.
