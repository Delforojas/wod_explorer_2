# Plan técnico

## Componentes afectados

- `frontend/src/views/login/LoginView.tsx`: botón informativo entre el campo de contraseña y las alertas/acción de submit.
- `frontend/src/styles/login.css`: alineación derecha, tipografía, estado deshabilitado y comportamiento responsive del control.
- `frontend/src/views/login/LoginView.test.tsx`: render estático del estado no operativo y de la posición respecto al submit.

## Estrategia

1. Renderizar un `<button type="button" disabled>` con la pregunta y una etiqueta visible «Próximamente» inmediatamente después del campo Contraseña.
2. Estilizarlo como acción secundaria alineada a la derecha, sin convertirlo en enlace ni añadir interacción. El estado deshabilitado explica visualmente su indisponibilidad y no entra en el orden de tabulación.
3. Añadir una prueba de markup que verifique el texto, `type="button"`, `disabled` y su ubicación antes de Iniciar sesión; mantener las props y el submit sin cambios.
4. Ejecutar pruebas dirigidas y los checks frontend existentes.

## Verificación

- Ejecutar la prueba dirigida de `LoginView`.
- Ejecutar `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Revisar manualmente `/login` en escritorio y móvil, confirmando que el control informa Próximamente, no navega ni envía el formulario, y que el login existente funciona.
