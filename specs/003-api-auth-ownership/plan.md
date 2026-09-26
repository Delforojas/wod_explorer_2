# Plan: Autenticación, autorización y ownership de la API

## Enfoque

Conservar la autenticación JWT stateless existente y mover la decisión de propiedad a la capa de servicios. Un componente pequeño resolverá el usuario autenticado desde `SecurityContextHolder`; los servicios aplicarán las reglas de visibilidad y ownership antes de leer o modificar entidades. La configuración HTTP limitará los métodos públicos a las lecturas del catálogo y de WOD genéricos.

Los controllers dejarán de exponer entidades JPA y utilizarán los DTOs y mappers ya presentes o los DTOs mínimos necesarios. La validación se realizará con Jakarta Bean Validation y los errores se centralizarán en una respuesta JSON común.

## Componentes y archivos afectados

- `backend/pom.xml`: añadir validación y soporte de tests de Spring Security si no están disponibles.
- `backend/src/main/java/.../config/SecurityConfig.java`: métodos públicos, stateless JWT y handlers de `401`/`403`.
- `backend/src/main/java/.../security/JwtAuthenticationFilter.java`: tratar tokens inválidos como requests no autenticadas sin errores 500.
- `backend/src/main/java/.../security/CurrentUserService.java`: resolver de forma segura la identidad autenticada.
- `backend/src/main/java/.../controller/`: proteger métodos, retirar escrituras públicas de ejercicios y usar contratos DTO.
- `backend/src/main/java/.../service/`: aplicar filtros de visibilidad, ownership y propietario derivado para usuarios, WOD, versiones, composición y resultados.
- `backend/src/main/java/.../repository/`: añadir consultas por propietario, origen y estado activo cuando sean necesarias.
- `backend/src/main/java/.../dto/` y `mapper/`: completar validaciones y respuestas sin campos internos.
- `backend/src/main/java/.../exception/`: excepciones de recurso, conflicto, autenticación y autorización junto con un `RestControllerAdvice` común.
- `backend/src/test/java/.../`: tests de seguridad HTTP, contratos DTO, autenticación, ownership y aislamiento de resultados.
- `specs/003-api-auth-ownership/`: SDD y trazabilidad de la Issue.

No se modificarán `DOMAIN.md`, el esquema SQL, frontend, OAuth Google, roles ni la arquitectura de capas existente.

## Cambios técnicos previstos

1. Configurar `SecurityFilterChain` para permitir `GET` público únicamente donde el servicio filtre catálogo activo y WOD genérico visible; exigir autenticación para usuarios, resultados y escrituras.
2. Endurecer el filtro JWT para capturar errores de parseo y continuar sin establecer autenticación inválida.
3. Resolver el usuario autenticado por username y usarlo en creación, consultas y operaciones de propiedad; nunca aceptar `user` u `owner` desde el request como fuente de autorización.
4. Añadir consultas de repositorio y comprobaciones de servicio para combinar WOD genéricos públicos con WOD personales propios y filtrar resultados por `user_id`.
5. Mantener las operaciones de ejercicios de solo lectura en el controller público y forzar `PERSONAL` para la creación de WOD.
6. Proteger versiones y elementos por el WOD padre, y resultados por el usuario autenticado y la versión accesible.
7. Sustituir respuestas de entidades por DTOs, especialmente en usuarios, WOD, resultados y el endpoint legado de `exercise_results`.
8. Añadir validación declarativa de requests y manejo centralizado de errores para validación, autenticación, autorización, conflictos y recursos ausentes.
9. Cubrir con tests los casos públicos, privados, ownership cruzado, JWT inválido, no exposición de `passwordHash` y aislamiento de resultados.

## Estrategia de verificación

- Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- Ejecutar `./mvnw -q test` desde `backend/` con JDK 21, MySQL accesible y variables locales requeridas.
- Ejecutar `./mvnw -q package` desde `backend/`.
- Ejecutar `docker compose config --quiet` con una variable JWT efímera de test, sin mostrar secretos.
- Ejecutar `git diff --check` y revisar que no haya secretos, entidades expuestas ni cambios fuera de la Issue.
- Inspeccionar mediante tests MockMvc que las lecturas públicas funcionan, las rutas privadas responden `401`, las operaciones prohibidas responden `403` y los DTOs no contienen `passwordHash`.
- Verificar mediante tests de servicio que dos usuarios no pueden leer, modificar ni eliminar recursos privados del otro y que los resultados se aíslan por propietario.
- Confirmar que no se ha modificado el esquema ni se ha añadido funcionalidad de Google OAuth, roles o `exercise_results`.
