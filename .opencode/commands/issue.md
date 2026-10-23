---
description: Implements a GitHub Issue using SDD, verification checks, and a local commit; prepares the work for manual validation
---

# Issue Development Workflow

Implement GitHub Issue **#$1** in the current repository.

This command executes the complete development workflow:
analysis, branch preparation, SDD, implementation, verification,
local commit, and handoff for manual validation.

**Do not push, merge branches, close the Issue, or execute `/finish-issue`.**

## 0. Execution Rules

- Follow the root `AGENTS.md` and applicable specialized agents.
- The GitHub Issue defines requirements. `DOMAIN.md`, `PROJECT.md`,
  and approved specifications govern their respective areas.
- Execute phases sequentially. Never skip mandatory guardrails.
- Load each `guardarails/`, `hooks/`, or `loops/` file only when
  its corresponding phase requires it.
- Treat Markdown hooks as procedures to follow and verify,
  not automatically executable programs.
- Reuse available evidence. Avoid unnecessary repeated reads or checks.
- Never invent requirements, results, commands, decisions, or files.
- Never automatically discard, overwrite, stash, or include unrelated work.
- Never automatically rebase, force-push, or rewrite Git history.
- Never weaken verification or security controls to reduce token usage.

### Canonical Evidence Record

Maintain one compact `issue_evidence` record for the whole workflow. Record a
field only after its source has been observed; leave missing values absent and
never infer them. Separate the record into:

- `static`: Issue identity and approved scope, dependencies and decisions,
  applicable instruction/specification paths and revisions, SDD references,
  historical verification results, and the accepted commit/range manifest;

- `mutable`: observation time, active branch, `HEAD`, working-tree and staging
  state, remote references and SHAs, published branch, Issue state, PR state,
  checks, and merge state.

Each observation must retain its source, phase, and status. Reuse an unchanged
static entry across later phases. Invalidate only the affected static entries
when scope, specifications, decisions, or applicable instructions change.
Invalidate the affected mutable entries after any Git, remote, GitHub, PR, or
working-tree mutation and re-observe them at the next security boundary.

### Blocking Policy

If a mandatory guardrail fails, essential information is missing,
or an operation requires authorization:

1. Stop before proceeding to the next operation.
2. Preserve existing changes and collected evidence.
3. Identify the blocking condition and supporting evidence.
4. Request only the intervention necessary to continue.

A blocked phase is not a successful phase.
Never declare a phase complete unless its required checks pass.

## 1. Retrieve the Issue

Retrieve GitHub Issue #$1 using the configured `github` MCP
for the current repository.

Identify the title, description, acceptance criteria, scope,
constraints, dependencies, and relevant references.

Load and apply:

`.opencode/commands/guardarails/issue.md`

Continue only when the Issue Guard returns `PASS`.

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

## 3. Prepare the Working Branch

This phase is mandatory before modifying any project file.

1. Load and follow:
   `.opencode/commands/hooks/branch-check.md`
2. Consume the complete read-only result from `branch-check.md`, including its
   observation time and mutable Git evidence. Do not repeat the same Git
   inspection immediately. Stop if the result is incomplete or stale.
   The base-selection fetch below invalidates only the remote-reference fields
   of `branch_evidence`; retain unaffected branch, working-tree, and staging
   observations only while they remain unchanged.
3. Select exactly one base policy before recording the canonical base:
   - For an independent Issue, select `base_policy=standard-main`. Refresh
     only the remote-tracking reference with `git fetch origin main`. This must
     not modify the working tree, staging, or commit history. Run `git ls-remote
     origin refs/heads/main` and verify that `git rev-parse origin/main` equals
     the observed remote SHA. If either reference cannot be verified, stop.
   - For an approved dependency, require that the Issue identifies a real
     dependency and that the user explicitly approves it. Record the dependency
     Issue, branch, exact remote base reference, intended PR destination and
     exact destination remote reference. Refresh the approved base tracking
     reference with `git fetch origin <base_branch>`, then run
     `git ls-remote origin <base_remote_ref>` and verify
     `git rev-parse <base_ref>` equals the observed base SHA. If the PR target
     differs from the dependency base, also run
     `git ls-remote origin <pr_target_ref>` and record its observed SHA. If the
     target equals the base, record the same observed SHA as
     `pr_target_sha_initial`. Missing or conflicting
     approval, ancestry, included-commit, or destination evidence is a blocker.
   - Never infer an exception from the current branch or from an unverified
     local branch.
4. Record one canonical, non-hybrid policy record:
   - `standard-main`: `base_branch=main`, `base_ref=origin/main`,
     `base_remote_ref=refs/heads/main`, `base_sha=<verified remote SHA>`,
     `pr_target=main`, and `pr_target_ref=refs/heads/main`.
   - `approved-dependency`: `base_branch` and `base_ref` are the approved
     dependency branch and its exact remote-tracking reference,
     `base_remote_ref` is its exact remote reference, `base_sha` is its
     verified remote SHA, and `pr_target` and `pr_target_ref` are the approved
     PR destination and exact remote reference.
   - Record `base_remote_sha_initial` and `pr_target_sha_initial` separately
     from `base_sha`. `base_sha` is the immutable historical SHA from which the
     Issue branch is created; later remote observations must never overwrite it.
   - Classify all staged, unstaged, untracked, and deleted work before any
     branch operation. Existing local work, including `opencode.json`, remains
     unrelated unless the Issue explicitly owns it.
5. Reuse an existing Issue branch only when it is dedicated to this Issue and
    `git merge-base --is-ancestor <base-sha> <issue-branch>` and its complete
    range can be validated against the approved base. Otherwise, create the
    branch from the exact approved `base_sha`, never from the active branch or
    its working tree. Do not rebase or change an existing branch base.
6. Actually switch to the Issue branch. Stop if doing so would overwrite,
   move, stash, or otherwise alter any pre-existing local work.
7. Load and apply:
   `.opencode/commands/guardarails/branch.md`

Branch naming:

`<type>/<three-digit-issue-number>-<slug>`

Allowed types: `feat`, `fix`, `docs`, `refactor`,
`test`, `chore`.

The slug must be short, descriptive, and derived
from the actual GitHub Issue title.

Never create duplicate Issue branches.

Do not automatically rebase, change an existing
branch's base, discard work, or rewrite Git history.

Continue only when the Branch Guard returns `PASS`.

## 4. Create or Complete the SDD

Create or reuse:

`specs/<three-digit-issue-number>-<slug>/`

Required files:

- `spec.md`: objective, scope, expected behavior,
  acceptance criteria, and constraints.
- `plan.md`: technical approach, affected components,
  implementation strategy, and verification.
- `tasks.md`: actionable tasks, dependencies,
  and required checks.

If an SDD directory already exists for Issue #$1:

- Reuse the existing directory.
- If its slug is empty or invalid, rename it to the correct
  Issue-derived name before continuing.
- Never create a second SDD directory for the same Issue.
- Preserve valid existing content and approved decisions.
- Do not overwrite unrelated files or existing valid work.

If the rename cannot be performed safely, stop and
report the blocking condition.

The SDD Guard must pass before planning begins.
The SDD must derive from the GitHub Issue, relevant
project analysis, existing architecture, and applicable
project rules.

Never invent functional requirements or overwrite
previously approved decisions.

Reuse any existing SDD for the Issue and preserve valid decisions.

Do not create duplicate directories or overwrite approved
requirements without justification.

Load and apply:

`.opencode/commands/guardarails/sdd.md`

Continue only when the SDD Guard returns `PASS`.

## 5. Validate the Plan

Verify traceability:

`GitHub Issue → spec.md → plan.md → tasks.md → verification`

Ensure every acceptance criterion is covered by actionable tasks
and appropriate verification procedures.

Load and apply:

`.opencode/commands/guardarails/planning.md`

If the guard returns `PASS`, continue.

If planning problems can be corrected without changing
requirements or scope, load and execute:

`.opencode/commands/loops/planning.md`

Revalidate the plan after corrections.

If an unresolved functional, architectural, or scope
decision requires authorization, stop the workflow.

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

Continue when all tasks are completed and no blockers remain.

## 7. Run Verification Checks

Determine applicable verification checks from:

- GitHub Issue acceptance criteria.
- `spec.md`, `plan.md`, and `tasks.md`.
- Applicable `AGENTS.md` instructions.
- Existing project scripts, tools, and conventions.
- Affected components, layers, and files.

Inspect actual project configuration before selecting
verification commands.

Run only applicable checks, including tests, build,
lint, type checking, integration, or configuration
validation when required.

Do not invent commands or omit mandatory checks.

Run tests, build, lint, type checking, integration checks,
and other validations when applicable.

Load and apply:

1. `.opencode/commands/hooks/verification-gate.md`
2. `.opencode/commands/guardarails/verification.md`

Record the actual commands, results, and observed failures.

If all applicable checks pass, proceed to Phase 9.

If any check fails, proceed to Phase 8.

## 8. Resolve Failures

For each verification failure:

1. Identify the failed check and its observed result.
2. Inspect relevant errors and warnings.
3. Determine the likely root cause and whether it relates
   to Issue #$1.
4. Load and apply:
   `.opencode/commands/guardarails/repair.md`
5. If repair is permitted, load and execute:
   `.opencode/commands/loops/repair.md`

Provide the Repair Loop with:

- Failed checks and executed commands.
- Actual verification results.
- Relevant errors and warnings.
- Identified root cause, when known.
- Necessary Issue and implementation context.

Follow the repair loop's verification and iteration rules.

Never weaken tests or expand Issue scope to force success.

Continue only after all applicable verification checks pass.

## 9. Review Changes

Load and follow:

`.opencode/commands/hooks/pre-stage-check.md`

Identify staged, unstaged, new, and deleted files,
including changes that existed before the workflow.

Verify that every change intended for the commit belongs
to the Issue and is justified by its SDD.

Load and apply:

`.opencode/commands/guardarails/change-review.md`

Continue only when the Change Review Guard returns `PASS`.

## 10. Create the Local Commit

This phase is mandatory.

1. Stage only changes belonging to the Issue.
2. Load and follow `.opencode/commands/hooks/pre-commit.md`.
3. Create a real, non-empty commit using project conventions.
4. Record its hash and message.
5. Load and apply `.opencode/commands/guardarails/commit.md`.

Never use indiscriminate `git add .` or include unrelated changes.

Continue only when the commit exists and the
Commit Guard returns `PASS`.

## 11. Verify Post-Commit State

Load and apply:

1. `.opencode/commands/hooks/post-commit.md`
2. `.opencode/commands/guardarails/post-commit.md`

Verify that the commit belongs to the Issue,
the correct branch remains active, and no Issue-related
changes remain uncommitted.

Preserve all unrelated local changes.

Continue only when the Post-Commit Guard returns `PASS`.

## 12. Document the Issue on GitHub

Update GitHub Issue #$1 using the configured `github` MCP.

Document only verified evidence:

- Implemented work and relevant technical decisions.
- Affected components and files.
- Executed verification checks and their results.
- Local commit hash, message, and branch.
- Readiness for manual validation.

Persist only the compact static handoff evidence needed by `/finish-issue`:
Issue identity and approved scope, approved decisions and dependencies, SDD
references, historical verification results, accepted commit/range, and the
complete Issue file/status manifest. Do not present mutable Git, remote, PR, or
Issue state as current handoff evidence; those values must be freshly observed
by `/finish-issue`.

Explicitly state that the Issue remains open and
the branch has not been pushed by this command.

Load and apply:

`.opencode/commands/guardarails/github-documentation.md`

Continue only when the GitHub Documentation Guard returns `PASS`.

## 13. Final Workflow Verification

Load and apply:

1. `.opencode/commands/hooks/final-workflow-check.md`
2. `.opencode/commands/guardarails/final-workflow.md`

Verify SDD completeness, acceptance-criteria coverage,
completed tasks, successful required checks, local commit,
GitHub documentation, and absence of uncommitted Issue changes.

The Issue must remain open.
No push must have occurred during this workflow.

Continue only when the Final Workflow Guard returns `PASS`.

## 14. Prepare Manual Validation

Derive manual checks from the Issue acceptance criteria,
implemented behavior, affected components, and relevant risks.

Adapt validations to the actual scope:

- Frontend: visual behavior, interaction, navigation,
  responsive layouts, and accessibility when applicable.
- Backend/API: affected endpoints, expected responses,
  relevant status codes, and error scenarios.
- Authentication: authentication states, permissions,
  ownership, and role distinctions when applicable.
- Persistence: relevant data operations and integrity.
- Docker/Infrastructure: startup, healthchecks,
  connectivity, persistence, and configuration.
- Documentation/Design: relevant documentation,
  technical decisions, and design review.
- Integrations: external service interactions, API
  connections, error handling, and integration behavior.
- Configuration: relevant environment variables,
  application settings, configuration loading,
  and expected behavior.

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

## Validaciones manuales pendientes

Provide a concise, task-specific Markdown checklist.
Do not mark any checkbox as completed automatically.

Do not record manual validation as approved.

Continue only when the Manual Validation Guard returns `PASS`.

## 15. Development Handoff

Load and apply:

`.opencode/commands/guardarails/workflow-handoff.md`

The development handoff is ready only when all previous
mandatory checks and the Workflow Handoff Guard return `PASS`.

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

**Expected final state:**

- Implementation and verification completed.
- Local commit created.
- Issue documented and left open.
- No push.
- No merge.
- No Issue closure.
- Manual validation pending.

After the user approves manual validation,
the next command is:

`/finish-issue $1`

Never execute it automatically from `/issue`.
