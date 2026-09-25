# Context Guard

## Propósito

Garantizar que el contexto disponible del proyecto es suficiente, coherente y compatible con la GitHub Issue antes de comenzar cualquier modificación.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- se ha revisado el contexto relevante disponible para la Issue;
- se han identificado y respetado los `AGENTS.md` aplicables;
- se han considerado las reglas, Constitución o documentación equivalente cuando existan;
- la Issue es compatible con la arquitectura existente o permite determinar de forma segura los cambios necesarios;
- no existen contradicciones relevantes entre la Issue y las reglas del proyecto;
- existe información suficiente para continuar de forma segura.

## Condiciones de bloqueo

Activa este guardrail si:

- existe una contradicción relevante entre la GitHub Issue y los `AGENTS.md` aplicables;
- existe una contradicción relevante entre la GitHub Issue y las reglas del proyecto;
- existe una contradicción relevante con la arquitectura existente;
- distintas instrucciones aplicables son incompatibles entre sí;
- falta contexto necesario para determinar de forma segura qué debe implementarse;
- continuar requeriría inventar arquitectura, reglas, dependencias, convenciones o comportamientos no definidos;
- existe una decisión funcional o técnica necesaria que no puede resolverse mediante el contexto disponible.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

No modifiques archivos.

No crees ni modifiques el SDD.

No implementes cambios.

No continúes con las siguientes fases del workflow.

Informa al usuario del bloqueo concreto.

Indica qué fuentes o reglas están en conflicto cuando sea posible.

Solicita únicamente la aclaración o decisión necesaria para poder continuar.
