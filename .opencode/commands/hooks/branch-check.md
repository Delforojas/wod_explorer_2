# Branch Check Hook

## Propósito

Inspeccionar el estado Git del repositorio antes de preparar la rama de trabajo para la GitHub Issue #$1.

Este hook únicamente recopila y devuelve información del repositorio.

No decide qué rama debe utilizarse y no modifica el estado de Git.

## Momento de ejecución

Ejecuta este hook antes de:

- determinar la rama base;

- crear una nueva rama;

- reutilizar una rama existente;

- modificar cualquier archivo como parte de la Issue.

## Comprobaciones

Obtén:

- la rama activa;

- el estado actual del working tree;

- los cambios locales existentes;

- los cambios actualmente en staging;

- las ramas locales existentes;

- las ramas locales relacionadas con la GitHub Issue #$1.

Utiliza, cuando correspondan:

- `git branch --show-current`;

- `git status`;

- `git diff`;

- `git diff --cached`;

- `git branch`.

## Resultado

Devuelve información suficiente para que el workflow pueda determinar:

- cuál es la rama activa;

- si existen cambios locales;

- si existen cambios en staging;

- si ya existe una rama relacionada con la Issue #$1;

- si existe algún estado Git que deba tenerse en cuenta antes de preparar la rama.

## Restricciones

Este hook NO debe:

- crear ramas;

- cambiar de rama;

- determinar por sí mismo la rama base;

- generar el nombre de la nueva rama;

- hacer commit;

- hacer push;

- hacer `stash`;

- hacer `rebase`;

- eliminar ramas;

- descartar cambios;

- modificar archivos;

- alterar el historial Git.

Su responsabilidad termina después de inspeccionar y devolver el estado actual del repositorio.
