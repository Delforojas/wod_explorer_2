# Issue Guard

## Propósito

Garantizar que existe una GitHub Issue válida y con información suficiente antes de iniciar el workflow de desarrollo.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- la GitHub Issue solicitada existe;

- la Issue puede obtenerse mediante el GitHub MCP configurado;

- puede identificarse el trabajo solicitado;

- existe información suficiente para continuar de forma segura con el análisis del proyecto.

## Condiciones de bloqueo

Activa este guardrail si:

- no puede obtenerse la GitHub Issue;

- la Issue no existe;

- el GitHub MCP necesario no está disponible;

- el contenido de la Issue no permite identificar suficientemente el trabajo solicitado;

- existe una ambigüedad crítica que impide continuar de forma segura.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

No crees una rama.

No crees ni modifiques el SDD.

No implementes cambios.

No continúes con las siguientes fases del workflow.

Informa al usuario del bloqueo concreto y solicita únicamente la información o intervención necesaria para continuar.
