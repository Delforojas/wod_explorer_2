# Tasks: Shell global de la aplicación

## Orden y dependencias

1. Crear la organización `components/layout` y trasladar el `Navbar` existente.
2. Implementar `AppLayout` y `Footer`.
3. Integrar el layout alrededor de las rutas actuales.
4. Añadir CSS estructural mínimo.
5. Ejecutar verificaciones y revisar alcance.

Las tareas 2 y 3 dependen de la organización del `Navbar`. La tarea 4 depende
de que la composición del layout esté integrada. La tarea 5 depende de todas
las tareas anteriores.

## Tareas ejecutables

- [x] Crear `src/components/layout`.
- [x] Trasladar o reutilizar `Navbar` dentro de `components/layout` sin cambiar
  sus enlaces ni destinos.
- [x] Crear `AppLayout` con `Navbar`, `main` para `children` y `Footer`.
- [x] Crear un `Footer` global básico sin diseño visual definitivo.
- [x] Envolver el `Routes` actual de `App` con `AppLayout` sin modificar las
  páginas ni las rutas existentes.
- [x] Añadir únicamente estilos estructurales para altura, ancho, contenido
  principal y funcionamiento en viewport móvil.
- [x] Confirmar que `vite.config.ts` mantiene el puerto `5174`.
- [x] Confirmar que la integración actual de login y Google OAuth no cambia.
- [x] Confirmar que no se introduce navegación responsive de la Issue #19 ni
  dependencias nuevas.

## Verificaciones

- [x] `npm run lint` desde `frontend/`.
- [x] `npm run build` desde `frontend/`.
- [x] Revisar `git diff --check`.
- [x] Revisar que las rutas `/`, `/exercises`, `/wods`, `/login` y
  `/auth/google/callback` siguen declaradas.
- [ ] Validar manualmente el shell en desktop y viewport móvil.
- [x] Validar mediante ejecución local que el shell sirve las rutas existentes.
- [x] Revisar que el contenido de cada página aparece entre Navbar
  y Footer.
- [x] Revisar que el diff no contiene rediseño visual ni cambios de feature.
