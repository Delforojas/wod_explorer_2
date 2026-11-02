# SDD: Integridad de autoría y prescripciones WOD

## Objetivo

Endurecer los flujos de creación y edición de WODs para que las prescripciones
sean completas y compatibles con la medición del ejercicio, soportando
`DISTANCE_TIME`, evitando solicitudes duplicadas y haciendo deterministas las
cargas y selecciones asíncronas.

## Alcance

- Completar la edición y visualización de prescripciones `DISTANCE_TIME`.
- Validar en el cliente el tipo de WOD, los ejercicios seleccionados y los
  campos requeridos por cada `measurementType` antes de llamar a la API.
- Mostrar errores asociados al WOD o a la prescripción concreta.
- Deshabilitar los controles de creación y actualización mientras la solicitud
  está en curso.
- Evitar que respuestas asíncronas antiguas sobrescriban una selección más
  reciente o actualicen una pantalla desmontada.
- Añadir pruebas unitarias y de comportamiento para validación, doble submit y
  carreras de selección.

## Comportamiento esperado

1. El formulario conserva los valores de cada prescripción al crear y editar.
2. `REPS` exige repeticiones; `WEIGHT` exige repeticiones y peso; `TIME`
   exige duración; `DISTANCE` exige distancia; `WEIGHT_DISTANCE` exige peso y
   distancia; y `DISTANCE_TIME` exige distancia y duración.
3. Una prescripción con campos incompletos, negativos, no finitos o
   incompatibles con su medición se rechaza localmente y señala el ejercicio
   afectado.
4. `AMRAP` y `EMOM` requieren límite de tiempo; las reglas existentes de
   `FOR_TIME` se conservan.
5. Un submit en curso no puede iniciar otra creación o actualización.
6. Solo la respuesta de la selección asíncrona más reciente puede cambiar el
   detalle mostrado; los errores de respuestas obsoletas tampoco reemplazan el
   estado vigente.
7. Las cargas canceladas por desmontaje no actualizan estado de React.

## Criterios de aceptación

- [x] `DISTANCE_TIME` se puede crear, editar, mostrar y enviar sin perder sus
      datos obligatorios.
- [x] Las combinaciones modalidad/medición inválidas se rechazan antes de la
      solicitud HTTP.
- [x] Los controles de submit no permiten solicitudes duplicadas.
- [x] Las respuestas asíncronas antiguas no sobrescriben elecciones nuevas.
- [x] Los errores identifican el WOD o la prescripción afectada.
- [x] Existen pruebas para todas las mediciones soportadas, combinaciones
      inválidas, doble submit y carreras asíncronas.

## Restricciones

- No implementar ni cambiar el CRUD de la API WOD; su superficie pertenece a
  la Issue #29.
- No cambiar contratos REST, entidades, migraciones ni reglas de ownership.
- La validación frontend no sustituye la validación backend existente.
- Mantener React + hooks, Zod, Vitest y la UI en español.
- Mantener los cambios limitados a la Issue #94, su SDD y las pruebas
  necesarias.

## Dependencias y fuentes

- #26: cliente HTTP y comportamiento común de errores.
- #29: contrato del agregado WOD.
- `DOMAIN.md`: ownership, ciclo de vida y reglas de dominio WOD.
- `frontend/AGENTS.md`: arquitectura, validación y pruebas frontend.
