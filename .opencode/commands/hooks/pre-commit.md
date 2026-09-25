# Pre-Commit Hook

## Propósito

Comprobar de forma determinista el estado Git inmediatamente antes de crear el commit de la GitHub Issue #$1.

Este hook actúa como última comprobación técnica entre la preparación del staging y la ejecución de `git commit`.

No determina qué cambios pertenecen funcionalmente a la Issue, no crea el commit y no modifica el estado del repositorio.

## Momento de ejecución

Ejecuta este hook después de preparar el staging y justo antes de ejecutar:

`git commit`

## Entrada

Recibe del workflow:

- la rama de trabajo esperada;

- el conjunto de cambios que deben estar preparados para el commit;

- los cambios previamente identificados como ajenos a la Issue, cuando existan.

El hook utiliza esta información únicamente para comparar el estado Git real con el estado esperado.

## Comprobaciones

Obtén y comprueba:

- la rama activa;

- el estado actual del repositorio;

- los cambios actualmente en staging;

- los cambios que permanecen fuera de staging;

- que existe contenido preparado para el commit;

- que el contenido de staging coincide con el conjunto esperado;

- que ningún cambio previamente identificado como ajeno está incluido en staging.

Utiliza, cuando correspondan:

- `git branch --show-current`;

- `git status`;

- `git diff --cached`;

- `git diff`.

## Resultado

El hook debe devolver un resultado técnico determinista sobre el estado inmediatamente anterior al commit.

### PASS

El estado previo al commit es válido cuando:

- existe contenido en staging;

- la rama activa coincide con la rama de trabajo esperada;

- el contenido preparado coincide con el conjunto de cambios esperado;

- no existen cambios previamente identificados como ajenos dentro de staging;

- el estado Git puede determinarse de forma segura.

En este caso, el workflow puede continuar con `git commit`.

### FAIL

El estado previo al commit no es válido cuando:

- staging está vacío;

- la rama activa no coincide con la rama de trabajo esperada;

- existen cambios previamente identificados como ajenos dentro de staging;

- el contenido preparado no coincide con el conjunto de cambios esperado;

- el estado Git no puede determinarse de forma segura.

En este caso:

DETENTE.

No ejecutes `git commit`.

Devuelve el estado concreto que impide continuar.

## Restricciones

Este hook NO debe:

- determinar qué cambios pertenecen funcionalmente a la Issue;

- ejecutar `git add`;

- ejecutar `git commit`;

- modificar staging;

- descartar cambios;

- modificar archivos;

- hacer `stash`;

- hacer `rebase`;

- hacer push;

- alterar el historial Git;

- corregir automáticamente un staging incorrecto.

Su responsabilidad termina después de comparar el estado Git real con el estado esperado y devolver el resultado.
