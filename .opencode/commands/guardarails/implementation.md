# Implementation Guard

## Propósito

Garantizar que durante toda la implementación los cambios permanecen alineados con la GitHub Issue, el SDD, la arquitectura y las reglas del proyecto.

Debe mantenerse la trazabilidad:

`GitHub Issue → spec.md → plan.md → tasks.md → implementación`

## Condiciones para continuar

El guardrail se considera superado mientras:

- la implementación permanece dentro del alcance de la GitHub Issue #$1;
- los cambios corresponden a las tasks definidas;
- los cambios son coherentes con `spec.md`;
- los cambios siguen el enfoque definido en `plan.md`;
- se respetan los `AGENTS.md` aplicables;
- se respetan la arquitectura, tecnologías y convenciones existentes;
- no se introducen decisiones funcionales importantes no contempladas;
- no se introducen decisiones arquitectónicas importantes no contempladas;
- no aparecen dependencias necesarias que invaliden la planificación;
- no es necesario ampliar el alcance de la Issue para continuar;
- el comportamiento existente fuera del alcance de la Issue permanece preservado.

## Condiciones de bloqueo

Activa este guardrail si durante la implementación aparece:

- una decisión funcional importante no contemplada;
- una decisión arquitectónica importante no contemplada;
- una dependencia necesaria no prevista;
- una contradicción entre la implementación y la GitHub Issue;
- una contradicción entre la implementación y el SDD;
- una contradicción con los `AGENTS.md` aplicables;
- una contradicción relevante con la arquitectura o las reglas del proyecto;
- trabajo adicional necesario que excede el alcance de la Issue;
- una modificación ajena a la Issue que no puede justificarse técnicamente;
- la necesidad de introducir infraestructura, dependencias o complejidad no contempladas para poder continuar;
- cualquier situación que requiera modificar los requisitos para completar una task.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no amplíes el alcance;
- no improvises una solución que modifique los requisitos;
- no tomes decisiones funcionales importantes por iniciativa propia;
- no tomes decisiones arquitectónicas importantes no respaldadas por el SDD o el contexto disponible;
- no continúes con la task afectada;
- no marques la task afectada como completada;
- no continúes con las siguientes tasks.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- la task afectada;
- el bloqueo encontrado;
- la parte de la Issue, spec, plan o arquitectura relacionada;
- la decisión necesaria para poder continuar.

Informa al usuario del bloqueo concreto.

Solicita únicamente la aclaración o decisión necesaria para continuar de forma segura.
