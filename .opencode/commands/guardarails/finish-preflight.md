# Finish Preflight Guard

## Purpose

Provide a read-only barrier after local commit resolution and before
`/finish-issue $1` performs any new remote mutation. This procedure recovers
the `/issue $1` handoff from GitHub documentation, Git, and the SDD, validates
explicit manual approval, checks the complete local Issue range, and protects
unrelated work.

Markdown procedures are not automatically executable. The workflow must
explicitly load this file, provide the required evidence, evaluate the result,
and stop on `BLOCK`.

## Outcomes

- `PASS`: the normal open-Issue path is safe to continue to
  `.opencode/commands/hooks/pre-push-check.md`.
- `VERIFIED_NO_MUTATION`: a previously closed Issue has been verified through
  read-only checks. This is terminal and authorizes no publication, PR action,
  documentation update, or closure.
- `BLOCK`: required evidence is missing, conflicting, unsafe, or unverifiable.

`VERIFIED_NO_MUTATION` is not a successful normal finish and must never be
treated as permission to continue the mutation path.

## Required Inputs and Evidence

The workflow must provide:

- The current repository identity and GitHub Issue number `#$1`.
- The current GitHub Issue record, including state and identity.
- Explicit user-provided evidence approving manual validation. The explicit
  `/finish-issue $1` command is not approval evidence by itself.
- The current branch, local `HEAD`, and the result of
  `.opencode/commands/hooks/branch-check.md`.
- One non-hybrid base policy (`standard-main` or `approved-dependency`), its
  determining evidence, `base_branch`, `base_ref`, and exact `base_remote_ref`.
- The immutable historical `base_sha` used to create the Issue branch,
  `base_remote_sha_initial`, and `base_remote_sha_latest`.
- The `pr_target`, exact `pr_target_ref`, `pr_target_sha_initial`, and
  `pr_target_sha_latest`. `standard-main` must use `main`,
  `origin/main`, and `refs/heads/main`; a dependency must use only its
  explicitly approved values.
- The accepted Issue commit hash, message, source, and branch.
- The current working-tree and staging state.
- The classification of unrelated committed and uncommitted changes.
- The complete commit range and patch review relative to the validated base.
- The protected local paths, including `opencode.json` when pre-existing, and
  evidence that they remain untouched and outside staging.

## Handoff Evidence Recovery

No persisted handoff snapshot is required. Reconstruct one read-only evidence
record from these sources:

1. GitHub Issue documentation and relevant Issue comments must identify the
   Issue branch, SDD path, completed tasks, verification results, commit hash,
   commit message, changed files, and pending manual-validation checklist.
2. Git must confirm the active branch, `HEAD`, commit hash and message, commit
   ancestry, complete range from the validated base, current working tree,
   staging state, and any published branch reference.
3. The SDD must confirm `spec.md`, `plan.md`, and `tasks.md`, completed tasks,
   acceptance-criteria coverage, and the verification results referenced by
   the Issue documentation.
4. The current user message or another explicit user statement must confirm
   that manual validation was approved. Issue state, an agent summary, a
   checklist, or the `/finish-issue` invocation cannot substitute for it.

The evidence is valid only when the repository, Issue, branch, SDD, accepted
commit, and verification results agree. Missing, stale, contradictory, or
ambiguous evidence returns `BLOCK`.

## Commit Provenance Modes

The accepted commit has one of these sources:

- `handoff-commit`: a valid commit created by `/issue $1` and recorded in the
  Issue handoff documentation.
- `finish-commit`: a new commit created by `/finish-issue $1` after the
  existing commit path found Issue changes that were still uncommitted.

A valid `handoff-commit` must not be rejected merely because `/finish-issue`
did not create it. The finish workflow must not create a duplicate commit when
the handoff commit already contains all Issue changes.

For `handoff-commit`, use the content and safety predicates from the Commit
Guard and Post-Commit Guard, but do not apply their development-only
requirement that the commit was created during the current workflow. The
handoff hash, branch, content, and post-commit state must be freshly verified
from Git and corroborated by the Issue documentation and SDD.

For `finish-commit`, the workflow must use the existing pre-stage, pre-commit,
Commit Guard, and Post-Commit Guard procedures before this preflight. This
procedure only consumes their results and does not perform those operations.

When a valid handoff commit exists and additional Issue changes remain, the
accepted Issue range may contain the handoff commit followed by one or more
validated finish commits. The final commit hash and the complete range are
recorded together. Every commit in that range must be Issue-related; no
duplicate handoff commit may be created.

The development-only Final Workflow Guard, GitHub Documentation Guard, and
Workflow Handoff Guard remain authoritative for `/issue`. During `/finish-issue`
they are used as evidence schemas for the recovered handoff, not as literal
current-workflow provenance gates after manual approval.

## Required Read-Only Checks

Use the relevant safety predicates from:

- `.opencode/commands/hooks/branch-check.md`
- `.opencode/commands/guardarails/branch.md`
- `.opencode/commands/guardarails/change-review.md`
- `.opencode/commands/guardarails/commit.md`
- `.opencode/commands/guardarails/post-commit.md`
- `.opencode/commands/guardarails/final-workflow.md`
- `.opencode/commands/guardarails/github-documentation.md`
- `.opencode/commands/guardarails/workflow-handoff.md`

Do not reinterpret a development guard as permission to mutate anything. Do
not require the recovered handoff to remain in its pre-approval state after
the user has approved manual validation.

Permitted local read-only checks include:

- `git branch --show-current`
- `git status`
- `git diff`
- `git diff --cached`
- `git diff --name-status <base>...HEAD`
- `git diff <base>...HEAD`
- `git log <base>..HEAD`
- `git show <commit>`
- `git rev-parse`
- `git merge-base`
- `git reflog`
- `git branch -vv`
- `git ls-remote --heads <remote> <branch>`

The complete range review must verify every commit and patch after the
validated base. Every commit and changed file must be justified by the Issue,
SDD, plan, or tasks. A commit that cannot be classified safely is a blocker.

Unrelated committed work must not occur in the Issue range. Unrelated staged,
unstaged, untracked, or deleted work may remain only when it is identified,
can be kept outside the Issue commit, and is not modified, staged, committed,
stashed, discarded, or overwritten by the workflow.

Permitted remote read-only checks include GitHub MCP reads for the Issue,
Issue documentation, SDD references, the validated base and destination
branch references, an already-published Issue branch or commit, and, only for
closed-state audit, the existing PR and destination branch evidence.

This procedure must not execute `git add`, `git commit`, `git push`,
`git switch`, `git pull`, merge, PR creation, PR modification, Issue update,
Issue closure, stash, rebase, force operation, discard, or history rewrite.

## Base Reference Stability

The exact historical `base_sha` captured by preflight is the only range
baseline accepted for the current evidence. Before PR creation and PR
validation, compare both `base_remote_ref` and `pr_target_ref` with their
current authoritative remote observations.

For `standard-main`, require `base_branch=main`, `base_ref=origin/main`,
`base_remote_ref=refs/heads/main`, `pr_target=main`, and
`pr_target_ref=refs/heads/main`. For `approved-dependency`, require explicit
approval and use the exact recorded dependency values without substitution.

Before PR creation and validation, run `git ls-remote origin <base_remote_ref>`
and `git ls-remote origin <pr_target_ref>`. Record the observed SHAs as
`base_remote_sha_latest` and `pr_target_sha_latest` on every validation and
keep them separate from immutable `base_sha`. If either reference disappears,
cannot be verified,
or changes without a complete safe re-evaluation, return `BLOCK` for the
current evidence. Re-evaluate the complete local range, patch, ancestry, and
conflict state against a changed base observation, and the complete PR scope
against a changed destination observation. Continue only when the evidence
demonstrates safe integration. Never silently substitute a moving branch and
never rebase automatically.

## PASS Conditions: Normal Open-Issue Path

Return `PASS` only when every condition below is supported by evidence:

- The Issue identity matches repository and Issue number `#$1`.
- The Issue is open.
- The handoff evidence has been recovered and is traceable across GitHub,
  Git, and the SDD.
- The SDD is valid, tasks are complete, and required automated checks passed.
- The accepted commit is a validated `handoff-commit` or `finish-commit`.
- The accepted commit is non-empty, on the active Issue branch, and its hash
  and message are known.
- The active branch is the Issue branch and is not `main`.
- The base policy is explicit and, for the standard path, the base and
  destination are both `main`.
- The validated base branch is unambiguous.
- The exact validated base remote SHA used for the range comparison is known.
- The `pr_target` is explicitly recorded and the destination branch equals it;
  for `standard-main`, it is also the validated `main` base. For a dependency,
  any relationship between `base_branch` and `pr_target` matches the approved
  exception record.
- The exact destination remote reference and SHA are known.
- The complete local commit range and patch are Issue-related and justified.
- No Issue-related changes remain outside the accepted commit range.
- Staged, unstaged, untracked, and deleted changes are classified safely.
- Unrelated local changes remain outside Issue commits and are preserved.
- The complete range was validated before handoff and contains no unrelated
  commit or file.
- `opencode.json` and other pre-existing protected paths are unchanged and
  outside staging.
- Any already-published branch matches the validated local `HEAD` exactly and
  has no unexplained divergence.
- Explicit user-provided manual approval is present and attributable to the
  user.
- No required evidence is missing, stale, contradictory, or ambiguous.

`PASS` authorizes the workflow to continue to the existing pre-push
procedure. It does not authorize a push by this guard.

## VERIFIED_NO_MUTATION Conditions: Already-Closed Audit

Return `VERIFIED_NO_MUTATION` only when the Issue was already closed before
this invocation and all of the following are verified read-only:

- The closed Issue identity matches repository and Issue number `#$1`.
- The accepted Issue commit and complete Issue range are identified and safe.
- The validated destination branch and its corresponding remote reference are
  identified explicitly.
- The currently active local branch is exactly the validated destination
  branch. Do not switch branches during this audit.
- The local destination branch contains the merged Issue changes, including
  the verified merge result or equivalent complete Issue diff.
- The local destination branch `HEAD` SHA exactly matches the verified remote
  destination SHA.
- The remote destination SHA was obtained from a fresh authoritative remote
  reference read, such as GitHub MCP or `git ls-remote`, and was not inferred
  solely from a potentially stale local remote-tracking reference.
- The published Issue branch matches the validated local state, or its
  absence is explicitly shown to be consistent with the recorded final state.
- An existing PR, when required by the recorded final state, is merged into
  the expected destination branch.
- The destination remote contains the intended Issue changes.
- Finalization documentation contains only verified evidence.
- Manual approval evidence is explicit and attributable to the user.
- No Issue-related changes remain uncommitted or unexplained.
- Unrelated work remains identified and untouched.

This outcome must stop the workflow. It must not reopen, update, publish,
merge, or close the Issue.

## BLOCK Conditions

Return `BLOCK` and stop before any remote mutation if any condition below
applies:

- The Issue cannot be identified or belongs to another repository.
- The normal path is attempted for an already-closed Issue.
- The base or destination reference changed after preflight without a complete
  scope re-evaluation against the new exact base SHA.
- The handoff cannot be reconstructed from GitHub documentation, Git, and the
  SDD.
- Manual approval is absent, ambiguous, inferred, or not attributable to the
  user.
- The active branch is `main`, does not correspond to the Issue, or cannot be
  identified safely.
- The base or destination branch cannot be determined, or they conflict.
- The standard policy does not target `main`, or an approved dependency
  exception is missing or incomplete.
- The accepted commit is missing, empty, on the wrong branch, or has an
  unknown or conflicting hash.
- The complete local commit range contains unrelated or unjustified work.
- Issue changes remain outside the accepted commit range.
- Staged, unstaged, untracked, or deleted changes cannot be classified or
  separated safely.
- The complete range was not validated or contains unrelated commits/files.
- `opencode.json` or another protected pre-existing path was modified, moved,
  staged, or overwritten.
- An already-published branch differs from the validated local `HEAD` or has
  unexplained commits.
- Any required evidence is missing, stale, contradictory, or unavailable.
- Continuing would require discarding, stashing, overwriting, rebasing,
  force-updating, or rewriting unrelated work or history.

When evaluating the already-closed `VERIFIED_NO_MUTATION` path, also return
`BLOCK` if:

- The validated destination branch or remote reference is missing, stale, or
  contradictory.
- The active local branch is not exactly the validated destination branch.
- The local destination branch does not contain the merged Issue changes.
- The local destination `HEAD` SHA does not exactly match the fresh verified
  remote destination SHA.
- The remote destination SHA was obtained only from a potentially stale local
  remote-tracking reference.

Report the blocking evidence and do not attempt an automatic repair.

## Position in the Workflow

For an open Issue, run after local commit resolution and before:

`.opencode/commands/hooks/pre-push-check.md`

No new remote mutation may occur before this guard returns normal-path `PASS`.

For an already-closed Issue, run in closed-audit mode after read-only evidence
collection and stop on either `VERIFIED_NO_MUTATION` or `BLOCK`.
