---
description: Review, merge and publish approved Issue changes
agent: git-local
---

# Merge Issue

Integrate GitHub Issue **#$1** into `main` and publish it.

This command performs only Git review, merge and push operations.

Do not implement code, modify source files, stage files, create development commits, create branches or close GitHub Issues.

Do not execute `scripts/merge_issue.py` or `scripts/close_issue.py`.

## 1. Verify Repository State

Execute:

```bash
git status
git branch --show-current
git ls-files -u
git branch --list
```

Verify:

- No merge, rebase or cherry-pick is in progress.
- No unresolved conflicts exist.
- No unrelated tracked or staged changes exist.
- The Issue has a dedicated local branch.
- The Issue branch is not ambiguous.

If any condition fails, STOP and report BLOCKED.

## 2. Identify Issue Branch

Execute:

```bash
git for-each-ref --format='%(refname:short)' refs/heads/
```

Find exactly one local branch matching:

`<prefix>/$1-<slug>`

Do not create, rename or guess branches.

If no branch exists or multiple branches match, STOP.

Record the exact branch name and its HEAD SHA.

## 3. Verify Issue Changes

Execute read-only Git commands using the actual branch name:

```bash
git log --oneline main..<issue-branch>
git diff --name-only main...<issue-branch>
git diff --stat main...<issue-branch>
```

Verify:

- The Issue branch contains commits to integrate.
- The changed files correspond to Issue #$1.
- No unrelated changes are included.
- Manual validation has been explicitly approved by the user.

If any verification fails, STOP.

Show the pending commits and changed files.

## 4. Prepare Main

Ask the user:

"¿Autorizas cambiar a main y actualizarla desde origin/main?"

Wait for explicit confirmation.

Only after confirmation execute:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, STOP.

Verify:

```bash
git status
git rev-parse main
git rev-parse origin/main
```

If `main` is not synchronized with `origin/main`, STOP.

## 5. Confirm Merge

Check whether the Issue branch is already integrated:

```bash
git merge-base --is-ancestor <issue-branch> main
```

If already integrated, do not repeat the merge.

If not integrated, show the exact branch name and pending commits.

Ask:

"¿Autorizas integrar la rama <issue-branch> en main?"

Wait for explicit confirmation.

## 6. Execute Merge

Only after confirmation execute:

```bash
git merge --no-ff --no-edit <issue-branch>
```

If Git reports conflicts or untracked files that would be overwritten, STOP.

Never automatically remove, move, reset or restore files.

After the merge execute:

```bash
git status
git log --oneline -3
git merge-base --is-ancestor <issue-branch> main
```

Require the Issue branch to be integrated into main.

If verification fails, STOP.

## 7. Review Publication

Execute:

```bash
git status
git log --oneline origin/main..main
git diff --name-only origin/main..main
git diff --stat origin/main..main
```

Show the exact commits and files pending publication.

If unexpected commits or files appear, STOP.

Ask:

"¿Autorizas publicar estos commits en GitHub mediante git push origin main?"

Wait for explicit confirmation.

## 8. Execute Push

Only after confirmation execute:

```bash
git push origin main
```

If push fails, STOP.

Verify:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> origin/main
```

Require:

- `main` and `origin/main` have identical SHA.
- The Issue branch is integrated into `origin/main`.

## 9. Final Verification

Execute:

```bash
git status
git log --oneline -3
```

Report:

- Issue number.
- Integrated branch.
- Merge commit SHA.
- Published commits.
- Remote synchronization.
- Remaining uncommitted changes.

## Final State

If merge and push succeed:

MERGE_PUBLISHED

If merge succeeds but push is not authorized:

MERGED_LOCALLY

If any verification fails:

BLOCKED

Never close the GitHub Issue automatically.
