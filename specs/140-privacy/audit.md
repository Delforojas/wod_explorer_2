# Auditoría técnica de privacidad

Revisión de código y esquema local realizada el 3 de noviembre de 2026. Este documento describe evidencias técnicas; no determina por sí mismo obligaciones legales ni sustituye una revisión de cumplimiento.

## Datos verificados

- Cuentas locales: `username`, `email`, `password_hash` y `created_at` en `users`; la contraseña se procesa con `BCryptPasswordEncoder` (`AuthService`, `SecurityConfig`).
- Google OAuth: la configuración solicita `openid`, `profile` y `email`; el flujo utiliza el correo verificado y el identificador `sub`, que se conserva como `provider_user_id` en `user_identities`.
- Sesión: el JWT tiene como sujeto el nombre de usuario, caduca según `jwt.expiration` (24 horas en la configuración actual) y el frontend lo guarda con la clave `token` de `localStorage`.
- WODs personales: nombre, propietario, fechas de creación/archivo y composición/versiones vinculadas.
- Resultados de ejercicios: ejercicio, repeticiones, carga, distancia, duración y fecha de realización.
- Resultados de WOD: versión, fecha, estado, tiempo, progreso, rondas y repeticiones.
- Google OAuth conserva hashes de códigos y de vinculación de navegador, proveedor, ruta de retorno, fechas de creación/consumo/expiración. El TTL configurado es de 300 segundos; no se observó una rutina de purga de los registros expirados.

## Privacidad y controles observados

- El dominio y los servicios limitan WODs personales y resultados al propietario autenticado.
- Las APIs permiten que un usuario autenticado actualice su propia cuenta y elimine sus propios resultados. También existe una ruta de eliminación de cuenta, pero el esquema local mantiene referencias de WODs y resultados a `users` sin `ON DELETE CASCADE`; su comportamiento con actividad asociada requiere validación antes de describirlo como un mecanismo de eliminación efectivo.
- El esquema local sí elimina en cascada identidades de proveedor y handoffs OAuth cuando se elimina el usuario.
- La configuración no muestra una integración de analítica en el código fuente revisado.
- El backend requiere sesión HTTP en el intercambio OAuth; el inventario de cookies efectivo depende del despliegue y debe verificarse fuera del repositorio.

## Información pendiente antes de una política definitiva

- Identidad, domicilio y contacto del responsable.
- Base jurídica, finalidades definitivas y procedimiento de atención de derechos.
- Proveedor de hosting, almacenamiento, backups, logs y encargados.
- Transferencias internacionales, si existen, y garantías.
- Plazos de conservación y reglas de borrado, incluida la purga de handoffs OAuth.
- Procedimiento real de eliminación de cuentas con WODs o resultados asociados.
- Cookies efectivas y servicios de terceros activos en producción.
