# Finish Workflow Check Hook

## Propósito

Comprobar de forma objetiva el estado final del repositorio y de GitHub después

de completar `/finish-issue $1`.

Este hook actúa como última comprobación técnica del workflow de finalización

de una GitHub Issue.

No implementa trabajo, no corrige problemas y no modifica el estado del

repositorio ni de GitHub.

## Momento de ejecución

Ejecuta este hook después de:

- publicar la rama de trabajo;

- integrar la rama mediante Pull Request;

- confirmar el merge en la rama destino;

- sincronizar la rama destino local;

- documentar la finalización en la GitHub Issue;

- cerrar la Issue.

Debe ejecutarse antes de mostrar el resumen final de `/finish-issue $1`.

## Entrada

Recibe del workflow, cuando estén disponibles:

- número de la Issue;

- rama de trabajo;

- rama base;

- rama destino;

- remoto utilizado;

- hash del commit final de la Issue;

- archivos pertenecientes a la Issue;

- Pull Request utilizado;

- hash resultante del merge;

- cambios locales identificados como ajenos a la Issue.

Utiliza esta información únicamente para comparar el estado final real con

el estado esperado.

## Comprobaciones

### 1. Estado de la rama de trabajo

Comprueba que:

- la rama de trabajo corresponde a la Issue #$1;

- la rama fue publicada correctamente;

- existe su correspondiente referencia remota;

- el commit final de la Issue está disponible en remoto.

No publiques la rama desde este hook.

### 2. Commit de la Issue

Comprueba que:

- existe el commit final identificado por el workflow;

- su hash coincide con el esperado;

- pertenece al historial correspondiente a la Issue;

- no quedan cambios pertenecientes a la Issue pendientes de commit.

Los cambios locales ajenos a la Issue no deben provocar `FAIL` únicamente

por existir, siempre que estén identificados y permanezcan fuera de los

commits de la Issue.

### 3. Pull Request

Comprueba mediante GitHub MCP que:

- existe el Pull Request utilizado por el workflow;

- su rama `head` corresponde a la rama de trabajo;

- su rama `base` corresponde a la rama destino esperada;

- contiene los cambios correspondientes a la Issue;

- su estado final es `merged`.

Si el Pull Request no está integrado correctamente:

**FAIL.**

### 4. Rama destino remota

Comprueba que:

- la rama destino existe en remoto;

- contiene los cambios integrados mediante el Pull Request;

- el resultado del merge está disponible en remoto.

Cuando el workflow haya proporcionado un hash resultante del merge,

comprueba que dicho resultado pertenece al historial de la rama destino.

### 5. Rama destino local

Comprueba que:

- la rama activa al finalizar es la rama destino;

- la rama destino local contiene los cambios de la Issue;

- la rama destino local está sincronizada con su correspondiente rama remota.

No cambies de rama desde este hook.

### 6. Working tree

Comprueba:

- el estado actual del working tree;

- el estado del staging;

- si existen cambios pendientes;

- si los cambios pendientes habían sido identificados previamente como ajenos

  a la Issue.

Los cambios locales ajenos a la Issue pueden permanecer en el working tree

siempre que:

- hayan sido identificados previamente;

- no formen parte de los commits de la Issue;

- no hayan sido modificados por `/finish-issue`;

- no impidan verificar el estado final del workflow.

Si aparecen cambios inesperados cuya relación con la Issue no puede

determinarse de forma segura:

**FAIL.**

### 7. Validación manual

Comprueba que el workflow dispone de evidencia de que:

- el usuario indicó explícitamente que la validación manual fue aprobada.

Este hook no ejecuta ni repite la validación manual.

Si no existe evidencia de su aprobación:

**FAIL.**

### 8. Estado de la GitHub Issue

Comprueba mediante GitHub MCP que:

- la finalización fue documentada;

- la información registrada corresponde al workflow ejecutado;

- la Issue #$1 está cerrada.

No modifiques ni cierres la Issue desde este hook.

## Resultado

El hook debe devolver un resultado técnico determinista.

### PASS

Devuelve `PASS` únicamente si:

- la rama de trabajo fue publicada correctamente;

- el commit final de la Issue existe en remoto;

- no quedan cambios pertenecientes a la Issue pendientes de commit;

- el Pull Request fue integrado correctamente;

- los cambios de la Issue existen en la rama destino remota;

- la rama destino local contiene los cambios de la Issue;

- la rama destino local está sincronizada con su correspondiente rama remota;

- la rama activa es la rama destino;

- la validación manual está registrada como aprobada;

- la finalización está documentada;

- la GitHub Issue está cerrada;

- no existen bloqueos pendientes.

Conserva para el resumen final:

- Issue;

- rama de trabajo;

- rama base;

- rama destino;

- remoto utilizado;

- hash y mensaje del commit final;

- archivos cambiados por la Issue;

- estado del working tree;

- cambios locales ajenos, si existen;

- estado del push;

- Pull Request;

- estado del merge;

- estrategia de merge, si está disponible;

- hash resultante del merge, si está disponible;

- estado de la validación manual;

- estado final de la Issue;

- rama activa al finalizar.

### FAIL

Devuelve `FAIL` si cualquiera de las condiciones necesarias para considerar

finalizado el workflow no puede verificarse correctamente.

Indica de forma explícita:

- qué comprobación ha fallado;

- cuál era el estado esperado;

- cuál es el estado observado;

- qué evidencia ha permitido detectar el problema.

No intentes resolver automáticamente el fallo.

## Restricciones

Este hook NO debe:

- implementar trabajo;

- modificar código;

- modificar archivos;

- modificar el SDD;

- completar tasks;

- ejecutar tests, build o lint;

- ejecutar `git add`;

- crear commits;

- modificar commits;

- ejecutar `git commit --amend`;

- cambiar de rama;

- hacer `stash`;

- hacer rebase;

- hacer push;

- hacer force push;

- crear Pull Requests;

- hacer merge;

- modificar Pull Requests;

- modificar la GitHub Issue;

- cerrar la GitHub Issue;

- eliminar ramas;

- descartar cambios;

- alterar el historial Git;

- corregir automáticamente ningún estado inválido.

Su responsabilidad termina después de comprobar el estado final del workflow

y devolver `PASS` o `FAIL` junto con la evidencia necesaria.
