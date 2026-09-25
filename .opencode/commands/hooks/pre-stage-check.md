# Pre-Stage Check Hook

## Propósito

Inspeccionar el estado Git del repositorio antes de preparar el staging para la GitHub Issue #$1.

Este hook recopila información objetiva sobre los cambios existentes en el working tree y en staging.

No modifica el estado del repositorio.

## Momento de ejecución

Ejecuta este hook después de que todas las verificaciones aplicables hayan finalizado correctamente y antes de:

- preparar el staging;

- ejecutar `git add`;

- crear el commit de la Issue.

## Comprobaciones

Obtén:

- el estado actual del working tree;

- los archivos modificados;

- los archivos nuevos;

- los archivos eliminados;

- los cambios actualmente en staging;

- los cambios todavía no incluidos en staging.

Utiliza, cuando correspondan:

- `git status`;

- `git diff`;

- `git diff --cached`.

Utiliza comprobaciones Git adicionales únicamente cuando sean necesarias para identificar correctamente el estado de los cambios.

## Resultado

Devuelve información suficiente para que el workflow pueda determinar:

- qué archivos presentan cambios;

- qué cambios están fuera de staging;

- qué cambios están actualmente en staging;

- si existen archivos nuevos o eliminados;

- si existen cambios que requieren revisión antes de preparar el staging.

El hook no determina por sí mismo si un cambio pertenece funcionalmente a la Issue.

Esa decisión debe realizarse utilizando la GitHub Issue, el SDD, las tasks y el contexto del workflow.

## Restricciones

Este hook NO debe:

- ejecutar `git add`;

- modificar el staging;

- crear commits;

- hacer push;

- hacer `stash`;

- descartar cambios;

- eliminar archivos;

- sobrescribir cambios;

- modificar archivos;

- alterar el historial Git;

- decidir automáticamente que un cambio pertenece a la Issue.

Su responsabilidad termina después de inspeccionar y devolver el estado Git previo al staging.
