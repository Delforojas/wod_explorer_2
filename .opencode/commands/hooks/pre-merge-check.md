# Pre-Merge Check Hook

## Purpose

Provide a strictly read-only barrier immediately before the Pull Request merge
operation in `/finish-issue $1`. This hook verifies the exact PR head and base,
the complete PR commit and patch scope, required checks, merge conflicts,
explicit manual approval, and the expected head SHA.

Markdown procedures are not automatically executable. The workflow must
explicitly load this hook, provide its evidence, evaluate `PASS` or `BLOCK`,
and execute the merge only after `PASS`.

## Outcomes

- `PASS`: the merge operation may be attempted with the verified expected head
  SHA.
- `BLOCK`: the merge must not be attempted because evidence is missing,
  conflicting, changed, unsafe, or unverifiable.

This hook does not create, modify, or merge a Pull Request.

## Branch and Reference Contract

- The `base branch` is the validated branch from which the Issue branch
  diverged.
- The `destination branch` is the PR target branch containing the integrated
  result.
- For the standard policy, `base_branch=main`, `base_ref=origin/main`,
  `base_remote_ref=refs/heads/main`, `pr_target=main`, and
  `pr_target_ref=refs/heads/main`. A dependency policy is valid only when all
  corresponding fields match the explicit approved exception record.
- The immutable historical `base_sha`, initial remote SHAs, and latest observed
  remote SHAs for both base and destination must be recorded separately.
- The exact PR head SHA expected at merge time must be recorded.

For `standard-main`, the PR base, destination, and validated base are all
`main`. For `approved-dependency`, the PR base and destination must equal
`pr_target`, while the Issue branch base must equal `base_branch`; any
relationship between them must match the approved exception. Their names and
references must not be substituted silently.

## Required Inputs and Evidence

The workflow must provide:

- The expected GitHub Issue number `#$1` and current Issue record.
- A normal-path `PASS` from:
  `.opencode/commands/guardarails/finish-preflight.md`.
- The validated Issue branch and exact published `HEAD` SHA.
- The validated `base_branch`, `base_ref`, `base_remote_ref`, immutable
  `base_sha`, `pr_target`, and `pr_target_ref`.
- `base_remote_sha_initial`, `base_remote_sha_latest`,
  `pr_target_sha_initial`, and `pr_target_sha_latest` for both exact
  references.
- The PR number or URL.
- The PR head branch and exact current head SHA.
- The PR base branch and exact base reference.
- The complete PR commit list.
- The complete PR file/status diff or equivalent patch evidence.
- The validated local commit range and Issue file/status manifest.
- Required repository check results.
- Evidence that no merge conflicts exist.
- Explicit user evidence approving manual validation.
- The classification of unrelated local changes.
- The protected local paths, including `opencode.json`, and evidence that they
  remain untouched and outside staging.

## Required Read-Only Checks

Verify all of the following before returning `PASS`:

- The PR head branch is the validated Issue branch.
- The PR head SHA equals the validated published `HEAD` SHA.
- The PR base branch equals the recorded `pr_target` and its reference equals
  `pr_target_ref`.
- The standard fields are exactly `main`, `origin/main`, and
  `refs/heads/main`, or every dependency field matches the explicit approved
  exception.
- The local range uses immutable `base_sha`; the current remote observations
  are recorded separately and are not substituted into that historical field.
- Every commit in the complete PR range is present in the validated local
  range or is a documented integration-only commit that is not yet merged.
- Every PR commit is justified by the Issue, SDD, plan, or tasks.
- Every file and status in the complete PR diff is justified by the Issue and
  matches the validated Issue file/status manifest.
- No unrelated committed change is present in the PR.
- The PR has no merge conflicts.
- Required repository checks passed, or repository evidence confirms that no
  required checks exist.
- Explicit manual approval is attributable to the user and remains valid for
  this merge.
- Fresh authoritative `git ls-remote origin <base_remote_ref>` and
  `git ls-remote origin <pr_target_ref>` checks resolve both exact references.
  Their observed SHAs are recorded as `base_remote_sha_latest` and
  `pr_target_sha_latest` against the initial observations. If either reference
  disappeared or advanced, the complete range and patch were re-evaluated
  against the new SHA without rebasing.
- `opencode.json` and other pre-existing protected paths are unchanged and
  absent from the PR scope.

The hook must perform a final read-only PR head recheck immediately before
returning `PASS`. Record that SHA as `expectedHeadSha`. If it differs from the
previously validated head SHA, return `BLOCK`.

If the destination/base reference has changed since preflight, do not silently
substitute the new SHA. Return `BLOCK` unless the workflow has re-evaluated the
complete local and PR scope against the new exact base SHA and supplied that
new evidence to this hook.

Permitted local read-only checks include:

- `git branch --show-current`
- `git status`
- `git diff`
- `git diff --cached`
- `git diff --name-status <base-sha>...<head-sha>`
- `git diff <base-sha>...<head-sha>`
- `git log <base-sha>..<head-sha>`
- `git show <commit>`
- `git rev-parse`
- `git merge-base`
- `git branch -vv`
- `git ls-remote origin <base_remote_ref>`
- `git ls-remote origin <pr_target_ref>`

Permitted remote read-only checks include GitHub MCP reads for the Issue, PR,
PR commits, PR files, required checks, branch references, conflict state, and
destination/base references.

This hook must not execute `git add`, `git commit`, `git push`, `git switch`,
`git pull`, merge, PR creation, PR modification, Issue update, Issue closure,
stash, rebase, force operation, discard, or history rewrite.

## Merge Invocation Contract

When the configured GitHub MCP merge operation supports an expected head SHA,
the workflow must pass the recorded `expectedHeadSha` as its conditional merge
value.

If conditional expected-head merging is unavailable, the workflow must not
claim an atomic SHA guarantee. It may proceed only when the final read-only
head recheck still matches the expected SHA and no change was detected. Any
change detected during that final recheck returns `BLOCK`.

## BLOCK Conditions

Return `BLOCK` and stop before merge if any condition below applies:

- The PR is missing or cannot be read safely.
- The PR head branch is wrong or its SHA differs from the validated published
  `HEAD`.
- The PR base branch or reference differs from the recorded `pr_target` or
  `pr_target_ref`, or the base fields do not match the approved policy.
- The standard PR does not target `main`, or a dependency exception is missing,
  unapproved, or points to a different destination.
- The immutable `base_sha`, initial remote SHA, or latest observed remote SHA is
  missing, stale, contradictory, or silently substituted.
- The complete PR commit list or file/status diff is missing or incomplete.
- Any PR commit or file is unrelated, unjustified, or outside the validated
  Issue scope.
- A protected local path is present in the PR or was modified to prepare it.
- The PR has merge conflicts.
- Required repository checks failed, are pending, or cannot be determined.
- Explicit manual approval is absent, ambiguous, or no longer attributable to
  the user.
- The final PR head recheck differs from the expected SHA.
- Conditional merge is unavailable and the final recheck cannot establish an
  unchanged expected head.
- Any required evidence is missing, stale, contradictory, or unavailable.
- Continuing would require modifying unrelated work or rewriting history.
- The destination advanced and safe integration against the new SHA cannot be
  demonstrated without rebasing or rewriting history.
- The base or destination remote reference disappeared or cannot be verified.

Report the observed state and stop. Do not attempt an automatic repair.

## Position in the Workflow

Run after PR creation or reuse and after all pre-merge checks, immediately
before the GitHub MCP merge operation.

After this hook returns `PASS`, preserve the recorded `expectedHeadSha` for
the conditional merge call and for the later pre-close and post-close checks.
