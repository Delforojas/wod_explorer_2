# Plan: Ciclo de vida de WOD personales

## Enfoque

Mantener la arquitectura `Controller → Service → Repository → JPA → MySQL` y
añadir una orquestación pequeña del agregado WOD. El nuevo servicio de agregado
coordinará la creación y actualización atómica de WOD, versión y elementos,
derivando el propietario desde `CurrentUserService`. Las operaciones existentes de
lectura seguirán filtrando recursos genéricos y personales propios.

La estrategia de historial será append-only para versiones: cada modificación del
WOD crea una versión nueva y conserva las anteriores. El endpoint de borrado seguirá
la política ya existente de archivado lógico, preservando resultados y versiones.

## Componentes y archivos afectados

- `backend/src/main/java/.../dto/`: request integrado y response agregado.
- `backend/src/main/java/.../service/WodAggregateService.java`: casos de uso atómicos del agregado.
- `backend/src/main/java/.../controller/WodController.java`: contratos integrados de creación, consulta, modificación y archivo.
- `backend/src/main/java/.../controller/WodVersionController.java`: conservar lecturas y retirar escrituras independientes.
- `backend/src/main/java/.../controller/WodVersionItemController.java`: conservar lecturas y retirar escrituras independientes.
- `backend/src/main/java/.../repository/`: consultas ordenadas y soporte de versiones/elementos del agregado.
- `backend/src/main/java/.../exception/`: error de definición inválida si la validación de negocio lo requiere.
- `backend/src/test/java/.../`: tests de servicio y API para composición, versionado, ownership y archivo.
- `specs/004-personal-wod-lifecycle/`: contrato, plan y tareas de esta Issue.

No se modifica `DOMAIN.md`, el esquema SQL, Docker Compose, autenticación, frontend
ni las entidades de resultados salvo que una compilación revele una incompatibilidad
directa con el contrato existente.

## Cambios técnicos previstos

1. Añadir DTOs de definición y respuesta agregada con validación estructural.
2. Validar en servicio ejercicios activos, lista no vacía, prescripciones y restricciones de modalidad antes de guardar.
3. Crear la versión inicial y sus elementos en la misma transacción que el WOD.
4. Actualizar el WOD creando una nueva versión numerada y conservando las anteriores.
5. Construir respuestas con la versión actual y elementos ordenados, sin exponer entidades directamente.
6. Ordenar las consultas de composición por `position` y mantener la repetición de ejercicios permitida.
7. Impedir que los controllers de versión y composición modifiquen el agregado fuera de `/api/wods`.
8. Añadir tests unitarios de reglas y tests MockMvc de contratos públicos, privados y de validación.

## Estrategia de verificación

- Ejecutar tests unitarios y de API con JDK 21 y MySQL 8.4 accesible.
- Ejecutar `./mvnw -q -DskipTests validate` y `./mvnw -q package` desde `backend/`.
- Comprobar con `git diff --check` que no hay errores de formato.
- Verificar mediante MCP que no se modificó el esquema y que las tablas usadas por el agregado siguen accesibles.
- Revisar que las respuestas no contienen entidades JPA ni campos internos.
- Dejar una checklist manual para crear, consultar, modificar y archivar un WOD con composición repetida y comprobar ownership.
