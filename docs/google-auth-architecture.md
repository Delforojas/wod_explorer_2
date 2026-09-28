# Arquitectura propuesta para Google Login

Estado: diseño técnico para la Issue #23. No es una especificación de
implementación ni activa el flujo OAuth/OIDC.

## 1. Contexto actual

La aplicación ya tiene una autenticación local basada en JWT:

- `POST /api/auth/register` y `POST /api/auth/login` devuelven el JWT como
  texto.
- El backend valida `Authorization: Bearer <token>` mediante
  `JwtAuthenticationFilter`.
- El `subject` del JWT identifica al usuario de WOD Explorer.
- La autorización de WOD y resultados se realiza en backend mediante ownership.

También existe una integración Google parcial en el código actual:

- `SecurityConfig` habilita `oauth2Login` y permite las rutas del handshake.
- `OAuth2AuthenticationSuccessHandler` recibe la identidad OAuth2 y redirige
  al frontend.
- `GoogleOAuthService` busca o crea usuarios y emite el JWT propio.
- `UserIdentity` relaciona un usuario con `AuthProvider.GOOGLE` y un
  `providerUserId`.
- `LoginPage` inicia ahora la navegación al endpoint backend
  `/oauth2/authorization/google`; `GoogleCallbackPage` todavía no procesa el
  resultado.
- El handler actual envía el JWT en el fragmento `#token` de la redirección.

La integración parcial se documenta para evitar duplicar decisiones. No se
amplía ni se corrige en esta Issue.

## 2. Decisión arquitectónica

Google será un proveedor de identidad, no el mecanismo de sesión ni de
autorización de WOD Explorer. El backend gestionará el flujo OAuth2/OIDC con
Spring Security usando Authorization Code. Una vez validada la identidad, el
backend resolverá el usuario local y emitirá el mismo JWT que utiliza el login
local.

El frontend no hablará directamente con Google, no recibirá client secrets y no
usará tokens de Google para consumir `/api`.

El handoff objetivo entre el callback backend y el frontend será un código
opaco de un solo uso y corta duración. El JWT propio no viajará en la URL. El
frontend intercambiará el código por el JWT mediante el backend y continuará
con el contrato de sesión existente.

## 3. Flujo completo

```text
LoginPage
    |
    | GET /oauth2/authorization/google
    v
Spring Security OAuth2 Client
    |
    | Authorization Code + OIDC
    v
Google
    |
    | redirect con authorization code
    v
GET /login/oauth2/code/google
    |
    | intercambio del code y validacion de identidad
    v
Servicio de identidad Google
    |
    +--> buscar (GOOGLE, sub)
    +--> crear o resolver User
    +--> emitir handoff de un solo uso
    v
Frontend /auth/google/callback?code=...
    |
    | POST /api/auth/google/exchange
    v
JWT propio de WOD Explorer
    |
    v
Estado de autenticacion del frontend
```

### Paso a paso

1. `LoginPage` inicia una navegación al endpoint OAuth2 del backend mediante el
   botón existente.
2. Spring Security genera y conserva el estado de la autorización y redirige a
   Google con los scopes OIDC necesarios.
3. Google autentica a la persona y devuelve el authorization code al callback
   backend registrado.
4. Spring Security intercambia el code, valida la respuesta OIDC y construye
   el principal OAuth2.
5. El servicio de identidad normaliza `sub`, email y `email_verified`, y
   resuelve la identidad local dentro de una transacción.
6. El backend crea un handoff opaco, vinculado al flujo y a la redirección
   permitida, y redirige al callback frontend.
7. `GoogleCallbackPage` envía el handoff al endpoint de intercambio.
8. El backend consume el handoff una sola vez y devuelve el JWT de WOD
   Explorer con el mismo contrato que el login local.
9. El frontend actualiza su estado de sesión y navega a la ruta original o a la
   página inicial.

El fragmento `#token` actual no es el contrato objetivo. Aunque el fragmento
no se envía normalmente al servidor, deja el JWT accesible a Javascript de la
página y no ofrece consumo de un solo uso.

## 4. Responsabilidades

### Frontend

- Iniciar el flujo navegando al backend desde el botón existente.
- No construir la autorización de Google ni almacenar secrets.
- Recibir únicamente el handoff opaco.
- Intercambiarlo mediante un servicio de autenticación.
- Integrar el JWT propio con el estado de sesión existente.
- Mostrar errores de cancelación, expiración, conflicto o intercambio fallido.
- Evitar aceptar tokens enviados por query string como sesión final.

### Backend y Spring Security

- Registrar Google como cliente OAuth2/OIDC mediante configuración externa.
- Gestionar Authorization Code, estado, nonce y callback.
- Validar issuer, audience, firma, expiración, `sub` y email verificado antes
  de usar la identidad.
- Resolver o crear el usuario y la identidad externa.
- Emitir el JWT propio mediante `JwtService`.
- Crear y consumir el handoff de forma atómica y con expiración corta.
- Mantener la autorización y el ownership completamente dentro de la API.

### Google

- Autenticar a la persona y proporcionar la identidad OIDC autorizada.
- No conocer ni decidir los permisos de WOD Explorer.
- No ser el emisor del JWT usado por la API propia.

### MySQL

- Conservar el usuario local de WOD Explorer.
- Conservar la relación entre usuario, proveedor y `sub` externo.
- Aplicar restricciones únicas para evitar identidades duplicadas.
- Almacenar en la tabla futura `oauth_login_handoffs` únicamente el estado
  mínimo y temporal del handoff. Nunca persistir access tokens o ID tokens de
  Google.

## 5. Identidad y vinculación

La resolución seguirá este orden:

1. Validar los atributos OIDC y normalizar el email para comparaciones.
2. Buscar `provider = GOOGLE` y `provider_user_id = sub`.
3. Si existe la identidad, iniciar sesión en el usuario relacionado.
4. Si no existe identidad y tampoco existe un usuario local con el email
   verificado, crear un usuario proveedor-only y su `UserIdentity` Google.
5. Si no existe identidad pero el email ya pertenece a un usuario local, no
   enlazar automáticamente. Devolver un conflicto controlado y exigir un
   futuro flujo explícito de vinculación iniciado por el usuario autenticado.

La coincidencia de email no demuestra por sí sola autorización para modificar
una cuenta local. El `sub` es el identificador externo estable; el email sirve
para la política de alta y comunicación, no sustituye a la identidad del
proveedor.
### Identidad ya vinculada

La identidad `(GOOGLE, sub)` resuelve directamente el usuario existente. No
se crea otro usuario aunque el email recibido haya cambiado, sujeto a las
reglas de verificación que se definan durante la implementación.

### Primer acceso sin usuario local

Se crea un usuario local con username generado de forma determinista y sin
password local. Se crea la identidad Google en la misma transacción. El JWT
emitido tiene el mismo subject y las mismas reglas de expiración que el login
local.

### Email local existente

No se realiza vinculación automática. La persona debe iniciar sesión con el
método local y, en una funcionalidad posterior, iniciar una acción explícita de
vinculación. Esa acción deberá requerir la sesión local válida y una nueva
verificación Google.

## 6. Persistencia

El modelo existente ya contiene la relación principal:

- `users` representa la identidad de la aplicación.
- `user_identities` contiene `user_id`, `provider` y `provider_user_id`.
- `AuthProvider` contiene `GOOGLE`.
- Las restricciones únicas existentes impiden repetir una identidad Google o
  asociar dos identidades Google al mismo usuario.

Hay una discrepancia que debe resolverse antes de implementar: la entidad
`User` y la base accesible permiten `password_hash = null` para usuarios
proveedor-only, mientras `Docker/mysql/init/001_baseline.sql` declara esa
columna como `NOT NULL`. La corrección debe hacerse mediante una decisión y un
script SQL posterior o una actualización coherente del baseline, nunca como un
cambio manual no documentado dentro de esta Issue.

Para el handoff de un solo uso se necesita un mecanismo server-side. La
arquitectura objetivo usa una tabla MySQL versionada llamada
`oauth_login_handoffs`, que debe contener como minimo:

- hash del código;
- proveedor y contexto de flujo;
- usuario resuelto o referencia temporal;
- expiración;
- fecha de consumo;
- redirección permitida y correlación no sensible.

La tabla y su migracion no forman parte de esta Issue; se implementaran en una
Issue posterior.

## 7. Endpoints y callbacks previstos

### Existentes que se reutilizarán o revisarán

- `GET /oauth2/authorization/google`: inicio del flujo backend.
- `GET /login/oauth2/code/google`: callback de Authorization Code.
- `POST /api/auth/login`: autenticación local existente.
- `POST /api/auth/register`: registro local existente.
- `GET /auth/google/callback`: ruta frontend ya declarada.

### Previsto para implementación posterior

- `POST /api/auth/google/exchange`: consume el handoff y devuelve el JWT
  propio. Este es el endpoint de intercambio definido por esta arquitectura.

Las Issues de implementacion deben respetar estas responsabilidades: Google y
su callback permanecen en backend y el frontend consume unicamente la sesion
propia.

## 8. Configuración

La implementación futura necesitará, como mínimo:

- `GOOGLE_CLIENT_ID`;
- `GOOGLE_CLIENT_SECRET`;
- `FRONTEND_URL` o una allowlist de redirecciones;
- scopes `openid`, `profile` y `email`;
- redirect URI registrada por entorno, por ejemplo
  `http://localhost:8080/login/oauth2/code/google` en desarrollo.

Los valores deben inyectarse mediante variables de entorno o el mecanismo de
secretos del entorno. No deben aparecer en Git, `PROJECT.md`,
`application.properties` ni esta documentación.

## 9. Seguridad

- Validar authorization code, state, nonce, issuer, audience, firma,
  expiración, redirect URI y `email_verified`.
- Usar `sub` como identificador estable y no confiar en un email enviado por el
  frontend.
- No enviar access tokens o ID tokens de Google a la API propia.
- No poner JWT propios ni tokens externos en query strings, logs o datos
  persistidos.
- Hacer el handoff de un solo uso, con expiración corta y consumo atómico.
- Permitir únicamente redirect URIs registradas para cada entorno.
- No vincular cuentas locales automáticamente por coincidencia de email.
- No incluir secretos, hashes de contraseñas ni datos personales innecesarios
  en el JWT propio.
- Revisar CORS, cookies, CSRF y CSP durante la implementación del handoff.
- Mantener la validación de ownership en los servicios backend existentes.

## 10. Descomposición de la implementación futura

La arquitectura permite separar el trabajo posterior en unidades manejables:

1. Alinear persistencia e identidad externa, incluida la nulabilidad de
   `password_hash` y el almacenamiento temporal del handoff.
2. Implementar el cliente OAuth2 backend, validación OIDC, resolución de
   usuarios y emisión del JWT.
3. Implementar el intercambio y callback frontend integrado con la sesión.
4. Añadir tests de seguridad para cuentas vinculadas, cuentas nuevas, email
   local existente, códigos expirados, reutilización y redirect inválido.

## Fuera de alcance de esta Issue

- Flujo OAuth/OIDC ejecutable.
- Endpoints o callbacks funcionales.
- Cambios en la base de datos, migraciones o entidades.
- Creación o vinculación real de usuarios.
- Client ID, Client Secret o credenciales reales.
- Tests de integración contra Google.
- Cambios funcionales en Spring Security, frontend o JWT.
