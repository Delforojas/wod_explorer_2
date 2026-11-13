---
description: Implements a prepared GitHub Issue through SDD, implementation, verification, and change review (phases 4–9 only)
agent: build
model: openai/gpt-5.6
---

# Dev Issue Workflow

Implement Issue **#$1** in the current repository.

This command executes ONLY phases 4 through 9 of the Issue Development Workflow.

It assumes phases 1–3 have already been completed outside this command.

**Do not retrieve the Issue through GitHub MCP, prepare branches, stage files, create commits, push, merge, update GitHub Issues, or execute `/finish-issue`.**

## 0. Execution Rules

- Follow root `AGENTS.md` and applicable specialized agents.
- Follow `DOMAIN.md`, `PROJECT.md`, and approved specifications.
- Execute phases 4–9 sequentially.
- Never skip mandatory guardrails.
- Load hooks, guards, and loops only when needed.
- Reuse valid evidence without unnecessary reads.
- Never invent requirements, decisions, commands, files, or verification results.
- Never modify unrelated work.
- Never weaken security or verification controls to reduce tokens.

### Required Input — Prepared Issue

Before phase 4, confirm that the preparation performed outside this command provides:

- Issue number and verified source.
- Issue title, requirements and acceptance criteria.
- Approved scope, constraints and dependencies.
- Relevant context and architectural decisions from phase 2.
- Active Issue branch verified in phase 3.
- Applicable AGENTS.md and specification references.

Use the prepared local Issue context, not a fresh GitHub MCP request.

If essential information is missing, stale, contradictory, or unverifiable, stop.

Do not independently reconstruct missing phase 1–3 evidence or declare their guards PASS.

### Blocking Policy

If any required guard fails:

1. Stop the workflow.
2. Preserve existing changes and evidence.
3. Report the exact blocking condition.
4. Identify the minimum intervention required.

A BLOCK is never a PASS.

---

## 4. Create or Complete the SDD

Create or reuse:

`specs/<three-digit-issue-number>-<slug>/`

Required files:

- `spec.md`: objective, scope, expected behavior, acceptance criteria, and constraints.
- `plan.md`: technical approach, affected components, implementation strategy, and verification.
- `tasks.md`: actionable tasks, dependencies, and required checks.

If an SDD already exists:

- Reuse its directory.
- Preserve valid existing content.
- Never create duplicate SDD directories.
- Rename an invalid slug only when safe and authorized.
- Never overwrite unrelated work.

The SDD must derive from the prepared Issue requirements, context, existing architecture, and project rules.

Load and apply:

`.opencode/commands/guardarails/sdd.md`

Continue only when the SDD Guard returns PASS.

## 5. Validate the Plan

Verify traceability:

`Issue → spec.md → plan.md → tasks.md → verification`

Ensure:

- Every acceptance criterion is covered.
- Tasks are actionable.
- Dependencies are identified.
- Verification procedures are applicable.
- No unresolved architectural or functional decisions remain.

Load and apply:

`.opencode/commands/guardarails/planning.md`

If the guard returns PASS, continue.

If correctable planning problems exist, load:

`.opencode/commands/loops/planning.md`

Correct the plan and revalidate.

If a decision requires authorization, stop.

## 6. Implement Tasks

Implement `tasks.md` according to:

- Approved scope.
- Task order and dependencies.
- Existing architecture.
- Applicable project rules.

Load and apply:

`.opencode/commands/guardarails/implementation.md`

`.opencode/commands/loops/task.md`

Use technical skills only when relevant.

Do not introduce unrelated improvements, new dependencies, or unnecessary refactoring.

Mark tasks completed only when supported by actual implementation and verification.

### Final SDD Synchronization

Before leaving phase 6:

1. Read `tasks.md`.
2. Compare tasks with actual implementation.
3. Mark completed tasks accurately.
4. Keep unfinished tasks pending.
5. Stop if mandatory work remains incomplete.

Do not postpone SDD synchronization until review or commit.

Continue only when implementation is complete and no blockers remain.

## 7. Run Verification Checks

Select applicable checks based on:

- Prepared Issue acceptance criteria.
- `spec.md`, `plan.md`, and `tasks.md`.
- Applicable `AGENTS.md`.
- Actual project configuration.
- Affected components and files.

Run only valid, applicable project commands.

Checks may include:

- Tests.
- Build.
- Lint.
- Type checking.
- Integration verification.
- Configuration validation.

Load and apply:

`.opencode/commands/hooks/verification-gate.md`

`.opencode/commands/guardarails/verification.md`

Record:

- Executed commands.
- Exit codes.
- PASS, FAIL, or INCOMPLETE.
- Relevant errors and warnings.
- Evidence sources.

Preserve complete logs locally where available.

Do not report a timeout or incomplete execution as PASS.

If all required checks pass, proceed to phase 9.

If any check fails, proceed to phase 8.

## 8. Resolve Failures

Execute this phase only when verification fails.

For each failure:

1. Identify the failed check.
2. Inspect relevant errors.
3. Determine the likely root cause.
4. Verify whether the failure belongs to the Issue scope.

Load and apply:

`.opencode/commands/guardarails/repair.md`

If repair is allowed, load:

`.opencode/commands/loops/repair.md`

Correct only the necessary implementation.

Reexecute affected checks and any mandatory invalidated checks.

Never weaken tests or expand the Issue scope merely to obtain PASS.

Continue only when all applicable checks pass.

## 9. Review Changes

Before reviewing, verify that the final SDD synchronization from phase 6 is complete.

Review:

- Modified files.
- New files.
- Deleted files.
- Relevant diffs.
- Issue scope.
- Completed tasks.
- Verification evidence.
- Pre-existing unrelated changes.

Load and follow:

`.opencode/commands/hooks/pre-stage-check.md`

Load and apply:

`.opencode/commands/guardarails/change-review.md`

Every intended change must be justified by the Issue and its SDD.

Do not stage or commit files.

Continue only when the Change Review Guard returns PASS.

---

## Development Handoff

When phase 9 passes, provide:

- Issue number.
- Active branch.
- SDD directory.
- Completed tasks.
- Implemented changes.
- Verification results.
- Reviewed file list.
- Remaining limitations or blockers.

The expected final state is:

`READY_FOR_STAGING`

This is a handoff label, not a replacement for an official harness state.

Do not claim that phases 10–15 have passed.

**Stop here. Do not execute phase 10 or any later phase.**
