# Pre-Close Check Hook

## Purpose

Provide a read-only barrier immediately before the normal
`/finish-issue $1` closure operation. This hook verifies the complete PR
commit range and file scope, publication, merge evidence, destination
synchronization, finalization documentation, and explicit manual approval.

This hook does not replace the post-close check:

`.opencode/commands/hooks/finish-workflow-check.md`

That existing hook remains the final read-only verification after normal
closure.

## Outcomes

- `PASS`: the normal open-Issue path may proceed to Issue closure.
- `BLOCK`: the Issue must not be closed because required evidence is missing,
  conflicting, unsafe, or unverifiable.

This hook has no closed-Issue success outcome. Already-closed Issues must be
handled by the read-only audit path in `finish-preflight.md`.

## Branch Terminology

- `base branch`: the validated branch from which the Issue branch diverged.
- `destination branch`: the branch targeted by the PR and containing the
  integrated result.

For this workflow, the destination branch must equal the validated base
branch. Record both names and verify the equality rather than relying on
implicit naming.

## Required Inputs and Evidence

The workflow must provide:

- The expected GitHub Issue number `#$1` and current Issue record.
- The successful normal-path `PASS` result from
  `.opencode/commands/guardarails/finish-preflight.md`.
- The validated Issue branch and published `HEAD` SHA.
- The validated base branch, destination branch, and their recorded remote
  references.
- The accepted commit hash, provenance mode, complete local commit range, and
  validated Issue file/status manifest.
- The successful result of:
  `.opencode/commands/hooks/pre-push-check.md`.
- Evidence that the Issue branch was published without unexplained divergence.
- The PR number or URL, head branch and SHA, base branch and reference, full
  commit list, and complete file/status diff.
- Required repository check results.
- The PR merge strategy and merged state. A merge timestamp or provider
  metadata may be recorded when available but is never proof by itself.
- Strategy-appropriate merge-result evidence: a merge-result SHA when
  available, or the equivalent destination-reference and resulting-tree
  evidence defined below.
- The destination remote reference and resulting destination SHA.
- Evidence that the local destination branch is synchronized after merge.
- The finalization documentation update result and recorded final evidence.
- Explicit user evidence approving manual validation.
- The classification of unrelated local changes before and after integration.

## Complete PR Scope Check

The PR must be checked as a complete range, not only by locating the expected
Issue commit:

- The PR head branch must be the validated Issue branch.
- The PR head SHA must equal the validated published `HEAD` SHA.
- The PR base branch must equal the validated destination branch.
- The PR base reference must be the expected destination reference used for
  the range comparison.
- Every commit in the PR range must be present in the validated local range
  or be the documented integration result.
- Every commit must be justified by the Issue, SDD, plan, or tasks.
- Every changed file and status in the complete PR diff must be justified by
  the Issue and must match the validated Issue file/status manifest.
- Any additional, unexplained, or unrelated commit or file is a blocker.

The merge commit produced by PR integration is evaluated separately as the
merge result and is not treated as an additional source commit in the Issue
range.

## Merge-Result Evidence

The hook must verify all of the following:

- The PR is merged successfully.
- Required repository checks passed, or repository evidence confirms that no
  required checks exist.
- The destination remote contains the intended Issue changes.
- The destination remote reference is recorded after integration.

Use evidence appropriate to the actual strategy:

- For a merge commit, verify the reported merge commit SHA exists on the
  destination remote and contains the validated PR diff.
- For squash, verify the squashed destination commit exists on the
  destination remote and its resulting tree contains the complete validated
  PR diff, even though the source commit hashes are not preserved.
- For rebase, verify the rebased destination commit range is on the
  destination remote and the resulting tree contains the complete validated
  PR diff, even though source commit hashes may change.

If the provider does not expose a distinct merge SHA, the destination remote
tip plus the merged PR state, reachability, and complete resulting diff must
be sufficient to identify the merge result. A timestamp or generic merged
metadata without that destination evidence is insufficient. Otherwise return
`BLOCK`.

## Finalization Documentation

Finalization documentation is independent from the development handoff
contract in `.opencode/commands/guardarails/github-documentation.md`.

The finalization record must contain only verified facts about:

- explicit manual approval;
- the Issue branch and accepted commit/range;
- the PR and complete validated scope;
- the base and destination branches;
- merge strategy and merge result evidence;
- destination synchronization;
- Issue-related files and statuses;
- the final Issue state that is about to be closed.

Do not require development-state claims such as manual validation remaining
pending, `/finish-issue` remaining pending, or the Issue remaining open after
this finalization record is written.

## Required Read-Only Checks

Use evidence produced by:

- `.opencode/commands/guardarails/finish-preflight.md`
- `.opencode/commands/hooks/pre-push-check.md`
- `.opencode/commands/guardarails/post-commit.md` when a `finish-commit` was
  created; a `handoff-commit` uses the freshly verified post-commit state from
  the preflight evidence
- `.opencode/commands/hooks/finish-workflow-check.md` only after closure

The development-only GitHub Documentation Guard remains authoritative for
`/issue`; it is not a finalization guard for this hook.

Permitted local read-only checks include:

- `git branch --show-current`
- `git status`
- `git diff`
- `git diff --cached`
- `git diff --name-status <base>...<head>`
- `git log <base>..<head>`
- `git show <commit>`
- `git rev-parse`
- `git merge-base`
- `git branch -vv`

Permitted remote read-only checks include GitHub MCP reads for:

- the Issue state and finalization documentation;
- the published Issue branch and commit;
- the PR head, base, full commit list, full file list, merge state, strategy,
  required checks, and merge-result evidence;
- the destination branch reference and resulting tree.

This hook must not execute `git add`, `git commit`, `git push`, `git switch`,
`git pull`, merge, PR creation, PR modification, Issue update, Issue closure,
stash, rebase, force operation, discard, or history rewrite.

## PASS Conditions

Return `PASS` only when every condition below is verified:

- The Issue is the expected Issue and remains open immediately before closure.
- The normal-path preflight returned `PASS`.
- The published branch corresponds exactly to the validated Issue branch and
  accepted `HEAD`.
- The PR exists and its head branch and SHA match the validated Issue branch
  and published `HEAD`.
- The PR base branch equals the validated destination branch and therefore the
  validated base branch.
- The complete PR commit range and file/status diff are Issue-related,
  justified, and free of unexplained divergence.
- Required repository checks passed or none are required.
- The PR is merged using a verified merge, squash, or rebase result.
- The destination remote contains the complete intended Issue diff.
- The local destination branch is active and exactly synchronized with its
  remote reference without unsafe update operations.
- Finalization documentation targets the correct Issue and contains only
  verified finalization evidence.
- Manual validation approval is explicit user evidence.
- Unrelated local changes remain identified, untouched, and outside Issue
  commits and PR scope.
- No blocker or unverified condition remains.

`PASS` authorizes the next operation to be the normal Issue closure. This hook
does not close the Issue.

## BLOCK Conditions

Return `BLOCK` and do not continue to Issue closure if any condition below
applies:

- The Issue is already closed or cannot be read safely.
- Preflight did not return normal-path `PASS`.
- The published branch or accepted `HEAD` cannot be verified.
- The PR is missing, has the wrong head or base, or has unexplained
  divergence.
- The complete PR commit range or file/status diff cannot be verified, is
  broader than the validated Issue scope, or contains unrelated work.
- Required repository checks failed, are pending, or cannot be determined.
- The PR is not merged or its merge strategy/result cannot be verified.
- The destination remote does not contain the complete intended Issue diff.
- The local destination branch is stale, differs from its remote, or cannot be
  synchronized without an unsafe update or modification of unrelated work.
- Finalization documentation is missing, targets the wrong Issue, contains
  unverified claims, or uses development-pending requirements as finalization
  requirements.
- Manual approval is missing, ambiguous, inferred, or not attributable to the
  user.
- Unrelated local changes were modified, staged, committed, or cannot be
  classified safely.
- Any required input is missing, stale, contradictory, or unavailable.

Report the observed state and stop. Do not reopen, update, or close the Issue
from this hook.

## Position in the Workflow

Run after:

- successful publication of the Issue branch;
- PR creation or reuse and merge;
- destination branch synchronization;
- finalization documentation update.

Run immediately before the normal Issue closure operation.

After closure, preserve the existing invocation of:

`.opencode/commands/hooks/finish-workflow-check.md`
