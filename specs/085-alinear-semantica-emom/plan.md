# Plan: Semántica EMOM alineada

## Enfoque

Usar `DOMAIN.md` como regla funcional vigente y conservar la arquitectura
existente `WodResultController → WodResultService → WodResultRepository`.
La validación EMOM ya aplica la forma binaria, por lo que se reforzarán sus
pruebas sin duplicar reglas en otra capa. La derivación de mejores marcas se
ajustará para considerar únicamente `FOR_TIME` y `AMRAP`; EMOM no llegará al
comparador de marcas.

Las Specs históricas #1 y #5 se actualizarán para distinguir la evidencia
histórica de los requisitos activos y referenciar la regla binaria de
`DOMAIN.md`. No se cambiarán el DTO, la entidad ni el esquema: sus campos de
progreso siguen siendo necesarios para `FOR_TIME` incompleto y deben rechazarse
por la regla de modalidad cuando el tipo es EMOM.

## Componentes y archivos afectados

- `specs/001-wod-result-domain/`: marcar la regla histórica de progreso EMOM
  como supersedida y reflejar la regla vigente en su spec, plan y tasks.
- `specs/005-personal-wod-results/`: alinear validación y mejores marcas EMOM
  con `DOMAIN.md` en su spec, plan y tasks, preservando la trazabilidad de la
  implementación histórica.
- `specs/085-alinear-semantica-emom/spec.md`: contrato funcional de esta Issue.
- `specs/085-alinear-semantica-emom/plan.md`: estrategia y verificaciones.
- `specs/085-alinear-semantica-emom/tasks.md`: tareas trazables.
- `backend/src/main/java/com/wodexplorer2/backend/service/WodResultService.java`:
  excluir EMOM de la selección y comparación de mejores marcas.
- `backend/src/test/java/com/wodexplorer2/backend/WodResultServiceTest.java`:
  cubrir aceptación binaria, rechazo de campos incompatibles y exclusión de
  EMOM de mejores marcas.

No se modifican `WodResult`, `WodResultRequest`, `WodResultResponse`, SQL,
migraciones, Docker, frontend, endpoints ni dependencias.

## Implementación

1. Añadir en las Specs históricas una nota de vigencia y sustituir las reglas
   activas de progreso EMOM por la regla binaria del dominio.
2. Mantener `validateEmom` como frontera única de validación de la combinación
   binaria y probar los campos incompatibles relevantes.
3. Simplificar la derivación de mejores marcas para que solo valide y compare
   `FOR_TIME` y `AMRAP`; los resultados EMOM quedan fuera.
4. Actualizar los tests unitarios sin reducir cobertura de propiedad, historial
   ni las modalidades no afectadas.
5. Sincronizar `tasks.md` únicamente después de verificar cada tarea real.

## Verificación

- Ejecutar `./mvnw -q test` desde `backend/`.
- Ejecutar `./mvnw -q -DskipTests validate` desde `backend/`.
- Ejecutar `./mvnw -q package` desde `backend/`.
- Ejecutar `git diff --check`.
- Revisar que no haya cambios en SQL, dependencias, frontend ni archivos fuera
  del manifiesto de esta Issue.
- Revisar que el contrato documentado conserve ownership, versión exacta y
  comportamiento de `FOR_TIME` y `AMRAP`.
