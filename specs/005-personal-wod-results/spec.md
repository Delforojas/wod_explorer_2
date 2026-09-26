# SDD: Resultados, historial y mejores marcas personales

## Objetivo

Implementar el agregado independiente de resultados para que un usuario autenticado
pueda registrar, consultar, corregir y eliminar sus intentos de WOD, manteniendo la
semántica de `FOR_TIME`, `AMRAP` y `EMOM`. El historial y las mejores marcas se
derivan bajo demanda de los resultados válidos existentes.

## Alcance

- Registrar resultados de versiones de WOD genéricas y de WOD personales propios.
- Validar la forma del resultado contra la modalidad de la versión ejecutada.
- Conservar múltiples intentos independientes para una misma versión de WOD.
- Permitir consultar, modificar y eliminar únicamente resultados propios.
- Consultar el historial propio con ordenación descendente y filtros por WOD,
  modalidad, origen e intervalo de fechas.
- Devolver en el historial el WOD, la versión, la modalidad, el origen, la fecha y
  los datos deportivos del resultado.
- Calcular mejores marcas desde resultados propios válidos, sin persistir una
  entidad o columna derivada.
- Recalcular automáticamente las mejores marcas después de crear, modificar o
  eliminar resultados porque cada consulta vuelve a derivarlas.
- Añadir tests de validación, propiedad, historial y comparación por modalidad.

## Contrato de API

- `POST /api/wod-results`: registra un intento sobre una versión válida y visible.
- `GET /api/wod-results`: devuelve el historial propio ordenado por
  `performedAt DESC, id DESC`. Admite `wodId`, `type`, `origin`, `from` y `to`.
- `GET /api/wod-results/{id}`: devuelve un resultado propio.
- `PUT /api/wod-results/{id}`: corrige los datos de ejecución del resultado propio.
  La versión ejecutada no puede cambiar durante una corrección.
- `DELETE /api/wod-results/{id}`: elimina el resultado propio sin afectar a otros
  intentos.
- `GET /api/wod-results/personal-bests`: devuelve la mejor marca derivada por
  versión y regla de comparación compatible.

Los contratos públicos usan DTOs. El response incluye `wodId`, nombre del WOD,
origen, `wodVersionId`, modalidad y los campos específicos existentes del
resultado, sin serializar entidades JPA.

## Comportamiento esperado

### Acceso y propiedad

- El usuario se obtiene del contexto autenticado; el request nunca establece el
  propietario.
- Una versión genérica puede usarse por cualquier usuario autenticado mientras su
  WOD no esté archivado.
- Una versión personal solo puede usarse por su propietario y mientras el WOD no
  esté archivado.
- Consultar, corregir o eliminar un resultado de otro usuario falla con la misma
  política de ownership existente.
- Una corrección conserva el `wodVersionId` original y permite operar sobre un
  resultado histórico aunque su WOD personal haya sido archivado.

### Validación por modalidad

- `FOR_TIME`: `completed` es obligatorio. Un resultado completado requiere un
  `timeSeconds` positivo y no admite campos de progreso; uno no completado no
  admite tiempo y debe conservar al menos un dato de progreso no negativo.
- `AMRAP`: requiere `amrapRounds` y `amrapExtraReps` no negativos y no admite
  tiempo ni campos de progreso.
- `EMOM`: requiere `progressRounds` no negativo; puede referenciar un elemento de
  la versión y, como máximo, una métrica no negativa entre repeticiones, distancia
  o duración. No admite tiempo ni campos AMRAP.
- Una referencia `progressItemId` debe pertenecer a la versión ejecutada.
- Los valores negativos o combinaciones incompatibles se rechazan antes de
  persistir.

### Mejores marcas

- `FOR_TIME`: menor tiempo entre resultados completados válidos de la misma versión.
- `AMRAP`: mayor número de rondas y, en empate, mayor número de repeticiones
  adicionales de la misma versión.
- `EMOM`: mayor progreso entre resultados compatibles de la misma versión y regla
  de progreso; reglas distintas no se comparan entre sí.
- Los resultados incompletos de `FOR_TIME` no participan en la mejor marca.
- Crear, corregir o eliminar un resultado cambia el resultado de la consulta de
  mejores marcas sin actualizar ninguna tabla derivada.

## Criterios de aceptación trazables

- [x] Cada resultado se asigna al usuario autenticado y referencia una versión
  existente del WOD.
- [x] Se rechazan datos incompatibles con `FOR_TIME`, `AMRAP` y `EMOM`.
- [x] Se conservan varios intentos para la misma versión sin sobrescritura.
- [x] Un usuario no puede consultar ni alterar resultados ajenos.
- [x] El historial muestra WOD, versión, fecha, origen y resultado, con filtros y
  ordenación definidos.
- [x] La mejor marca se deriva solo de resultados válidos existentes.
- [x] Crear, corregir o eliminar un resultado se refleja en la mejor marca derivada.
- [x] Existen tests para las tres modalidades y las reglas de propiedad, historial
  y comparación.

## Restricciones

- No se modifica el esquema SQL ni se añade un sistema de migraciones.
- No se crean entidades o columnas para historial o mejores marcas.
- No se implementan resultados públicos, competiciones, clasificaciones, marcas
  independientes de ejercicios, frontend ni funcionalidades sociales.
- No se admiten modalidades distintas de las tres aprobadas en `DOMAIN.md`.
- No se cambia una versión ejecutada durante la corrección de un resultado.
- La documentación del SDD se mantiene en español.
