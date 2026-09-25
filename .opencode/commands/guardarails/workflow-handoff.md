# Workflow Handoff Guard

## Propósito

Garantizar que `/issue $1` solo finalice cuando la fase de desarrollo esté completamente preparada para ser entregada al usuario para validación manual.

Este guardrail establece la frontera entre:

`desarrollo automatizado → validación manual del usuario → /finish-issue $1`

Superar este guardrail NO significa que la GitHub Issue esté finalizada ni que las validaciones manuales hayan sido aprobadas.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- existe una rama específica para la GitHub Issue #$1;
- la rama activa corresponde a la Issue;
- existe un SDD válido;
- existe una única carpeta SDD correspondiente a la Issue;
- todas las tasks están completadas;
- todas las verificaciones automáticas aplicables han finalizado correctamente;
- existe al menos un commit correspondiente a la Issue;
- el commit pertenece a la rama de trabajo;
- el hash y el mensaje del commit están disponibles;
- no quedan cambios pertenecientes a la Issue sin commit;
- la GitHub Issue está documentada con la implementación realizada;
- la documentación contiene el hash y el mensaje del commit;
- la GitHub Issue permanece abierta;
- las validaciones manuales pendientes están identificadas;
- ninguna validación manual ha sido marcada automáticamente como aprobada;
- `/finish-issue $1` permanece pendiente;
- no se ha realizado push desde `/issue $1`.

## Estado esperado del handoff

Al superar el guardrail, el estado esperado es:

- implementación completada;
- verificaciones automáticas superadas;
- cambios commiteados;
- rama únicamente local si todavía no había sido publicada;
- GitHub Issue documentada;
- GitHub Issue abierta;
- validación manual pendiente;
- `/finish-issue $1` pendiente.

## Condiciones de bloqueo

Activa este guardrail si:

- no existe una rama válida para la Issue;
- la rama activa no corresponde a la Issue;
- el SDD no es válido;
- existen varias carpetas SDD para la misma Issue;
- existen tasks pendientes;
- alguna verificación automática aplicable ha fallado, está pendiente o no ha podido completarse;
- no existe un commit correspondiente a la Issue;
- quedan cambios pertenecientes a la Issue sin commit;
- el hash o el mensaje del commit no están disponibles;
- la GitHub Issue no está correctamente documentada;
- la GitHub Issue ha sido cerrada;
- las validaciones manuales pendientes no han sido definidas;
- alguna validación manual ha sido considerada aprobada sin confirmación explícita del usuario;
- se ha ejecutado `/finish-issue $1`;
- se ha realizado push desde este workflow;
- el estado real del proyecto no permite determinar de forma segura que la implementación está preparada para validación manual.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no consideres `/issue $1` completado;
- no declares la implementación preparada para validación manual;
- no cierres la GitHub Issue;
- no hagas push;
- no ejecutes `/finish-issue $1`;
- no marques validaciones manuales como aprobadas;
- no ocultes ni ignores el estado que impide realizar el handoff.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- qué condición de entrega ha fallado;
- qué fase anterior del workflow está relacionada;
- cuál es el estado real encontrado;
- qué intervención es necesaria para poder completar el handoff.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria cuando el problema no pueda resolverse de forma segura.

No consideres `/issue $1` completado hasta que el `Workflow Handoff Guard` haya sido superado.

## Resultado satisfactorio

Si todas las condiciones se cumplen:

el `Workflow Handoff Guard` ha sido superado.

`/issue $1` puede considerarse completado.

La fase de desarrollo ha finalizado correctamente.

La GitHub Issue permanece abierta.

Las validaciones manuales permanecen pendientes de aprobación por parte del usuario.

El siguiente paso es:

`validación manual → /finish-issue $1`
