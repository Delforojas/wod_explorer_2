# Tareas

## Preparacion y configuracion

- [x] Confirmar la cadena Issue -> arquitectura #23 -> SDD -> implementacion.
- [x] Externalizar `FRONTEND_URL` y la configuracion de rutas OAuth por entorno.
- [x] Configurar el proxy o URL backend de `/oauth2` y `/login/oauth2` en
      desarrollo.

## Persistencia y backend

- [x] Crear la migracion versionada para `password_hash` nullable y
      `oauth_login_handoffs`.
- [x] Crear entidad, repositorio y servicio de handoff con hash, expiracion y
      consumo atomico.
- [x] Reforzar la resolucion Google con `sub`, email verificado y username
      unico sin auto-vinculacion por email.
- [x] Configurar el estado OAuth temporal y el handler de fallo de Spring
      Security sin convertir la API en stateful.
- [x] Sustituir el redirect `#token` por la creacion de handoff opaco.
- [x] Exponer `POST /api/auth/google/exchange` con el JWT de texto existente.
- [x] Mantener el logout de la aplicacion mediante la sesion de #91.

## Frontend

- [x] Implementar `GoogleCallbackPage` con estados, limpieza de URL y
      navegacion tras `useAuth().signIn`.
- [x] Añadir el servicio API y tipos para el intercambio.
- [x] Cubrir cancelacion, codigo ausente, codigo invalido, conflicto y fallo de
      intercambio con mensajes recuperables.
- [x] Documentar el riesgo XSS de `localStorage` sin migrar a cookies.
- [x] Actualizar la documentacion OAuth con el estado implementado y el riesgo
      residual de `localStorage`.

## Tests y cierre local

- [x] Añadir tests backend de identidad, handoff, exchange y seguridad.
- [x] Añadir tests frontend de callback, errores, replay/expiry y logout.
- [x] Ejecutar lint, tests, build, package y diff check aplicables.
- [x] Revisar el SDD final y marcar solo tareas realmente verificadas.
- [ ] Crear commit local de Issue #93 sin push ni PR.
