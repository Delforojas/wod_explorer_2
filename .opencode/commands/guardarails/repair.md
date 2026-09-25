# Repair Guard

## Propósito

Garantizar que los fallos detectados durante las verificaciones solo se corrijan cuando puedan resolverse de forma segura dentro del alcance de la GitHub Issue #$1.

## Condiciones para continuar

La resolución de un fallo puede continuar únicamente si:

- el fallo está relacionado con los cambios de la Issue;
- el fallo puede investigarse con la información disponible;
- la corrección puede realizarse dentro del alcance de la Issue;
- la corrección no requiere modificar los requisitos;
- la corrección no requiere una decisión funcional importante no contemplada;
- la corrección no requiere una decisión arquitectónica importante no contemplada;
- la corrección no requiere eliminar, desactivar o relajar una verificación válida;
- la corrección no requiere modificar innecesariamente comportamiento ajeno a la Issue.

## Condiciones de bloqueo

Activa este guardrail si el fallo:

- no está relacionado con la Issue;
- requiere modificar comportamiento fuera del alcance;
- requiere ampliar el alcance de la Issue;
- requiere una decisión funcional importante no contemplada;
- requiere una decisión arquitectónica importante no contemplada;
- requiere eliminar una verificación válida;
- requiere desactivar una verificación válida;
- requiere relajar una verificación válida únicamente para conseguir que pase;
- no puede resolverse de forma segura con la información disponible;
- requiere cambios cuya repercusión no puede determinarse de forma segura.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no amplíes el alcance de la Issue;
- no corrijas problemas ajenos a la Issue;
- no modifiques requisitos por iniciativa propia;
- no realices refactorizaciones innecesarias;
- no elimines tests para conseguir que las verificaciones pasen;
- no desactives reglas de lint para ocultar fallos;
- no relajes configuraciones de build únicamente para evitar errores;
- no desactives mecanismos de verificación válidos;
- no continúes hacia el commit.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- la verificación que ha fallado;
- el fallo concreto;
- la causa identificada, cuando sea conocida;
- por qué no puede resolverse dentro del alcance;
- la decisión o intervención necesaria para continuar.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria para continuar de forma segura.

No continúes hacia el commit.
