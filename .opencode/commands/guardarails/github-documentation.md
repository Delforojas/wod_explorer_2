# GitHub Documentation Guard

## Propósito

Garantizar que la documentación publicada en la GitHub Issue #$1 representa de forma fiel, verificable y trazable el trabajo realizado durante este workflow.

La documentación debe mantener la trazabilidad:

`GitHub Issue → SDD → tasks → implementación → verificaciones → commit → documentación GitHub`

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- la GitHub Issue #$1 ha sido actualizada correctamente;

- la documentación corresponde a la Issue correcta;

- la documentación refleja únicamente trabajo realmente realizado;

- la implementación documentada corresponde al trabajo ejecutado;

- las verificaciones documentadas corresponden únicamente a verificaciones realmente ejecutadas;

- los resultados documentados corresponden a los resultados reales obtenidos;

- el hash documentado corresponde al commit creado durante este workflow;

- el mensaje documentado corresponde al commit creado durante este workflow;

- el nombre de la rama documentado corresponde a la rama de trabajo actual;

- la documentación indica que la implementación está completada;

- la documentación indica que las verificaciones aplicables han finalizado correctamente;

- la documentación indica que los cambios están commiteados;

- la Issue permanece abierta;

- la validación manual aparece explícitamente como pendiente;

- se indica que `/finish-issue $1` debe ejecutarse después de la validación manual.

## Condiciones de bloqueo

Activa este guardrail si:

- no puede actualizarse correctamente la GitHub Issue;

- se ha actualizado una Issue incorrecta;

- la documentación contiene trabajo que no se ha realizado;

- la documentación indica como ejecutada una verificación que no se realizó;

- la documentación indica como satisfactoria una verificación que falló, fue omitida o no pudo completarse;

- el hash documentado no corresponde al commit esperado;

- el mensaje documentado no corresponde al commit esperado;

- el nombre de la rama documentado es incorrecto;

- la documentación declara la Issue como cerrada o finalizada definitivamente;

- la documentación no deja explícitamente pendiente la validación manual;

- no puede determinarse de forma segura que la información publicada corresponde al estado real del workflow.

## Acciones prohibidas

Si se activa una condición de bloqueo:

- no continúes al siguiente punto del workflow;

- no declares el workflow como finalizado;

- no cierres la Issue;

- no hagas push;

- no inventes información para completar la documentación;

- no documentes verificaciones que no se hayan ejecutado;

- no ocultes verificaciones fallidas, omitidas o incompletas;

- no declares completada la validación manual si el usuario todavía no la ha realizado.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica:

- la GitHub Issue afectada;

- la información que no ha podido documentarse correctamente;

- cualquier discrepancia entre el estado real del workflow y la documentación publicada;

- el error producido por el GitHub MCP, cuando corresponda;

- la intervención necesaria para continuar.

Informa al usuario del bloqueo concreto.

Solicita únicamente la intervención necesaria cuando el problema no pueda resolverse de forma segura.

No continúes al siguiente punto del workflow hasta que el `GitHub Documentation Guard` haya sido superado
