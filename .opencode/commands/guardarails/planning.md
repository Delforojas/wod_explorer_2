# Planning Guard

## Propósito

Garantizar que la planificación definida en el SDD es coherente, completa y viable antes de permitir que comience la implementación.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- `spec.md` cubre los criterios de aceptación de la GitHub Issue #$1;
- el alcance de `spec.md` corresponde al alcance de la Issue;
- `plan.md` permite implementar lo definido en `spec.md`;
- `plan.md` es compatible con la arquitectura, tecnologías y convenciones existentes;
- `tasks.md` representa el trabajo necesario definido en `spec.md` y `plan.md`;
- las tasks son concretas, ejecutables y verificables;
- las dependencias entre tasks están identificadas cuando sean relevantes;
- las verificaciones previstas permiten demostrar los criterios de aceptación;
- no existen decisiones funcionales importantes sin resolver;
- no existen decisiones arquitectónicas importantes sin resolver;
- no existen contradicciones relevantes con los `AGENTS.md` aplicables;
- no existen contradicciones relevantes con las reglas del proyecto;
- no existe trabajo planificado fuera del alcance de la Issue;
- no se requieren cambios innecesarios para completar la Issue.

Debe existir trazabilidad coherente entre:

`GitHub Issue → spec.md → plan.md → tasks.md → verificaciones`

## Condiciones de bloqueo

Activa este guardrail si:

- existen criterios de aceptación sin cubrir;
- existen requisitos importantes sin representar en el SDD;
- `spec.md` introduce alcance no respaldado por la Issue;
- `plan.md` no permite implementar correctamente la spec;
- existen incompatibilidades relevantes con la arquitectura existente;
- existen tasks insuficientes;
- existen tasks ambiguas, no ejecutables o no verificables;
- existen dependencias necesarias entre tasks que no han sido resueltas;
- las verificaciones previstas no permiten demostrar los criterios de aceptación;
- existe una contradicción entre Issue, spec, plan o tasks;
- existe una decisión funcional importante sin resolver;
- existe una decisión arquitectónica importante sin resolver;
- completar la planificación requeriría ampliar el alcance de la Issue;
- existen cambios innecesarios no justificados por la Issue.

## Acciones prohibidas

Mientras el Planning Guard no haya sido superado:

- no comiences la implementación;
- no modifiques código como parte de la implementación;
- no marques tasks de implementación como completadas;
- no amplíes el alcance de la Issue;
- no tomes decisiones funcionales importantes por iniciativa propia;
- no tomes decisiones arquitectónicas importantes no respaldadas por el contexto disponible;
- no continúes con las siguientes fases del workflow.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica exactamente qué parte de la cadena de planificación presenta el problema.

Indica los criterios de aceptación, archivos del SDD, tasks o decisiones afectadas cuando corresponda.

Informa al usuario del bloqueo concreto.

Solicita únicamente la aclaración o decisión necesaria para poder continuar.

No comiences la implementación hasta que la planificación sea viable.
