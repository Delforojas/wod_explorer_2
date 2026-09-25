# Post-Commit Guard

## Propósito

Garantizar que, después de crear el commit, el estado real del repositorio corresponde al esperado y que todo el trabajo perteneciente a la GitHub Issue #$1 está incluido en el commit antes de continuar.

Debe mantenerse la trazabilidad:

`GitHub Issue → SDD → tasks → implementación → verificaciones → cambios Git → commit → estado post-commit`

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- el commit creado durante este workflow existe;

- el commit sigue siendo el último commit esperado;

- el commit puede identificarse mediante el hash obtenido anteriormente;

- la rama activa corresponde a la GitHub Issue #$1;

- todo el trabajo perteneciente a la Issue está incluido en el commit;

- no quedan cambios pertenecientes a la Issue pendientes en el working tree;

- no quedan cambios pertenecientes a la Issue pendientes en staging;

- no quedan archivos nuevos, modificados o eliminados pertenecientes a la Issue pendientes de incluir.

La existencia de cambios locales ajenos a la Issue no bloquea por sí sola el workflow si pueden identificarse de forma segura y permanecen intactos.

## Condiciones de bloqueo

Activa este guardrail si:

- el commit esperado no existe;

- el último commit no corresponde al commit esperado;

- el hash no corresponde al commit creado durante este workflow;

- la rama activa no corresponde a la GitHub Issue #$1;

- quedan cambios pertenecientes a la Issue sin commit;

- quedan cambios pertenecientes a la Issue en staging;

- quedan archivos nuevos, modificados o eliminados pertenecientes a la Issue pendientes de incluir;

- existen cambios pendientes cuya relación con la Issue no puede determinarse de forma segura;

- no puede determinarse de forma segura que todo el trabajo de la Issue está incluido en el commit.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no documentes la Issue como completada;

- no cierres la Issue;

- no hagas push;

- no crees automáticamente otro commit sin determinar primero la causa del problema;

- no modifiques cambios ajenos a la Issue;

- no elimines cambios ajenos a la Issue;

- no descartes cambios ajenos a la Issue;

- no hagas `stash` automáticamente de cambios ajenos;

- no añadas cambios ajenos al staging;

- no incluyas cambios ajenos en commits adicionales.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- la rama activa;

- el último commit;

- el hash esperado;

- los cambios pendientes detectados;

- cuáles pertenecen claramente a la Issue;

- cuáles son ajenos a la Issue;

- cuáles no pueden clasificarse de forma segura.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria cuando el problema no pueda resolverse de forma segura.

No continúes al siguiente punto del workflow hasta que el `Post-Commit Guard` haya sido superado.
