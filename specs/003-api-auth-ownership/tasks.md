# Tasks: Autenticación, autorización y ownership de la API

## Orden y dependencias

1. Contratos, errores y resolución de identidad.
2. Configuración HTTP y filtro JWT.
3. Protección de catálogo, WOD y composición.
4. Protección de usuarios y resultados.
5. Tests y verificación final.

Las tareas 3 y 4 dependen de la resolución de identidad y de la configuración HTTP. La tarea 5 depende de toda la implementación.

## Tareas ejecutables

- [x] Añadir las dependencias de validación y testing de seguridad estrictamente necesarias.
- [x] Crear la resolución del usuario autenticado y excepciones/handler de errores HTTP consistentes.
- [x] Endurecer el filtro JWT para que tokens ausentes o inválidos no establezcan una identidad y no provoquen errores internos.
- [x] Configurar los métodos públicos y privados de `SecurityConfig`, incluyendo `401` y `403` consistentes.
- [x] Hacer públicos únicamente los GET de ejercicios activos y WOD/versiones/composición visibles; retirar las escrituras de ejercicios.
- [x] Implementar creación, modificación y archivado de WOD personales usando exclusivamente el usuario autenticado y bloqueando WOD genéricos.
- [x] Aplicar ownership a versiones y elementos mediante su WOD padre, incluyendo lecturas públicas solo para WOD genéricos.
- [x] Convertir `UserController` a DTOs y restringir todas sus operaciones al usuario autenticado; eliminar la creación directa de usuarios fuera de `/api/auth/register`.
- [x] Aplicar ownership y aislamiento por usuario a `WodResultController` y al endpoint legado de `ExerciseResultController`, sin aceptar propietarios desde requests.
- [x] Convertir controllers restantes de recursos afectados a DTOs y aplicar validación de entrada sin exponer entidades JPA.
- [x] Añadir tests de autenticación, rutas públicas, rutas privadas, ownership cruzado, errores y ausencia de `passwordHash`.
- [x] Revisar que no se hayan modificado el esquema, OAuth Google, roles, frontend ni decisiones de dominio fuera de la Issue.

## Verificaciones

- [x] `./mvnw -q -DskipTests validate` desde `backend/`.
- [x] `./mvnw -q test` desde `backend/` con JDK 21.
- [x] `./mvnw -q package` desde `backend/`.
- [x] `docker compose --env-file .env.example config --quiet` con variables ficticias de test; el `.env` local contiene una línea malformada ajena a estos cambios y no se modificó.
- [x] `git diff --check`.
- [x] Revisión de secretos, alcance, entidades expuestas y estado Git antes y después del commit.
