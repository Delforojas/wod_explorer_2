# Commit Guard

## Propósito

Garantizar que exista un commit real, válido y trazable para la GitHub Issue #$1 antes de permitir que el workflow continúe.

El commit debe representar exclusivamente el trabajo correspondiente a la Issue y mantener la trazabilidad:

`GitHub Issue → SDD → tasks → implementación → verificaciones → cambios Git → commit`

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- se ha creado realmente un commit durante este workflow;

- el commit pertenece a la rama de trabajo de la GitHub Issue #$1;

- el commit contiene únicamente cambios pertenecientes a la Issue;

- ningún cambio ajeno o preexistente ha sido incluido accidentalmente;

- el commit no está vacío;

- el commit puede identificarse mediante su hash;

- el mensaje del commit respeta las convenciones Git aplicables del proyecto;

- el contenido del commit puede justificarse mediante la Issue, el SDD y las tasks implementadas.

## Condiciones de bloqueo

Activa este guardrail si:

- no se ha creado realmente un commit;

- el commit se ha creado en una rama incorrecta;

- el commit contiene cambios ajenos a la Issue;

- el commit contiene cambios locales preexistentes que no pertenecen a la Issue;

- el commit contiene archivos generados o modificados accidentalmente;

- el commit está vacío;

- no puede determinarse de forma segura qué cambios contiene;

- no puede obtenerse o identificarse su hash;

- el mensaje incumple las convenciones Git aplicables;

- el contenido del commit no puede justificarse mediante la Issue y el SDD;

- no puede determinarse de forma segura que el commit corresponde al trabajo realizado durante este workflow.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no continúes al siguiente punto del workflow;

- no documentes la Issue como completada;

- no cierres la Issue;

- no hagas push;

- no crees commits adicionales únicamente para ocultar el problema;

- no modifiques historial Git automáticamente para ocultar el problema;

- no descartes trabajo ajeno;

- no sobrescribas trabajo ajeno.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- el commit afectado, cuando exista;

- la rama actual;

- el hash del commit, cuando pueda obtenerse;

- la condición concreta que ha fallado;

- los cambios problemáticos, cuando corresponda.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria cuando el problema no pueda resolverse de forma segura.

No continúes al siguiente punto del workflow hasta que el `Commit Guard` haya sido superado.
