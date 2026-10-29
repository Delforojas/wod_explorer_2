# Issue #91: Autenticación local y consistencia de sesión

## Objetivo

Completar la experiencia de autenticación local del frontend y establecer una
única fuente de verdad para la sesión JWT utilizada por rutas protegidas,
navbar, navegación móvil, footer y acciones de logout.

## Alcance

- Mostrar estados de carga y error en login y registro.
- Evitar envíos duplicados mientras login o registro están pendientes.
- Mostrar errores de validación, credenciales inválidas y fallos de red.
- Centralizar la lectura, escritura, limpieza y expiración de la sesión local.
- Hacer que las rutas protegidas reaccionen de forma determinista ante tokens
  ausentes, inválidos o expirados.
- Mantener sincronizados el layout, navbar y navegación móvil después de login,
  logout, refresh y expiración.
- Mantener el flujo Google OAuth fuera de esta Issue.

## Comportamiento esperado

- Login y registro validan los datos antes de llamar a la API.
- Mientras una petición está pendiente, el formulario no permite otro envío y
  comunica el estado al usuario.
- Un login o registro correcto almacena el JWT mediante el almacén de sesión,
  actualiza inmediatamente el estado autenticado y muestra una confirmación
  breve antes de navegar al inicio.
- Logout elimina el JWT y devuelve la aplicación al estado público.
- Un token inválido o expirado no habilita rutas privadas.
- Un `401` de una petición autenticada limpia la sesión y hace que la ruta
  protegida redirija a login.
- La sesión expirada por tiempo también se limpia sin depender únicamente de
  una nueva navegación.
- Los errores de red y de autenticación se muestran con texto comprensible y
  accesible.

## Criterios de aceptación

- [ ] Login y registro exponen estados visibles de pendiente, éxito y fallo.
- [ ] Los envíos duplicados se bloquean mientras existe una petición pendiente.
- [ ] Los estados autenticado y no autenticado son consistentes después de
      login, logout, refresh y expiración.
- [ ] Las rutas protegidas reaccionan de forma determinista ante tokens
      ausentes o inválidos.
- [ ] Existen tests para éxito, validación, error de red, logout y expiración.

## Dependencias

- #26 proporciona el cliente HTTP y el comportamiento común de errores.
- #27 proporciona las funciones API de auth y usuarios.

Estas dependencias no se reimplementan en esta Issue.

## Restricciones

- No cambiar el contrato REST ni el backend.
- No implementar Google OAuth; corresponde a #93.
- No introducir una librería de estado nueva.
- Mantener la arquitectura React + hooks + Context ya aprobada.
- Mantener la UI en español y los controles accesibles.
