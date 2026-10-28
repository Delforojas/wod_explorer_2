# Tasks: Semántica EMOM alineada

## Documentación

- [x] D1. Registrar la decisión vigente binaria de EMOM y su trazabilidad en el
  SDD de la Issue.
- [x] D2. Actualizar el SDD de la Spec #1 para que su regla EMOM de progreso
  quede identificada como histórica y supersedida.
- [x] D3. Actualizar el SDD de la Spec #5 para que validación y mejores marcas
  EMOM no sean requisitos activos contradictorios.

## Backend

- [x] B1. Ajustar `WodResultService` para que EMOM no sea candidato ni se
  compare en `personal-bests`, conservando `FOR_TIME` y `AMRAP`.
- [x] B2. Añadir o actualizar tests para aceptar EMOM binario, rechazar campos
  incompatibles y excluir EMOM de mejores marcas.

## Verificación y entrega

- [x] V1. Ejecutar tests, validación Maven, empaquetado y `git diff --check`.
- [x] V2. Revisar el diff y confirmar que no hay cambios de esquema, frontend,
  dependencias o archivos ajenos.
- [ ] V3. Sincronizar el SDD con el resultado real y preparar el commit local.
