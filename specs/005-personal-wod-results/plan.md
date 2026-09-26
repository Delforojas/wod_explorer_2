# Plan: Resultados, historial y mejores marcas personales

## Enfoque

Extender el flujo existente `WodResultController → WodResultService →
WodResultRepository` sin crear una capa adicional. El servicio conservará las
reglas de propiedad, resolverá la versión y sus elementos, validará la forma del
resultado y coordinará las operaciones transaccionales. Las consultas derivadas
de historial y mejores marcas reutilizarán los resultados privados del usuario.

La API usará DTOs separados para crear y corregir resultados. La corrección solo
actualizará los datos deportivos y `performedAt`; la versión original permanece
inmutable como referencia histórica. La consulta de historial usará un query de
repositorio con filtros opcionales y orden determinista.

## Componentes y archivos afectados

- `backend/src/main/java/.../dto/`: request de corrección y responses enriquecidos
  con identidad del WOD y modalidad.
- `backend/src/main/java/.../entity/WodResult.java`: método de actualización
  controlada de campos de ejecución.
- `backend/src/main/java/.../repository/WodResultRepository.java`: consulta
  ordenada con filtros privados y joins de historial.
- `backend/src/main/java/.../service/WodResultService.java`: validación por
  modalidad, create/update/delete, historial y comparación de mejores marcas.
- `backend/src/main/java/.../controller/WodResultController.java`: endpoints de
  corrección, filtros y mejores marcas.
- `backend/src/main/java/.../mapper/WodResultMapper.java`: response con contexto
  del WOD sin exponer entidades.
- `backend/src/main/java/.../exception/`: error de resultado inválido y respuesta
  HTTP `400` consistente.
- `backend/src/test/java/.../`: tests unitarios de reglas, ownership, filtros y
  comparación.
- `specs/005-personal-wod-results/`: contrato, plan y tasks de esta Issue.

No se modifican tablas, scripts SQL, Docker Compose, dependencias ni frontend.

## Cambios técnicos previstos

1. Añadir DTO de corrección sin `wodVersionId` y enriquecer el response con WOD,
   origen y modalidad.
2. Implementar validación centralizada en el servicio para los tres tipos de WOD,
   incluyendo progreso y pertenencia del elemento de progreso.
3. Añadir `@Transactional` a escrituras y `@Transactional(readOnly = true)` a
   lecturas derivadas.
4. Implementar `PUT` y mantener `DELETE` protegido por ownership.
5. Añadir query privada de historial con filtros opcionales por WOD, modalidad,
   origen y fechas.
6. Calcular mejores marcas en memoria a partir de resultados válidos, con
   comparadores específicos y sin persistir resultados derivados.
7. Mantener la restricción de versión durante las correcciones y permitir corregir
   resultados propios de WOD archivados sin permitir nuevos intentos.
8. Añadir tests unitarios para validación, propiedad, múltiples intentos,
   ordenación/filtros, comparación `FOR_TIME`, `AMRAP` y `EMOM`, y recálculo tras
   modificación o eliminación.

## Estrategia de verificación

- Ejecutar `./mvnw -q test` desde `backend/` con las variables requeridas.
- Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- Ejecutar `./mvnw -q package` desde `backend/`.
- Ejecutar `git diff --check`.
- Inspeccionar con MCP `database` que `wod_results`, `wod_versions` y
  `wod_version_items` conservan el esquema existente y que no se han creado tablas
  derivadas.
- Revisar que el response no expone entidades JPA ni propietario ajeno.
- Dejar validaciones manuales para registrar, corregir, eliminar, filtrar y
  consultar la mejor marca con usuarios y modalidades distintas.
