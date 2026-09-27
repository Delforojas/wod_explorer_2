# SDD: Shell global de la aplicación

## Objetivo

Crear la estructura global compartida de WOD Explorer para que las páginas
existentes se rendericen dentro de un layout común con navegación, contenido
principal y footer.

La Issue se limita a la composición estructural del layout. No introduce el
diseño visual definitivo ni cambia la funcionalidad de las páginas o rutas
existentes.

## Alcance

- Crear `AppLayout` como contenedor común de la aplicación.
- Organizar `AppLayout`, `Navbar` y `Footer` bajo `src/components/layout`.
- Mantener `Navbar` como estructura base de navegación global.
- Renderizar las rutas existentes dentro de un elemento `main` compartido.
- Añadir un footer global básico.
- Aplicar únicamente CSS estructural para validar el layout en desktop y móvil.
- Mantener el puerto de desarrollo `5174`.
- Mantener sin cambios la integración existente con backend y Google OAuth.

## Comportamiento esperado

- `AppLayout` recibe el contenido de página mediante composición de React.
- La navegación actual mantiene sus enlaces y destinos: `/`, `/exercises` y
  `/wods`.
- Las rutas existentes permanecen disponibles: `/`, `/exercises`, `/wods`,
  `/login` y `/auth/google/callback`.
- Todas las páginas se renderizan entre el `Navbar` y el `Footer`.
- El contenido de página se encuentra dentro de un elemento semántico `main`.
- El layout ocupa la altura disponible sin introducir navegación responsive ni
  estados de autenticación.
- El botón y la ruta de Google OAuth conservan su comportamiento actual.

## Criterios de aceptación

- [ ] Existe un `AppLayout` reutilizable.
- [ ] `Navbar`, `Main` y `Footer` tienen responsabilidades claramente separadas.
- [ ] Las páginas pueden renderizar su contenido dentro de `AppLayout`.
- [ ] No existe duplicación innecesaria de estructura entre páginas.
- [ ] Los componentes globales están organizados dentro de `components/layout`.
- [ ] La estructura funciona correctamente en desktop.
- [ ] La estructura funciona correctamente en viewport móvil.
- [ ] Se utiliza únicamente el CSS necesario para validar estructura y responsive.
- [ ] No se introduce todavía el diseño visual definitivo.
- [ ] No se utiliza ningún MCP de diseño para implementar esta Issue.

## Restricciones

- No implementar la navegación responsive de la Issue #19.
- No rediseñar colores, tipografías, iconografía, animaciones ni botones.
- No cambiar la funcionalidad de las páginas existentes.
- No cambiar rutas ni contratos de API.
- No modificar la integración con backend ni Google OAuth.
- No añadir dependencias.
- No utilizar un MCP de diseño.
- Mantener el frontend en el puerto `5174`.
