# Plan: Alinear resultados WOD con politica inmutable

## Enfoque

Aplicar la decision aprobada en la capa documental y en el contrato real existente
sin introducir una nueva abstraccion. El controlador ya carece de `PUT` y `PATCH`,
por lo que la implementacion debe conservar esa superficie y retirar solamente el
DTO y las pruebas obsoletas que afirman una correccion. El servicio debe conservar
la creacion de intentos, la consulta privada, el borrado con ownership y el calculo
derivado de mejores marcas.

Las Specs historicas se conservaran como evidencia: Spec #1 sigue siendo la
referencia original de inmutabilidad y Spec #5 recibira una nota y ajustes de
contrato que identifiquen su politica de correccion como supersedida por Issue #11.

## Componentes y archivos afectados

- `DOMAIN.md`: eliminar referencias que permitan modificar o corregir resultados;
  conservar version historica, ownership, eliminacion y derivacion.
- `backend/AGENTS.md`: alinear la regla operativa de resultados con inmutabilidad.
- `Docker/AGENTS.md`: alinear la regla de persistencia sin cambiar tablas ni
  migraciones.
- `specs/005-personal-wod-results/spec.md`: identificar la politica de correccion
  como historica y actualizar el contrato vigente sin borrar su trazabilidad.
- `specs/005-personal-wod-results/plan.md`: retirar el plan de implementacion de
  correcciones y describir la politica vigente.
- `specs/005-personal-wod-results/tasks.md`: conservar el registro historico y
  ajustar las tareas vigentes que contradigan la decision.
- `backend/src/main/java/.../dto/WodResultUpdateRequest.java`: eliminar DTO
  huerfano de un contrato no soportado.
- `backend/src/test/java/.../WodResultServiceTest.java`: retirar expectativas de
  actualizacion y cubrir derivacion despues de eliminar un resultado.
- `backend/src/test/java/.../WodResultServiceOwnershipTest.java`: cubrir borrado
  autorizado solo para el propietario.
- `backend/src/test/java/.../ApiSecurityTests.java`: comprobar que no existe la
  operacion HTTP `PUT` para resultados.

No se modifican controladores para añadir endpoints, entidades para añadir
mutadores, repositorios, SQL, Docker Compose, frontend, dependencias ni secretos.

## Estrategia de implementacion

1. Actualizar las reglas documentales y anotar la supersesion de la politica de
   correccion en Spec #5.
2. Eliminar el DTO de correccion no utilizado.
3. Retirar del test de servicio el caso que invoca metodos inexistentes y añadir
   casos de borrado por ownership y de derivacion de mejores marcas tras borrar.
4. Añadir una prueba HTTP autenticada que confirme que `PUT /api/wod-results/{id}`
   responde como metodo no permitido, sin crear un endpoint alternativo.
5. Revisar que no existan referencias de correccion soportadas fuera de la
   evidencia historica documentada.

## Verificacion

- `./mvnw -q test` desde `backend/`.
- `./mvnw -q -DskipTests validate` desde `backend/`.
- `./mvnw -q package` desde `backend/`.
- `git diff --check`.
- Busquedas dirigidas de `WodResultUpdateRequest`, `@PutMapping`, `@PatchMapping`,
  `update` y `correg` en el contrato de resultados.
- Revisar que el diff no incluya los cambios preexistentes del frontend,
  `opencode.json` ni `.opencode/commands/roadmap.md`.
- No se requiere inspeccion de esquema live porque no se cambia persistencia ni
  SQL; se verificara que no haya modificaciones bajo `Docker/mysql`.
