# Pre-Stage Check Hook

## Propósito

Inspeccionar una única vez el estado Git y SDD del repositorio antes de
preparar el staging para la GitHub Issue #$1.

Este hook produce la observación en sesión `pre_stage_evidence`. No escribe
esa evidencia en archivos, GitHub ni ningún almacenamiento persistente y no
decide qué cambios pertenecen funcionalmente a la Issue.

No modifica el estado del repositorio.

## Momento de ejecución

Ejecuta este hook después de que todas las verificaciones aplicables hayan
finalizado correctamente y antes de:

- preparar el staging;
- ejecutar `git add`;
- crear el commit de la Issue.

La observación debe producirse en la frontera final de sincronización de
`spec.md`, `plan.md` y `tasks.md`, antes de cualquier cambio de staging.

## Observación `pre_stage_evidence`

Genera exactamente una observación por ejecución y entrégala al workflow en
memoria. Debe identificar:

- `source`: este hook y cada comando o fuente SDD utilizada;
- `phase`: frontera previa a staging;
- `observed_at`: momento de la observación;
- repositorio e Issue `#$1` a los que corresponde;
- rama activa y `HEAD` observados;
- estado completo del working tree, staging y cambios fuera de staging;
- manifiesto completo de archivos con estados `A`, `M`, `D` o `R`;
- paths protegidos y preexistentes, incluido `opencode.json` cuando esté
  modificado;
- estado observado de `spec.md`, `plan.md` y `tasks.md`, incluyendo existencia,
  revisión o hash cuando esté disponible y estado bruto de sus tasks;
- `status` de la recolección: completa, incompleta o contradictoria;
- `invalidated_by`: condiciones que dejan de hacer válida la observación.

La observación es válida únicamente mientras no ocurra ninguna de estas
condiciones:

- edición, creación, eliminación o renombrado de un archivo;
- cambio del staging, incluido `git add`, `git reset` o equivalente;
- cambio de rama, `HEAD` o historial Git;
- modificación de `spec.md`, `plan.md`, `tasks.md` o de otra fuente SDD
  observada;
- cambio del alcance, decisión o contexto de la Issue que la observación debía
  evaluar.

El workflow y `change-review` deben consumir esta observación directamente.
No deben reconstruirla ni repetir las mismas consultas mientras siga válida.

## Comprobaciones

Obtén una sola vez:

- el estado actual del working tree;
- los archivos modificados, nuevos, eliminados y renombrados;
- los cambios actualmente en staging;
- los cambios todavía no incluidos en staging;
- la lista completa de cambios locales preexistentes y no relacionados,
  incluyendo `opencode.json` cuando esté modificado;
- la existencia y el estado observado de `spec.md`, `plan.md` y `tasks.md`.

Utiliza, cuando correspondan:

- `git branch --show-current`;
- `git rev-parse HEAD`;
- `git status`;
- `git diff`;
- `git diff --cached`;
- lecturas SDD necesarias para registrar su estado y revisión.

Utiliza comprobaciones adicionales únicamente para completar esta observación
o resolver una contradicción. No las repitas para evaluar pertenencia a la
Issue.

## Resultado

### PASS

Devuelve `PASS` únicamente cuando `pre_stage_evidence` está completa,
coherente, corresponde al repositorio y Issue actuales, y contiene el estado
Git, el manifiesto, los paths protegidos y el estado SDD requeridos.

`PASS` significa que la observación puede ser consumida por
`guardarails/change-review.md`; no significa que los cambios pertenezcan a la
Issue ni autoriza `git add`.

### FAIL

Devuelve `FAIL` y no ejecutes `git add` cuando:

- falta la observación o alguno de sus campos obligatorios;
- una consulta Git o SDD no pudo completarse;
- el estado Git o el SDD es incompleto o contradictorio;
- no puede identificarse con seguridad el manifiesto `A/M/D/R`;
- no puede identificarse un path protegido o el estado de `opencode.json`;
- la observación ya fue invalidada antes de ser consumida.

El workflow debe obtener una nueva observación después de resolver el
problema. No debe continuar usando una observación parcial o inválida.

## Responsabilidad de decisión

La evaluación de pertenencia a la Issue, separabilidad de cambios ajenos,
sincronización semántica del SDD y condiciones de bloqueo corresponde
exclusivamente a `guardarails/change-review.md`, usando esta observación y el
contexto de Issue/SDD ya reunido por el workflow.

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

Su responsabilidad termina después de producir la única observación
`pre_stage_evidence` del estado previo al staging.
