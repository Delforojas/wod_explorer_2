# Tasks: Arquitectura de autenticacion con Google

## Orden y dependencias

1. Inspeccionar la autenticacion JWT, OAuth2 parcial, usuarios e identidades.
2. Documentar el flujo objetivo y las responsabilidades por componente.
3. Documentar vinculacion, persistencia, endpoints, configuracion y seguridad.
4. Implementar el inicio de navegacion desde el boton existente.
5. Revisar trazabilidad, alcance y ausencia de cambios funcionales fuera de ese
   inicio.

Las tareas 2 y 3 dependen de la inspeccion del estado real. La tarea 4 depende
de toda la documentacion anterior.

## Tareas ejecutables

- [x] Contrastar `LoginPage`, `GoogleCallbackPage` y el contrato JWT local.
- [x] Contrastar `SecurityConfig`, callback OAuth2, `GoogleOAuthService`,
  `UserIdentity` y `AuthProvider`.
- [x] Documentar el flujo Authorization Code/OIDC completo y el handoff de la
  sesion propia.
- [x] Documentar las responsabilidades de frontend, backend, Google y MySQL.
- [x] Documentar los casos de identidad vinculada, identidad nueva y email
  local existente.
- [x] Documentar endpoints, callbacks, variables de entorno y redirect URIs.
- [x] Documentar el impacto futuro en persistencia, incluida la discrepancia de
  nulabilidad de `password_hash`.
- [x] Documentar validaciones y controles de seguridad.
- [x] Confirmar explicitamente que no se implementan OAuth/OIDC, endpoints,
  migraciones ni tests de integracion con Google.
- [x] Añadir `onClick` al boton existente sin crear otro boton ni cambiar su
  diseño visual.
- [x] Navegar desde `LoginPage` hacia
  `http://localhost:8080/oauth2/authorization/google`.

## Verificaciones

- [x] `git diff --check` y comprobacion equivalente de archivos nuevos.
- [x] Revisar que `spec.md`, `plan.md` y la documentacion arquitectonica cubren
  todos los criterios de aceptacion de la Issue #23.
- [x] Revisar que no hay cambios de codigo, configuracion funcional,
  dependencias o esquema fuera del `onClick` de `LoginPage`.
- [x] Revisar que el cambio local preexistente en
  `.opencode/commands/issue.md` queda fuera del staging.
- [x] `npm run lint` desde `frontend/`.
- [x] `npm run build` desde `frontend/`.
- [ ] Revisar manualmente que el boton conserva su texto, tipo y diseño, y que
  la navegacion apunta al endpoint backend esperado.
