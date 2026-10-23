# Post-Commit Guard

## Propósito

Consumir la única observación `post_commit_evidence` producida por
`.opencode/commands/hooks/post-commit.md` y determinar si el commit posterior
a la GitHub Issue #$1 puede superar el workflow.

Este guardrail evalúa decisiones. No vuelve a observar Git, no vuelve a leer
el SDD para reconstruir la evidencia y no ejecuta consultas redundantes cuando
la observación sigue válida.

Debe mantenerse la trazabilidad:

`GitHub Issue → SDD → tasks → implementación → verificaciones → cambios Git → commit → post_commit_evidence → estado post-commit`

## Entrada obligatoria

El workflow debe proporcionar exactamente una observación en sesión:

`post_commit_evidence`

La observación debe proceder del hook autorizado y conservar, como mínimo:

- `source`, `phase`, `observed_at`, repositorio e Issue;
- estado `complete`, `incomplete` o `contradictory`;
- rama, `HEAD`, último commit y commit esperado;
- estado de working tree y staging;
- manifiestos completos de pendientes, staged y unstaged;
- `base_policy`, `base_branch`, `base_ref`, `base_remote_ref` y `base_sha`;
- rango exacto `base_sha..HEAD`, lista completa de commits con manifiesto por
  commit y manifiesto agregado de archivos del rango;
- paths protegidos, siempre `opencode.json`, y su estado actual, staging,
  inclusión en el rango y conservación;
- `invalidated_by` y las condiciones de validez observadas.

El contexto de la Issue, el SDD, las tasks, el commit esperado y la política
canónica de base utilizados para evaluar pertenencia deben ser los ya reunidos
por el workflow. No se reconstruyen desde este guardrail.

## Consumo sin consultas duplicadas

Antes de tomar cualquier decisión:

- devuelve `BLOCK` si falta `post_commit_evidence`;
- devuelve `BLOCK` si `source` o `phase` no corresponden al hook y fase
  post-commit;
- devuelve `BLOCK` si la observación es anterior al commit;
- devuelve `BLOCK` si está `incomplete` o `contradictory`;
- devuelve `BLOCK` si falta cualquier campo, manifiesto completo o path
  protegido requerido;
- devuelve `BLOCK` si `invalidated_by` contiene una mutación ocurrida;
- devuelve `BLOCK` si la observación no corresponde al repositorio, Issue,
  rama, `HEAD` o commit esperado del workflow;
- devuelve `BLOCK` si `base_sha` no es el SHA histórico canónico, está ausente,
  fue reemplazado o no consta como inmutable;
- devuelve `BLOCK` si `base_sha..HEAD`, sus commits o su manifiesto de archivos
  no son completos y coherentes.

Si la observación es válida, consume directamente sus valores. No ejecutes de
nuevo `git status`, `git diff`, `git diff --cached`, `git log`, `git show`,
`git rev-parse`, `git merge-base` ni lecturas del SDD para reconstruir los
mismos datos. Una nueva observación solo puede producirla el hook después de
detener el guardrail y resolver la mutación o la falta de evidencia.

## Evaluación

El guardrail debe evaluar todas estas condiciones con la observación válida y
el contexto ya reunido por el workflow:

1. **Correspondencia del commit con la Issue.**
   - El commit esperado por `Commit Guard` existe.
   - `expected_commit.sha`, `last_commit.sha` y `HEAD` son el mismo commit.
   - El mensaje observado coincide con el mensaje registrado del commit
     esperado.
   - La rama activa es la rama dedicada a la Issue #$1.
   - El commit y cada commit del rango pueden justificarse por la Issue, su
     SDD o sus tasks; un commit ajeno o no clasificable bloquea.

2. **Rama y política de base.**
   - La rama observada corresponde a la Issue y es la rama que el workflow
     aprobó.
   - `base_policy`, `base_branch`, `base_ref`, `base_remote_ref` y
     `base_sha` coinciden exactamente con la política canónica ya aprobada.
   - `base_sha` es histórico e inmutable y figura como ancestro de `HEAD`.
   - El rango evaluado es exactamente `base_sha..HEAD`; nunca se sustituye por
     la rama activa, `HEAD`, un SHA remoto posterior o un rango parcial.

3. **Pertenencia completa del rango.**
   - La lista de commits del rango está completa y contiene el manifiesto de
     archivos de cada commit.
   - Cada commit y cada archivo de su manifiesto están justificados por la
     Issue, el SDD o las tasks.
   - Cada manifiesto por commit conserva el estado bruto `A`, `M`, `D` o `R`,
     el score cuando exista y las dos rutas de cada renombrado, incluida la
     ruta original; los commits merge no pueden aparecer sin sus cambios.
   - El manifiesto de archivos del rango está completo, incluidos estados de
     adición, modificación, eliminación y renombrado.
   - Cada archivo del rango está justificado por la Issue, el SDD o las tasks.
   - Cualquier commit o archivo ajeno, accidental, ambiguo o imposible de
     separar produce `BLOCK`.

4. **Ausencia de cambios pendientes de la Issue.**
   - Se clasifica cada entrada de `pending_manifest`, `staged_manifest` y
     `unstaged_manifest` contra la Issue y su SDD.
   - Cada entrada `??` de `git status --porcelain=v1 -uall` está presente en
     `pending_manifest`, aunque no aparezca en `git diff HEAD`.
   - No queda ningún cambio, archivo nuevo, modificado, eliminado o
     renombrado perteneciente a la Issue sin incluir en el commit.
   - No queda ningún cambio de la Issue en staging ni fuera de staging.
   - Los cambios locales ajenos solo pueden permanecer si están identificados,
     no se mezclan con la Issue y permanecen intactos.
   - Una relación incierta o una mezcla no separable produce `BLOCK`.

5. **Paths protegidos.**
   - `opencode.json` y todos los demás paths protegidos están identificados.
   - Permanecen fuera del staging y del rango del commit.
   - Su estado preexistente no fue modificado, movido, eliminado ni incluido.
   - Cualquier path protegido incluido en `range.files`, aunque el cambio
     parezca ajeno, produce `BLOCK`.
   - Un estado protegido ausente, contradictorio o no determinable produce
     `BLOCK`.

## Resultado

Devuelve `PASS` únicamente cuando todas las condiciones anteriores se cumplen
con evidencia completa, coherente y todavía válida.

Devuelve `BLOCK` cuando:

- falta, es incompleta, contradictoria o está invalidada la evidencia;
- el commit esperado no existe, no es `HEAD` o no coincide con el commit
  observado;
- la rama o la política de base no son las aprobadas;
- `base_sha` no es histórico, inmutable, ancestro o base exacta del rango;
- falta cualquier commit o archivo del rango, o alguno no está justificado;
- quedan cambios de la Issue pendientes, staged, unstaged o sin clasificar;
- `opencode.json` u otro path protegido aparece en el rango, staging o en un
  estado distinto al preexistente;
- aprobar requeriría modificar, descartar, mover, hacer stash o incluir
  cambios ajenos.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Informa el motivo concreto y usa únicamente la evidencia ya observada para
identificar:

- rama activa, `HEAD`, commit esperado y último commit;
- `base_sha`, política y rango completo;
- commits y archivos del rango que no estén justificados;
- cambios pendientes de la Issue, ajenos o no clasificables;
- paths protegidos afectados, especialmente `opencode.json`;
- campo ausente, contradicción o mutación que invalidó la observación.

No ejecutes consultas Git duplicadas desde este guardrail. Si el problema se
puede resolver, el workflow debe detenerse, resolverlo sin alterar trabajo
ajeno y volver a ejecutar el hook para producir una nueva observación. Nunca
reutilices la observación antigua para evaluar el estado posterior.

No continúes al siguiente punto del workflow hasta que el `Post-Commit Guard`
haya devuelto `PASS`.

## Acciones prohibidas

Si se devuelve `BLOCK`:

- no documentes la Issue como completada;
- no cierres la Issue;
- no hagas push;
- no crees automáticamente otro commit;
- no modifiques, elimines, descartes ni hagas stash de cambios ajenos;
- no añadas cambios ajenos al staging;
- no alteres `opencode.json` ni ningún path protegido;
- no debilites los controles de pertenencia, rango, staging o historial.
