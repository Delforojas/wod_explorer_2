# Manual Validation Guard

## Propósito

Garantizar que las validaciones manuales propuestas para la GitHub Issue #$1 sean específicas, relevantes y ejecutables, y que permanezcan pendientes hasta que el usuario las confirme explícitamente.

Este guardrail establece la frontera entre la validación automática realizada por el agente y la validación manual que corresponde exclusivamente al usuario.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- las validaciones manuales están relacionadas directamente con la GitHub Issue #$1;
- las validaciones se derivan del comportamiento realmente implementado;
- las validaciones son concretas y ejecutables por el usuario;
- las validaciones cubren los comportamientos relevantes que requieren comprobación manual;
- las validaciones no duplican innecesariamente verificaciones automáticas ya superadas;
- no se han inventado validaciones sin relación con los cambios realizados;
- todas las validaciones manuales aparecen como pendientes;
- ninguna validación manual ha sido marcada automáticamente como completada;
- no se ha asumido que ninguna validación manual ha sido superada;
- la validación manual no ha sido registrada como aprobada sin confirmación explícita del usuario.

Si no existe ninguna validación manual razonable, esta condición debe indicarse explícitamente y no deben inventarse validaciones.

## Condiciones de bloqueo

Activa este guardrail si:

- las validaciones propuestas no están relacionadas con la Issue;
- las validaciones son genéricas y no representan el comportamiento implementado;
- las validaciones no son suficientemente concretas para que el usuario pueda ejecutarlas;
- falta una validación manual necesaria para un comportamiento relevante;
- se han añadido validaciones innecesarias únicamente para completar la checklist;
- se duplican verificaciones automáticas sin una razón funcional;
- alguna validación manual aparece marcada como completada sin confirmación explícita del usuario;
- se ha asumido que una validación manual ha pasado;
- se ha registrado la validación manual como aprobada sin confirmación explícita del usuario;
- no puede determinarse de forma segura qué validaciones manuales son necesarias.

## Acciones prohibidas

El agente no debe:

- marcar automáticamente ninguna validación manual como completada;
- asumir que una validación manual ha pasado;
- registrar una validación manual como aprobada sin confirmación explícita del usuario;
- inventar resultados de validaciones manuales;
- ejecutar `/finish-issue $1`;
- cerrar la GitHub Issue;
- hacer push como consecuencia de esta fase.

La aprobación de las validaciones manuales corresponde exclusivamente al usuario.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- qué validación manual presenta el problema;
- qué comportamiento de la Issue debería cubrir;
- qué condición del guardrail ha fallado;
- qué información o intervención es necesaria para resolverlo.

Informa al usuario del bloqueo concreto.

Solicita únicamente la información o intervención necesaria para continuar.

No continúes al punto 15 hasta que el `Manual Validation Guard` haya sido superado.

## Estado de las validaciones

Superar este guardrail NO significa que las validaciones manuales hayan sido aprobadas.

Significa únicamente que:

- la checklist de validación manual ha sido correctamente definida;
- las validaciones están preparadas para ser ejecutadas por el usuario;
- todas las validaciones permanecen pendientes.

La aprobación real solo puede producirse mediante confirmación explícita del usuario.
