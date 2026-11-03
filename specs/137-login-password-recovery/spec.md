# Issue #137: accesos a autenticación en login y dock móvil

## Objetivo

Mejorar los accesos a autenticación con dos cambios de interfaz: un acceso textual no operativo de recuperación en `/login` y el destino «Entrar» en el dock móvil para visitantes.

## Alcance

- Añadir un botón de texto nativo, deshabilitado y con la indicación «Próximamente», entre el campo Contraseña y el botón Iniciar sesión.
- Mantener el estilo oscuro, espaciado, responsive y el foco visible de los controles existentes.
- Mantener el control no operativo: no debe navegar, abrir una pantalla, enviar datos ni invocar autenticación.
- Añadir cobertura de presentación que demuestre posición, estado deshabilitado e indicación accesible.
- Reutilizar el dock móvil existente para mostrar Inicio, Ejercicios, WODs y Entrar a visitantes.
- Hacer que Entrar navegue a la ruta existente `/login` y tenga estado activo en esa ruta.
- Ocultar Entrar cuando existe sesión, conservando los destinos autenticados actuales porque no existe una ruta de cuenta en el dock.
- Mantener los cuatro elementos visibles sin desbordamiento en pantallas móviles pequeñas y respetar el área segura inferior existente.

## Fuera de alcance

- Recuperación o restablecimiento de contraseña, rutas, endpoints, correos, tokens, almacenamiento y cambios de autenticación.
- Modificaciones a la validación o envío del login existente.
- Rutas ficticias de cuenta o cambios en la navegación existente de usuarios autenticados.

## Comportamiento esperado

- El texto aparece debajo de Contraseña y antes de Iniciar sesión.
- El control comunica «Próximamente» y está deshabilitado, por lo que no promete una recuperación disponible.
- El formulario de login conserva sus campos, estados de error/éxito y acciones existentes.
- Sin sesión, el dock móvil muestra Inicio, Ejercicios, WODs y Entrar; Entrar abre `/login` y se muestra activo allí.
- Con sesión, Entrar no aparece y el dock mantiene sus destinos autenticados actuales.

## Criterios de aceptación

- [ ] `/login` muestra «¿Olvidaste tu contraseña?» bajo Contraseña y antes de Iniciar sesión.
- [ ] El diseño mantiene coherencia en escritorio y móvil.
- [ ] El estado pendiente queda explícito y no inicia ningún flujo de recuperación.
- [ ] El inicio de sesión existente no presenta regresiones.
- [ ] El dock móvil de visitantes muestra exactamente Inicio, Ejercicios, WODs y Entrar.
- [ ] Entrar navega a `/login` y se marca activo en esa ruta.
- [ ] El dock no se corta ni desborda en pantallas pequeñas y no muestra Entrar con sesión iniciada.

## Restricciones

- Reutilizar React, CSS y patrones de autenticación existentes.
- Usar un control nativo y no operativo para recuperación, y el `NavLink` existente para el destino real `/login`.
- Mantener idioma español y semántica accesible.
