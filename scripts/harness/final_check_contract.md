# `final-check`: contrato de entrega para validación manual

Operación de solo lectura de la fase 13. No publica, no crea commits, no cierra
Issues, no aprueba validaciones manuales y no ejecuta `/finish-issue`.

```sh
python3 scripts/harness/git_policy.py final-check \
  --issue 75 --workflow-id <identificador-de-sesion> \
  --post-json <observacion-post-commit.json> \
  --context-json <contexto-validado-del-workflow.json>
```

Devuelve `final_check_evidence` por stdout y código 0 únicamente para `PASS`.
`FAIL` incluye la fase, condición e intervención necesarias. Los archivos de
entrada representan evidencia de sesión suministrada por el workflow; el
comando no crea archivos de evidencia. El workflow también puede invocar
`final_check()` con sus adaptadores de entrada existentes.

## Límite de confianza

El comando verifica Git y archivos locales. Reutiliza hechos inmutables de la
observación post-commit, compara el estado mutable actual y consume decisiones
semánticas ya aprobadas. No determina por sí mismo pertenencia funcional,
cobertura semántica ni aplicabilidad de verificaciones.

La evidencia de GitHub debe obtenerse mediante el MCP de GitHub inmediatamente
para esta entrega y normalizarse al contrato siguiente. El comando **no llama
al MCP**, no vuelve a publicar comentarios y no usa `gh` como alternativa.
`workflow_controller.py` conserva el estado de fase y referencias de evidencia
en memoria; `sdd_manager.py` observa la estructura SDD; `verification_runner.py`
conserva resultados y huellas de fuente; y `evidence_manager.py` valida el
ledger versionado. Ninguno de ellos sustituye la evidencia semántica, de GitHub
o de auditoría externa exigida por este contrato.

Git local no demuestra que no hubo push. Esa condición exige un registro de
acciones fiable que cubra todo el workflow, incluidas acciones externas al
harness. Una declaración aislada `pushed=false` no es suficiente.
Los JSON y sus hashes son referencias de integridad, **no firmas ni pruebas de
autenticidad**: el workflow debe conservar su procedencia y completitud. Una
cadena con datos desconocidos, incompletos o invalidados devuelve `FAIL`.

## Observación post-commit

`--post-json` contiene `post_commit_evidence` de `post-check-commit`, completo,
coherente y todavía válido. Debe incluir los campos de la fase 11, además de:

- `refs_sha256`: huella de las referencias Git observadas. Un cambio posterior
  exige una nueva observación, aunque el SHA histórico de base siga siendo válido.
- `base.canonical_policy`: política aprobada completa, sin sustituir el SHA
  histórico por una referencia remota posterior.
- `git_state.pending_fingerprints`: mapa de las rutas pendientes y sus rutas
  originales. Cada huella contiene `exists`, `mode`, `sha256`, `index_entries`.
  Las huellas se producen en la misma observación que los paths protegidos.

Si una observación antigua carece de estos campos, debe obtenerse una nueva.
No se reconstruyen silenciosamente desde el estado actual.

## Contexto del workflow

`--context-json` es un objeto con los siguientes campos obligatorios. Los
identificadores y estados distinguen mayúsculas y minúsculas. Los SHA-256 de
objetos se calculan sobre `json.dumps(obj, sort_keys=True, separators=(',', ':'),
ensure_ascii=True).encode()`. Los de archivos se calculan sobre sus bytes.

- `status: PASS`, `invalidated: false`, `issue`, `workflow_id`, `repository`
  (ruta absoluta canónica), `branch`, `head_sha`, `observed_at` (ISO-8601 con zona).
- `post_commit_evidence_sha256`: hash del objeto post-commit.
- `post_commit_guard`: `{status: PASS, source, evidence_sha256}`. El hash referencia
  esa misma observación y representa la decisión semántica previa del guardrail.
- `base_approval`: `{status: PASS, source, policy, initial_remote_sha}`. `policy`
  coincide exactamente con `base.canonical_policy`; el SHA inicial coincide con
  el histórico aprobado. `standard-main` exige `main`, `origin/main` y destino
  `main`. `approved-dependency` exige el registro y manifiesto de aprobación de
  dependencia que utiliza el contrato existente de política.
- `unrelated_changes`: lista completa de `{path, classification: unrelated,
  source, justification}` para cada entrada pendiente. Una lista vacía solo es
  válida si no hay pendientes. Las huellas de la fase 11 vinculan esta
  clasificación al contenido concreto, no solo al nombre del archivo.
- `sdd`: `{status: PASS, source, content_approved: true, slug_matches_issue: true,
  folder, files, acceptance_inventory_complete: true, required_criteria,
  acceptance_criteria}`. `files` contiene los SHA-256 de `spec.md`, `plan.md`,
  `tasks.md`. Cada criterio contiene `{id, covered: true, source,
  implemented_tasks: [...], verification_ids: [...]}`. La lista de criterios
  debe coincidir con el inventario completo aprobado. `verification_ids` puede
  estar vacío si la revisión de aplicabilidad justifica que no hay controles
  automáticos aplicables; eso no aprueba las validaciones manuales. La carpeta única debe
  cumplir `specs/<numero>-<slug-en-kebab-case>/`. El comando comprueba archivos
  no vacíos, hashes y tareas concretas marcadas `[x]`/`[X]` fuera de bloques de
  código. No acepta cambios SDD pendientes como trabajo ajeno.
- `verifications`: `{status: PASS, source, inventory_complete: true, tree_sha,
  sdd_files, required: [...], reports: [...]}`. Vincula los informes al árbol
  exacto del commit y a los hashes SDD. Cada informe aplicable contiene
  `{id, applicable: true, source, tree_sha, status: PASS, exit_code: 0, command}`.
  Cada informe no aplicable contiene `{id, applicable: false, source, tree_sha,
  status: NOT_APPLICABLE, reason}`. Si `required` está vacío, se exige
  `not_applicable_reason`. Nunca se aceptan verificaciones pendientes o fallidas.
- `github`: `{source: github-mcp, invalidated: false, observed_at, repository,
  number, state: open, issue_url, comments: [{id, body}, ...]}`. `repository`
  usa `owner/repo` y debe coincidir con el origen GitHub configurado. Las
  observaciones GitHub deben ser posteriores al post-commit y anteriores o
  iguales al contexto. El workflow debe invalidarlas cuando cambie la fuente.
- `documentation`: `{status: PASS, source, comment_id, body_sha256,
  static_summary}`. El comentario observado debe conservar el hash, mensaje y
  contenido aprobado. El resumen debe estar incluido como objeto JSON en un
  bloque Markdown `json` del comentario; el comando lo compara estructuralmente.
- `actions`: `{source: workflow-action-log, complete: true,
  coverage: entire-workflow, workflow_id, events: [...]}`. `events` lleva
  secuencias contiguas desde 1 y empieza por `issue-start`. Debe registrar el
  `create-commit` satisfactorio con `commit_sha` y `github-documentation`
  satisfactorio con `comment_id`. Cualquier `push`, `finish-issue` o
  `manual-approve` bloquea, al igual que una operación sin clasificar. Las demás
  operaciones admitidas son los nombres canónicos del harness, `sdd`,
  `planning`, `implementation`, `verification`, `change-review`, `commit-guard`,
  `post-commit-guard`, `github-read`, `github-documentation-guard`,
  `manual-validation-plan`, `handoff-guard`.
- `manual_validation`: `{status: pending, source, checks: [{id, description,
  status: pending}, ...]}`. Lista no vacía; cada descripción debe estar
  documentada en el comentario observado.
- `finish_issue_status: pending`.

## Resumen estático publicado

`documentation.static_summary` contiene:

```text
source, issue, workflow_id,
scope_approved: true,
decisions_and_dependencies_approved: true,
mutable_observations_are_current: false,
commit: {sha, message, branch},
base_policy: <política completa>,
initial_remote_sha: <SHA inicial aprobado>,
sdd: {folder, files},
verification_ids: <lista required>,
range: <objeto range completo de la observación post-commit>
```

Las decisiones semánticas y sus fuentes se conservan en el contexto y en el
resumen aprobado. Los datos históricos no certifican el estado actual de Git,
GitHub, remotos ni una futura PR. El `Final Workflow Guard` y el `Workflow
Handoff Guard` siguen siendo decisiones del workflow sobre esta evidencia;
`PASS` de `final-check` no aprueba la validación manual.

## Pruebas

`tests/test_final_check.py` utiliza repositorios temporales y recibos MCP
simulados explícitamente. Compara todos los bytes del repositorio antes y
después. Las pruebas no consultan ni cambian ninguna Issue real.
