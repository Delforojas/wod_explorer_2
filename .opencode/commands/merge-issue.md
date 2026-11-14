---
description: Review, merge and publish a completed Issue
agent: git-local
---

# Merge Issue Workflow

Integrate GitHub Issue #$1 into main and publish it.

This command performs Git verification, merge and push only.

Do not execute scripts/merge_issue.py or other Python scripts.

## 1. Execution Rules

- Follow applicable AGENTS.md rules.
- Execute Git commands using the real bash tool.
- Never simulate output or assume Git state.
- Never invent branches, commits or verification results.
- Never bypass a failed check.
- Never force push, reset, restore or discard changes.
- Never stage files or create development commits.
- Never create, rename or delete branches.
- Never close GitHub Issues.
- Never execute other workflow phases.
- Never approve operations on behalf of the user.

Allowed Git mutations only after explicit authorization:

- git switch main
- git pull --ff-only origin main
- git merge --no-ff --no-edit <issue-branch>
- git push origin main

git fetch origin main is permitted for verification.

If bash is unavailable or verification is incomplete,
report BLOCKED and stop.

## 2. Validate Issue and Repository

Verify that $1 is a positive integer.

Execute:

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --porcelain=v1 --untracked-files=all
git ls-files -u
git rev-parse --absolute-git-dir
```

Require:

- Execution from the repository root.
- No detached HEAD.
- No unresolved conflicts.
- No merge, rebase, cherry-pick or revert in progress.
- No staged or unstaged tracked changes.
- No unrelated untracked files.

Untracked `.workflow/issues/*.json` files may be ignored
for the working-tree cleanliness check only.

Never stage, delete or modify these JSON files.

If any requirement fails, report BLOCKED.

## 3. Identify Issue Branch

Execute:

```bash
git for-each-ref --format='%(refname:short)' refs/heads/
```

Identify exactly one branch matching:

`<prefix>/$1-<slug>`

Require:

- Exactly one matching local branch.
- The branch is not main or master.
- The branch belongs to Issue #$1.

Never guess or select between multiple matches.

Record:

```bash
git rev-parse <issue-branch>
```

If ambiguous or missing, report BLOCKED.

## 4. Inspect Issue Changes

Execute:

```bash
git log --oneline main..<issue-branch>
git diff --name-status main...<issue-branch>
git diff --stat main...<issue-branch>
```

Show the actual commits and changed files.

Require that:

- The changed files correspond to Issue #$1.
- No unrelated commits or files are present.
- No local workflow JSON is included in the integration.
- The Issue implementation passed manual validation.

Never assume manual validation passed.

If evidence is missing or ambiguous, report BLOCKED.

Do not modify the repository during this step.

## 5. Prepare Main

Ask:

"¿Autorizas cambiar a main y actualizarla desde origin/main?"

Wait for explicit user confirmation.

If declined, report CANCELLED.

After authorization execute:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, report BLOCKED.

Repeat repository and Git-state verification.

Confirm main is synchronized:

```bash
git rev-parse main
git rev-parse origin/main
```

Require identical SHA values.

## 6. Verify Integration State

Execute:

```bash
git merge-base --is-ancestor <issue-branch> main
```

Interpret the actual exit code:

- 0: ALREADY_MERGED_LOCALLY.
- 1: The branch is not yet merged.
- Other: BLOCKED.

If already merged, skip the merge and continue
to publication verification.

Otherwise, execute:

```bash
git log --oneline main..<issue-branch>
git diff --name-status main...<issue-branch>
```

Require pending commits.

Check for untracked files that would be overwritten
by the incoming merge.

If any collision or unexpected change is found,
report BLOCKED.

Never automatically move, remove or overwrite files.

Show the pending commits and files.

Ask:

"¿Autorizas integrar <issue-branch> en main?"

Wait for explicit user confirmation.

If declined, report CANCELLED.

## 7. Execute Merge

Only when the merge is required and authorized:

```bash
git merge --no-ff --no-edit <issue-branch>
```

If Git reports conflicts or other errors,
report BLOCKED and preserve the actual Git state.

Never resolve conflicts automatically.

Verify:

```bash
git status
git log --oneline -3
git merge-base --is-ancestor <issue-branch> main
```

Require exit code 0 for the ancestry check.

Record the resulting HEAD SHA.

## 8. Review Publication

Execute:

```bash
git status
git log --oneline origin/main..main
git diff --name-status origin/main..main
git diff --stat origin/main..main
```

Require:

- No unresolved Git operation.
- No staged or unstaged tracked changes.
- The Issue branch is integrated into main.
- Every pending commit is reviewed.
- No unexpected files are included.

If origin/main already equals main and the Issue branch
is integrated, verify the remote state and report
MERGE_PUBLISHED without pushing again.

Otherwise, show all commits and files to publish.

Ask:

"¿Autorizas publicar estos commits mediante git push origin main?"

Wait for explicit confirmation.

If declined, report MERGED_LOCALLY.

## 9. Publish Main

Only after explicit confirmation:

```bash
git push origin main
```

If the push fails, report BLOCKED.

Verify:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> origin/main
git status
```

Require:

- main and origin/main have identical SHA values.
- The Issue branch is integrated into origin/main.
- No unresolved Git operation exists.

Do not assume publication succeeded based only
on the push command output.

## 10. Final Output

Report:

- Issue number.
- Exact integrated branch.
- Final main commit SHA.
- Published commits.
- Changed files.
- Remote synchronization status.
- Any remaining uncommitted changes.

Final states:

MERGE_PUBLISHED:
Merge is integrated and verified on origin/main.

MERGED_LOCALLY:
Merge is integrated but publication is pending.

CANCELLED:
User declined an authorized operation.

BLOCKED:
A required verification or operation failed.

Never delete branches or close GitHub Issues.
