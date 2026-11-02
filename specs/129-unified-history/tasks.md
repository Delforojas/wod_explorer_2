# Tareas

## Preparación

- [x] Confirmar Issue #129, alcance backend mínimo y restricciones sin SQL ni endpoint unificado.
- [x] Confirmar rutas, contratos, privacidad y utilidades existentes de Historial, WOD Results y Benchmarks.
- [x] Crear este SDD sobre la base verificada de `origin/main`.

## Backend

- [x] Enriquecer `ExerciseResultResponse` con `exerciseName` y `measurementType`.
- [x] Actualizar mapper, esquema frontend y orden de repositorio a `performedAt DESC, id DESC`.
- [x] Mantener la consulta limitada al usuario autenticado y conservar ejercicios inactivos.
- [x] Añadir pruebas backend de mapeo, orden, inactivos y privacidad.

## Frontend

- [x] Crear el modelo discriminado y utilidades puras de normalización, filtros, orden y formato.
- [x] Cargar resultados WOD y ejercicio con estados independientes y reintentos.
- [x] Añadir modos `Todos`, `WODs` y `Ejercicios` con rango de fechas común.
- [x] Aplicar filtros WOD solo en modo `WODs` y limpiar valores al salir de ese modo.
- [x] Renderizar filas mixtas con tipo, nombre, fecha y puntuación correcta.
- [x] Cubrir seis tipos de medición, modalidades WOD, origen y estados incompletos.
- [x] Reutilizar estilos existentes y mantener accesibilidad/responsive sin acciones destructivas.
- [x] Añadir pruebas frontend para mezcla, filtros, orden, formato y errores parciales.

## Verificación y handoff

- [x] Revisar que no haya cambios SQL, API fuera del DTO, dominio, auth o endpoints nuevos.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `./mvnw -q test` desde `backend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff final y crear commit local sin push.
- [x] Documentar la Issue y preparar checklist manual sin aprobarla.

## Resultado de verificación

- `./mvnw -q test` desde `backend/`: correcto, incluyendo las pruebas de
  mapper, servicio y privacidad de resultados de ejercicios.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/`: correctos.
- `git diff --check`: correcto.
- La integración local de `main` actualizado se realizó sin conflictos en el
  commit `76d4ea5`; no se hizo push, PR, merge remoto ni cierre de la Issue.
- La validación visual manual de datos mixtos, filtros, cronología, ejercicios
  inactivos, estados parciales, responsive y teclado sigue pendiente de
  aprobación explícita.
