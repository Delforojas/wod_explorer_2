# Issue Workflow — State File

Path: `.opencode/state/issue-<N>/state.json` (gitignored).

- The orchestrator is its only writer. Subagents read it and report changes
  through their contract.
- It lives outside `specs/` on purpose: phases 1–2 run before the Issue branch
  exists, and the committed tree must not depend on the commit hash it records.
- Its durable copy is the static handoff evidence that phase 12 publishes on
  the GitHub Issue.

## Template

```json
{
  "issue": 0,
  "workflow": "gissue",
  "status": "IN_PROGRESS",
  "current_phase": 1,
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
    "stale": true,
    "observed_at": null,
    "branch": null,
    "head": null,
    "working_tree": {},
    "remote_refs": {},
    "issue_state": null
  },

  "log": []
}
```

## Fields

`status`: `IN_PROGRESS`, `BLOCKED`, or `DONE`.

`static` (historical; reused across phases until invalidated):

- `issue`: number, title, URL, acceptance criteria references.
- `scope`, `dependencies`, `decisions`: approved scope, dependencies, and
  decisions, each with its source.
- `naming`: `type`, three-digit `number`, and `slug` derived from the Issue
  title; phase 3 builds the branch name and phase 4 the SDD directory from it.
- `context`: `{path, revision, applies, reason}` for every context item used.
- `base_policy`, `base`: `standard-main` or `approved-dependency` and its
  canonical record (`base_branch`, `base_ref`, `base_remote_ref`, `base_sha`,
  `base_remote_sha_initial`, `pr_target`, `pr_target_ref`,
  `pr_target_sha_initial`). `base_sha` is immutable once recorded.
- `branch`, `sdd`: Issue branch name; SDD directory, files, and
  `plan_validated` (set by phase 5, reset by any later SDD edit other than
  ticking task checkboxes).
- `protected_paths`: files that must never change or enter staging, as
  `{path, status_entry, hash}`, recorded in phase 3. Phase 3 requires a clean
  start, so it holds `opencode.json` unmodified, with its hash.
- `verification`: list of runs `{run, observed_at, results: [{check, command,
 source, status, summary}], manual_only}`, written by phase 7. The last run is
  the authoritative one; phases 9 and 13 require it to be all `PASS`.
- `implementation`: per task `{task, dependencies, files, changes, checks,
result}`, written by phase 6 and updated by phase 8 (repairs add their files
  to the task they belong to, or an entry `repair:<check>`), so phase 9 can map
  each change to its task.
- `commit`: `{hash, message, branch}`. Its presence tells `git-ops` that the
  commit already exists, so it never creates a second one.
- `manifest`: written by phase 9 as the approved set for the whole range
  `base_sha..HEAD`; each entry is `{path, status (A|M|D|R), old_path (R only),
content_hash (git hash-object of the approved content; none for D),
justification (task or acceptance criterion)}`. Phases 10–11 stage and
  verify against it: a file whose content changed after review is not staged. -`documentation`: the GitHub comment written in phase 12 (URL or id and
  the date), so phase 13 can verify it against the real result.
  `mutable` (current observations only; PR, publication, and merge state belong
  to `/finish-issue`):

- `stale`: `true` until observed, and again after any mutation.
- `branch`, `head`, `working_tree` (staged, unstaged, untracked, deleted),
  `remote_refs` (`ref → sha`), `issue_state`.

`log`: one entry per delegation, appended in order:

```json
{
  "phase": "3",
  "mode": "branch",
  "agent": "git-ops",
  "status": "PASS",
  "summary": "...",
  "at": "<ISO-8601>"
}
```
