# Plan técnico

## Enfoque

Añadir una migración incremental que alinee una inicialización limpia con la
estructura live sin cambiar el baseline histórico. Modelar las relaciones
adicionales en JPA y recuperarlas en lotes en el servicio agregado. Extender el
contrato de lectura y sus schemas Zod, y hacer que el detalle compartido los
renderice de forma opcional y ordenada.

## Cambios previstos

- `Docker/mysql/init/004_wod_prescription_contract.sql`: añadir `calories` y
  crear las tablas de variantes, progresión y extensión con claves, unicidad y
  checks compatibles con MySQL 8.4.
- Backend: añadir entidades/repositories para las relaciones y extender los
  DTOs/mappers/servicio de agregado sin alterar rutas existentes.
- Frontend: extender los schemas y tipos derivados; renderizar las dimensiones
  y reglas adicionales en `WodDetail` reutilizando sus estilos actuales.
- Tests: construir fixtures de definición avanzados y asegurar que los campos
  llegan y se presentan correctamente.

## Estrategia

1. Modelar la migración desde la estructura live observada y ejecutarla a través
   del mecanismo de init usado por Testcontainers.
2. Incorporar las entidades con relaciones de solo lectura desde la perspectiva
   del agregado y repositorios que recuperen datos por listas de identificadores.
3. Ampliar DTOs de respuesta, mappers y composición del agregado preservando
   compatibilidad de campos existentes y orden de ítems.
4. Actualizar schemas Zod y el renderer compartido para que campos ausentes no
   generen texto vacío ni unidades incorrectas.
5. Añadir pruebas unitarias/integración de los contratos y ejecutar las
   verificaciones definidas por los módulos afectados.
6. Usar navegación explícita de asociaciones (`wodVersionItem_Id` y
   `wodVersion_Id`) en consultas derivadas de Spring Data JPA para que la
   inicialización del repositorio resuelva atributos de entidad reales.
7. Centralizar en `WodDetail` la selección de la magnitud principal, con la
   prioridad `reps`, `distanceM`, `calories`, `durationSeconds`; el resto de
   magnitudes y las cargas se mantienen como metadata sin duplicar el valor
   principal.
8. Reutilizar consultas por lote en los mapeadores de endpoints directos para
   que versiones e ítems expongan el mismo contrato avanzado que el agregado
   sin consultas N+1.

## Verificación

- `./mvnw test` desde `backend/`.
- `npm run lint`, `npm run test` y `npm run build` desde `frontend/`.
- `git diff --check`.
- Inspección de Testcontainers para asegurar que la migración construye el
  esquema desde cero.
- Validación manual aprobada por el usuario: detalle de WOD en desktop y móvil
  para carga, distancia, duración, calorías, variantes, progresión y extensión.
- `WodPrescriptionMigrationIntegrationTest` inicializa MySQL 8.4 con todos los
  scripts y reaplica `004_wod_prescription_contract.sql` sobre ese esquema para
  validar los caminos limpio y existente sin tocar la base de desarrollo.
