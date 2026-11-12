---
description: Orchestrates GitHub Issue #$1 through SDD, implementation, verification, and a local commit using subagents; prepares manual validation
argument-hint: <issue-number>
model: sonnet
---

# /cissue $1 — Orchestrator

You direct the workflow for GitHub Issue #$1. You do not read code, logs,
guardrails, or project documentation, and you do not run Git or checks.
You delegate each phase to a subagent, validate its contract, update the state
file, and decide the next step.

**Never push, merge, close the Issue, or run `/finish-issue`.**

## State

- State file: `.claude/state/cissue-$1/state.json`.
  Schema: `.claude/cissue-workflow/state.md`.
- If it exists and `status` is `IN_PROGRESS`, resume at `current_phase`.
- If `status` is `BLOCKED`, show the recorded `blocker` and `needs`. Take the
  user's answer. If it is an approval or a decision, record it in
  `static.decisions` as `{decision, source: "user", at}` exactly as given.
  Then set `status = IN_PROGRESS` and re-delegate the same phase.
  Never record an approval the user did not state.
- If it does not exist, create it from the template with `cissue = $1`.
- You are its only writer. Do not write any other file.

## Phases

| Phase | Subagent      | Mode      | On PASS |
| ----- | ------------- | --------- | ------- |
| 1–2   | issue-analyst | `analyze` | 3       |
| 3     | git-ops       | `branch`  | 4       |
| 4     | sdd-writer    | `sdd`     | 5       |
| 5     | reviewer      | `plan`    | 6       |
| 5b    | sdd-writer    | `fix`     | 5       |
| 6     | implementer   | `build`   | 7       |
| 7     | verifier      | `verify`  | 9       |
| 8     | implementer   | `repair`  | 7       |
| 9     | reviewer      | `changes` | 10      |
| 10–11 | git-ops       | `commit`  | 12      |
| 12    | handoff       | `github`  | 13      |
| 13    | reviewer      | `final`   | 14      |
| 14–15 | handoff       | `manual`  | done    |

Invoke each subagent with: phase, mode, Issue number, and state file path.
For phases 5b and 8, also pass the `failures` of the last reviewer (5b) or
If a subagent is not defined, treat the phase as `BLOCKED`.

## After Each Contract

1. **Validate.** Required keys present, `phase` and `mode` match the request,
   `blocker` and `needs` present when `BLOCKED`, `failures` present when `FAIL`.
   An invalid or missing contract is `BLOCKED`.
2. **Update the state.** (for every status, including `BLOCKED`).
   - Append a `log` entry (include `failures` and `corrections` when present,
     so the loop can be reconstructed).
   - Merge `static_updates` into `static`; remove the keys in `invalidates`.
     Never overwrite `static.base.base_sha` once it is set.
   - If `mutable_updates` is present, merge it and set `mutable.stale = false`.
   - Otherwise, if `mutated` is `true`, set `mutable.stale = true`.
3. **Route.**
   - `PASS`: set `current_phase` to the next phase.
   - `FAIL` in phase 7: if `repair_cycles < 3` and its failed checks differ
     from the previous verifier contract in this run, increment it and go to
     phase 8; otherwise treat as `BLOCKED` (no progress).
   - `FAIL` in phase 5: if `planning_cycles < 3` and its failed checks differ
     from the previous reviewer contract in this run, increment it and go to
     phase 5b; otherwise treat as `BLOCKED` (no progress).

   - `FAIL` in any other phase: treat as `BLOCKED`.
   - `BLOCKED`: set `status = BLOCKED`, stop, and show `blocker` and `needs`.
     Do not continue.

## Final Response

Only after phases 14–15 return `PASS`: set `status = DONE` and present the
handoff from the last contract. It must include the heading
`### Validaciones manuales pendientes` with an unchecked checklist.

After the user approves manual validation, the next command is
`/finish-issue $1`. Never run it from `/cissue`.
