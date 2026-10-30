# Plan: Callback y sesion de Google OAuth

## Enfoque

Completar la integracion parcial existente sin reemplazar la autenticacion
local. Spring Security seguira gestionando Authorization Code + OIDC y una
sesion HTTP temporal conservara la solicitud OAuth durante el redirect. Esa
sesion no se usara para autorizar la API: los endpoints privados continuaran
validando el JWT de WOD Explorer.

El callback backend resolvera la identidad, creara un handoff aleatorio y
guardara unicamente su hash. El frontend intercambiara el codigo una sola vez
por el JWT de texto existente y reutilizara `useAuth().signIn`.

## Componentes afectados

### Backend

- `SecurityConfig`: estado OAuth temporal, rutas publicas, callback y handler
  de fallo.
- `OAuth2AuthenticationSuccessHandler`: validacion de identidad y redireccion
  con handoff, nunca con JWT.
- Nuevos servicios, repositorios, entidad y DTO para `oauth_login_handoffs`.
- `GoogleOAuthService`: identidad OIDC, email verificado, usernames unicos y
  emision del handoff.
- `AuthController`: endpoint de intercambio publico.
- Excepciones y errores OAuth seguros para frontend.
- `Docker/mysql/init/002_google_oauth.sql`: nulabilidad de password y tabla de
  handoffs.
- `application.properties`, `docker-compose.yml` y `.env.example`: variables y
  URLs externalizadas.

### Frontend

- `GoogleCallbackPage`: lectura del codigo/error, intercambio, estados y
  navegacion limpia.
- `authApi.ts`, `apiEndpoints.ts` y tipos: contrato de intercambio.
- `vite.config.ts` y `.env.example`: rutas/proxy OAuth en desarrollo.
- `docs/google-auth-architecture.md`: estado implementado del handoff y riesgo
  residual de mantener el JWT en `localStorage`.
- Tests de parsing, intercambio, errores, doble ejecucion y logout.

## Identidad y persistencia

- Normalizar email para comparacion y exigir `email_verified=true`.
- Buscar primero `AuthProvider.GOOGLE + sub`.
- Crear el usuario proveedor-only y `UserIdentity` en una transaccion.
- Rechazar el email local existente con conflicto controlado.
- Generar un username derivado del email, sanitizado, truncado y con sufijo
  determinista hasta encontrar una variante disponible; manejar la carrera con
  restricciones unicas.
- Permitir `password_hash = NULL` en una migracion posterior al baseline.
- Handoff: hash unico, usuario, proveedor, destino permitido, expiracion,
  consumo, timestamps e indice de expiracion.
- Consumir mediante una actualizacion condicional que solo acepte codigo no
  consumido y no expirado.

## Flujo de seguridad

- Spring Security mantiene `state` y valida el callback OIDC.
- El handler acepta un principal OIDC con `sub`, email y verificacion.
- El redirect frontend solo usa una URL configurada/permitida.
- El codigo de handoff se genera con una fuente criptografica segura y se
  transmite una sola vez por query; el JWT nunca aparece en la URL.
- El endpoint de intercambio no acepta JWT ni tokens Google y no registra el
  codigo recibido.
- La respuesta de intercambio conserva el contrato JWT de login local.
- La pagina frontend reemplaza la URL despues de procesar el callback.
- `signOut` solo borra la sesion JWT local.

## Configuracion de entorno

- Backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL` y una
  allowlist/normalizacion de destinos si el despliegue requiere mas de uno.
- Google Cloud: cliente Web, scopes `openid profile email` y callback backend
  exacto por entorno.
- Frontend: `VITE_API_URL` y proxy de `/oauth2` y `/login/oauth2` en Vite, o
  URL backend explicita equivalente.
- Docker: pasar `FRONTEND_URL` al backend sin incluir secretos en Git.

## Verificacion

- Backend unit tests para resolucion de identidad, usernames, email verificado
  y ciclo de vida del handoff.
- Backend MockMvc/security tests para exchange, errores y rutas OAuth publicas.
- Frontend Vitest para callback, errores, intercambio y logout.
- `./mvnw -q test`, `./mvnw -q package`.
- `npm run lint`, `npm run test`, `npm run build`.
- `git diff --check` y validacion de que ningun secreto o token aparece en el
  diff.
- Validacion manual con una cuenta Google de prueba y los casos de rechazo.
