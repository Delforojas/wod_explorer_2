---
description: Commit approved Issue files
agent: git-local
---

# Commit Issue

Create one local commit for GitHub Issue #$1.

Execute ONLY this workflow using the real bash tool.

Do not run Python scripts or other workflows.

Never switch branches, fetch, pull, push, merge, reset,
restore, rebase or close GitHub Issues.

Never invent command output or claim an operation succeeded
without receiving its actual result.

## 1. Verify Branch and Files

Execute using the real bash tool:

```bash
git branch --show-current
git status --short --untracked-files=all
git diff --cached --name-only
```

Require:

- Current branch matches `<prefix>/$1-<slug>`.
- Current branch is not `main` or `master`.
- No unresolved conflicts or Git operations in progress.
- The Issue file selection has been reviewed and approved.

If a required condition cannot be verified, report `BLOCKED`.

## 2. Select and Stage Files

Show the actual files returned by Git.

Ask the user:

"¿Qué archivos quieres incluir en el commit?
Indica las rutas exactas."

Do not select files automatically.

Do not include `.workflow/issues/*.json`.

Wait for the user's explicit file selection.

Show the selected paths and ask:

"¿Autorizas añadir exclusivamente estos archivos al staging?"

Wait for confirmation.

Only after authorization execute:

```bash
git add -- <approved-file-paths>
```

Use the actual approved paths, correctly quoted.

Never use:

- `git add .`
- `git add -A`
- `git add --all`

If git add fails, report BLOCKED.

Verify:

```bash
git diff --cached --name-only
```

Require:

- At least one staged file.
- Every staged file was approved.
- No `.workflow/issues/*.json` files are staged.
- No unrelated files are staged.

If any condition fails, report BLOCKED.
Do not execute git commit.

## 3. Create Commit

Propose one Conventional Commit message using:

`<type>: <short-description> (#$1)`

Use the appropriate type:

`feat`, `fix`, `docs`, `refactor`, `test` or `chore`.

Show the exact message and ask:

"¿Autorizas crear el commit con este mensaje?"

Wait for explicit confirmation.

Only after authorization execute:

```bash
git rev-parse HEAD
```

Record the current HEAD SHA.

Then execute:

```bash
git commit -m "<approved-message>"
```

If the command fails, report BLOCKED.

Never execute git commit more than once.

## 4. Verify Result

Only after git commit succeeds execute:

```bash
git rev-parse HEAD
git log -1 --format='%H%n%s'
git branch --show-current
```

Require:

- The HEAD SHA differs from the SHA recorded before the commit.
- The git commit command completed successfully.
- A real commit SHA was returned.
- The commit message matches the approved message.
- The current branch still belongs to Issue #$1.

If all checks pass, report:

COMMIT_CREATED

- Issue: #$1
- Branch: <verified-branch>
- Commit: <actual-SHA>
- Message: <actual-message>

Otherwise report BLOCKED.

Never push, merge or close the Issue.
