---
description: Review, merge and publish a completed Issue
agent: git-local
---

# Merge Issue Workflow

Integrate GitHub Issue **#$1** into `main` and publish it.

This command performs only Git verification, merge and push operations.

Do not execute `scripts/merge_issue.py` or other Python scripts.

## 1. Execution Rules

- Follow applicable `AGENTS.md` instructions.
- Execute all Git commands using the real bash tool.
- Never simulate command output or assume Git state.
- Never invent branches, commits, SHAs or verification results.
- Never bypass failed or incomplete checks.
- Never force push, reset, restore or discard changes.
- Never stage files or create development commits.
- Never create, rename or delete branches.
- Never close GitHub Issues.
- Never execute prepare, development, commit or close workflows.
- Never approve operations on behalf of the user.
- Stop immediately when a required verification fails.

The only permitted Git mutations are:

- `git switch main`
- `git pull --ff-only origin main`
- `git merge --no-ff --no-edit <issue-branch>`
- `git push origin main`

Each operation requires the corresponding explicit user authorization.

`git fetch origin main` is permitted for remote verification.

If bash is unavailable or verification cannot be completed, report `BLOCKED`.

## 2. Validate Issue and Repository

Verify that `$1` is a positive integer.

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
- Current branch is not empty (no detached HEAD).
- No unresolved conflicts.
- No merge, rebase, cherry-pick or revert in progress.
- No staged or unstaged tracked changes.
- No unrelated untracked files.

Untracked `.workflow/issues/*.json` files may be ignored for the working-tree cleanliness check.

Never stage, delete or modify these files.

### Pending Git Operation Check

Execute using the real bash tool:

```bash
git_dir="$(git rev-parse --absolute-git-dir)" || exit 1

for marker in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD; do
    if [ -e "$git_dir/$marker" ]; then
        echo "BLOCKED: pending Git operation: $marker"
        exit 1
    fi
done

for directory in rebase-merge rebase-apply; do
    if [ -d "$git_dir/$directory" ]; then
        echo "BLOCKED: pending rebase"
        exit 1
    fi
done
```

Require successful execution.

If any required validation fails, report `BLOCKED` and stop.

## 3. Identify Issue Branch

Execute:

```bash
git for-each-ref --format='%(refname:short)' refs/heads/
```

Identify exactly one existing local branch matching:

`<prefix>/$1-<slug>`

Require:

- Exactly one matching branch.
- A non-empty prefix and slug.
- The Issue number matches exactly.
- The branch is not `main` or `master`.

The slug does not need to match the GitHub Issue title exactly.

Never propose or construct a new branch name.

Never create a branch during this workflow.

Never select between multiple matching branches automatically.

Record the actual branch name and SHA:

```bash
git rev-parse <issue-branch>
```

Require a valid commit SHA.

If the branch is missing, ambiguous or cannot be resolved, report `BLOCKED`.

## 4. Inspect Issue Changes

Execute:

```bash
git log --oneline main..<issue-branch>
git diff --name-status main...<issue-branch>
git diff --stat main...<issue-branch>
```

Show:

- Exact Issue branch.
- Branch HEAD SHA.
- Actual commits pending integration.
- Changed files.
- Change summary.

Verify:

- The commits belong to Issue #$1.
- The changed files correspond to the Issue requirements.
- No unrelated commits or files are included.
- No `.workflow/issues/*.json` files are included in the integration.
- Manual validation has been explicitly approved.

Never assume manual validation passed.

If evidence is missing or ambiguous, report `BLOCKED`.

Do not modify the repository during this step.

If there are no pending commits, do not assume the branch is already integrated. Continue only to the ancestry verification.

## 5. Prepare Main

Show the current branch and identified Issue branch.

Ask:

"¿Autorizas cambiar a main y actualizarla desde origin/main?"

STOP and wait for explicit user confirmation.

If declined, report `CANCELLED`.

After authorization execute:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, report `BLOCKED`.

Repeat the repository and pending Git operation checks from Step 2.

Verify synchronization:

```bash
git rev-parse main
git rev-parse origin/main
```

Require identical SHA values.

If different, report `BLOCKED`.

## 6. Verify Integration State

Execute:

```bash
git merge-base --is-ancestor <issue-branch> main
```

Inspect the actual exit code:

- `0`: Branch already integrated locally.
- `1`: Branch not yet integrated.
- Any other code: `BLOCKED`.

### Already Integrated

If exit code is `0`:

- Do not execute another merge.
- Continue to Step 8 to verify publication.
- Do not report success before remote verification.

### Integration Pending

If exit code is `1`, execute:

```bash
git log --oneline main..<issue-branch>
git diff --name-status main...<issue-branch>
```

Require actual pending commits.

### Untracked File Collision Check

Execute:

```bash
git ls-files --others --exclude-standard
git diff --name-only --diff-filter=A main...<issue-branch>
```

Compare the actual returned paths.

If an untracked local path would be added by the Issue branch, report `BLOCKED`.

This comparison is a preliminary check. Git may detect additional conflicts during the merge.

Never automatically move, delete or overwrite files.

If verification cannot be completed reliably, report `BLOCKED`.

### Merge Authorization

Show:

- Exact existing Issue branch.
- Branch SHA.
- Pending commits.
- Changed files.
- Collision-check result.

Ask:

"¿Autorizas integrar la rama <issue-branch> en main?"

STOP and wait for explicit user confirmation.

If declined, report `CANCELLED`.

Never request authorization if branch verification failed.

## 7. Execute Merge

Only when integration is required and explicitly authorized:

```bash
git merge --no-ff --no-edit <issue-branch>
```

If Git reports conflicts or any error:

- Report `BLOCKED`.
- Preserve the actual Git state.
- Never resolve conflicts automatically.
- Never reset, restore or abort automatically.

After a successful merge execute:

```bash
git status
git log --oneline -3
git rev-parse HEAD
git merge-base --is-ancestor <issue-branch> main
```

Require:

- Merge command succeeded.
- No unresolved Git operation.
- The ancestry check returned exit code `0`.
- The resulting main HEAD SHA was retrieved.
- The resulting files and commits are consistent with the approved integration.

Record the actual resulting main SHA.

If any verification fails, report `BLOCKED`.

## 8. Review Publication

Execute:

```bash
git status
git log --oneline origin/main..main
git diff --name-status origin/main..main
git diff --stat origin/main..main
git rev-parse main
git rev-parse origin/main
```

Require:

- No unresolved Git operation.
- No staged or unstaged tracked changes.
- The Issue branch is integrated into `main`.
- All pending commits have been reviewed.
- No unexpected files or commits are included.

### Already Published

If `main` and `origin/main` have identical SHAs, perform a fresh remote verification:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> origin/main
```

Require:

- Fetch succeeded.
- Both SHAs are identical.
- Remote ancestry check returned exit code `0`.

If all pass, report `ALREADY_PUBLISHED`.

Do not execute merge or push again.

If the Issue branch is not integrated into `origin/main`, report `BLOCKED`.

### Publication Pending

If local `main` contains unpublished commits, show:

- Exact commits pending publication.
- Changed files.
- Current main SHA.
- Current origin/main SHA.

Ask:

"¿Autorizas publicar estos commits mediante git push origin main?"

STOP and wait for explicit user confirmation.

If declined, report `MERGED_LOCALLY`.

## 9. Publish Main

Only after explicit authorization execute:

```bash
git push origin main
```

If the push fails, report `BLOCKED`.

After the push execute:

```bash
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> main
git merge-base --is-ancestor <issue-branch> origin/main
git status
```

Require:

- Push succeeded.
- Fetch succeeded.
- `main` and `origin/main` have identical SHAs.
- Both ancestry checks returned exit code `0`.
- No unresolved Git operation exists.

Never assume publication succeeded based only on the push output.

## 10. Mandatory Publication Evidence Gate

Never report `MERGE_PUBLISHED` or `ALREADY_PUBLISHED` based on assumptions, expected output or previous conversation context.

Successful publication requires ALL of the following evidence from actual Git tool executions:

1. Exact Issue branch identified from local Git references.
2. Issue branch SHA successfully retrieved.
3. Issue branch integrated into local `main` (ancestry exit code `0`).
4. Successful `git fetch origin main`.
5. Issue branch integrated into `origin/main` (ancestry exit code `0`).
6. Identical SHA values for `main` and `origin/main`.
7. Actual final main SHA recorded.
8. No unresolved Git operations.
9. All required user authorizations obtained for operations executed in this workflow.

If the branch was already published before this execution, report `ALREADY_PUBLISHED`.

If this execution completed a required publication, report `MERGE_PUBLISHED`.

If local integration is complete but publication remains pending, report `MERGED_LOCALLY`.

If required evidence is missing, report `BLOCKED`.

Never use any of the following as successful verification evidence:

- "SHA not retrieved"
- "Integration assumed"
- "Published commits: N/A"
- "Expected result"
- "Already up to date" without ancestry verification.

## 11. Final Output

Report:

- Issue number.
- Exact Issue branch name.
- Issue branch SHA.
- Final main SHA.
- Origin/main SHA.
- Actual local ancestry verification.
- Actual remote ancestry verification.
- Merge commit SHA, if created.
- Published commits, if any.
- Changed files.
- Remaining uncommitted changes.
- Remote synchronization status.

Final states:

**MERGE_PUBLISHED**

The Issue integration was successfully published and verified on `origin/main`.

**ALREADY_PUBLISHED**

The Issue integration was already published before this execution and has been verified.

**MERGED_LOCALLY**

The Issue is integrated into local `main`, but publication is pending.

**CANCELLED**

The user declined an operation.

**BLOCKED**

A required verification or operation failed.

Never delete branches or close GitHub Issues.

Stop after reporting the verified final state.
