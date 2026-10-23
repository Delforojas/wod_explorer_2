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

La sincronización final de `spec.md`, `plan.md` y `tasks.md` debe estar
completada antes de ejecutar este hook. Este hook es una frontera de revisión
de solo lectura: no debe permitir que avance un SDD que todavía requiera
registrar el estado de tasks ya terminadas.

## Comprobaciones

Obtén:

- el estado actual del working tree;

- los archivos modificados;

- los archivos nuevos;

- los archivos eliminados;

- los cambios actualmente en staging;

- los cambios todavía no incluidos en staging;

- la lista completa de cambios locales preexistentes y no relacionados,
  incluyendo `opencode.json` cuando esté modificado.

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

- si existen cambios que requieren revisión antes de preparar el staging;

- si algún archivo preexistente protegido aparece en staging o sería movido por
  la preparación del commit.

Comprueba también que:

- el workflow ha contrastado el estado actual de `tasks.md` con la
  implementación y las verificaciones antes de preparar el staging;
- toda task cuyo trabajo real está terminado ya aparece marcada como
  completada;
- no existe una actualización del SDD conocida o pendiente que deba hacerse
  después de esta revisión;
- `spec.md`, `plan.md` y `tasks.md` forman parte del conjunto revisado cuando
  pertenecen al alcance de la Issue.

Si alguna comprobación falla, devuelve `FAIL` y no ejecutes `git add`. El
workflow debe sincronizar el SDD y repetir la revisión antes de continuar.

El hook no determina por sí mismo si un cambio pertenece funcionalmente a la Issue.

Esa decisión debe realizarse utilizando la GitHub Issue, el SDD, las tasks y el contexto del workflow.

`opencode.json` y cualquier otro cambio preexistente deben conservarse en el
estado original y fuera del staging. Solo pueden pasar a ser archivos de la
Issue si el alcance lo autoriza explícitamente y el conflicto local se ha
resuelto antes de preparar el staging.

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
