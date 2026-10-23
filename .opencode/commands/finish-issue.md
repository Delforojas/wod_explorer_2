---
description: Finalize, publish, integrate, document, and close an implemented GitHub Issue
---

# Finish GitHub Issue #$1

Run this command only after the implementation for Issue #$1 is complete, a
dedicated Issue branch exists, its tasks are complete, and the user has
explicitly approved manual validation.
The explicit `/finish-issue $1` invocation authorizes the remote operations in
this workflow, but it is not evidence of manual-validation approval.

This command does not implement work, regenerate or modify the SDD, repeat the
full project analysis, create branches, or repeat tests, build, or lint unless
needed to investigate a detected problem.

It may create only a necessary Issue commit, stage only Issue files, publish
the Issue branch, create or reuse and merge the Pull Request, document verified
finalization facts, and close the Issue. Never include, modify, stash, discard,
overwrite, or otherwise move unrelated local work.

## Canonical Evidence Record

Maintain one in-session record and update it as each phase produces evidence.
Do not reconstruct conflicting copies of these values.

- Static handoff evidence: Issue identity, repository, approved scope,
  dependencies and decisions, SDD references, completed tasks, historical
  verification results, and explicit user approval evidence.
- Static commit evidence: accepted commit hash, message, provenance
  (`handoff-commit` or `finish-commit`), complete range, and complete Issue
  file/status manifest.
- Static base policy: one non-hybrid policy (`standard-main` or
  `approved-dependency`), its determining evidence, `base_branch`, `base_ref`,
  `base_remote_ref`, immutable historical `base_sha`, and approved
  `pr_target`/`pr_target_ref`.
- Mutable observations: active branch and `HEAD`, working-tree and staging
  state, base and destination remote SHAs, published branch, Issue state, PR
  state, checks, merge strategy/result, destination synchronization, and
  protected local paths including `opencode.json`.
- Every reused static entry must retain its source and revision/hash when
  available. Mutable entries must retain observation time, source, phase, and
  status; they are never inherited as current merely because the handoff was
  valid historically.

## Entry And Issue State

1. Read the GitHub Issue with GitHub MCP. Verify the repository and Issue
   identity, implementation documentation, completed tasks, absence of pending
   blockers, and explicit user evidence approving manual validation.
2. Preserve the Issue state before this invocation. The normal mutation path is
   allowed only when the Issue was open at that time.
3. If implementation work is pending, stop. Do not implement it from this
   command.

Issue state never replaces the required Git, branch, commit, working-tree, and
remote evidence.

## Read-Only Branch And Scope Intake

Load and apply `.opencode/commands/hooks/branch-check.md` before determining the
base branch. Use its read-only result to identify the active branch, Git state,
staged and local changes, and related Issue branches.

Stop if the active branch does not correspond to Issue #$1, Git state cannot be
determined safely, or continuing would require changing branches, discarding
work, stashing automatically, rewriting history, or touching unrelated work.
Do not commit, push, document, or close after this stop.

Use the base policy recorded by `/issue`; do not infer a different base from the
current branch or silently substitute a historical work branch.

Read the static handoff summary only after checking repository and Issue
identity, source references, accepted commit/range, and SDD consistency. If the
summary is absent, incomplete, or contradictory, reconstruct the affected
static facts from the Issue, SDD, and Git. If they cannot be reconciled, return
`BLOCK`. This reuse never replaces fresh mutable Git, remote, PR, or Issue
checks.

Verify the canonical policy without substituting fields. For
`standard-main`, require `base_branch=main`, `base_ref=origin/main`,
`base_remote_ref=refs/heads/main`, `pr_target=main`, and
`pr_target_ref=refs/heads/main`. For `approved-dependency`, use the exact
approved dependency values recorded by `/issue`.

Before resolving the accepted commit and before the preflight, run
`git ls-remote origin <base_remote_ref>` and
`git ls-remote origin <pr_target_ref>` using the recorded exact references.
Record the observed base and destination SHAs as `base_remote_sha_latest` and
`pr_target_sha_latest`, separately from immutable `base_sha`, and compare each
with its corresponding initial observation. If either reference disappears,
changes without a complete safe re-evaluation, or cannot be verified, return
`BLOCK`. Recompute the complete Issue range and patch against a changed base
SHA when required, and re-evaluate the PR target against its changed SHA. Never
rebase automatically, overwrite `base_sha`, or silently substitute a branch.

Pass `base_branch`, `base_ref`, `base_remote_ref`, immutable `base_sha`,
`base_remote_sha_initial`, `base_remote_sha_latest`, `pr_target`,
`pr_target_ref`, `pr_target_sha_initial`, `pr_target_sha_latest`, the policy,
and the destination evidence unchanged to `finish-preflight` and every later PR
validation.

Classify the complete Issue scope before staging or committing:

- committed changes after the validated base;
- staged, unstaged, untracked, and deleted changes;
- every Issue file with status `A`, `M`, `D`, or `R`;
- unrelated committed and uncommitted work.

Use the Issue, SDD, plan, tasks, branch, and complete commit and patch ranges to
justify ownership. Every Issue commit and file must be attributable to the
Issue. Unrelated work may remain only when it is identified, separable, outside
Issue commits and PR scope, and untouched by this workflow. Stop if ownership
cannot be determined safely.

## Already-Closed Issue

If the Issue was already closed before this invocation, do not enter the normal
publication, PR, documentation, merge, or closure path.

After the read-only intake above, load
`.opencode/commands/guardarails/finish-preflight.md` in closed-audit mode and
provide the complete canonical evidence record.

- `VERIFIED_NO_MUTATION`: report the verified final state and end the command.
- `BLOCK`: report the missing, stale, contradictory, or unsafe evidence and end the command.

This path must not reopen, update, publish, create or modify a PR, merge, close,
switch branches, or perform any other mutation. `VERIFIED_NO_MUTATION` is not a
normal-path success.

## Resolve The Issue Commit

Find a valid existing commit for the Issue before creating one. It must be on
the active Issue branch, contain the Issue changes, be non-empty, and have a
message that clearly identifies Issue #$1 or its purpose.

- Reuse a complete `/issue` handoff commit as `handoff-commit`; never duplicate it.
- If Issue changes remain uncommitted, an additional commit may be created as `finish-commit` only for unambiguously owned Issue changes.
- If no valid commit exists and owned Issue changes are pending, create the necessary `finish-commit`.
- If a valid commit already exists, verify that no Issue changes remain outside the accepted range before continuing.
- Do not amend, rebase, rewrite existing history, or create a redundant commit.

When a new commit is necessary, execute these existing procedures in order:

1. Load `.opencode/commands/hooks/pre-stage-check.md` and require its pass result.
2. Stage only the classified Issue files. Never use `git add .` or an equivalent broad command.
3. Load `.opencode/commands/hooks/pre-commit.md` and require its pass result.
4. Create the commit. Its message must describe the change, follow repository style when known, and include `(#$1)`.
5. Load `.opencode/commands/hooks/post-commit.md` and require its pass result.

Stop on any failed hook. Preserve the accepted hash, message, provenance,
complete Issue range, and complete file/status manifest in the evidence record.

## Finish Preflight

After commit resolution and before any remote mutation, load
`.opencode/commands/guardarails/finish-preflight.md`. Provide its required
Issue, SDD, Git, branch, commit, range, patch, manual-approval, and unrelated-
work evidence from the canonical record.

- Normal open Issue: only `PASS` may continue to `pre-push-check`.
- `BLOCK`: stop before every remote mutation and report the blocking evidence.
- `VERIFIED_NO_MUTATION`: valid only for the already-closed path and terminal there.

The exact validated base SHA is the only accepted range baseline. If the base
or destination reference changes, stop the current evidence, re-evaluate the
complete local range and patch against the new exact SHA, update the record, and
rerun the preflight before continuing.

## Publish The Issue Branch

1. Load `.opencode/commands/hooks/pre-push-check.md` and require `PASS`.
2. Preserve its remote, branch, upstream, and safe-push result in the evidence record.
3. Only after `PASS`, publish the current branch. Configure upstream during the push only when no valid upstream exists; otherwise use a normal push.
4. Verify that the push succeeded, the remote branch exists, and the accepted Issue commit is available remotely.

Stop on failure. Never force push, force-with-lease, rebase, amend, rewrite
history, or document or close the Issue after an unverifiable push.

Recompute and preserve the final Issue file/status manifest from the complete
validated range, using the equivalent of
`git diff --name-status <base>...HEAD`. Do not include files belonging
exclusively to unrelated work.

## Pull Request Integration

The Pull Request is mandatory before normal Issue closure. Its `base` is the
validated destination and its `head` is the published Issue branch. For the
standard policy, the PR base must be `main`. Never merge directly with local
`git merge`.

Before creating or reusing the PR, verify that the destination exists remotely,
the Issue branch is published, the accepted commit is remote, and both
`base_remote_ref` and `pr_target_ref` still resolve. Record their latest SHAs
as `base_remote_sha_latest` and `pr_target_sha_latest`, then compare them with
the corresponding initial observations.
If either reference advanced, re-evaluate the complete local and PR scope
against the new SHA without rebasing; stop when safety cannot be demonstrated.
Also verify that the Issue head branch and `pr_target` are different. If a
reference is missing, the branches are equal, or a reference changed without a
safe re-evaluation, stop.

Search first for any open PR for the Issue and published head. Reuse it only
when its base matches the approved destination and exact policy. If an existing
PR has a different base, stop without retargeting it and without creating a
duplicate. If no matching PR exists, create it with GitHub MCP using the
recorded head and `pr_target`. A new PR title must describe the change and
include `#$1` when appropriate.

Before merge, verify the complete PR commit list, complete file/status diff and
patch, Issue ownership of every commit and file, absence of unrelated committed
work, required checks, no conflicts, correct head/base references, and explicit
manual approval. These checks must be performed by loading
`.opencode/commands/hooks/pre-merge-check.md` immediately before merge.

Require `PASS`. Preserve its final `expectedHeadSha`. When the GitHub MCP
supports conditional expected-head merging, pass that exact SHA to the merge.
When it does not, perform the hook's final read-only recheck, do not claim an
atomic SHA guarantee, and stop if the head changed.

After `PASS`, merge through GitHub MCP using the permitted repository strategy.
Never force-push or rewrite history. Verify that the PR is merged, the merge
result is available remotely, the destination contains the complete intended
Issue change, and the strategy-specific evidence is sufficient:

- merge commit: verify the merge SHA exists on the destination and contains the validated PR diff;
- squash: verify the squashed destination commit and resulting tree contain the validated PR diff;
- rebase: verify the rebased destination range and resulting tree contain the validated PR diff.

If the provider has no distinct merge SHA, use the destination tip, merged PR
state, reachability, and complete resulting diff. A timestamp or generic merged
metadata alone is insufficient.

After the remote merge is verified, synchronize the local approved destination
with its remote using only a safe fast-forward update, conceptually
`git switch <destination>` followed by
`git pull --ff-only <remote> <destination>`. Do not perform a local merge. If
unrelated local work prevents switching or synchronizing safely, stop; do not
stash, discard, overwrite, or force the operation.

Verify and record that the active destination contains the Issue changes and is
exactly synchronized with the destination remote.

## Finalization Documentation

After merge and destination synchronization, update the correct GitHub Issue
with only verified finalization facts. This is finalization documentation, not
the development handoff. Do not claim pending validation or pending
`/finish-issue` after this update is verified.

The record must include:

- explicit user approval and known automatic verification results;
- Issue branch, validated base branch and SHA, destination branch and remote SHA;
- accepted commit, provenance, message, complete range, and full PR commit list;
- complete PR file/status manifest, PR identity and status, merge strategy, and merge-result evidence;
- published branch, destination synchronization, and pre/post classification of unrelated work;
- working-tree and staging state;
- every Issue file with its `A`, `M`, `D`, or `R` status.

Document only facts observed during this workflow. If the Issue update fails,
stop and do not close the Issue.

## Pre-Close And Closure

After the merge, synchronization, and finalization update, load
`.opencode/commands/hooks/pre-close-check.md`. Provide the canonical evidence
record, including the normal preflight `PASS`, published head, complete PR
scope, required checks, strategy-specific merge result, destination remote and
local synchronization, finalization documentation, manual approval, and
unrelated-work classification.

Only `PASS` authorizes the next operation. `BLOCK` stops the workflow and does
not authorize automatic repair.

The Issue must still be the open Issue observed at entry. Closure is the last
remote mutation and is allowed only after all previous gates pass, the branch is
published, the PR is integrated into the validated destination, finalization
documentation is verified, and no blocker remains.

Never run this section for an Issue that was already closed; that route ended in
the closed-audit section.

## Post-Close Verification

After normal closure, and only after normal closure, load
`.opencode/commands/hooks/finish-workflow-check.md`. It must verify publication,
accepted commit, complete Issue scope, merged PR, destination remote and local
synchronization, preserved unrelated work, manual approval, finalization
documentation, and closed Issue state.

- `PASS`: continue to the final summary.
- `FAIL`: stop, report the failed check, expected state, observed state, and evidence. Do not repair automatically.

Do not run this hook for the terminal closed-Issue audit path.

The workflow must finish on the active destination branch. If it cannot remain
there safely, stop and do not change unrelated local work to force that state.

## Final Summary

Only after `finish-workflow-check PASS`, show the preserved canonical evidence:

- Issue, current branch, Issue branch, base branch, destination branch, and remote;
- final commit hash and message, complete Issue range, and all Issue files/statuses;
- working-tree state and unrelated local changes, explicitly marked unchanged;
- push state, PR identity and state, merge state, strategy, and merge-result SHA when available;
- manual-validation approval, final Issue state, and destination synchronization.

Include every Issue file with status `A`, `M`, `D`, or `R`. Do not list files that
belong exclusively to unrelated work. Do not invent commits, files, checks,
CI results, PR data, merge results, or validation evidence.

## Global Safety Rules

- Keep all procedures read-only until their explicitly authorized mutation phase.
- Load supporting procedures at the phase where they are needed; do not preload every hook or guardrail.
- Stop immediately on missing, stale, contradictory, unsafe, or unverifiable evidence.
- Preserve unrelated local work exactly as found.
- Never automatically create or switch to a different Issue branch.
- Never automatically stash, discard, overwrite, force-update, rebase, amend, or rewrite history.
- Never close, document as complete, push, create or modify a PR, or merge after a failed relevant gate.
