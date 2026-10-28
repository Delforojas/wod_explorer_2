# Plan: Resultados, historial y mejores marcas personales

> **Politica supersedida:** La correccion de resultados descrita en la version
> historica de este plan queda reemplazada por Issue #11. Los resultados actuales
> son inmutables despues de crearse y solo admiten consulta y eliminacion por su
> propietario.
>
> La comparación EMOM basada en progreso que aparece en la evidencia histórica
> queda supersedida por Issue #85. La regla vigente es binaria y EMOM no participa
> en mejores marcas clasificadas.

## Enfoque

Extender el flujo existente `WodResultController → WodResultService →
WodResultRepository` sin crear una capa adicional. El servicio conservará las
reglas de propiedad, resolverá la versión y sus elementos, validará la forma del
resultado y coordinará las operaciones transaccionales. Las consultas derivadas
de historial y mejores marcas reutilizarán los resultados privados del usuario.

La API usa un DTO para crear resultados y no ofrece DTO ni endpoint de correccion.
La consulta de historial usa un query de repositorio con filtros opcionales y orden
determinista.

## Componentes y archivos afectados

- `backend/src/main/java/.../dto/`: responses enriquecidos con identidad del WOD y
  modalidad; se elimina el request de correccion huerfano.
- `backend/src/main/java/.../repository/WodResultRepository.java`: consulta
  ordenada con filtros privados y joins de historial.
- `backend/src/main/java/.../service/WodResultService.java`: validación por
  modalidad, create/delete, historial y comparación de mejores marcas.
- `backend/src/main/java/.../controller/WodResultController.java`: endpoints de
  creación, consulta, eliminación, filtros y mejores marcas; sin correccion.
- `backend/src/main/java/.../mapper/WodResultMapper.java`: response con contexto
  del WOD sin exponer entidades.
- `backend/src/main/java/.../exception/`: error de resultado inválido y respuesta
  HTTP `400` consistente.
- `backend/src/test/java/.../`: tests unitarios de reglas, ownership, filtros y
  comparación.
- `specs/005-personal-wod-results/`: contrato, plan y tasks de esta Issue.

No se modifican tablas, scripts SQL, Docker Compose, dependencias ni frontend.

## Cambios técnicos previstos

1. Mantener el response enriquecido con WOD, origen y modalidad y eliminar el DTO
   de correccion historico no soportado.
2. Implementar validación centralizada en el servicio para los tres tipos de WOD,
   incluyendo progreso y pertenencia del elemento de progreso.
3. Añadir `@Transactional` a escrituras y `@Transactional(readOnly = true)` a
   lecturas derivadas.
4. Mantener `DELETE` protegido por ownership y no exponer `PUT` ni `PATCH`.
5. Añadir query privada de historial con filtros opcionales por WOD, modalidad,
   origen y fechas.
6. Calcular mejores marcas en memoria a partir de resultados válidos, con
   comparadores específicos y sin persistir resultados derivados.
7. Mantener la version exacta de cada resultado y permitir eliminar resultados
   propios aunque el WOD historico ya no admita nuevos intentos.
8. Añadir tests unitarios para validación, propiedad, múltiples intentos,
   ordenación/filtros, comparación `FOR_TIME` y `AMRAP`, exclusión de `EMOM` y
   derivacion tras eliminación.

## Estrategia de verificación

- Ejecutar `./mvnw -q test` desde `backend/` con las variables requeridas.
- Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- Ejecutar `./mvnw -q package` desde `backend/`.
- Ejecutar `git diff --check`.
- Inspeccionar con MCP `database` que `wod_results`, `wod_versions` y
  `wod_version_items` conservan el esquema existente y que no se han creado tablas
  derivadas.
- Revisar que el response no expone entidades JPA ni propietario ajeno.
- Dejar validaciones manuales para registrar, eliminar, filtrar y
  consultar la mejor marca con usuarios y modalidades distintas.
