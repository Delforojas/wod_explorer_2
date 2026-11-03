# Plan técnico

## Componentes afectados

- `frontend/src/views/login/LoginView.tsx`: botón informativo entre el campo de contraseña y las alertas/acción de submit.
- `frontend/src/styles/login.css`: alineación derecha, tipografía, estado deshabilitado y comportamiento responsive del control.
- `frontend/src/views/login/LoginView.test.tsx`: render estático del estado no operativo y de la posición respecto al submit.
- `frontend/src/components/layout/navigation.ts`: cuarto destino público Entrar con la ruta existente `/login`.
- `frontend/src/components/layout/NavigationLinks.tsx`: icono de usuario reutilizable para el nuevo destino.
- `frontend/src/components/layout/MobileNavigation.tsx`: clase de cantidad de elementos para el layout compacto del dock.
- `frontend/src/styles/mobile-dock.css`: cuatro columnas equitativas para visitantes en pantallas de hasta 380 px.
- `frontend/src/components/layout/NavigationPlacement.test.tsx`: cobertura de destinos públicos, navegación activa y ausencia de Entrar con sesión.

## Estrategia

1. Renderizar un `<button type="button" disabled>` con la pregunta y una etiqueta visible «Próximamente» inmediatamente después del campo Contraseña.
2. Estilizarlo como acción secundaria alineada a la derecha, sin convertirlo en enlace ni añadir interacción. El estado deshabilitado explica visualmente su indisponibilidad y no entra en el orden de tabulación.
3. Añadir una prueba de markup que verifique el texto, `type="button"`, `disabled` y su ubicación antes de Iniciar sesión; mantener las props y el submit sin cambios.
4. Añadir Entrar a `publicNavigation` para que `MobileNavigation` lo muestre solo al visitante y use el `NavLink` existente para navegación y estado activo.
5. Conservar el conjunto autenticado y ajustar exclusivamente la cuadrícula estrecha del dock para cuatro elementos públicos.
6. Ejecutar pruebas dirigidas y los checks frontend existentes.

## Verificación

- Ejecutar la prueba dirigida de `LoginView`.
- Ejecutar la prueba dirigida de `NavigationPlacement`.
- Ejecutar `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Revisar manualmente `/login` en escritorio y móvil, confirmando que el control informa Próximamente, no navega ni envía el formulario, que el dock de visitantes tiene cuatro destinos sin desbordamiento y que Entrar navega a `/login`.
