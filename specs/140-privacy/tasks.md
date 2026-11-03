# Tareas

- [x] Leer la Issue y auditar el tratamiento técnico de datos.
- [x] Identificar y documentar la información pendiente para una política definitiva.
- [x] Crear el SDD y el borrador de página pública `/privacy`.
- [x] Añadir el enlace Privacidad al footer sin rutas legales adicionales.
- [x] Añadir cobertura del footer y de la vista de privacidad.
- [x] Ejecutar checks y preparar validación visual.
- [x] Validar visualmente el borrador y el footer en escritorio y móvil (aprobado por usuario el 2026-11-03).

## Verificaciones completadas

- `database_ping`: PASS (conexión MySQL local disponible).
- `SHOW CREATE TABLE`: revisado para `users`, `user_identities`, `oauth_login_handoffs`, `exercise_results`, `wod_results` y `wods`, sin consultar registros personales.
- `npm run test -- src/styles/footer.test.tsx src/views/privacy/PrivacyView.test.tsx`: PASS (2 archivos, 3 tests).
- `npm run lint`: PASS.
- `npm run test`: PASS (30 archivos, 116 tests).
- `npm run build`: PASS.
- `git diff --check`: PASS.
- `21st review`: omitido; el binario `21st` no está instalado en el entorno.
