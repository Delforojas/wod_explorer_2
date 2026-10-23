# Final Workflow Check Hook

## Propósito

Comprobar de forma objetiva el estado final de la fase de desarrollo de `/issue $1` antes de entregar la GitHub Issue para validación manual.

Este hook no finaliza la Issue ni ejecuta acciones de publicación. La publicación, integración y cierre pertenecen a `/finish-issue $1`.

## Momento de ejecución

Ejecuta este hook después de:

- completar la implementación y las verificaciones automáticas aplicables;
- crear el commit de la Issue;
- documentar el resultado del workflow en la GitHub Issue;
- definir las validaciones manuales pendientes.

Debe ejecutarse antes de declarar que `/issue $1` está preparado para validación manual.

## Comprobaciones

Comprueba que:

- la rama activa corresponde a la GitHub Issue #$1 y no es `main`;
- existe una única carpeta SDD válida para la Issue;
- existen `spec.md`, `plan.md` y `tasks.md`;
- las tasks están completadas;
- las verificaciones automáticas aplicables han finalizado correctamente;
- existe un commit correspondiente a la Issue en la rama activa;
- no quedan cambios de la Issue pendientes de commit ni en staging;
- cualquier cambio pendiente del working tree fue identificado previamente como ajeno a la Issue;
- la GitHub Issue permanece abierta y documentada con el resultado real del workflow;
- no se ha realizado push como parte de `/issue $1`;
- la validación manual permanece pendiente;
- `/finish-issue $1` no se ha ejecutado.

Utiliza, cuando corresponda:

- `git branch --show-current`;
- `git status`;
- `git diff`;
- `git diff --cached`;
- `git log -1`;
- GitHub MCP para comprobar la Issue.

## Resultado

Devuelve `PASS` únicamente si todas las comprobaciones anteriores se pueden verificar correctamente.

Devuelve `FAIL` si:

- la rama activa no corresponde a la Issue o es `main`;
- falta o es inválido el SDD;
- existen tasks incompletas;
- falla o falta alguna verificación automática aplicable;
- no existe un commit de la Issue;
- quedan cambios de la Issue sin commit;
- existen cambios pendientes sin poder clasificarse como ajenos;
- la Issue está cerrada, no está documentada o no puede consultarse;
- se ha realizado push durante `/issue`;
- la validación manual se ha registrado como aprobada;
- `/finish-issue $1` ya se ha ejecutado.

## Restricciones

Este hook NO debe:

- ejecutar `git add`, crear commits, modificar archivos o alterar el historial;
- hacer push, crear Pull Requests, hacer merge o cerrar la Issue;
- cambiar de rama;
- ejecutar `/finish-issue $1`;
- aprobar o registrar la validación manual;
- exigir publicación, Pull Request, merge, Issue cerrada, validación manual aprobada ni rama destino activa.

Su responsabilidad termina después de devolver `PASS` o `FAIL` junto con la evidencia necesaria.
