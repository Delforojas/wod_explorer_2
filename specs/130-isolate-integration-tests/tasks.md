# Tareas

- [x] Separar configuración común, dev y test sin importar `.env` en el perfil test.
- [x] Configurar Surefire para activar automáticamente el perfil Spring `test`.
- [x] Añadir dependencias Testcontainers compatibles con Spring Boot 3.5.5.
- [x] Crear la configuración compartida del contenedor MySQL 8.4 y cargar los scripts SQL versionados.
- [x] Implementar el guard fail-fast de datasource y sus pruebas de aceptación/rechazo.
- [x] Aplicar la configuración a todos los tests `@SpringBootTest` y verificar que los unitarios no requieren MySQL.
- [x] Añadir o actualizar documentación de Docker, ejecución y limpieza segura del entorno de test.
- [x] Ejecutar compilación, suite completa dos veces, `git diff --check` y verificaciones read-only de seguridad.
- [x] Revisar diff final, estado de rama y cumplimiento de los criterios de aceptación antes de cualquier commit o publicación.
