# Tasks: Decisiones de dominio para versiones y resultados WOD

## Orden

1. Actualizar las reglas de resultados y propiedad.
2. Actualizar modalidades, prescripciones y comparación de mejores marcas.
3. Actualizar versionado histórico, archivo de WOD, historial y decisiones pendientes.
4. Validar trazabilidad y consistencia documental.

## Tareas ejecutables

- [x] Sustituir en `DOMAIN.md` la modificación/corrección de resultados por inmutabilidad después del registro.
- [x] Mantener la eliminación exclusivamente para el usuario propietario y conservar múltiples intentos.
- [x] Fijar `FOR_TIME`, `AMRAP` y `EMOM` como modalidades iniciales y documentar sus representaciones y reglas de comparación.
- [x] Documentar prescripciones mínimas, posiciones ordenadas y repetición de ejercicios.
- [x] Documentar la referencia a la versión concreta ejecutada y el archivo de WOD personal con resultados.
- [x] Documentar historial y mejores marcas como consultas derivadas, incluyendo creación y eliminación de resultados.
- [x] Eliminar de la lista de decisiones pendientes los puntos resueltos y conservar únicamente el versionado del catálogo como pendiente.
- [x] Comprobar que `spec.md`, `plan.md` y `DOMAIN.md` no contienen requisitos contradictorios.

## Verificaciones

- [x] Buscar referencias a `modificar`, `corregir` o equivalentes aplicadas a resultados y confirmar que no describen una operación permitida.
- [x] Buscar referencias a la mejor marca y confirmar que siempre es derivada y no almacenada.
- [x] Revisar que las reglas de ownership, privacidad, múltiples intentos e inmutabilidad aparecen en las secciones de reglas, invariantes y casos de uso.
- [x] Ejecutar `git diff --check`.
- [x] Revisar `git status --short` y confirmar que solo se incluyen `DOMAIN.md` y `specs/001-wod-result-domain/` en el commit de esta Issue; conservar sin tocar los cambios preexistentes.
