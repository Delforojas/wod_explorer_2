---
description: Commit reviewed Issue changes
agent: git-local
---

# Commit Issue

Create a local commit for GitHub Issue **#$1**.

This command performs only Git review, staging and commit operations.

Do not implement code, modify files, push, merge or update GitHub Issues.

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

## 2. Select Issue Files

Identify the files approved by the Change Review Guard.

Show:

- Files belonging to the Issue.
- Unrelated modified files.
- Untracked files.
- Already staged files, if any.

Never use `git add .` or `git add -A`.

Never stage unrelated files.

Ask the user to explicitly approve the file selection.

## 3. Stage Approved Files

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

## 4. Create Commit

Propose a Conventional Commit message based on the actual Issue:

`feat(frontend): descripcion breve (#$1)`

Use `fix`, `docs`, `refactor` or another appropriate type when applicable.

Show the exact message and staged file list.

Ask for explicit confirmation before committing.

After confirmation, run:

```bash
git commit -m "<approved-message>"
```

## 5. Final Verification

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
