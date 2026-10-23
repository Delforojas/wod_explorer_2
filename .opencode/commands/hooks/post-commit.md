# Post-Commit Hook

## Propósito

Inspeccionar una única vez el estado Git inmediatamente después de crear el
commit correspondiente a la GitHub Issue #$1 y producir la observación en
sesión `post_commit_evidence`.

El hook no decide si los cambios pertenecen funcionalmente a la Issue. Su
resultado es la única fuente de observación post-commit para
`.opencode/commands/guardarails/post-commit.md`.

No escribe la evidencia en archivos ni modifica el repositorio.

## Momento de ejecución

Ejecuta este hook después de:

- crear el commit;
- superar el `Commit Guard`;
- registrar el hash y el mensaje del commit creado.

Debe ejecutarse antes de documentar el resultado del workflow en GitHub. Una
observación producida antes del commit, incluida `pre_stage_evidence`, nunca es
válida para esta fase.

## Observación `post_commit_evidence`

Genera exactamente una observación por ejecución y entrégala al workflow en
memoria. Debe contener todos estos campos, sin inferir valores no observados:

```yaml
post_commit_evidence:
  source:
    hook: .opencode/commands/hooks/post-commit.md
    commands: [lista exacta de consultas Git ejecutadas]
  phase: post-commit
  observed_at: <momento de observación>
  repository: <repositorio actual>
  issue: <Issue #$1>
  status: complete | incomplete | contradictory
  expected_commit:
    sha: <hash registrado por Commit Guard>
    message: <mensaje registrado por Commit Guard>
  branch: <rama activa>
  head: <SHA de HEAD>
  last_commit:
    sha: <SHA>
    message: <mensaje>
  git_state:
    working_tree: <estado bruto y estado interpretado>
    staging: <estado bruto y estado interpretado>
    pending_manifest: [manifiesto completo A/M/D/R y no trackeados]
    staged_manifest: [manifiesto completo A/M/D/R]
    unstaged_manifest: [manifiesto completo A/M/D/R y no trackeados]
  base:
    base_policy: <política canónica ya aprobada>
    base_branch: <rama base>
    base_ref: <referencia base>
    base_remote_ref: <referencia remota exacta>
    base_sha: <SHA histórico inmutable>
    immutable: true
    is_ancestor_of_head: true | false | unknown
  range:
    expression: <base_sha>..<HEAD>
    commits: [lista completa, ordenada, de SHA, mensaje y manifiesto por commit]
    files: [manifiesto completo A/M/D/R del rango]
  protected_paths:
    - path: opencode.json
      preexisting: true | false | unknown
      current_state: <estado observado>
      staged: true | false | unknown
      in_range: true | false | unknown
      unchanged_from_precommit: true | false | unknown
  invalidated_by: [mutaciones que vuelven inválida esta observación]
```

Los corchetes `]` de los manifiestos representan listas completas; cada
entrada debe conservar el estado Git y la ruta anterior cuando sea un
renombrado. `pending_manifest` es la unión sin duplicados de staged,
unstaged y no trackeados, construida a partir de la salida completa de
`git status --porcelain=v1 -uall`. Cada entrada `??` de esa salida debe
aparecer en `pending_manifest`, aunque no aparezca en `git diff HEAD`.
`git diff HEAD` solo aporta cambios de archivos trackeados y nunca puede ser
la fuente única del manifiesto pendiente.

Para `range.commits`, conserva un manifiesto separado por cada commit,
incluidos los commits merge. Cada entrada debe conservar el estado bruto
`A`, `M`, `D` o `R`, el score cuando exista y ambas rutas en un renombrado,
como `R<score>\t<ruta_original>\t<ruta_nueva>`. No reemplaces esos manifiestos
por el diff agregado ni elimines los cambios de un commit merge.

`protected_paths` debe incluir siempre `opencode.json` y todos los paths
locales preexistentes protegidos que ya consten en la evidencia canónica.
Una lista de paths protegidos ausente, incompleta o cuyo estado no pueda
determinarse vuelve la observación `incomplete`.

`base_sha` debe copiarse de la política canónica previamente aprobada. Es el
SHA histórico desde el que se creó o validó la rama de la Issue y nunca puede
ser sustituido por `HEAD`, por la rama activa ni por una observación remota
posterior. Si la política o `base_sha` no están disponibles, no se debe
inventar una base: marca la evidencia `incomplete`.

## Comprobaciones únicas

Recopila una sola vez, dentro de esta observación, lo necesario para todos los
consumidores posteriores:

- rama activa y `HEAD`;
- SHA y mensaje del último commit;
- estado completo del working tree y del staging;
- manifiestos completos staged, unstaged y pendientes;
- política de base y `base_sha` histórico inmutable ya aprobado;
- resultado de que `base_sha` sea ancestro de `HEAD`;
- rango exacto completo `base_sha..HEAD`;
- lista completa de commits del rango con SHA, mensaje y manifiesto por commit;
- manifiesto completo de archivos del rango con estados y renombrados;
- estado de cada path protegido, siempre incluido `opencode.json`.

Utiliza, cuando correspondan, consultas equivalentes a:

- `git branch --show-current`;
- `git rev-parse HEAD`;
- `git show -s --format=%H%x00%s HEAD`;
- `git status --porcelain=v1 -uall` y la forma de estado de rama necesaria;
- `git diff --name-status -M -C`;
- `git diff --cached --name-status -M -C`;
- `git diff --name-status -M -C HEAD` para el manifiesto pendiente completo;
- `git merge-base --is-ancestor <base_sha> HEAD`;
- `git log --format=%H%x00%s --name-status -M -C --reverse <base_sha>..HEAD`;
- `git diff-tree --root --name-status -r -M -C -m <commit>` para el manifiesto
  de cada commit, incluidos merges;
- `git diff --name-status -M -C <base_sha>..HEAD`;
- consultas acotadas a los paths protegidos para distinguir su estado actual,
  staging e inclusión en el rango.

No vuelvas a ejecutar estas consultas desde el guardrail. Si una consulta no
puede completarse, si una salida no puede parsearse completamente o si dos
salidas se contradicen, marca `status=incomplete` o `status=contradictory` y
no presentes `PASS`.

## Validez e invalidación

La observación solo es válida si:

- fue producida en la fase `post-commit`, después del commit y del `Commit
  Guard`;
- corresponde al repositorio, Issue, rama y commit esperados;
- contiene todos los campos requeridos y manifiestos completos;
- `head` coincide con `last_commit.sha` y con el rango observado;
- `base_sha` permanece identificado como histórico e inmutable;
- el estado de los paths protegidos es determinable y coherente.

Invalida inmediatamente `post_commit_evidence` cualquier:

- nuevo commit, `--amend`, `reset`, `rebase`, merge, cherry-pick, revert o
  cualquier otra mutación del historial o de una referencia;
- cambio de rama o de `HEAD`;
- edición, creación, eliminación o renombrado de cualquier archivo;
- cambio del staging, incluido `git add`, `git reset` o equivalente;
- `stash`, `restore`, checkout u otra operación que cambie el working tree,
  índice o referencias, aunque el estado visible parezca igual;
- modificación de `spec.md`, `plan.md`, `tasks.md` o de otra fuente SDD
  relevante para la Issue;
- cambio del alcance, decisión o contexto de la Issue;
- cambio, ausencia o contradicción de cualquier path protegido.

No se reutiliza evidencia antigua para comprobar un estado posterior a una
mutación. Ante evidencia ausente, incompleta, contradictoria o invalidada, el
workflow debe detenerse y producir una nueva observación antes de reevaluar.

## Resultado

El hook devuelve la observación `post_commit_evidence` completa al workflow.
No devuelve `PASS` por pertenencia funcional. El `Post-Commit Guard` consume
esta misma observación para decidir `PASS` o `BLOCK`.

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
- alterar el historial Git;
- cambiar `base_sha` o sustituir la política de base;
- clasificar por sí mismo la pertenencia de cambios a la Issue.

Su responsabilidad termina después de producir la única observación
`post_commit_evidence` del estado posterior al commit.
