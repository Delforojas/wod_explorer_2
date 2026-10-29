# Tareas

- [x] Crear el almacén de sesión con lectura segura del JWT, persistencia,
      limpieza, expiración y notificación de cambios.
- [x] Crear `AuthProvider` y `useAuth`, incluyendo sincronización entre
      pestañas y expiración automática.
- [x] Montar el proveedor dentro de `BrowserRouter`.
- [x] Migrar `RequireAuth`, `AppLayout`, `Navbar`, `MobileNavigation` y las
      listas públicas al estado común de sesión.
- [x] Completar login con validación, errores visibles, confirmación de éxito,
      estado pendiente, bloqueo de doble envío y `signIn`.
- [x] Completar registro con el mismo flujo de sesión, confirmación de éxito y
      manejo de errores.
- [x] Conectar las respuestas `401` autenticadas con la expiración de sesión
      sin modificar el contrato REST.
- [x] Mantener feedback accesible y estados disabled en las vistas de auth.
- [x] Añadir tests para login válido, validación, red, logout y expiración a
      nivel del almacén y sus funciones puras.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Revisar sincronización final del SDD y el diff antes de staging.
