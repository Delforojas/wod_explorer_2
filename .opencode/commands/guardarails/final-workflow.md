# Final Workflow Guard

## Propósito

Garantizar que todas las fases automáticas del workflow `/issue $1` han finalizado correctamente y que existe un estado completo, coherente y trazable antes de avanzar a la fase de validación manual.

Debe existir trazabilidad coherente entre:

`GitHub Issue → SDD → tasks → implementación → verificaciones → cambios Git → commit → documentación GitHub`

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- la rama activa corresponde a la GitHub Issue #$1;
- existe una única carpeta SDD correspondiente a la Issue;
- la carpeta SDD tiene un número y slug válidos;
- `spec.md` existe y contiene contenido válido;
- `plan.md` existe y contiene contenido válido;
- `tasks.md` existe y contiene contenido válido;
- todas las tasks están completadas;
- los criterios de aceptación están cubiertos por la implementación;
- todas las verificaciones aplicables han finalizado correctamente;
- existe un commit creado durante este workflow para la Issue;
- el commit pertenece a la rama de trabajo correspondiente;
- el hash del commit está disponible;
- no quedan cambios pertenecientes a la Issue sin commit;
- no quedan cambios pertenecientes a la Issue pendientes en staging;
- la GitHub Issue ha sido documentada correctamente;
- la documentación de GitHub refleja el resultado real del workflow;
- la GitHub Issue permanece abierta;
- no se ha realizado push.

## Condiciones de bloqueo

Activa este guardrail si:

- la rama activa no corresponde a la Issue;
- falta el SDD;
- existen varias carpetas SDD para la misma Issue;
- la carpeta SDD tiene un nombre o slug inválido;
- falta alguno de los archivos obligatorios del SDD;
- alguno de los archivos obligatorios del SDD no contiene contenido válido;
- existen tasks pendientes;
- algún criterio de aceptación no está cubierto;
- alguna verificación aplicable ha fallado, está pendiente o no ha podido completarse;
- no existe el commit esperado;
- el commit no corresponde a la rama de trabajo;
- el hash del commit no está disponible;
- quedan cambios pertenecientes a la Issue sin commit;
- quedan cambios pertenecientes a la Issue pendientes en staging;
- la GitHub Issue no ha sido documentada correctamente;
- la GitHub Issue ha sido cerrada;
- se ha realizado push;
- existe cualquier inconsistencia que rompa la trazabilidad del workflow.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no declares superada la verificación final;
- no declares la implementación lista para validación manual;
- no cierres la Issue;
- no hagas push;
- no ejecutes `/finish-issue $1`;
- no ocultes ni ignores la condición fallida;
- no alteres el estado del proyecto únicamente para aparentar que el workflow ha sido completado.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

EL WORKFLOW HA FALLADO.

DETENTE.

Identifica exactamente:

- qué condición ha fallado;
- en qué fase del workflow se encuentra el problema;
- qué elemento rompe la trazabilidad;
- qué intervención es necesaria para poder continuar.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria cuando el problema no pueda resolverse de forma segura.

No continúes al punto 14 hasta que el `Final Workflow Guard` haya sido superado.

## Resultado satisfactorio

Si todas las condiciones se cumplen:

el `Final Workflow Guard` ha sido superado.

La fase automática de desarrollo y verificación está correctamente completada.

El workflow puede avanzar a la preparación de la validación manual.
