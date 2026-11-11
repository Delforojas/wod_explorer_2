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

- la política de base está registrada como `standard-main` o
  `approved-dependency`;

- para `standard-main`, `origin/main` fue verificado con un SHA exacto y la
  rama de Issue parte de ese SHA, no de la rama activa;

- para `approved-dependency`, existe aprobación explícita, la rama y el SHA
  remoto de la dependencia están registrados, la ascendencia es válida y el
  destino previsto del PR está documentado;

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

- falta el SHA exacto de la base remota o la rama no parte de la base aprobada;

- una excepción de dependencia no tiene aprobación, ascendencia, commits
  incluidos o destino de PR verificables;

- existen varias ramas para la misma Issue y no puede determinarse de forma segura cuál debe utilizarse;

- existen cambios locales ajenos a la Issue que impiden cambiar de rama o continuar de forma segura;

- `opencode.json` u otro cambio preexistente no está clasificado, se movería,
  sobrescribiría o entraría en staging;

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

Los cambios locales preexistentes, incluido `opencode.json`, deben permanecer
en el mismo estado y fuera del staging. Una Issue futura puede incluirlos solo
si su alcance lo autoriza y el conflicto local se resuelve mediante una
decisión explícita antes de preparar la rama.

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
