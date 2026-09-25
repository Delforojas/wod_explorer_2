# Post-Commit Hook

## Propósito

Inspeccionar el estado Git inmediatamente después de crear el commit correspondiente a la GitHub Issue #$1.

Este hook recopila información objetiva sobre el commit creado, la rama activa y el estado resultante del repositorio.

No modifica el repositorio.

## Momento de ejecución

Ejecuta este hook después de:

- crear el commit;
- superar el `Commit Guard`.

Debe ejecutarse antes de documentar el resultado del workflow en GitHub.

## Comprobaciones

Obtén:

- la rama activa;
- el último commit;
- el hash del último commit;
- el mensaje del último commit;
- el estado actual del working tree;
- los cambios actualmente en staging;
- los cambios que permanecen fuera de staging;
- los archivos nuevos, modificados o eliminados que permanezcan pendientes.

Utiliza, cuando correspondan:

- `git branch --show-current`;
- `git log -1 --oneline`;
- `git rev-parse HEAD`;
- `git status`;
- `git diff`;
- `git diff --cached`.

## Resultado

Devuelve información suficiente para que el workflow pueda determinar:

- cuál es la rama activa;
- cuál es el último commit;
- cuál es su hash;
- cuál es su mensaje;
- si existen cambios pendientes después del commit;
- si existen cambios actualmente en staging;
- qué archivos permanecen modificados, nuevos o eliminados.

El hook no determina por sí mismo si los cambios pendientes pertenecen funcionalmente a la Issue.

Esa decisión corresponde al workflow y al `Post-Commit Guard`.

## Restricciones

Este hook NO debe:

- ejecutar `git add`;
- crear commits adicionales;
- modificar commits existentes;
- ejecutar `git commit --amend`;
- modificar staging;
- modificar archivos;
- descartar cambios;
- hacer `stash`;
- hacer `rebase`;
- hacer push;
- eliminar ramas;
- alterar el historial Git.

Su responsabilidad termina después de inspeccionar y devolver el estado Git posterior al commit.
