# Plan: Arquitectura de autenticacion con Google

## Enfoque

Crear una unica documentacion arquitectonica que describa el estado real
observado y el flujo objetivo para integrar Google mediante Spring Security
OAuth2 Login, vinculando la identidad externa con `UserIdentity` y emitiendo el
JWT propio de WOD Explorer.

El diseño define un handoff mediante codigo opaco de un solo uso almacenado
temporalmente en MySQL, en lugar de transportar el JWT en la URL. La
documentacion debe distinguir esta decision objetivo de la implementacion
parcial existente, que actualmente redirige con un fragmento `#token`.

No se modificara codigo, esquema, configuracion funcional ni dependencias.

## Componentes y capas afectadas en el futuro

- `docs/google-auth-architecture.md`: decision arquitectonica y estado
  observado.

- `frontend/src/pages/LoginPage.tsx`: inicio del flujo.
- `frontend/src/pages/GoogleCallbackPage.tsx`: consumo del handoff.
- Servicio/estado de autenticacion frontend: intercambio y sesion propia.
- `SecurityConfig`: cliente OAuth2, callbacks y proteccion de la transaccion.
- `OAuth2AuthenticationSuccessHandler`: resultado del login y handoff.
- `GoogleOAuthService` o servicio de identidad equivalente: alta, resolucion y
  vinculacion segura.
- `User`, `UserIdentity` y `AuthProvider`: identidad local y proveedor externo.
- `JwtService`: emision del mismo JWT usado por el login local.
- `Docker/mysql/init/` y scripts posteriores: solo si una Issue de implementacion
  aprueba cambios de nulabilidad o almacenamiento de handoffs.

## Cambios tecnicos documentados

1. Usar Authorization Code con OIDC y validacion server-side.
2. Resolver primero por `(provider, provider_user_id)` usando el `sub` de Google.
3. Crear usuarios nuevos sin password local solo cuando no exista email local.
4. No enlazar automaticamente cuentas por coincidencia de email.
5. Emitir el JWT de WOD Explorer despues de resolver la identidad.
6. Consumir un handoff opaco una sola vez antes de entregar el JWT al frontend.
7. Mantener Google fuera de la autorizacion de recursos privados.
8. Identificar la discrepancia entre `password_hash` nullable en la base/entidad
   y `NOT NULL` en el baseline SQL sin modificarla en esta Issue.

## Estrategia de verificacion

- Revisar que la documentacion cubre todos los criterios de aceptacion de la
  Issue #23.
- Contrastar nombres, rutas y componentes con el codigo existente.
- Confirmar que no se modifican archivos de codigo, configuracion funcional,
  esquema ni dependencias.
- Ejecutar `git diff --check`.
- Revisar el diff y el estado Git para separar el cambio local preexistente de
  `.opencode/commands/issue.md`.
- No ejecutar tests o build de aplicacion porque el cambio es exclusivamente
  documental.
