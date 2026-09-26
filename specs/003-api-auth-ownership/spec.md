# SDD: Autenticación, autorización y ownership de la API

## Objetivo

Aplicar la identidad JWT ya existente a los endpoints del backend y garantizar que la API distingue entre catálogo público, WOD genéricos públicos y recursos privados propiedad del usuario autenticado.

## Alcance

- Mantener registro y login mediante JWT como únicos mecanismos de autenticación de esta Issue.
- Permitir sin autenticación únicamente las lecturas públicas del catálogo de ejercicios y de WOD genéricos, incluida su definición pública.
- Derivar el propietario desde la identidad autenticada para crear WOD personales, versiones, composición y resultados.
- Restringir usuarios, WOD personales, versiones, composición y resultados al propietario correspondiente.
- Eliminar las escrituras de ejercicios del API de usuarios finales y evitar que una petición pueda crear WOD genéricos.
- Exponer respuestas mediante DTOs sin entidades JPA ni `passwordHash`.
- Validar las entradas de autenticación y recursos modificables y devolver errores HTTP consistentes.
- Mantener el endpoint legado de `exercise_results` sin ampliar su funcionalidad, pero aplicarle autenticación, ownership y DTOs para evitar exposición accidental de datos privados.

## Comportamiento esperado

### Autenticación

- `POST /api/auth/register` y `POST /api/auth/login` permanecen públicos y devuelven un JWT sin credenciales internas.
- Un request sin JWT válido a un endpoint privado devuelve `401 Unauthorized` con una respuesta de error consistente.
- Un JWT inválido no provoca un error interno; se trata como una request no autenticada.
- La sesión es stateless y la identidad se obtiene del `subject` del JWT validado.

### Recursos públicos

- `GET /api/exercises` y `GET /api/exercises/{id}` solo exponen ejercicios activos.
- `GET /api/wods` y `GET /api/wods/{id}` exponen WOD genéricos no archivados para cualquier visitante.
- Las lecturas públicas de versiones y composición solo exponen elementos pertenecientes a WOD genéricos; un WOD personal solo es visible para su propietario autenticado.
- Los métodos de escritura de ejercicios no tienen endpoint público para usuarios finales.
- Crear un WOD siempre crea un WOD personal del usuario autenticado; el cliente no puede elegir propietario ni convertirlo en genérico.

### Ownership

- Un usuario autenticado solo puede consultar sus propios usuarios, WOD personales, versiones, composición y resultados privados.
- La creación de WOD, versiones, elementos y resultados ignora cualquier propietario enviado por el cliente y usa la identidad autenticada.
- Un resultado de WOD solo puede registrarse sobre un WOD genérico o sobre un WOD personal del usuario autenticado.
- Las consultas de resultados devuelven exclusivamente los resultados del usuario autenticado.
- La modificación y el archivado de WOD personales, así como las operaciones sobre sus versiones y elementos, requieren ownership.
- Un usuario no puede modificar ni eliminar recursos genéricos ni recursos privados de otro usuario; las operaciones prohibidas devuelven `403 Forbidden`.
- Los recursos inexistentes devuelven `404 Not Found`.

### Contratos y errores

- Los controllers reciben y devuelven DTOs; ninguna respuesta de usuario serializa directamente `User`, `Wod`, `WodResult` u otra entidad JPA.
- Los DTOs de entrada aplican validación estructural antes de llegar a la lógica de servicio.
- Los errores de validación, autenticación, autorización, conflicto y recurso inexistente usan una estructura JSON común sin stack traces ni secretos.

## Criterios de aceptación

- [x] Una persona no autenticada solo puede acceder a los recursos públicos definidos.
- [x] Un usuario autenticado no puede leer, modificar ni eliminar recursos privados de otro usuario.
- [x] Las escrituras de ejercicios y WOD genéricos no están expuestas a usuarios finales.
- [x] Ninguna respuesta pública contiene `passwordHash` ni credenciales.
- [x] Los resultados devueltos corresponden exclusivamente al usuario autenticado.
- [x] Los casos de autenticación, ownership y acceso denegado tienen tests verificables.
- [x] Las entradas de autenticación y recursos modificables se validan y los errores HTTP mantienen una estructura consistente.

## Restricciones

- No implementar OAuth de Google, roles, funcionalidades sociales ni frontend.
- No introducir cálculo de mejores marcas ni historial como funcionalidad nueva.
- No modificar el esquema SQL ni introducir migraciones; el modelo de la Issue #2 ya contiene las relaciones necesarias para ownership.
- No exponer ni registrar secretos, tokens completos, hashes de contraseñas o stack traces.
- No convertir `exercise_results` en una funcionalidad de dominio; solo se protege el endpoint legado existente para evitar una fuga de datos.
- No introducir una arquitectura nueva ni una capa adicional fuera de services, repositories, controllers, DTOs y manejo de errores.
