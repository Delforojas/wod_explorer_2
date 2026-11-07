---
description: Implements a GitHub Issue using the Hybrid Python + AI Harness
---

# Hybrid Issue Development Workflow — /hyssue

Execute GitHub Issue **#$1** using the `/hyssue` workflow.

This command is independent from `/issue`.

The current execution mode is `hyssue`.

Follow all mandatory Issue, Context, Branch, SDD,
Verification, Commit and Handoff guardrails.

Never bypass a guardrail to resolve a command mismatch.
**Do not push, merge branches, close the Issue, or execute `/finish-issue`.**
Never execute `/finish-issue $1` automatically from `/hyssue`.

## 0. Execution Rules — Hybrid Harness

### 0.1 AI Responsibilities

- Follow the root `AGENTS.md` and applicable specialized agents.
- The GitHub Issue defines requirements. `DOMAIN.md`, `PROJECT.md`, and approved specifications govern their respective areas.
- Never invent requirements, results, commands, decisions, or files.
- Apply architectural, functional, and technical judgment when required.
- Preserve all mandatory verification and security requirements.

### 0.2 Local Harness Responsibilities

The local harness is located in `scripts/harness/`.

Implemented components (local technical results do not replace semantic guards):

- `workflow_controller.py`: Tracks workflow phases, mandatory guardrails, and transition status.
- `evidence_manager.py`: Records verified evidence and invalidates stale observations.
- `git_policy.py`: Validates Git operations against workflow safety policies.

Use only implemented and tested operations. A failed local check remains blocking;
implementation of the coordinator never authorizes bypassing a guard.

#### Session coordination

Use the local `harness` MCP server to maintain one in-memory
`WorkflowController` instance throughout the development workflow.

The MCP server exposes three tools:

- `harness_status`: inspect the current controller session.
- `harness_start`: initialize the controller with the actual Issue
  number and a unique `workflow_id`.
- `harness_call`: execute supported controller operations.

Before starting a new workflow:

1. Call `harness_status` to inspect the existing session.
2. If no session exists, call `harness_start` once.
3. Call `harness_status` again and verify that the Issue,
   repository, and `workflow_id` match the active workflow.
4. If an existing session belongs to another workflow,
   return BLOCK. Never replace an active controller.

#### Initial Phase Transition — Mandatory

A newly initialized WorkflowController starts at phase 0.

Phase 0 establishes the harness execution rules and
the active session. It does not register GitHub Issue
evidence and does not require a semantic guard.

After verifying the active session identity:

1. Read the current phase using `harness_status`.
2. If phase is 0 and status is RUNNING, call:
   - `harness_call`
   - `operation`: `advance`
   - `arguments`: `{}`
3. Require a PASS result with phase 1.
4. Verify the new phase using `harness_status`.
5. Only then execute Phase 1 and register
   `github_issue_observation`.

If the current phase is already 1 and the session identity
matches the active workflow, continue without advancing.

Never advance automatically from phase 1 or later.
Subsequent phase transitions require their mandatory
evidence and guardrails.

If the workflow is BLOCKED, inconsistent, or belongs
to another session, return BLOCK.

Never use `record_external` or `record_static` to
bypass the initial phase transition.

Never invoke `advance` speculatively or multiple
times to reach a desired phase.

Use `harness_call` for all supported controller operations,
including `invoke`, `record_external`, `record_static`,
`decide_guard`, `advance`, `notify`, and `snapshot`.

The controller invokes supported local functions and records
their returned evidence through `evidence_manager.py`.

The local CLI examples below describe the same operations.
When the MCP session is active, execute supported operations
through `harness_call` with `operation: "invoke"` rather than
creating unrelated standalone controller sessions.

Do not launch `workflow_controller.py --serve` directly when
the `harness` MCP server is available.

### Guard Decision Contract — Mandatory

All guard decisions must use the exact
WorkflowController.decide_guard signature:

`decide_guard(name, status, source, references, reason)`

Invoke through `harness_call` with:

- `operation`: `decide_guard`
- `arguments.name`: guard name for the active phase
- `arguments.status`: `PASS`, `BLOCK`, `FAIL`, or `NEEDS_APPROVAL`
- `arguments.source`: exact guardrail Markdown path
- `arguments.references`: complete current session evidence references
- `arguments.reason`: non-empty justification based on verified evidence

All five arguments are mandatory.

For Issue Guard, use:

- `name`: `issue`
- `source`: `.opencode/commands/guardarails/issue.md`

Set `status` to `PASS` only after evaluating the
Issue Guard rules against verified Issue evidence.

Do not omit or invent arguments.
Do not reconstruct or shorten evidence references.
Do not treat successful evidence registration
as automatic guard approval.

If the required evidence or a defensible guard decision
is unavailable, return BLOCK.

Register real GitHub MCP observations and semantic guard
decisions with their sources and current evidence references.
Do not execute Markdown as code or invent guard results.

Register real GitHub MCP observations and semantic guard
decisions with their sources and current evidence references.
Do not execute Markdown as code or invent guard results.

Consume JSON objects and session references directly in memory.
Protected pre/post-commit observations and superseded observation
versions must never be written to intermediate JSON files.

Legacy file-based CLI inputs remain supported but must not be
used to persist protected workflow observations.

If the MCP connection is lost, the server restarts, or the
controller session becomes unavailable or inconsistent,
return BLOCK. Never recreate historical protected evidence
from unverified snapshots or bypass mandatory guardrails.

A session snapshot is transient control data, not an
authorized static export. Only an explicitly authorized
historical static summary may be exported.

The controller ends at `AWAITING_MANUAL_VALIDATION`.
It does not approve manual validation, push, publish, merge,
close the Issue, or execute `/finish-issue`.

### 0.3 Workflow Execution Rules

- Execute phases sequentially. Never skip mandatory guardrails.
- Load each `guardarails/`, `hooks/`, or `loops/` file only when its corresponding phase requires it.
- Treat Markdown hooks as procedures to follow and verify, not automatically executable programs.
- Use local scripts for supported deterministic operations.
- Verify that each local harness operation exists before using it.

- Do not automatically execute the harness unit test suite
  when starting `/hyssue` or entering a workflow phase.

- Distinguish harness validation from Issue verification:
  - Harness tests validate the Python workflow infrastructure.
  - Issue tests validate the implementation being developed.

- Reuse existing successful harness test evidence only when
  its source, results, and exact validated code revision
  can be verified.

- If the harness implementation or relevant dependencies
  have changed, previously validated evidence is invalid
  for the affected operations.

- When valid harness test evidence is unavailable, execute
  the relevant tests required to validate the operation
  before using it. Do not execute the entire harness suite
  unless full-suite validation is necessary.

- Failed, incomplete, timed-out, or unverifiable tests
  must never be treated as PASS.

- Always execute the mandatory Git checks, guardrails,
  and applicable Issue-specific verification checks.

- Never skip security checks or required verification
  solely to reduce execution time or token consumption.

- Keep original Markdown procedures active until their local replacements have passed equivalent validation.
- Reuse available verified evidence. Avoid unnecessary repeated reads or checks.
- Never weaken verification or security controls to reduce token usage.

### 0.4 Git Safety Rules

- Never automatically discard, overwrite, stash, or include unrelated work.
- Never automatically rebase, force-push, or rewrite Git history.
- Preserve existing working-tree and staging changes.
- Require explicit authorization when an operation needs user approval.

### 0.5Canonical Evidence Record

Maintain one compact `issue_evidence` record for the whole workflow. Record a field only after its source has been observed; leave missing values absent and never infer them.

Separate the record into:

- `static`: Issue identity and approved scope, dependencies and decisions, applicable instruction/specification paths and revisions, SDD references, historical verification results, and the accepted commit/range manifest.

- `mutable`: Observation time, active branch, `HEAD`, working-tree and staging state, remote references and SHAs, published branch, Issue state, PR state, checks, and merge state.

Each observation must retain its source, phase, and status.

Reuse an unchanged static entry across later phases.

Invalidate only the affected static entries when scope, specifications, decisions, or applicable instructions change.

Invalidate the affected mutable entries after any Git, remote, GitHub, PR, or working-tree mutation and re-observe them at the next security boundary.

Busca ### 0.6 Blocking Policy y, justo antes, pega este bloque:

### 0.5.1 Evidence Registration Contract

All evidence registrations must use the exact
WorkflowController method signatures.

#### External observations

For Phase 1, register the GitHub Issue observation
through `harness_call`:

- `operation`: `record_external`
- `arguments.key`: `github_issue_observation`
- `arguments.payload`: verified GitHub observation

The observation payload must include:

- `phase`: `1`
- `issue`: current Issue number ($1)
- `workflow_id`: current workflow identity
- `source`: actual GitHub MCP source
- `status`: `PASS` only when the GitHub MCP observation
  has been successfully retrieved and validated.
- `observed_at`: timezone-aware ISO 8601 timestamp

Validation rules:

- Do not use `verified`, `success`, `complete`, or other
  descriptive statuses in place of `PASS`.
- If retrieval or validation fails, return BLOCK.
- Never label unverified evidence as PASS.

#### Static evidence

Register historical Issue identity through
`record_static`:

- `operation`: `record_static`
- `arguments.key`: `issue_identity`
- `arguments.kind`: `issue_identity`
- `arguments.payload`: only the following fields:
  - `number`
  - `title`
  - `url`
  - `repository_full_name`
- `arguments.source`: actual verified source
- `arguments.observed_at`: timezone-aware ISO 8601
- `arguments.status`: `PASS` only when verified

Do not include `issue`, `workflow_id`, `repository`,
`phase`, `source`, `status`, or `observed_at`
inside a static evidence payload.

These metadata values belong to the controller,
session, or separate method arguments.

For `approved_scope`, use only the allowed payload
fields: `description`, `acceptance_criteria`,
`constraints`, and `approved_by`.

Never fabricate approval or acceptance criteria.

Static payload fields must conform to
`STATIC_FIELDS` in `evidence_manager.py`.

Never turn mutable GitHub observations into
static evidence.

#### SDD Static References

When registering `sdd_refs` through `record_static`,
use the following contract:

- `arguments.kind`: `sdd_refs`
- `arguments.payload` may contain only:
  - `folder`
  - `files`
  - `revisions`

The `revisions` field must contain only verified,
immutable content identifiers, such as SHA-256
hashes of the SDD files.

Never include mutable Git state in the payload,
including nested objects:

- `branch`
- `head`
- `head_sha`
- `active_branch`
- `working_tree`
- `staging_state`
- `git_state`

Do not copy entire outputs from `git_policy.inspect`
or `sdd_manager.inspect` into static evidence.

Extract only verified historical references.

If immutable revisions cannot be established,
do not invent them or substitute mutable Git values.

Keep mutable Git observations in their corresponding
mutable evidence records.

Never bypass EvidenceManager validation.

#### General rules

- Apply the same contract to any Issue number.
- Never hardcode Issue IDs, session IDs, or SHAs.
- Pass only supported method arguments.
- Treat registration errors as BLOCK.
- Do not bypass evidence validation.

### 0.6 Blocking Policy

If a mandatory guardrail fails, essential information is missing, an execution error occurs, or an operation requires authorization:

1. Stop before proceeding to the next operation.
2. Preserve existing changes and collected evidence.
3. Identify the blocking condition and supporting evidence.
4. Request only the intervention necessary to continue.

Additional rules:

- Treat `BLOCK`, execution errors, and missing mandatory evidence as blocking conditions.
- Never bypass a failed local guard using model judgment.
- Never declare a phase complete unless its required checks pass.
- A blocked phase is not a successful phase.
- Never weaken verification or security controls to reduce token usage.

## 1. Retrieve the Issue

Retrieve GitHub Issue #$1 using the configured
`github` MCP for the current repository.

Identify the title, description, acceptance criteria,
scope, constraints, dependencies, and relevant references.

### Workflow Identity Check

The current command is `/hyssue`.

Verify that the retrieved Issue is compatible with
the `/hyssue` workflow.

If the Issue explicitly requires `/hyssue`, continue.

If the Issue explicitly requires another workflow,
return BLOCK and report the contradiction.

Never reinterpret `/hyssue` as `/issue`.
Never switch workflows automatically.

Load and apply:

`.opencode/commands/guardarails/issue.md`

Continue only when the Issue Guard returns PASS.

Resolve the canonical GitHub repository identity from
the configured Git remote `origin`.

Extract the exact repository owner and name.

Do not infer, normalize, translate, or reconstruct
the repository name from the local directory name.

Use the verified owner and repository name when
calling the GitHub MCP.

If repository identity cannot be verified, return BLOCK.

### Phase 1 Evidence Registration

After retrieving and verifying the GitHub Issue:

1. Register `github_issue_observation` through
   `record_external` using the current phase and
   verified GitHub MCP evidence.

2. Register `issue_identity` through `record_static`
   using only the approved static fields.

3. Register `approved_scope` only when its content
   and approval have been explicitly established.
   Never infer approval from Issue existence.

4. Collect the complete evidence references returned
   by the active WorkflowController session.

5. Evaluate the Issue Guard using those exact
   references, without reconstructing or modifying them.

6. Continue only when the Issue Guard returns PASS
   and WorkflowController authorizes advancement.

#### Evidence Reference Integrity — Mandatory

Evidence references are opaque, session-scoped objects.

Every reference must preserve these seven fields:

- `key`
- `category`
- `version`
- `sha256`
- `issue`
- `repository`
- `workflow_id`

When calling `decide_guard`:

- Copy each reference exactly as returned by
  `record_external`, `record_static`, or `invoke`.
- Preserve all fields and their original values.
- Never shorten or reconstruct references.
- Never reuse references from an earlier workflow.
- Never invent missing reference fields.
- Use only references belonging to the current
  WorkflowController session.

If a complete, current reference is unavailable,
return BLOCK. Do not fabricate a replacement.

Never pass a GitHub repository identifier as the
local repository path.

## 2. Analyze Relevant Context

Before evaluating the Context Guard, inspect only the
context necessary to understand and implement the Issue:

- Root and applicable specialized `AGENTS.md` files.
- Affected code and architecture.
- Relevant product, domain, and project documentation.
- Related specifications and dependencies.
- Relevant MCP resources when they provide necessary
  information for the Issue.
- Skills or technical documentation only when necessary.

Do not indiscriminately load unrelated files, skills,
documentation, or MCP resources.

Record the paths, revisions or hashes when available, applicability decisions,
and source of every static context item actually used. Later phases consume
this record instead of rereading unchanged static context merely to reconstruct
what was already verified.

Only after gathering the necessary context, load and apply:

`.opencode/commands/guardarails/context.md`

Continue only when the Context Guard returns `PASS`.

### Context Guard Source — Mandatory

The Context Guard source is exactly:

`.opencode/commands/guardarails/context.md`

When calling `decide_guard` in phase 2:

- `name`: `context`
- `status`: `PASS` only after validating the context
- `source`: `.opencode/commands/guardarails/context.md`
- `references`: complete current-session evidence references
- `reason`: non-empty justification based on verified context

The source path must match exactly, including lowercase letters.

Never use `CONTEXT.md` as the Context Guard source.

Context documents and guardrail sources are different.
Reading a context document does not change the required
guardrail source.

If the required guardrail file is unavailable,
return BLOCK. Never substitute another file.


### Mandatory Context Evidence — Phase 2

Before advancing from Phase 2, register the mandatory
static evidence required by WorkflowController:

- `operation`: `record_static`
- `arguments.key`: `context`
- `arguments.kind`: `context_item`
- `arguments.payload`: verified context item
- `arguments.source`: actual context source
- `arguments.observed_at`: actual ISO 8601 timestamp
- `arguments.status`: `PASS` only when verified

The payload must follow STATIC_FIELDS['context_item']:

- `path`
- `sha256`
- `revision`
- `applicability`
- `reason`

Use only verified values. Do not invent hashes,
revisions, paths or applicability decisions.

The key `context` is mandatory for Phase 2 advancement.
Additional context items may use separate keys.

Include the complete current-session reference for
`context` when evaluating the Context Guard.

The Context Guard returning PASS does not replace
the mandatory static evidence.

Never advance to Phase 3 without a valid
static evidence entry with key `context`.

## 3. Prepare the Working Branch — Hybrid

This phase is mandatory before modifying any project file.

The local harness is responsible for deterministic Git operations.
The AI remains responsible for interpreting Issue dependencies,
selecting the approved base policy, and identifying decisions
requiring user authorization.

### Phase 3 — MCP Invocation Contract

All Git operations in Phase 3 must execute through the
active WorkflowController using `harness_call`.

Use this invocation structure:

Use this invocation structure through `harness_call`:

- `operation`: `invoke`
- `arguments.operation`: `git_policy.inspect`
- `arguments.arguments.issue`: current Issue number ($1)

Resolve `$1` to the actual Issue number before invoking
the tool. Pass it as an integer, never as a string.

Never hardcode an Issue number.

Do not forward `workflow_id` to `git_policy.inspect`.
The active WorkflowController owns the session identity.

Permitted arguments by operation:

- `git_policy.inspect`:
  `issue`, `policy_path`
- `git_policy.validate_base`:
  `issue`, `policy_path`
- `git_policy.prepare_branch`:
  `issue`, `branch_name`, `policy_path`,
  `expected_head`, `expected_branch`
- `git_policy.check_branch`:
  `issue`, `branch_name`, `policy_path`,
  `approved_commits_path`

Only supply arguments required by the actual Python signature
and the validated evidence available at the current phase.

Never forward `workflow_id` to these operations.
The active WorkflowController and EvidenceManager own
the workflow session identity.

Do not invent parameter names, values, paths or evidence.

Never bypass the controller by executing Git mutation
operations directly when an MCP invocation fails.

If an operation returns BLOCK, NEEDS_APPROVAL or an error,
stop immediately.

### 3.1. Inspect Git State

Invoke `git_policy.inspect` through `harness_call`
using the active WorkflowController.

Arguments

- `issue`: current Issue number ($1).
- `policy_path`: only when required.

Never pass `workflow_id` to `git_policy.inspect`.

The harness must inspect the active branch, HEAD,
working tree, staging area, existing Issue branches,
remote references, and pre-existing changes.

Return verified `branch_evidence` without modifying Git.

Stop if mandatory evidence is missing or invalid.

### 3.2. Determine Base Policy

The AI must analyze Issue #$1 and its verified dependencies.

Select exactly one policy:

- `standard-main`
- `approved-dependency`

For `standard-main`:

- Use `main` as the base branch.
- Use `origin/main` as the base reference.
- Use `refs/heads/main` as the remote base reference.
- Set the intended PR target to `main`.

For `approved-dependency`:

- Require a real dependency identified by the Issue.
- Require explicit user approval.
- Identify the approved dependency branch.
- Identify the exact remote base reference.
- Identify the intended PR destination.
- Identify the exact PR target remote reference.
- Never infer authorization from the current branch.

Stop if the policy cannot be determined safely.

#### Canonical Base Policy Contract

The Issue number must always come from the current
command argument ($1). Never hardcode an Issue number.

After `git_policy.inspect`, construct one canonical
policy object using the verified Git observations.

For `standard-main`, use:

- `policy`: `standard-main`
- `base_branch`: `main`
- `base_ref`: `origin/main`
- `base_remote_ref`: `refs/heads/main`
- `base_sha`: `branch_evidence.base_candidate.base_remote_sha_latest`
- `pr_target`: `main`
- `pr_target_ref`: `refs/heads/main`

The `base_sha` must be a verified full commit SHA.
Never invent, approximate or reuse a stale SHA.

Reuse the same canonical policy object throughout
the workflow, including commit and final validation.

Pass it as the mandatory `policy_path` argument to
`git_policy.validate_base`,
`git_policy.prepare_branch` and
`git_policy.check_branch`.

For `approved-dependency`, require verified dependency
evidence and explicit user authorization, including
the approved commit manifest.

If required policy evidence is absent, contradictory
or invalidated, stop with BLOCK.

A policy object is not itself authorization to mutate Git.

### 3.3. Validate Canonical Base

Invoke `git_policy.validate_base` through `harness_call`
using the active WorkflowController.

Arguments:

- `issue`: current Issue number ($1).
- `policy_path`: required canonical policy object from Phase 3.2.

Use the base policy selected in Phase 3.2 and the
verified evidence from Phase 3.1.

Do not pass `workflow_id` or unsupported arguments.

If validation fails, returns BLOCK, or mandatory
evidence is missing, stop immediately.

The local harness must:

- Never fetch, reset, rebase or modify remote-tracking
  references during canonical base validation.
- Verify the exact remote SHA using read-only Git queries.
- Require the local base reference to match the approved
  exact SHA; otherwise return BLOCK.
- Verify the corresponding local tracking SHA.
- Reject missing or conflicting remote references.
- Validate dependency evidence when applicable.
- Record the canonical base policy.
- Record `base_branch`, `base_ref`, and `base_remote_ref`.
- Record `pr_target` and `pr_target_ref`.
- Record `base_sha` as an immutable historical value.
- Record `base_remote_sha_initial`.
- Record `pr_target_sha_initial`.
- Keep current remote observations separate from historical SHA.
- Preserve working-tree, staging, and commit history.

For `approved-dependency`, require evidence of:

- Explicit approval.
- Approved dependency identity.
- Exact dependency base reference and SHA.
- Intended PR destination.
- Verifiable ancestry and included commits.

`evidence_manager.py` must:

- Register verified canonical base evidence in session; export only an explicitly authorized historical static summary.
- Preserve the immutable historical `base_sha`.
- Invalidate only observations affected by the fetch.
- Retain unaffected working-tree and staging observations
  only while their state remains unchanged.

Stop if validation fails or evidence is incomplete.

### 3.4. Validate and Prepare Issue Branch

Select exactly one execution path based on
the verified result of `git_policy.inspect`:

- New Issue branch:
  invoke `git_policy.prepare_branch` through
  `harness_call`.

- Existing Issue branch:
  follow `Existing Issue Branch Recovery`.
  Do not invoke `git_policy.prepare_branch`.

Both paths must use the same canonical base policy
and complete the Branch Guard before Phase 4.

For the new-branch path, invoke
`git_policy.prepare_branch` using the active
WorkflowController.

Arguments:

- `issue`: current Issue number ($1).
- `branch_name`: proposed Issue-specific branch.
- `policy_path`: required canonical policy object from Phase 3.2.
- `expected_head`: branch_evidence.git.head from Phase 3.1.
- `expected_branch`: branch_evidence.git.active_branch from Phase 3.1.

Use the canonical base and authorization evidence
validated in previous steps.

Before modifying Git, the harness must:

- Revalidate all safety-critical preconditions.
- Verify the canonical base and its historical SHA.
- Identify all existing branches associated with the Issue.
- Reject ambiguous or duplicate Issue branches.
- Validate the complete commit range of reusable branches.
- Verify ancestry against the approved base SHA.
- Require AI validation of Issue ownership and commit scope.
- Preserve all pre-existing local changes.
- Preserve unrelated staged and unstaged files.
- Block operations that could overwrite or move local work.

Branch naming:

`<type>/<three-digit-issue-number>-<slug>`

Allowed types:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

The slug must be derived from the actual GitHub Issue title.

Branch preparation rules:

- Reuse an existing branch only when fully validated.
- Otherwise create the branch from the exact approved
  historical `base_sha`.
- Never use the active branch as the implicit base.
- Never create duplicate Issue branches.
- Never automatically rebase.
- Never change the base of an existing branch.
- Never stash, discard, overwrite or move unrelated work.
- Never rewrite Git history.
- Never force-push.
- Never modify unrelated files.

Switch to the validated Issue branch.

After a successful Git mutation, EvidenceManager must:

- Invalidate affected mutable Git evidence.
- Preserve valid historical static evidence.
- Preserve the immutable canonical `base_sha`.
- Require fresh observations at the next security boundary.

Stop if branch preparation fails or mandatory
evidence is missing.

### 3.5. Validate Branch Guard

Invoke `git_policy.check_branch` through `harness_call`
using the active WorkflowController.

Arguments:

- `issue`: current Issue number ($1).
- `branch_name`: validated Issue-specific branch.
- `policy_path`: required canonical policy object from Phase 3.2.
- `approved_commits_path`: only when required by the
  verified branch-validation contract.

Do not pass `workflow_id` or unsupported arguments.

Continue to Phase 4 only when the complete Branch Guard
returns PASS.

The local harness must verify:

- The Issue-specific branch exists.
- The Issue-specific branch is active.
- The active branch is not `main`.
- The branch name matches Issue #$1.
- The branch naming convention is valid.
- The canonical base policy is recorded.
- The exact historical base SHA is recorded.
- The branch descends from the approved base SHA.
- Remote reference evidence is valid.
- Dependency authorization exists when applicable.
- Existing Issue branches have been validated.
- No unrelated local work was moved or overwritten.
- Pre-existing staging and working-tree changes are preserved.
- No prohibited Git operation occurred.

The harness must distinguish between:

- `PASS`: All mandatory checks passed.
- `BLOCK`: A mandatory condition failed.
- `NEEDS_APPROVAL`: Explicit user authorization is required.

`evidence_manager.py` must record:

- The final branch validation status.
- The observation timestamp.
- The sources of verified evidence.
- The canonical base and historical SHA.
- The active Issue branch.
- The current Git observations.
- Any blockers or missing authorizations.

A successful Git inspection alone does not authorize
branch creation or switching.

### Existing Issue Branch Recovery

When `git_policy.inspect` identifies an existing
Issue-specific branch:

1. Never call `git_policy.prepare_branch` automatically.
2. Verify that exactly one Issue branch exists and
   that it is the active branch.
3. Resolve and validate the canonical base policy.
4. Invoke `git_policy.check_branch` with the verified
   branch name and canonical policy.
5. Require `branch_check_evidence.status == PASS`.
6. Inspect all preexisting working-tree changes.
7. Determine whether each change belongs to the
   current Issue and can safely remain in place.
8. If any change is unrelated, ambiguous, or unsafe,
   return BLOCK.
9. Apply Branch Guard using the current evidence.
10. Advance only when the controller authorizes it.

An existing valid Issue branch must be reused,
not recreated.

Never delete, stash, reset, rebase, overwrite or
automatically stage preexisting work.

A successful technical branch check does not
automatically approve local changes.

### 3.6. Blocking Policy

If any operation returns `BLOCK`, `NEEDS_APPROVAL`,
an execution error, or incomplete mandatory evidence:

1. Stop the workflow immediately.
2. Do not modify project files.
3. Do not create or modify the SDD.
4. Do not proceed to implementation.
5. Preserve existing Git changes and collected evidence.
6. Identify the specific blocking condition.
7. Report the supporting evidence.
8. Request only the authorization or intervention required.

Never bypass a failed local guard using model judgment.

Never treat missing evidence as successful verification.

Continue to Phase 4 only when the complete Branch Guard
returns `PASS`.

### 3.7. Migration Compatibility

The local harness components are planned interfaces
until they are implemented, tested, and integrated.

Required components:

- `scripts/harness/git_policy.py`
- `scripts/harness/evidence_manager.py`

Before the local implementation is validated, continue
using the original procedures:

- `.opencode/commands/hooks/branch-check.md`
- `.opencode/commands/guardarails/branch.md`

Do not replace the original procedures until equivalent
validation has been demonstrated through automated tests.

Never weaken the original Git safety guarantees to
reduce token usage.

## 4. Create or Complete the SDD — Hybrid

This phase requires a successful Branch Guard.

### 4.1. Inspect Existing SDD

Execute:

`python3 scripts/harness/sdd_manager.py inspect --issue $1`

The local harness must:

- Identify existing SDD directories for Issue #$1.
- Detect duplicate or incorrectly named directories.
- Inspect existing `spec.md`, `plan.md`, and `tasks.md`.
- Identify files and content that must be preserved.
- Return structured evidence without modifying files.

Stop if the SDD state cannot be determined safely.

### 4.2. Prepare SDD Structure

Execute the validated local operation:

`python3 scripts/harness/sdd_manager.py prepare --issue $1`

The local harness must:

- Create or safely reuse the Issue-specific SDD directory.
- Use `specs/<three-digit-issue-number>-<slug>/`.
- Create missing required files without overwriting existing work.
- Never create duplicate SDD directories.
- Rename an invalid directory only when the operation is safe
  and its intended destination has been verified.
- Stop when existing work or approved decisions could be lost.

### 4.3. Generate or Complete SDD Content

The AI must create or complete:

- `spec.md`: Objective, scope, expected behavior,
  acceptance criteria, and constraints.
- `plan.md`: Technical approach, affected components,
  implementation strategy, and verification.
- `tasks.md`: Actionable tasks, dependencies,
  and required checks.

All content must derive from:

- GitHub Issue #$1.
- Relevant project context.
- Existing architecture.
- Applicable project rules.
- Previously approved specifications and decisions.

Preserve valid existing content.

Never invent requirements or overwrite approved decisions.

### 4.4. Validate SDD Structure

Execute:

`python3 scripts/harness/sdd_manager.py validate --issue $1`

The local harness must:

- Verify the canonical SDD directory exists.
- Verify all three required files exist.
- Detect duplicate SDD directories.
- Validate required structural elements.
- Return PASS or BLOCK with supporting evidence.

Structural PASS does not imply functional or
architectural approval.

### 4.5. Apply SDD Guard

Load and apply:

`.opencode/commands/guardarails/sdd.md`

The AI must verify:

- Consistency with the GitHub Issue.
- Coverage of approved requirements.
- Compatibility with project architecture.
- Preservation of previous decisions.
- No unsupported functional assumptions.

Continue to Phase 5 only when both local structural
validation and the SDD Guard return PASS.

### Migration Compatibility

Until `sdd_manager.py` is implemented and tested,
follow the original Phase 4 workflow and SDD Guard.

Never bypass the original safety requirements.

### SDD Guard Validation Contract

The SDD Guard consists of two mandatory validations:

1. Structural validation — Local Python harness.
2. Semantic validation — AI using the original SDD Guard.

The local harness validates:

- Exactly one Issue-specific SDD directory.
- Correct directory naming convention.
- Three-digit Issue number.
- Non-empty lowercase kebab-case slug.
- Required SDD files exist.
- All required files contain non-empty content.

The AI validates:

- The slug reasonably matches the Issue title.
- `spec.md` sufficiently defines the requested behavior.
- `plan.md` provides a concrete implementation approach.
- `tasks.md` contains actionable work.
- No important unsupported requirements were introduced.

Structural PASS is not semantic PASS.

Continue to Phase 5 only when both validations return PASS.

If either validation fails, stop and report the specific
blocking condition.

Do not automatically overwrite approved SDD content.

## 5. Validate the Plan — Hybrid

Verify traceability:

`GitHub Issue → spec.md → plan.md → tasks.md → verification`

Ensure every acceptance criterion is covered by actionable tasks
and appropriate verification procedures.

### 5.1. Reuse SDD Evidence

Reuse verified SDD evidence from Phase 4.

Do not repeat structural checks already completed unless
the relevant evidence has become stale or invalid.

### 5.2. Apply Planning Guard

Load and apply:

`.opencode/commands/guardarails/planning.md`

The AI must validate planning consistency, completeness,
feasibility, traceability, dependencies, and scope.

Continue only when the Planning Guard returns `PASS`.

### 5.3. Planning Repair Loop

If planning problems can be corrected without changing
requirements or scope, load and execute:

`.opencode/commands/loops/planning.md`

After corrections:

- Invalidate affected planning and SDD evidence.
- Revalidate the affected SDD conditions.
- Reapply the Planning Guard.
- Continue only after all mandatory checks pass.

### 5.4. Blocking Policy

If an unresolved functional, architectural, or scope
decision requires authorization, stop the workflow.

Never begin implementation while planning is blocked.
Never invent requirements or expand the Issue scope.

## 6. Implement Tasks

Implement `tasks.md` while respecting task order,
dependencies, architecture, and approved scope.

Load and apply:

- `.opencode/commands/guardarails/implementation.md`
- `.opencode/commands/loops/task.md`

Select technical skills based on actual task requirements.
Do not load skills by default.

Do not introduce unrelated improvements, dependencies,
refactorings, or functionality.

Mark a task complete only after its required work
has been implemented and verified.

Before leaving this phase, perform a final SDD synchronization:

- reread `tasks.md` and compare it with the implementation and verifications
  that actually completed;
- mark every task that can now be considered complete in `tasks.md`;
- if the real state does not allow a task to be completed, leave it pending and
  activate the applicable blocking flow;
- do not postpone this update until after change review, staging, or commit.

Continue when all tasks are completed and no blockers remain.

## 7. Run Verification Checks — Hybrid

Determine applicable verification checks from:

- GitHub Issue acceptance criteria.
- `spec.md`, `plan.md`, and `tasks.md`.
- Applicable `AGENTS.md` instructions.
- Existing project configuration and conventions.
- Affected components, layers, and files.

### 7.1. Select Applicable Checks — AI

Inspect actual project configuration before selecting checks.

Identify all mandatory and applicable verifications.

Select only existing, validated project commands.

Do not invent commands or omit required checks.

Record the exact selected check set before execution.

### 7.2. Execute Verification Gate — Python

When implemented and tested, execute:

`python3 scripts/harness/verification_runner.py run --checks <validated-check-ids>`

The local harness must:

- Execute exactly the selected checks.
- Use verified project commands and working directories.
- Wait for each execution to finish.
- Capture actual exit codes and execution status.
- Capture relevant errors and warnings.
- Distinguish PASS, FAIL, and INCOMPLETE.
- Record checks that could not execute.
- Preserve complete diagnostic logs.
- Return a compact structured report.
- Never modify code, tests, or project configuration
  to force successful results.

A check that did not execute or complete is never PASS.

### 7.3. Apply Verification Guard — AI

Load and apply:

`.opencode/commands/guardarails/verification.md`

Verify:

- All applicable checks were identified.
- Every required check was executed.
- All results are known and complete.
- No applicable check failed.
- No unresolved relevant errors remain.
- No relevant blocking warnings remain.
- No mandatory verification is pending.

Technical PASS alone does not imply overall
Verification Guard PASS.

### 7.4. Result Routing

If all mandatory checks and the Verification Guard PASS:

- Proceed to Phase 9.

If a check fails and the issue can be corrected
within approved scope:

- Proceed to Phase 8.

If execution is incomplete or a blocker requires
authorization or external intervention:

- Stop and report the blocking condition.
- Never treat INCOMPLETE as PASS.

### Migration Compatibility

Until `verification_runner.py` is implemented,
tested, and proven equivalent to the original hook,
load and execute:

`.opencode/commands/hooks/verification-gate.md`

Always apply the original Verification Guard.

Never skip mandatory checks to reduce token usage.

## 8. Resolve Failures — Hybrid

For each applicable verification failure:

1. Identify the failed check and its observed result.
2. Inspect relevant errors and warnings.
3. Determine the likely root cause and whether it relates
   to Issue #$1.
4. Load and apply:
   `.opencode/commands/guardarails/repair.md`
5. If repair is permitted, load and execute:
   `.opencode/commands/loops/repair.md`

### 8.1. Repair Responsibilities — AI

The AI must:

- Identify the root cause when possible.
- Verify that the failure is related to the Issue.
- Apply the Repair Guard before modifying code.
- Determine and implement the minimum permitted correction.
- Preserve approved requirements and architecture.
- Never weaken tests or verification rules.
- Never expand Issue scope.

### 8.2. Re-run Affected Checks — Python

When implemented and tested, execute:

`python3 scripts/harness/verification_runner.py run --checks <validated-check-ids>`

The local harness must:

- Re-run the affected verification checks.
- Use the same validated project check definitions.
- Capture actual execution results.
- Report PASS, FAIL, or INCOMPLETE for each check.
- Preserve relevant errors, warnings, and diagnostic logs.
- Never modify implementation or project configuration.

Until the local runner is validated, use:

`.opencode/commands/hooks/verification-gate.md`

### 8.3. Reapply Verification Guard

Load and apply:

`.opencode/commands/guardarails/verification.md`

After each correction:

- Evaluate the results of the affected checks.
- Identify any mandatory checks still pending or invalidated.
- Repeat the Repair Loop only while repair is permitted
  and reasonable progress exists.
- Stop when the Repair Guard blocks further correction.

### 8.4. Final Verification

Before leaving Phase 8:

- Ensure every applicable check has valid evidence
  for the final implementation state.
- Re-run any checks invalidated by subsequent changes.
- Confirm no relevant errors or blocking warnings remain.
- Require the complete Verification Guard to return PASS.

Continue to Phase 9 only after full verification succeeds.

### 8.5. Blocking Policy

If a repair requires changes outside approved scope,
a new functional or architectural decision, or weakening
valid verification mechanisms:

- Stop immediately.
- Preserve existing work.
- Identify the blocking condition.
- Request only the necessary authorization or intervention.

Never proceed toward commit while verification is blocked.

## 9. Review Changes — Hybrid

Before reviewing changes, confirm the final SDD
synchronization boundary established in Phase 6.

At this point:

- Every completable task is marked in `tasks.md`.
- `spec.md`, `plan.md`, and `tasks.md` are frozen
  for the intended commit.
- Any later SDD modification invalidates the review.
- Do not continue if task state and implementation
  cannot be reconciled safely.

### 9.1. Collect Pre-Stage Evidence — Python

When implemented and tested, execute:

`python3 scripts/harness/git_policy.py review-changes --issue $1`

The local harness must:

- Inspect Git and SDD without modifying them.
- Identify staged, unstaged, new, deleted, and renamed files.
- Identify protected and pre-existing changes.
- Record the state of `opencode.json`.
- Record the active branch and HEAD.
- Record the observed SDD state and task statuses.
- Provide sufficient diff content for change review.
- Return one complete `pre_stage_evidence` observation
  directly to the workflow, without persistent storage.

Observation PASS means collection succeeded.
It does not authorize staging.

### 9.2. Apply Change Review Guard — AI

Load and apply:

`.opencode/commands/guardarails/change-review.md`

Consume the valid `pre_stage_evidence` directly.

Do not repeat Git or SDD observations while the
evidence remains valid.

The AI must:

- Justify every proposed commit change using
  the Issue, SDD, and tasks.
- Identify changes outside approved scope.
- Identify protected and pre-existing work.
- Determine whether Issue changes can be
  safely separated from unrelated work.
- Confirm final SDD synchronization.
- Reject uncertain or unsafe inclusion.

### 9.3. Result

Continue to Phase 10 only when the
Change Review Guard returns `PASS`.

If evidence is missing, incomplete, contradictory,
or invalidated, stop and obtain a fresh observation
through the collection procedure.

If unrelated work cannot be separated safely,
stop and request the necessary intervention.

Never modify, stash, discard, or stage unrelated work.

### Migration Compatibility

Until `git_policy.py review-changes` is implemented
and proven equivalent to the original hook, use:

`.opencode/commands/hooks/pre-stage-check.md`

Always apply the original Change Review Guard.

## 10. Create the Local Commit — Hybrid

This phase is mandatory.

Proceed only after the Change Review Guard returns PASS.

### 10.1. Define Approved Commit — AI

Use the approved Phase 9 review to identify:

- The expected working branch.
- The canonical base policy and exact base SHA.
- The approved commit manifest and patch.
- All protected and unrelated changes.
- The complete approved Issue commit range.
- The commit message following project conventions.

Never infer approval from the current Git state alone.

### 10.2. Prepare Selective Staging — Python

When implemented and tested, execute:

`python3 scripts/harness/git_policy.py prepare-staging --issue $1`

Pass the approved manifest and required verified
preconditions through the implemented CLI contract.

The local harness must:

- Revalidate the reviewed Git and SDD state.
- Stage only approved Issue changes.
- Preserve unrelated staged and unstaged work.
- Never stage protected paths without explicit approval.
- Reject ambiguous or inseparable mixed changes.
- Never use indiscriminate `git add .`.
- Stop safely if the approved state has changed.

### 10.3. Pre-Commit Validation — Python

Execute:

`python3 scripts/harness/git_policy.py pre-commit-check --issue $1`

The local harness must verify:

- The expected Issue branch is active.
- Staging is non-empty.
- Staging matches the approved patch and manifest.
- No unrelated or protected changes are staged.
- The canonical base SHA and ancestry are valid.
- Every commit in the candidate Issue range has
  previously approved justification.
- The complete candidate patch matches the approved scope.
- The working tree and staging can be verified safely.

This operation is read-only.

PASS authorizes only the next controlled commit operation.

### 10.4. Create Commit — Python

Execute:

`python3 scripts/harness/git_policy.py create-commit --issue $1`

Pass the approved commit message and required authorization
through the implemented CLI contract.

The local harness must:

- Revalidate critical preconditions immediately before commit.
- Reject changes to the approved staging.
- Create one real, non-empty Issue commit.
- Never include unrelated or protected work.
- Never rewrite existing Git history.
- Record the real commit hash and message.
- Stop and report any failure without hiding it.

### 10.5. Verify Created Commit — Python

Execute:

`python3 scripts/harness/git_policy.py check-commit --issue $1`

The local harness must:

- Verify the commit exists.
- Verify it was created during this workflow.
- Verify its branch and parent relationship.
- Verify it is non-empty.
- Verify its hash and message.
- Verify its exact content against the approved manifest.
- Confirm no unrelated or protected changes were included.
- Return a structured technical result.

### 10.6. Apply Commit Guard — AI

Load and apply:

`.opencode/commands/guardarails/commit.md`

Verify complete traceability:

`Issue → SDD → tasks → implementation → verification → changes → commit`

Continue only when the local technical validation
and the Commit Guard both return PASS.

### Blocking Policy

If any staging, pre-commit, commit, or validation
operation returns FAIL, BLOCK, or incomplete evidence:

- Stop immediately.
- Preserve existing local work.
- Report the exact failure and affected Git state.
- Never force-push, rebase, stash, discard, or rewrite
  history to hide the problem.
- Never continue to push or Issue completion.

### Migration Compatibility

Until the local commit operations are implemented,
tested, and validated, use the original Phase 10 workflow:

1. Stage only approved Issue changes.
2. Load and follow:
   `.opencode/commands/hooks/pre-commit.md`
3. Create a real, non-empty commit.
4. Record its hash and message.
5. Load and apply:
   `.opencode/commands/guardarails/commit.md`

Never weaken the original Git safety guarantees.

## 11. Verify Post-Commit State — Hybrid

This phase requires Commit Guard PASS.

### 11.1. Collect Post-Commit Evidence — Python

When implemented and tested, execute:

`python3 scripts/harness/git_policy.py post-commit-check --issue $1`

Provide the canonical historical base policy, exact base SHA,
expected branch, commit SHA and commit message previously
validated by the workflow.

The local harness must:

- Observe the actual Git state exactly once per execution.
- Record the active branch, HEAD and last commit.
- Record complete working-tree and staging manifests.
- Include all untracked files in the pending manifest.
- Record the canonical historical `base_sha`.
- Verify that `base_sha` is an ancestor of HEAD.
- Enumerate the complete `base_sha..HEAD` commit range.
- Preserve per-commit manifests, including merge commits.
- Preserve rename scores and original paths.
- Record the complete aggregated range manifest.
- Inspect all protected pre-existing paths.
- Always include `opencode.json` among protected paths.
- Compare protected paths against verified earlier evidence.
- Return one structured `post_commit_evidence` observation.
- Report incomplete or contradictory observations explicitly.
- Never modify Git, staging, files, or history.

The evidence must contain:

- Source, phase, timestamp, repository and Issue.
- Status: complete, incomplete, or contradictory.
- Expected and observed commit information.
- Active branch and HEAD.
- Complete staged, unstaged and pending manifests.
- Canonical base policy and immutable historical SHA.
- Complete commit range and per-commit manifests.
- Protected path states and preservation evidence.
- Conditions that invalidate the observation.

Do not declare functional PASS from technical observation.

### 11.2. Apply Post-Commit Guard — AI

Load and apply:

`.opencode/commands/guardarails/post-commit.md`

Consume the valid `post_commit_evidence` directly.

Do not repeat Git or SDD queries while the
observation remains valid.

The AI must verify:

- The expected commit matches HEAD and the last commit.
- The branch and base policy match the approved workflow.
- Every commit and file in the complete range is justified.
- No Issue-related changes remain uncommitted.
- All unrelated local changes remain intact.
- No protected path appears in staging or commit range.
- The complete Issue-to-commit traceability is preserved.

### 11.3. Result

Continue to Phase 12 only when the Post-Commit Guard
returns PASS.

Return BLOCK when evidence is missing, incomplete,
contradictory, invalidated, or insufficient to justify
the complete commit range and pending changes.

On BLOCK:

- Stop the workflow.
- Preserve all unrelated local work.
- Do not automatically create another commit.
- Do not push.
- Do not close the Issue.
- Report the exact blocking condition.

If the state changes, obtain a fresh post-commit
observation before reapplying the guard.

### Migration Compatibility

Until `git_policy.py post-commit-check` is implemented,
tested, and proven equivalent to the original hook,
load and execute:

`.opencode/commands/hooks/post-commit.md`

Always apply the original Post-Commit Guard.

Never weaken existing Git or Issue-scope guarantees.

## 12. Document the Issue on GitHub

Update GitHub Issue #$1 using the configured `github` MCP.

Reuse previously verified workflow evidence.
Do not repeat local Git or SDD observations while
their evidence remains valid.

Document only:

- Verified implementation and technical decisions.
- Affected files and their complete status manifest.
- Actual executed verification checks and results.
- The verified local commit hash, message, and branch.
- Readiness for manual validation.

Persist only the compact static handoff evidence
required by `/finish-issue`:

- Issue identity and approved scope.
- Approved decisions and dependencies.
- SDD references.
- Historical verification results.
- Accepted commit and complete Issue commit range.
- Complete Issue file/status manifest.

Keep mutable Git, remote, PR, and Issue state separate.

State explicitly:

- Implementation is complete.
- Applicable verification checks passed.
- Changes are committed locally.
- Manual validation remains pending.
- The Issue remains open at documentation time.
- This command has not pushed the branch.
- `/finish-issue $1` must run after manual validation.

Verify the GitHub MCP operation succeeded and the
documentation was published to the correct Issue.

Load and apply:

`.opencode/commands/guardarails/github-documentation.md`

Continue only when the GitHub Documentation Guard
returns `PASS`.

## 13. Final Workflow Verification — Hybrid

This phase requires GitHub Documentation Guard PASS.

### 13.1. Reuse Verified Evidence

Reuse previously verified workflow evidence:

- Approved base policy and historical base SHA.
- Complete validated Issue commit range.
- SDD structure and approved content.
- Final task completion state.
- Acceptance criteria coverage.
- Actual required verification results.
- Created Issue commit and post-commit evidence.
- Protected and unrelated local changes.
- Verified GitHub documentation.

Do not repeat checks while their evidence remains valid.

Do not treat historical observations as current state.

### 13.2. Final Local Git Check — Python

When implemented and tested, execute:

`python3 scripts/harness/git_policy.py final-check --issue $1`

The local harness must:

- Verify the expected Issue branch is active.
- Verify the approved base policy and historical base SHA.
- Verify the expected commit and complete Issue range.
- Identify remaining staged, unstaged and untracked changes.
- Confirm preservation of protected paths.
- Return structured current Git evidence.
- Never modify Git, staging, files or history.

The local Git check cannot independently establish
that no push occurred throughout the workflow.

Require reliable workflow action evidence for that claim.

### 13.3. SDD and Verification Evidence

Reuse Phase 4 SDD evidence when still valid.

If necessary, execute:

`python3 scripts/harness/sdd_manager.py validate --issue $1`

Confirm that all tasks are completed and that their
completion is supported by implemented and verified work.

Reuse applicable successful verification reports from
Phases 7 and 8.

Reject verification evidence invalidated by later changes.

### 13.4. Verify GitHub Documentation — MCP

Using the configured `github` MCP, verify:

- Issue #$1 remains open.
- Documentation was published successfully.
- Documented facts match verified workflow evidence.
- Manual validation remains pending.
- `/finish-issue $1` has not been executed
  during this workflow.

Do not infer unobserved remote or historical actions.

### 13.5. Apply Final Workflow Guard — AI

Load and apply:

`.opencode/commands/guardarails/final-workflow.md`

Verify complete traceability:

`Issue → SDD → tasks → implementation → verification → Git changes → commit → GitHub documentation`

Confirm:

- All approved acceptance criteria are covered.
- All tasks are actually complete.
- All applicable verifications passed.
- The correct Issue commit exists.
- No Issue-related changes remain uncommitted.
- All protected and unrelated changes are preserved.
- The Issue remains open and documented.
- No push was performed by this workflow.
- Manual validation remains pending.

Continue to Phase 14 only when every mandatory
condition is supported by valid evidence and
the Final Workflow Guard returns PASS.

### Blocking Policy

If any required evidence is missing, incomplete,
contradictory, outdated or invalidated:

- Stop immediately.
- Identify the failed condition and originating phase.
- Preserve existing local work.
- Never invent evidence or assume successful execution.
- Never push, close the Issue, or execute `/finish-issue`.
- Request only the intervention needed.

### Migration Compatibility

Until the local operations have been implemented,
tested, and validated, use:

1. `.opencode/commands/hooks/final-workflow-check.md`
2. `.opencode/commands/guardarails/final-workflow.md`

Never weaken original workflow guarantees.

## 14. Prepare Manual Validation

Derive task-specific manual checks from acceptance criteria, implemented
behavior, affected components, and risks. Cover the applicable scope:

- Frontend: visual behavior, interactions, navigation, responsiveness, accessibility.
- Backend/API: endpoints, responses, status codes, error cases.
- Authentication: states, permissions, ownership, roles.
- Persistence: data operations and integrity.
- Docker/Infrastructure: startup, healthchecks, connectivity, persistence, configuration.
- Documentation/Design: relevant documentation, decisions, review.
- Integrations: external services, connections, errors, behavior.
- Configuration: variables, loading, settings, expected behavior.

Do not generate generic checklists.
Do not duplicate completed automated checks unless
manual confirmation provides additional evidence.

If no reasonable manual validation applies,
state this explicitly without inventing checks.

When environment preparation is necessary,
provide only applicable commands defined by the project.
Never invent development or setup commands.

Load and apply:

`.opencode/commands/guardarails/manual-validation.md`

Manual validation must remain pending user approval.

The final response MUST contain this exact heading:

### 14.1 Validaciones manuales pendientes

Provide a concise, task-specific Markdown checklist.
Do not mark any checkbox as completed automatically.

Do not record manual validation as approved.

Continue only when the Manual Validation Guard returns `PASS`.

## 15. Development Handoff

Load and apply:

`.opencode/commands/guardarails/workflow-handoff.md`

The development handoff is ready only when all previous mandatory checks and
the Workflow Handoff Guard return `PASS`.

Provide a final summary containing:

- GitHub Issue and working branch.
- SDD location and task status.
- Executed verification checks and results.
- Commit hash and message.
- Issue-related files marked `A`, `M`, `D`, or `R`.
- Actual `git status` and GitHub Issue status.
- Manual validation status: pending user approval.
- The complete pending manual-validation checklist.
- Blockers or limitations, if any.

Keep the listed static handoff evidence historical; report `git status` and
GitHub Issue status as current observations. The resulting state is completed
implementation and verification, a local commit, an open documented Issue, no
push, merge, or closure, and pending manual validation.

After the user approves manual validation,
the next command is:

`/finish-issue $1`

Never execute it automatically from `/hyssue`.
