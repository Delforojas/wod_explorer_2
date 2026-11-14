
---
description: Review, merge and publish a completed Issue
agent: git-local
---

# Merge Issue

Merge GitHub Issue #$1 into `main` and publish it.

Execute ONLY this workflow using the real bash tool.

Do not execute Python scripts or other workflows.

Never create or delete branches, stage files, create development
commits, reset, restore, rebase, force push or close GitHub Issues.

Never invent command output, commit SHAs or verification results.

Never execute a Git mutation without explicit user authorization.

## 1. Verify Repository

Execute:

```bash
git branch --show-current
git status --short --untracked-files=all
git ls-files -u
```

Require:

- The working tree has no staged or unstaged tracked changes.
- No unresolved conflicts or Git operations in progress.
- No unrelated untracked files.

Untracked `.workflow/issues/*.json` files may be ignored
for the working-tree cleanliness check only.

Never stage, modify or delete these JSON files.

If verification fails, report `BLOCKED`.

## 2. Identify Issue Branch

Execute:

```bash
git branch --list "*/$1-*"
```

Require:

- Exactly one existing local Issue branch.
- The branch matches `<prefix>/$1-<slug>`.
- The branch is not `main` or `master`.

Record the exact branch name.

Execute:

```bash
git rev-parse <issue-branch>
```

Require a valid commit SHA.

Never invent a branch name or select between multiple matches.

If the branch is missing or ambiguous, report `BLOCKED`.

## 3. Prepare Main

Show the identified Issue branch.

Ask:

"¿Autorizas cambiar a main y actualizarla desde origin/main?"

Wait for explicit confirmation.

If declined, report `CANCELLED`.

Only after authorization execute:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, report `BLOCKED`.

Verify:

```bash
git branch --show-current
git status --short --untracked-files=all
git rev-parse main
git rev-parse origin/main
```

Require:

- Current branch is `main`.
- No staged or unstaged tracked changes.
- No unrelated untracked files.
- `main` and `origin/main` have identical SHA values.

If verification fails, report `BLOCKED`.

## 4. Verify Integration

Execute:

```bash
git merge-base --is-ancestor <issue-branch> main
```

Interpret the actual exit code:

- `0`: The Issue branch is already integrated locally.
- `1`: The Issue branch is not integrated.
- Any other result: `BLOCKED`.

If the tool does not provide a reliable exit code,
report `BLOCKED`.

If already integrated, skip Step 5 and continue to Step 6.

If not integrated, execute:

```bash
git log --oneline main..<issue-branch>
git diff --name-status main...<issue-branch>
git diff --stat main...<issue-branch>
```

Show the actual pending commits and changed files.

Require:

- At least one pending commit.
- No `.workflow/issues/*.json` files included.
- No unexpected files or commits.

Also check for untracked files that would be overwritten:

```bash
git ls-files --others --exclude-standard
git diff --name-only --diff-filter=A main...<issue-branch>
```

Compare the resulting paths.

If a collision is detected, report `BLOCKED`.

Never move, remove or overwrite local files automatically.

## 5. Merge Issue

Show:

- Exact Issue branch.
- Branch SHA.
- Pending commits.
- Changed files.

Ask:

"¿Autorizas integrar esta rama en main?"

Wait for explicit confirmation.

If declined, report `CANCELLED`.

Only after authorization execute:

```bash
git merge --no-ff --no-edit <issue-branch>
```

If the merge fails or produces conflicts:

- Report `BLOCKED`.
- Preserve the current Git state.
- Never resolve conflicts automatically.
- Never reset or abort the merge automatically.

After a successful merge execute:

```bash
git status
git log -1 --oneline
git rev-parse main
git merge-base --is-ancestor <issue-branch> main
```

Require:

- Merge command succeeded.
- No unresolved Git operation.
- The Issue branch is integrated into main.
- An actual main commit SHA was retrieved.

If verification fails, report `BLOCKED`.

## 6. Publish Main

First refresh the remote reference:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
```

If fetch fails, report `BLOCKED`.

### Already Published

If `main` and `origin/main` have identical SHA values,
execute:

```bash
git merge-base --is-ancestor <issue-branch> origin/main
```

Require exit code `0`.

If verified, report `ALREADY_PUBLISHED`.

If not verified, report `BLOCKED`.

Do not execute another merge or push.

### Publication Pending

If `main` and `origin/main` differ, execute:

```bash
git log --oneline origin/main..main
git diff --name-status origin/main..main
git diff --stat origin/main..main
```

Show the actual commits and changed files pending publication.

Require:

- The Issue branch is integrated into local `main`.
- No unexpected files or commits.
- The publication is a valid fast-forward from `origin/main`.

If verification fails, report `BLOCKED`.

Ask:

"¿Autorizas publicar estos commits mediante git push origin main?"

Wait for explicit confirmation.

If declined, report `MERGED_LOCALLY`.

Only after authorization execute:

```bash
git push origin main
```

If push fails, report `BLOCKED`.

Verify publication using actual Git output:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> origin/main
git status --short --untracked-files=all
```

Require:

- Push succeeded.
- Fetch succeeded.
- `main` and `origin/main` have identical SHA values.
- The Issue branch is integrated into `origin/main`.
- No unresolved Git operation exists.

If any requirement fails, report `BLOCKED`.

Do not infer publication from the push output alone.

## 7. Final Output

Report:

- Issue number.
- Exact Issue branch.
- Issue branch SHA.
- Final main SHA.
- Origin/main SHA.
- Merge commit SHA, if created.
- Published commits, if any.
- Remote synchronization status.

Allowed final states:

**MERGE_PUBLISHED**

The Issue was published during this workflow and
its integration into `origin/main` was verified.

**ALREADY_PUBLISHED**

The Issue was already published before this workflow
and its integration into `origin/main` was verified.

**MERGED_LOCALLY**

The Issue is integrated into local `main`,
but publication is pending.

**CANCELLED**

The user declined an operation.

**BLOCKED**

A required operation or verification failed.

### Final Output Rule

Never report `MERGE_PUBLISHED` or `ALREADY_PUBLISHED`
without successful remote verification.

The only successful published states are
`MERGE_PUBLISHED` and `ALREADY_PUBLISHED`.

Never report states belonging to other workflows.

Never create commits outside the merge operation,
delete branches or close GitHub Issues.

Stop after reporting the verified final state.
