# Plan: Decisiones de dominio para versiones y resultados WOD

## Enfoque

Actualizar la fuente de verdad funcional `DOMAIN.md` para convertir en reglas explícitas las decisiones aprobadas por la Issue #1. Mantener el cambio limitado a documentación de dominio y añadir el SDD trazable que servirá de contrato para futuras implementaciones.

## Componentes y archivos afectados

- `DOMAIN.md`: reglas de resultados, modalidades, versionado histórico, archivo de WOD y mejores marcas derivadas.
- `specs/001-wod-result-domain/spec.md`: comportamiento y criterios de aceptación.
- `specs/001-wod-result-domain/plan.md`: este plan.
- `specs/001-wod-result-domain/tasks.md`: tareas y verificaciones.

No se modifican código Java, entidades JPA, SQL, Docker, APIs ni dependencias.

## Cambios técnicos previstos

1. Reemplazar las referencias a modificación o corrección de resultados por la regla append-only.
2. Documentar las modalidades iniciales `FOR_TIME`, `AMRAP` y `EMOM` y sus formas de resultado.
3. Documentar que cada resultado queda asociado a la versión ejecutada del WOD.
4. Documentar el archivo de WOD personal con resultados y la prohibición de crear nuevos resultados sobre un WOD archivado.
5. Documentar historial y mejores marcas como consultas derivadas sin almacenamiento duplicado.
6. Resolver la política inicial de prescripciones y dejar notas y versionado del catálogo como decisiones fuera de esta Issue.

## Estrategia de verificación

- Revisar que no queden en `DOMAIN.md` casos de uso o reglas que permitan modificar/corregir resultados.
- Revisar que cada criterio de `spec.md` tenga una regla equivalente en `DOMAIN.md`.
- Buscar referencias a mejores marcas almacenadas como entidad o fuente adicional.
- Ejecutar `git diff --check` para validar el formato del cambio documental.
- No ejecutar tests o build del backend porque no se modifican código ni configuración.
