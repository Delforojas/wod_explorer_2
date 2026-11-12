# Issue Workflow — State File

Path: `.opencode/state/gissue-<N>/state.json` (gitignored).

- The orchestrator is its only writer. Subagents read it and report changes
  through their contract.
- It lives outside `specs/` on purpose: phases 1–2 run before the Issue branch
  exists, and the committed tree must not depend on the commit hash it records.
- Its durable copy is the static handoff evidence that phase 12 publishes on
  the GitHub Issue.

## Template

```json
{
  "schema_version": "1.0",
  "issue": 0,
  "run_id": null,
  "workflow": "gissue",
  "status": "IN_PROGRESS",
  "current_phase": 1,

  "execution": {
    "phase_status": "PENDING",
    "attempt": 0
  },

  "repair_cycles": 0,
  "planning_cycles": 0,

  "static": {
    "issue": {},
    "scope": {},
    "naming": {},
    "dependencies": [],
    "decisions": [],
    "context": [],
    "base_policy": null,
    "base": {},
    "protected_paths": [],
    "branch": null,
    "sdd": {},
    "verification": [],
    "implementation": [],
    "commit": {},
    "manifest": [],
    "documentation": {}
  },

  "mutable": {
    "branch": null,
    "head": null,
    "working_tree": {},
    "remote_refs": {},
    "issue_state": null,
    "freshness": {}
  },

  "blocker": null,
  "needs": [],
  "log": []
}
```

## Fields

`schema_version`: version of the state schema.

`issue`: GitHub Issue number.

`run_id`: unique execution identifier, created when the workflow starts
and preserved when resuming the same execution.

`workflow`: workflow identifier (`gissue`).

`status`: `IN_PROGRESS`, `BLOCKED`, or `DONE`.

`current_phase`: the phase that must execute next or be reconciled.

`execution.phase_status`:

- `PENDING`: phase not yet started.
- `RUNNING`: phase currently executing.
- `VALIDATING`: phase completed, awaiting guard validation.
- `PASS`: phase successfully validated.

`execution.attempt`: number of attempts for the current phase.

A `RUNNING` or `VALIDATING` phase must be reconciled before retrying.
After a validated phase transition, reset `execution.phase_status`
to `PENDING` and `execution.attempt` to `0` for the next phase.

`repair_cycles`: number of repair cycles initiated in phase 7.
Maximum: 3.

`planning_cycles`: number of planning correction cycles initiated in phase 5.
Maximum: 3.

`blocker`: recorded blocking condition and supporting evidence.
Set when `status` becomes `BLOCKED`.

`needs`: minimum intervention required to resume.
Never infer user approvals or decisions.

### Static

`static` contains historical evidence and approved workflow decisions.
Entries are reused across phases until explicitly invalidated.

- `issue`: number, title, URL, and acceptance criteria references.

- `scope`, `dependencies`, `decisions`: approved scope, dependencies,
  and decisions, each with its source.

- `naming`: `type`, three-digit `number`, and `slug` derived from the Issue
  title. Phase 3 builds the branch name and phase 4 builds the SDD directory.

- `context`: `{path, revision, applies, reason}` for each context item used.

- `base_policy`, `base`: `standard-main` or `approved-dependency`, together
  with the canonical base record:
  `base_branch`, `base_ref`, `base_remote_ref`, `base_sha`,
  `base_remote_sha_initial`, `pr_target`, `pr_target_ref`,
  `pr_target_sha_initial`.

  `base_sha` is immutable once recorded and validated.

- `branch`, `sdd`: Issue branch name; SDD directory, files, and
  `plan_validated`.

  `plan_validated` is set by phase 5 and invalidated by subsequent
  substantive SDD edits. Ticking task checkboxes without changing
  task definitions does not invalidate it.

- `protected_paths`: paths that must never be changed or staged,
  represented as `{path, status_entry, hash}` and recorded in phase 3.

  Phase 3 requires a clean starting state. The record includes
  `opencode.json` with its initial hash.

- `verification`: list of verification runs:

  `{run, observed_at, results: [{check, command, source, status, summary}], manual_only}`

  Phase 7 records verification results. The latest applicable run is
  authoritative only while its evidence remains valid.

  Phases 9 and 13 require all mandatory applicable automated checks
  to have `PASS` results. Manual-only checks remain pending for the user.

- `implementation`: per-task records:

  `{task, dependencies, files, changes, checks, result}`

  Phase 6 creates these records and phase 8 updates them.

  Repairs must be attributed to their corresponding task or recorded
  under an entry such as `repair:<check>`.

  Phase 9 uses these records to trace changes to tasks and
  acceptance criteria.

- `commit`: `{hash, message, branch}`.

  The recorded commit must be verified against the actual Git
  history and active branch before reuse.

  Never repeat commit creation without reconciling the real
  repository state, even if the recorded hash is missing.

- `manifest`: approved by phase 9 before staging.

  Contains all Issue-related changes authorized for the commit,
  including uncommitted working-tree changes.

  Each entry is:

  `{path, status (A|M|D|R), old_path (R only), content_hash, justification}`

  `content_hash` identifies the approved content and is omitted for
  deleted files. `justification` references a task or acceptance criterion.

  Phase 10 stages only approved changes. Before staging, it verifies
  that the content still matches its approved hash.

  Phase 11 compares the actual commit against the approved manifest,
  including paths, statuses, and content.

  Any unexpected change, unauthorized path, or mismatch is `BLOCKED`.

  Protected paths cannot be authorized merely by appearing
  in the manifest.

- `documentation`: GitHub comment created in phase 12, including
  its URL or ID and observation date.

  Phase 13 verifies the recorded documentation against
  the actual GitHub result.

### Mutable

`mutable` contains current observations only.

PR creation, publication, and merge state belong to `/finish-issue`.

- `branch`: currently observed Git branch.

- `head`: currently observed HEAD commit.

- `working_tree`: observed staged, unstaged, untracked,
  and deleted files.

- `remote_refs`: observed Git remote references and their SHAs.

- `issue_state`: observed GitHub Issue state.

- `freshness`: per-field observation metadata:

  `{source, observed_at, status}`

  Valid statuses: `VALID`, `STALE`.

  Each tracked observation must have an independent freshness record.

  Mutations invalidate only affected observations and their
  dependent evidence.

  Updating one observation must never mark unrelated evidence
  as valid.

  Re-observe stale evidence before required security boundaries.

  Historical observations must not be treated as current evidence.

### Log

`log` contains one entry per delegation, appended in execution order.

Example:

```json
{
  "phase": "3",
  "mode": "branch",
  "agent": "git-ops",
  "run_id": "<execution-id>",
  "attempt": 1,
  "status": "PASS",
  "summary": "...",
  "failures": [],
  "corrections": [],
  "next_phase": "4",
  "at": "<ISO-8601>"
}
```

The log must preserve the outcome of each delegation, including
failed attempts, corrections, and routing decisions.

Never erase historical log entries to make a failed phase appear
successful.

## State Ownership and Safety

- Only the orchestrator may modify the canonical `state.json`
  until a validated State Manager is available.
- Subagents must report proposed updates through their contracts.
- State updates must be validated before persistence.
- Never overwrite an immutable `base_sha`.
- Never mark evidence as fresh without a corresponding observation.
- Reconcile interrupted operations before repeating side effects.
- A `BLOCKED` workflow must not advance until the blocking
  condition is resolved and the required decision or evidence
  is recorded.
- `DONE` means the Gissue development handoff is complete.
  It does not mean manual validation has been approved.
- `/gissue` must never push, merge, close the GitHub Issue,
  or invoke `/finish-issue`.
