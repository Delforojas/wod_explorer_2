# Plan técnico

## Enfoque

Crear un pequeño almacén de sesión en `src/auth/` que sea la única frontera
para el token local. El almacén validará la forma mínima del JWT que el
frontend ya necesita (`sub` y `exp`), persistirá el token, notificará cambios
en la misma pestaña y escuchará cambios de almacenamiento entre pestañas.

Un `AuthProvider` expondrá el estado y las acciones `signIn`/`signOut` mediante
Context. Se montará dentro de `BrowserRouter` para que las rutas protegidas y
el layout consuman la misma sesión.

El cliente API conservará su contrato actual. Solo se conectará el `401` al
almacén de sesión y se permitirá que login diferencie credenciales inválidas
de una sesión expirada. No se rediseñará la normalización general de errores
perteneciente a #26/#27.

## Componentes afectados

- `frontend/src/auth/authSession.ts`: persistencia, validación y eventos de
  sesión.
- `frontend/src/auth/AuthContext.tsx`: proveedor y hook de sesión.
- `frontend/src/api/client/apiError.ts`: limpiar sesión ante `401` autenticado.
- `frontend/src/api/authApi.ts`: mensajes de autenticación pública.
- `frontend/src/main.tsx`: montar el proveedor.
- `frontend/src/components/auth/RequireAuth.tsx`: consumir el estado común.
- `frontend/src/components/layout/AppLayout.tsx`: consumir sesión y logout.
- `frontend/src/components/layout/Navbar.tsx`: eliminar lectura directa del
  token.
- `frontend/src/components/layout/MobileNavigation.tsx`: exponer la misma
  acción de logout desde la navegación móvil.
- `frontend/src/components/wodFilter/WodsList.tsx` y
  `frontend/src/components/ExerciseFilter/ExercisesList.tsx`: consumir el
  estado reactivo para mostrar acciones de usuarios autenticados.
- `frontend/src/api/wodsApi.ts`: usar la sesión validada al cargar el detalle
  de un WOD.
- `frontend/src/pages/LoginPage.tsx`: validación, estados y `signIn`.
- `frontend/src/pages/RegisterPage.tsx`: usar `signIn` y el mismo manejo de
  errores.
- `frontend/src/views/login/LoginView.tsx` y sus tipos: feedback y disabled.
- `frontend/src/views/register/RegisterView.tsx`: feedback accesible del
  estado pendiente.
- `frontend/src/utils/auth.ts`: conservar la API existente delegando al
  almacén común si sigue siendo necesaria.
- `frontend/src/auth/authSession.test.ts`: pruebas unitarias del flujo de
  sesión y mensajes de error.

## Estrategia de implementación

1. Añadir el almacén de sesión sin cambiar aún los consumidores.
2. Añadir `AuthProvider` y montar el provider dentro del router.
3. Migrar RequireAuth, AppLayout y Navbar para eliminar fuentes duplicadas de
   estado.
4. Completar login y registro con validación previa, estado de envío, mensajes
   de error, confirmación visible de éxito y almacenamiento centralizado del
   JWT.
5. Conectar la expiración por tiempo y la limpieza provocada por `401`.
6. Añadir pruebas puras sin incorporar dependencias de testing de componentes.
7. Ejecutar lint, tests y build frontend.

## Riesgos controlados

- El JWT no se verifica criptográficamente en frontend; solo se valida su
  estructura y expiración para decidir la presentación local. La autorización
  continúa en backend.
- La sincronización entre pestañas usa el evento `storage`; la misma pestaña
  usa un evento de sesión explícito.
- No se cambiará la ruta ni el formato del JWT emitido por backend.
