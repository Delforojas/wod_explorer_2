# SDD: Arquitectura de autenticacion con Google

## Objetivo

Definir la arquitectura tecnica para una futura integracion de Google Login
con WOD Explorer e implementar unicamente el inicio de navegacion desde el
boton existente de `LoginPage`.

## Alcance

- Documentar el flujo `LoginPage -> Google -> Spring Security -> usuario -> JWT de WOD Explorer`.
- Conectar el boton existente de Google con el endpoint de inicio OAuth2 del
  backend, sin implementar el resto del flujo.
- Separar las responsabilidades de frontend, backend, Google y persistencia.
- Definir la identificacion y vinculacion de identidades Google.
- Identificar endpoints, callbacks, configuracion y cambios futuros de modelo.
- Documentar la seguridad necesaria para la implementacion posterior.

## Comportamiento esperado

- El backend inicia y termina el flujo Authorization Code con Google mediante
  Spring Security OAuth2 Client.
- Google solo verifica la identidad; el backend continua siendo responsable de
  ownership, autorizacion y JWT de WOD Explorer.
- El identificador externo estable es el claim OIDC `sub`, almacenado en
  `user_identities` junto al proveedor `GOOGLE`.
- Una identidad ya vinculada inicia sesion en el usuario existente.
- Una identidad nueva crea un usuario proveedor-only solo si no existe un
  usuario local con el email verificado.
- Un email ya asociado a una cuenta local no se vincula automaticamente; se
  rechaza con conflicto controlado hasta que exista un flujo explicito de
  vinculacion.
- El handoff futuro usa un codigo opaco de un solo uso y corta duracion; no
  transporta JWT ni tokens de Google en la URL.
- El intercambio del codigo devuelve el JWT propio con el contrato del login
  local.
- El boton existente `Continuar con Google` inicia una navegacion hacia
  `http://localhost:8080/oauth2/authorization/google`.
- El callback frontend, el intercambio del handoff y la sesion final siguen
  pendientes de Issues posteriores.

## Criterios de aceptacion

- [ ] Existe documentacion tecnica de la arquitectura propuesta.
- [ ] El flujo completo de autenticacion esta definido.
- [ ] Las responsabilidades de todos los componentes estan separadas.
- [ ] La convivencia con JWT esta definida.
- [ ] La identificacion y vinculacion de usuarios esta definida.
- [ ] El comportamiento ante email local existente esta definido.
- [ ] Se identifican cambios futuros de frontend, backend y persistencia.
- [ ] Se identifican endpoints, callbacks y configuracion futura.
- [ ] Se documentan las consideraciones principales de seguridad.
- [ ] No se implementa el flujo OAuth/OIDC completo en esta Issue.
- [ ] El boton existente inicia la navegacion al endpoint OAuth2 del backend.
- [ ] No se modifica innecesariamente el diseño o el markup visual del boton.
- [ ] La documentacion permite derivar Issues de implementacion sin redefinir
  las decisiones arquitectonicas principales.

## Restricciones

- Esta Issue modifica documentacion tecnica y añade unicamente el inicio de
  navegacion del boton existente.
- No se modifica codigo Java, SQL, Docker, configuracion funcional del backend
  ni dependencias.
- No se almacenan credenciales reales ni tokens externos.
- No se crean endpoints, migraciones, usuarios ni vinculos reales.
- Se respeta la arquitectura existente
  `Controller -> Service -> Repository -> JPA -> MySQL`.
- El estado parcial de OAuth existente se documenta como evidencia; no se
  amplia el flujo ni se corrige el callback en esta Issue.
