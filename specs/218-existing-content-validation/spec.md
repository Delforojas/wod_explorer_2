# Issue #218 - Existing Content Validation

## Objective

Add an explicit, opt-in `existing-content-validation` profile to `/gissue` so it can conclude `NO_CHANGES` only when independently reviewed evidence proves that existing content already satisfies every applicable acceptance criterion.

## Scope

- Add deterministic Python controls for the profile, baseline snapshots, freshness, protected paths, evidence, and auditability.
- Keep the persistent `/gissue` state and its contracts consistent with the controller.
- Add an explicit phase route in which only justified operations may be `NOT_APPLICABLE`.
- Preserve the ordinary workflow: it still requires a branch, SDD, manifest, applicable checks, and a real commit.
- Add positive, negative, resumption, and ordinary-flow regression coverage.

## Out Of Scope

- Changing `docs/emom-reference.md` or changing/restarting `.opencode/state/gissue-213/state.json`.
- Pushing, merging, creating a PR, closing an Issue, or running `/finish-issue`.
- The remote no-change closing flow, which needs a separate Issue.

## Expected Behavior

The profile is disabled unless explicitly selected and authorized. It admits `NO_CHANGES` only after complete, current criterion-to-evidence coverage and a semantic review. Git controls verify the baseline, index, protected paths, hashes, references, and absence of attributable commits. A failed, inaccessible, or incomplete required check never becomes `NOT_APPLICABLE`.

The profile preserves decisions and evidence across interruptions, reconciles before retrying, produces an honest no-change handoff, and leaves manual validation pending. The regular workflow remains strict and unchanged in its requirement for a real change commit.

## Acceptance Criteria

1. The profile requires explicit authorization or selection and is disabled by default.
2. The ordinary profile still requires a branch, SDD, manifest, applicable verifications, and a real commit.
3. `NO_CHANGES` requires complete, current criterion coverage and independent semantic review, not merely an empty diff.
4. Git snapshot, hashes, index, protected paths, and no attributable commits are verified; a revert cannot qualify as `NO_CHANGES`.
5. Every `NOT_APPLICABLE` operation records authorization, reason, and evidence; it cannot waive a failed or incomplete required check.
6. No artificial file or empty commit is created; unmet requirements or unexpected mutations block and report.
7. Controller, persistent state, and contracts preserve identity, granular freshness, safe transitions, traceability, and reconciled resumption.
8. Review and handoff accurately report `NO_CHANGES`, non-applicable operations, no invented branch/commit/publication, an open Issue, and pending manual validation.
9. Positive, negative, resumption, and ordinary-flow regression tests demonstrate the behavior.
10. The required unittest command passes in an environment with its dependencies, with actual results documented.
11. A controlled #213 validation does not edit its EMOM document, force its state, publish, merge, or close anything.

## Constraints

- Work on this independent maintenance branch.
- Do not modify, delete, or reset `.opencode/state/gissue-213/state.json` or any other canonical Issue state.
- Do not weaken ordinary guardrails, create empty commits, or translate errors into `NOT_APPLICABLE`.
- `/gissue` and `/hyssue` are implementation targets only; neither workflow nor the harness MCP controller will be executed for this Issue.
