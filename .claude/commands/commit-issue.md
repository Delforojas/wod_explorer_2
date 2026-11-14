---
description: Review, stage and commit approved Issue changes
agent: git-local
---

# Commit Issue

Create a local commit for GitHub Issue **#$1**.

This command performs only Git review, staging and commit operations.

Do not implement code, modify application files,
push, merge or update GitHub Issues.

The only permitted file deletion is the verified
local Issue JSON defined in Step 2.

## 1. Verify Repository State

Run:

```bash
git status
git branch --show-current
git diff
git diff --cached
```

Verify:

- The current branch belongs to Issue #$1.
- The current branch is not main or master.
- No merge or rebase is in progress.
- The working tree contains no unresolved conflicts.
- `/dev-issue $1` has reported READY_FOR_STAGING.

If any requirement cannot be verified, STOP.

## 2. Clean Local Issue Context

Target file:

`.workflow/issues/$1.json`

Before deletion, verify:

- The file belongs to the requested Issue #$1.
- The file is untracked by Git.
- The file is a regular file, not a symbolic link.
- The file is located inside `.workflow/issues/`.
- No other files will be affected.

If the file does not exist, continue.

If any safety check fails, report BLOCKED.
Never delete a tracked file or symbolic link.

After successful verification, execute:

```bash
rm -- ".workflow/issues/$1.json"
```

Do not ask for user confirmation.

Verify that the file no longer exists.

Continue to the next workflow step.

## 3. Select Issue Files

Identify the files approved by the Change Review Guard.

Show:

- Files belonging to the Issue.
- Unrelated modified files.
- Untracked files.
- Already staged files, if any.

Never use `git add .` or `git add -A`.

Never stage unrelated files.

Ask the user to explicitly approve the file selection.

## 4. Stage Approved Files

After confirmation, execute:

```bash
git add -- <approved-files>
```

Then verify:

```bash
git diff --cached --stat
git diff --cached --check
git diff --cached
```

If staged content includes unrelated changes, STOP.

Do not automatically discard or restore user changes.

## 5. Create Commit

Propose a Conventional Commit message based on the actual Issue:

`feat(frontend): descripcion breve (#$1)`

Use `fix`, `docs`, `refactor` or another appropriate type when applicable.

Show the exact message and staged file list.

Ask for explicit confirmation before committing.

After confirmation, run:

```bash
git commit -m "<approved-message>"
```

## 6. Final Verification

Run:

```bash
git status
git log -1 --oneline
```

Report:

- Issue number.
- Active branch.
- Commit hash.
- Commit message.
- Committed files.
- Remaining uncommitted changes.

## Final State

COMMIT_CREATED

Do not execute merge, push, branch deletion or `/finish-issue`.

If any required check fails, report BLOCKED.
