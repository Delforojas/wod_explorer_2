# Branch Guard

## Propósito

Garantizar que la GitHub Issue se desarrolla en una rama válida, específica para la Issue y basada en un estado adecuado del proyecto antes de modificar archivos.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- puede determinarse de forma segura la rama base;

- existe una rama específica para la GitHub Issue;

- la rama específica ha sido creada o reutilizada correctamente;

- la rama específica es actualmente la rama activa;

- la rama activa no es `main`;

- la rama activa corresponde a la GitHub Issue #$1;

- el número de Issue aparece correctamente en el nombre de la rama;

- los cambios locales existentes no impiden continuar de forma segura.

Verifica la rama activa mediante:

`git branch --show-current`

## Condiciones de bloqueo

Activa este guardrail si:

- no puede determinarse de forma segura cuál debe ser la rama base;

- la rama activa es `main`;

- la rama activa no corresponde a la GitHub Issue #$1;

- el número de Issue no aparece correctamente en el nombre de la rama;

- no se ha cambiado físicamente a la rama de trabajo;

- existen varias ramas para la misma Issue y no puede determinarse de forma segura cuál debe utilizarse;

- existen cambios locales ajenos a la Issue que impiden cambiar de rama o continuar de forma segura;

- continuar requeriría alterar historial existente sin autorización;

- continuar requeriría descartar, sobrescribir, mover o incluir trabajo ajeno sin autorización.

## Acciones prohibidas

El agente no debe automáticamente:

- implementar directamente sobre `main`;

- crear una segunda rama para la misma Issue cuando ya existe una válida;

- cambiar arbitrariamente la rama base;

- hacer `rebase`;

- eliminar ramas;

- descartar commits;

- alterar historial existente;

- descartar cambios locales ajenos;

- sobrescribir cambios locales ajenos;

- hacer `stash` de cambios ajenos;

- añadir cambios ajenos al staging;

- incluir cambios ajenos en commits.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones de bloqueo:

DETENTE.

No crees ni modifiques el SDD.

No implementes cambios.

No modifiques archivos del proyecto.

No continúes con las siguientes fases del workflow.

Informa al usuario del bloqueo concreto.

Si el bloqueo está relacionado con cambios locales, identifica qué cambios impiden continuar cuando sea posible.

Solicita únicamente la decisión o intervención necesaria para continuar de forma segura.
