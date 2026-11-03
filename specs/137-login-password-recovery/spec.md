# Issue #137: acceso visual a recuperación de contraseña

## Objetivo

Mostrar en `/login` el acceso textual «¿Olvidaste tu contraseña?» bajo el campo Contraseña, comunicando de forma explícita que la recuperación estará disponible próximamente.

## Alcance

- Añadir un botón de texto nativo, deshabilitado y con la indicación «Próximamente», entre el campo Contraseña y el botón Iniciar sesión.
- Mantener el estilo oscuro, espaciado, responsive y el foco visible de los controles existentes.
- Mantener el control no operativo: no debe navegar, abrir una pantalla, enviar datos ni invocar autenticación.
- Añadir cobertura de presentación que demuestre posición, estado deshabilitado e indicación accesible.

## Fuera de alcance

- Recuperación o restablecimiento de contraseña, rutas, endpoints, correos, tokens, almacenamiento y cambios de autenticación.
- Modificaciones a la validación o envío del login existente.

## Comportamiento esperado

- El texto aparece debajo de Contraseña y antes de Iniciar sesión.
- El control comunica «Próximamente» y está deshabilitado, por lo que no promete una recuperación disponible.
- El formulario de login conserva sus campos, estados de error/éxito y acciones existentes.

## Criterios de aceptación

- [ ] `/login` muestra «¿Olvidaste tu contraseña?» bajo Contraseña y antes de Iniciar sesión.
- [ ] El diseño mantiene coherencia en escritorio y móvil.
- [ ] El estado pendiente queda explícito y no inicia ningún flujo de recuperación.
- [ ] El inicio de sesión existente no presenta regresiones.

## Restricciones

- Reutilizar React, CSS y patrones de autenticación existentes.
- Usar un control nativo y no operativo, sin rutas ni dependencias nuevas.
- Mantener idioma español y semántica accesible.
