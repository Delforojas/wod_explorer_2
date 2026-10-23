# Change Review Guard

## Propósito

Garantizar que únicamente los cambios pertenecientes a la GitHub Issue #$1
puedan avanzar hacia la preparación del commit, preservando cualquier trabajo
local ajeno o preexistente.

Debe mantenerse la trazabilidad:

`GitHub Issue → spec.md → plan.md → tasks.md → implementación → cambios Git`

Este guardrail evalúa decisiones. No vuelve a observar Git ni el SDD cuando
`pre_stage_evidence` sigue válida.

## Entrada obligatoria

El workflow debe proporcionar exactamente una observación en sesión
`pre_stage_evidence` producida por:

`.opencode/commands/hooks/pre-stage-check.md`

La observación debe conservar `source`, `phase`, `observed_at`, repositorio,
Issue, rama, `HEAD`, estado Git, manifiesto `A/M/D/R`, paths protegidos, estado
del SDD, `status` e `invalidated_by`.

El contexto de la Issue, el SDD y las tasks utilizado para justificar la
pertenencia debe ser el ya reunido por el workflow. No se debe reconstruir ni
volver a consultar ese contexto mientras las fuentes y la observación no hayan
cambiado.

## Consumo de la evidencia

Antes de evaluar cualquier decisión:

- devuelve `BLOCK` si `pre_stage_evidence` falta;
- devuelve `BLOCK` si está incompleta o contradictoria;
- devuelve `BLOCK` si su `source`, `phase`, repositorio, Issue o `HEAD` no
  corresponden al workflow actual;
- devuelve `BLOCK` si ocurrió alguna condición de `invalidated_by`;
- devuelve `BLOCK` si el estado de `opencode.json` o de otro path protegido no
  puede determinarse.

Si la observación es válida, consume directamente sus listas y estados. No
ejecutes de nuevo `git status`, `git diff`, `git diff --cached` ni lecturas del
SDD para reconstruir los mismos datos. Si hace falta una observación nueva, el
workflow debe detenerse, ejecutar de nuevo el hook y volver a cargar este
guardrail.

## Condiciones para continuar

El guardrail devuelve `PASS` únicamente si, usando la observación válida y el
contexto de la Issue:

- los cambios necesarios para completar la Issue están presentes;
- cada cambio que vaya a formar parte del commit puede justificarse por la
  Issue, el SDD o las tasks;
- los archivos modificados, nuevos, eliminados y renombrados están identificados;
- los cambios que ya estaban en staging están identificados;
- los cambios locales preexistentes están identificados;
- `opencode.json` y cualquier otro path protegido está registrado y permanece
  fuera del staging salvo autorización explícita de alcance;
- no existen cambios accidentales que vayan a incluirse en el commit;
- no se van a incluir cambios ajenos al alcance de la Issue;
- los cambios pertenecientes a la Issue pueden separarse de forma segura de
  cualquier cambio ajeno;
- el estado observado de `spec.md`, `plan.md` y `tasks.md` permite evaluar la
  sincronización final requerida antes del staging.

La existencia de cambios ajenos a la Issue no bloquea por sí sola el workflow
si pueden mantenerse intactos y separarse de forma segura.

## Condiciones de bloqueo

Devuelve `BLOCK` si:

- no puede determinarse de forma segura qué cambios pertenecen a la Issue;
- los cambios de la Issue están mezclados con cambios ajenos y no pueden
  separarse de forma segura;
- existen cambios accidentales cuya procedencia o impacto no puede determinarse;
- preparar el commit requeriría modificar, eliminar o descartar trabajo ajeno;
- preparar el commit requeriría incluir cambios locales preexistentes que no
  pertenecen a la Issue;
- `opencode.json` u otro cambio preexistente aparecería en staging sin una
  autorización explícita de alcance y una resolución previa del conflicto;
- no puede justificarse alguno de los cambios que sería necesario incluir;
- separar los cambios podría afectar trabajo ajeno o preexistente;
- el estado SDD observado muestra una sincronización pendiente o no permite
  determinarla con seguridad;
- la evidencia requerida es ausente, incompleta, contradictoria o inválida.

## Acciones prohibidas

Los cambios ajenos a la Issue:

- no deben modificarse;
- no deben eliminarse;
- no deben descartarse;
- no deben incluirse en el staging;
- no deben incluirse en el commit;
- no deben moverse mediante `stash` automáticamente;
- no deben sobrescribirse.

Los cambios preexistentes protegidos deben conservar exactamente su estado
antes y después de la revisión. Una autorización futura para modificar uno de
ellos no permite sobrescribirlo automáticamente ni resolver el conflicto sin
una decisión explícita previa.

No prepares el commit mientras exista una condición de bloqueo.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

No prepares el commit ni ejecutes observaciones Git o SDD duplicadas desde este
guardrail. Identifica:

- los archivos o cambios que generan el conflicto;
- qué cambios pertenecen claramente a la Issue;
- qué cambios son ajenos, preexistentes o de procedencia incierta;
- por qué no pueden separarse de forma segura;
- qué condición invalidó o dejó incompleta la evidencia.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria para continuar de forma segura.
