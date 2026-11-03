# Tareas

## Preparación

- [x] Inspeccionar Issue, documentación aplicable, arquitectura y DB live.
- [x] Identificar la divergencia entre el esquema live y el schema versionado.
- [x] Definir alcance y contrato canónico en este SDD.

## Implementación

- [x] Añadir migración incremental reproducible para las prescripciones.
- [x] Modelar entidades, repositorios, DTOs y agregado backend.
- [x] Extender schemas y renderer compartido del frontend.
- [x] Actualizar la cobertura backend afectada del agregado.
- [x] Actualizar la cobertura frontend afectada de la presentación.
- [x] Corregir consultas derivadas de asociaciones JPA y cubrir la
      inicialización del repositorio en el contexto Spring.
- [x] Unificar la columna principal del detalle para reps, metros, calorías y
      segundos, preservando cargas y variantes como metadata.
- [x] Alinear los endpoints directos de versiones e ítems con el contrato del
      agregado mediante cargas por lote de variantes y reglas.
- [x] Cubrir con integración HTTP/MySQL el agregado y los endpoints directos
      para prescripciones combinadas, variantes y reglas opcionales.

## Verificación y handoff

- [x] Ejecutar las verificaciones completas de backend y frontend.
- [x] Validar la migración en MySQL 8.4 para un esquema limpio y su reaplicación
      sobre un esquema existente de Testcontainers.
- [x] Ejecutar `git diff --check` y sincronizar este SDD con el estado real.
- [x] Ejecutar la prueba de contexto Spring/Data JPA y comprobar el arranque de
      Spring Boot con MySQL 8.4.
- [x] Solicitar revisión visual manual antes de commit/push/PR; aprobación
      explícita del usuario registrada antes de la finalización.
