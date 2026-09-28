# Tasks: Arquitectura de autenticacion con Google

## Orden y dependencias

1. Inspeccionar la autenticacion JWT, OAuth2 parcial, usuarios e identidades.
2. Documentar el flujo objetivo y las responsabilidades por componente.
3. Documentar vinculacion, persistencia, endpoints, configuracion y seguridad.
4. Revisar trazabilidad, alcance y ausencia de cambios funcionales.

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
  migraciones, cambios funcionales ni tests de integracion con Google.

## Verificaciones

- [x] `git diff --check` y comprobacion equivalente de archivos nuevos.
- [x] Revisar que `spec.md`, `plan.md` y la documentacion arquitectonica cubren
  todos los criterios de aceptacion de la Issue #23.
- [x] Revisar que no hay cambios de codigo, configuracion funcional,
  dependencias o esquema.
- [x] Revisar que el cambio local preexistente en
  `.opencode/commands/issue.md` queda fuera del staging.
