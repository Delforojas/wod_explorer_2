# SDD: Semántica EMOM alineada

## Objetivo

Consolidar la regla vigente de EMOM en la documentación del dominio, las Specs
afectadas, la validación de resultados y la consulta derivada de mejores marcas.
La fuente de verdad es `DOMAIN.md`: un resultado EMOM solo registra si el WOD
fue completado y no participa en mejores marcas clasificadas.

## Alcance

- Mantener documentada y trazable la representación binaria de EMOM.
- Marcar como históricas y supersedidas las reglas de progreso EMOM de las Specs
  anteriores, conservando su evidencia sin dejarlas como requisitos activos.
- Aceptar únicamente `completed` para crear resultados EMOM.
- Rechazar en EMOM tiempo, progreso por rondas/elemento/métrica y campos AMRAP.
- Excluir resultados EMOM de la consulta derivada de mejores marcas.
- Cubrir con tests la representación válida, combinaciones incompatibles y
  exclusión de mejores marcas.

## Comportamiento esperado

### Representación

- `COMPLETED` se representa con `completed=true`.
- `NOT_COMPLETED` se representa con `completed=false`.
- `completed` es obligatorio para EMOM.
- EMOM no registra `timeSeconds`, `progressRounds`, `progressItemId`,
  `progressReps`, `progressDistanceM`, `progressDurationSeconds`,
  `amrapRounds` ni `amrapExtraReps`.
- La versión exacta del WOD, la privacidad y el ownership existentes se
  conservan sin cambios.

### Mejores marcas

- `GET /api/wod-results/personal-bests` deriva resultados solo para `FOR_TIME` y
  `AMRAP` según sus reglas vigentes.
- Ningún resultado EMOM genera una mejor marca clasificada.
- No se crea una tabla, columna ni fuente persistida adicional.

## Criterios de aceptación

- [ ] Existe una única regla documentada y trazable para los campos y la
  comparación de resultados EMOM.
- [ ] `DOMAIN.md` y las Specs afectadas no presentan reglas EMOM contradictorias
  como requisitos activos.
- [ ] La validación acepta EMOM completado y no completado solo con `completed`.
- [ ] La validación rechaza campos de tiempo, progreso y AMRAP en EMOM.
- [ ] La consulta de mejores marcas excluye EMOM y conserva `FOR_TIME` y `AMRAP`.
- [ ] Los tests cubren representación válida, combinaciones incompatibles y
  exclusión de EMOM de mejores marcas.
- [ ] No se introducen cambios de esquema, nuevas modalidades, resultados
  públicos ni lógica frontend.

## Restricciones

- `DOMAIN.md` continúa siendo la fuente de verdad funcional.
- No se resuelve la política de modificación de resultados de la Issue #11.
- No se implementa la interfaz de Personal Bests de la Issue #15.
- No se modifican tablas, scripts SQL, dependencias ni la persistencia.
- No se eliminan los campos de progreso del modelo porque siguen soportando
  resultados `FOR_TIME` no completados.
- La documentación del SDD se mantiene en español.
