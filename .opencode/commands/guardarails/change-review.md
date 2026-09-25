# Change Review Guard

## Propósito

Garantizar que únicamente los cambios pertenecientes a la GitHub Issue #$1 puedan avanzar hacia la preparación del commit, preservando cualquier trabajo local ajeno o preexistente.

Debe mantenerse la trazabilidad:

`GitHub Issue → spec.md → plan.md → tasks.md → implementación → cambios Git`

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- los cambios necesarios para completar la Issue están presentes;

- cada cambio que vaya a formar parte del commit puede justificarse por la Issue, el SDD o las tasks;

- se han identificado los archivos modificados, nuevos y eliminados;

- se han identificado los cambios que ya estuvieran en staging;

- se han considerado los cambios locales preexistentes;

- no existen cambios accidentales que vayan a incluirse en el commit;

- no se van a incluir cambios ajenos al alcance de la Issue;

- los cambios pertenecientes a la Issue pueden separarse de forma segura de cualquier cambio ajeno.

La existencia de cambios ajenos a la Issue no bloquea por sí sola el workflow si pueden mantenerse intactos y separarse de forma segura.

## Condiciones de bloqueo

Activa este guardrail si:

- no puede determinarse de forma segura qué cambios pertenecen a la Issue;

- los cambios de la Issue están mezclados con cambios ajenos y no pueden separarse de forma segura;

- existen cambios accidentales cuya procedencia o impacto no puede determinarse;

- preparar el commit requeriría modificar, eliminar o descartar trabajo ajeno;

- preparar el commit requeriría incluir cambios locales preexistentes que no pertenecen a la Issue;

- no puede justificarse alguno de los cambios que sería necesario incluir;

- separar los cambios podría afectar trabajo ajeno o preexistente.

## Acciones prohibidas

Los cambios ajenos a la Issue:

- no deben modificarse;

- no deben eliminarse;

- no deben descartarse;

- no deben incluirse en el staging;

- no deben incluirse en el commit;

- no deben moverse mediante `stash` automáticamente;

- no deben sobrescribirse.

No prepares el commit mientras exista una condición de bloqueo.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

No prepares el commit.

Identifica:

- los archivos o cambios que generan el conflicto;

- qué cambios pertenecen claramente a la Issue;

- qué cambios son ajenos, preexistentes o de procedencia incierta;

- por qué no pueden separarse de forma segura.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria para continuar de forma segura.
