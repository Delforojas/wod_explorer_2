# SDD: Ciclo de vida de WOD personales

## Objetivo

Implementar el agregado WOD personal para que cada WOD privado se cree, consulte,
modifique y archive junto con una composición válida de ejercicios del catálogo,
respetando ownership y la preservación histórica de resultados.

## Alcance

- Crear WOD personales mediante un contrato integrado de WOD, versión y composición.
- Validar que la composición no esté vacía y que cada elemento use un ejercicio activo existente.
- Asignar posiciones deterministas según el orden recibido y permitir repetir ejercicios.
- Consultar únicamente WOD genéricos públicos y WOD personales propios.
- Modificar el nombre y la definición creando una nueva versión del WOD.
- Mantener intactas las versiones y resultados anteriores al modificar un WOD.
- Archivar WOD personales mediante `DELETE`, conservando sus versiones y resultados.
- Exponer DTOs integrados sin serializar entidades JPA.
- Mantener las lecturas de versiones y composición existentes, pero retirar sus escrituras independientes para que el agregado sea la única entrada de modificación.

## Contrato integrado

`POST /api/wods` y `PUT /api/wods/{id}` reciben una definición con:

- `name` obligatorio y de hasta 100 caracteres;
- `type` entre `FOR_TIME`, `AMRAP` y `EMOM`;
- `timeCapSeconds` y `rounds` según las restricciones del esquema y la modalidad;
- `items`, una lista no vacía de elementos ordenados;
- cada elemento referencia `exerciseId` y puede incluir `reps`, `weightKg`, `distanceM` o `durationSeconds`.

La API asigna `position` empezando en uno según el orden de `items`; el cliente no
puede crear posiciones duplicadas, huecos ni reordenamientos ambiguos. Un mismo
`exerciseId` puede aparecer en varios elementos. Cada elemento debe contener al
menos una prescripción no negativa.

La respuesta integrada contiene el WOD, su versión actual y la composición ordenada.

## Comportamiento esperado

- La creación deriva el propietario del JWT y persiste WOD, versión inicial y elementos dentro de una transacción.
- Si algún ejercicio no existe o está inactivo, la creación o modificación falla sin dejar un agregado parcial.
- Una modificación actualiza el nombre y crea una versión posterior; nunca edita versiones que puedan estar referenciadas por resultados.
- La versión actual de un WOD archivado no es consultable ni modificable por la API de usuario.
- `DELETE /api/wods/{id}` archiva el WOD personal y no elimina físicamente versiones ni resultados.
- Un usuario no puede consultar o gestionar WOD personales de otro usuario ni WOD genéricos mediante operaciones privadas.
- Las operaciones de escritura de versiones y elementos se realizan exclusivamente a través de `/api/wods`.

## Criterios de aceptación

- [x] Un WOD personal siempre se crea con propietario autenticado, versión y al menos un elemento válido.
- [x] No se pueden añadir ejercicios inexistentes o inactivos ni publicar una composición vacía.
- [x] El orden se conserva de forma determinista y permite repetir el mismo ejercicio en posiciones distintas.
- [x] Un usuario solo puede consultar y gestionar sus WOD personales.
- [x] Las modificaciones crean una nueva versión y conservan las versiones/resultados históricos.
- [x] El borrado lógico archiva el WOD y preserva sus datos históricos.
- [x] Los contratos de WOD y composición usan DTOs integrados y no exponen entidades JPA.
- [x] Existen tests para creación, validación, consulta, modificación, archivado y acceso no autorizado.

## Restricciones

- No se modifica el esquema SQL ni se añade un gestor de migraciones.
- No se implementa publicación de WOD personales, catálogo editable, frontend, historial global ni mejores marcas.
- No se introducen modalidades, campos de resultado o reglas de prescripción fuera de las decisiones de la Issue #1 y el esquema existente.
- No se amplía `exercise_results`.
- La documentación del SDD se mantiene en español.
