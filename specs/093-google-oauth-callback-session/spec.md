# Issue #93: Callback y sesion de Google OAuth

## Objetivo

Completar el flujo Google OAuth aprobado en #23 para que la identidad validada
por Spring Security se convierta en una sesion JWT de WOD Explorer mediante un
handoff opaco, de un solo uso y de corta duracion.

## Alcance

- Mantener Authorization Code + OIDC gestionado por Spring Security.
- Usar una sesion HTTP temporal solo para conservar el estado de la transaccion
  OAuth; la API de WOD Explorer seguira usando JWT sin estado.
- Resolver identidades por `(GOOGLE, sub)` y exigir email verificado.
- Crear usuarios Google nuevos sin vincular automaticamente cuentas locales por
  email.
- Persistir handoffs usando solo un hash, expiracion y consumo atomico.
- Exponer `POST /api/auth/google/exchange` para obtener el JWT propio.
- Eliminar la redireccion con `#token=<JWT>`.
- Completar `GoogleCallbackPage` usando `AuthProvider` y `useAuth` existentes.
- Mantener el logout limitado a la sesion local de WOD Explorer.
- Incluir las migraciones necesarias para usuarios proveedor-only y handoffs.
- Configurar las rutas OAuth de desarrollo y externalizar URLs por entorno.

## Comportamiento esperado

1. El frontend navega a `/oauth2/authorization/google` en el backend.
2. Spring Security conserva y valida el estado OAuth y el callback OIDC.
3. El backend valida `sub`, email, `email_verified`, issuer, audience, firma y
   expiracion mediante la configuracion OIDC.
4. La identidad `(GOOGLE, sub)` existente inicia sesion en su usuario.
5. Una identidad nueva crea un usuario proveedor-only solo si no existe un
   usuario local con el email verificado.
6. Un email local existente produce un conflicto controlado, sin auto-vincular.
7. El backend crea un codigo aleatorio, guarda solo su hash y redirige al
   frontend con `?code=...` y una URL de destino permitida.
8. El callback frontend intercambia el codigo una sola vez mediante
   `POST /api/auth/google/exchange`.
9. El endpoint devuelve el JWT propio como texto, igual que login y registro.
10. El frontend llama a `useAuth().signIn(token)`, limpia la URL y navega a la
    aplicacion.
11. Codigos ausentes, invalidos, expirados o reutilizados producen un error
    recuperable y nunca una sesion.
12. El logout reutiliza `useAuth().signOut()` y solo elimina la sesion propia.

## Criterios de aceptacion

- [ ] Un login Google valido termina en estado autenticado de WOD Explorer.
- [ ] El callback muestra estados de carga, exito y error recuperable.
- [ ] Refrescar despues del callback conserva la sesion de #91.
- [ ] Se rechazan estados OAuth invalidos y handoffs ausentes, invalidos,
      expirados o reutilizados.
- [ ] No se envia JWT propio, access token o refresh token en URLs o logs.
- [ ] La resolucion de usuario usa `(GOOGLE, sub)` y exige email verificado.
- [ ] No se vincula automaticamente un email local existente.
- [ ] Los usernames Google son validos, unicos y compatibles con el limite del
      modelo existente.
- [ ] El handoff se guarda como hash y se consume atomicamente.
- [ ] `password_hash` admite usuarios proveedor-only mediante una migracion
      versionada reproducible.
- [ ] Las rutas OAuth funcionan en desarrollo y las URLs de entorno no estan
      hardcodeadas para produccion.
- [ ] El logout limpia la sesion de WOD Explorer sin revocar la cuenta Google.
- [ ] Existen tests para callback exitoso, consentimiento denegado, estado
      invalido, intercambio fallido, handoff replay/expiry y logout.

## Dependencias y restricciones

- #23 define la arquitectura OAuth/OIDC y la estrategia de identidad.
- #26 define el cliente HTTP y el contrato de errores del frontend.
- #27 define login/registro como JWT de texto.
- #91 define `AuthProvider`, `useAuth` y la hidratacion JWT existente.
- No se cambia el flujo username/password.
- No se introduce una migracion general a cookies HttpOnly en esta Issue; el
  riesgo XSS de `localStorage` queda documentado.
- No se almacenan secretos, JWT ni tokens de Google en el repositorio.
- No se exponen access tokens ni ID tokens de Google a la API propia.
- La arquitectura Controller -> Service -> Repository -> JPA -> MySQL se
  mantiene.
