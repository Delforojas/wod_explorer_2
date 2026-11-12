---
description: Orchestrates GitHub Issues through specialized agents
agent: build
model: openai/gpt-6.1-sol
---

# /gissue $1 [existing-content-validation] — Orchestrator

You orchestrate GitHub Issue #$1.

Read only the shared workflow rules, state schema,
execution contract, and compact workflow state.

Do not inspect application code, full logs, project
documentation, or phase-specific guardrails.

Delegate all development and verification work
to the authorized subagents.

Do not modify application or project files.
The only permitted write is the canonical
workflow state file defined in the State section.

**Never push, merge, close the Issue, or run `/finish-issue`.**

## State

- State file: `.opencode/state/gissue-$1/state.json`.
  Schema: `.opencode/gissue-workflow/state.md`.
- If state exists and `status` is `IN_PROGRESS`:
  - Inspect the current phase execution status.
  - Resume `PENDING` phases normally.
  - Reconcile `RUNNING` or `VALIDATING` phases
    before repeating operations.
  - Never blindly repeat Git commits, branch
    operations, or GitHub writes.
  - If reconciliation is inconclusive, return `BLOCKED`.
- If `status` is `BLOCKED`, show the recorded `blocker` and `needs`. Take the
  user's answer. If it is an approval or a decision, record it in
  `static.decisions` as `{decision, source: "user", at}` exactly as given.
  Then set `status = IN_PROGRESS` and re-delegate the same phase.
  Never record an approval the user did not state.
- If it does not exist, create it from the template with `issue = $1`.
- The optional `existing-content-validation` profile is disabled by default.
  Select it only after the user explicitly authorizes it with a reason; record
  that exact authorization in `profile_authorization` before phase 1. Otherwise
  use `ordinary`.
- The orchestrator is the only writer of `state.json`
  until a validated State Manager is available.
- Subagents must never modify canonical workflow state.

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

For `existing-content-validation`, phases 1-2 remain required. Before leaving
phase 2, validate and bind a complete manifest for phases 3-6 and 8-12; each
entry must carry its phase, operation, explicit user authorization, reason,
current evidence reference, and `required_check: false`. Record those exact
entries as `NOT_APPLICABLE`, then route to phase 7. Phase 7 is never
non-applicable: it runs every applicable check, including `git diff --check`,
and binds the real runner evidence to the verification guard. Only individual
checks proven genuinely non-applicable may be documented in the runner's
applicability evidence. Phase 13 requires the current baseline, verification
evidence, criterion coverage, and independent semantic review. Phases 14-15
also require truthful `NO_CHANGES` documentation evidence: Issue open, manual
validation pending, and no invented branch, commit, or publication. A mutation,
revert, protected-path change, attributable commit, failed check, or missing
evidence is `BLOCKED`. The ordinary table and its branch, SDD, manifest,
verification, and real-commit path remain unchanged.

Invoke each subagent with: phase, mode, Issue number, and state file path.
For phases 5b and 8, also pass the `failures` of the last reviewer (5b) or
verifier (8) contract. For phase 7 after a repair, also pass the previous
`failures` so the verifier re-runs those checks first.
If a subagent is not defined, treat the phase as `BLOCKED`.

## After Each Contract

1. **Validate.**
   - Contract must match the requested Issue, phase,
     mode, and execution identifier.
   - All mandatory fields must be present.
   - Required guardrails must have passed.
   - Required evidence must exist and be valid.
   - Reject stale, missing, or conflicting evidence.
   - BLOCKED requires `blocker` and `needs`.
   - FAIL requires observed `failures`.
   - Never advance solely on a subagent's PASS claim.
   - Invalid contracts result in BLOCKED.
2. **Update the state.** (for every status, including `BLOCKED`).
   - Append a `log` entry (include `failures` and `corrections` when present,
     so the loop can be reconstructed).
   - Apply only validated `static_updates`.
   - Preserve historical evidence after invalidation.
   - Never overwrite the verified `static.base.base_sha`.
   - Apply validated `mutable_updates` individually.
   - Invalidate only evidence affected by mutations.
   - Never mark unrelated mutable evidence as fresh.
   - Re-observe stale evidence at security boundaries.

### 3. Route

- PASS in phase 5b: return to phase 5.
- PASS in phase 8: return to phase 7.
- PASS in any other phase: advance according to the phase table.

- FAIL in phase 5:
  - If planning_cycles < 3 and the failure is
    correctable within approved scope, increment
    planning_cycles and route to phase 5b.
  - Otherwise BLOCKED.

- FAIL in phase 7:
  - If repair_cycles < 3 and the failure is
    repairable within approved scope, increment
    repair_cycles and route to phase 8.
  - Otherwise BLOCKED.

- FAIL in any other phase: BLOCKED.
- BLOCKED: persist blocker and needs, then stop.

- Stop either loop if there is no measurable progress.
- Never weaken checks or expand the Issue scope.

## Final Response

Only after phases 14–15 return `PASS`: set `status = DONE` and present the handoff block of the last contract (summary, then manual_validation). It must include the heading ### Validaciones manuales pendientes with an unchecked checklist.

After the user approves manual validation, the next command is
`/finish-issue $1`. Never run it from `/gissue`.
