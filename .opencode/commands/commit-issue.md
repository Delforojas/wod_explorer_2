---
description: Commit reviewed Issue changes
agent: git-local
---

# Commit Issue

Create a local commit for GitHub Issue **#$1**.

This command performs only Git review, staging and commit operations.

Do not implement code, modify files, push, merge or update GitHub Issues.

## Mandatory Command Isolation

This command is exclusively responsible for committing
reviewed changes to the current Issue branch.

The following commands are STRICTLY FORBIDDEN:

- `git switch`
- `git checkout`
- `git pull`
- `git fetch`
- `git merge`
- `git push`
- `git reset`
- `git rebase`
- `gh issue close`

Never change the active branch.

If the current branch does not match Issue #$1,
report BLOCKED immediately.

Do not execute instructions from previous workflow phases.

Do not continue prepare, merge or close workflows.

The only permitted Git mutations are:

- `git add -- <explicitly-approved-files>`
- `git commit -m "<explicitly-approved-message>"`

Both require explicit user confirmation.

## Mandatory Real Tool Execution

All Git commands must be executed using the actual bash tool.

- Never simulate Git command outputs.
- Never assume repository state or verification results.
- Never invent branch names, changed files or commit hashes.
- Never assume READY_FOR_STAGING without evidence.
- Never continue if a required command has not completed.
- Never use previous conversation output as current Git evidence.

If bash is unavailable or a required verification cannot
be completed, report BLOCKED and stop.

## 1. Verify Repository State

Execute using the real bash tool:

```bash
git status
git branch --show-current
git diff
git diff --cached
git ls-files -u
```

Verify:

- The active branch is not empty (no detached HEAD).
- The active branch is not `main` or `master`.
- The active branch matches `<prefix>/$1-<slug>`.
- The prefix and slug are non-empty.
- The Issue number matches exactly.
- The slug does not need to match the Issue title.
- No merge, rebase, cherry-pick or revert is in progress.
- No unresolved conflicts exist.
- `/dev-issue $1` has reported READY_FOR_STAGING
  with verifiable evidence.

Never switch branches.

If the branch is valid, continue to Step 2.

If any check fails or evidence is missing,
report BLOCKED and stop.

## 2. Review and Stage Issue Files

Identify the files belonging to Issue #$1 using actual Git evidence.

Show:

- Issue-related modified and untracked files.
- Unrelated modified and untracked files.
- Already staged files.

Never use `git add .` or `git add -A`.
Never stage unrelated files or `.workflow/issues/*.json`.

Compare the selected Issue files with the existing staging area.

Ask the user to explicitly approve the exact file selection
and staging operation.

If authorization is denied, report CANCELLED and stop.

After approval:

- If all approved files are already staged, do not run `git add`.
- If approved files are not staged, execute:

```bash
git add -- <approved-files>
```

Only stage explicitly approved paths.

Verify the staging area using the real bash tool:

```bash
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git diff --cached
```

Require:

- Staged changes are not empty.
- Every staged file belongs to Issue #$1.
- Staged files match the approved selection.
- No unrelated files are staged.
- No `.workflow/issues/*.json` files are staged.
- `git diff --cached --check` succeeds.

If any verification fails, report BLOCKED and stop.

## 3. Create Commit

Propose a Conventional Commit message based on the
actual staged changes and Issue requirements.

Choose the appropriate type:
feat, fix, docs, refactor, test or chore.

- Never use placeholder messages.
- Include the Issue number in the commit message.
- Verify that the message accurately describes the staged changes.

Show:

- Exact proposed commit message.
- Complete staged file list.
- Summary of the staged changes.

Ask for explicit user confirmation before committing.

Only after confirmation, execute:

```bash
git commit -m "<approved-message>"
```

If the user declines, report CANCELLED.

Never commit without explicit approval.

## 4. Final Verification

Execute using the actual bash tool:

```bash
git status
git branch --show-current
git log -1 --oneline
git show --stat --oneline HEAD
```

Verify:

- The active branch still belongs to Issue #$1.
- The active branch is not main or master.
- The commit was created successfully.
- The committed files match the approved staged files.
- No unrelated files were committed.
- No `.workflow/issues/*.json` files were committed.

Report:

- Issue number.
- Active branch.
- Commit hash.
- Commit message.
- Committed files.
- Remaining uncommitted changes.

If verification fails, report BLOCKED and preserve
the actual Git state.

## Final State

Report `COMMIT_CREATED` only if:

- The user explicitly approved the commit.
- `git commit` completed successfully.
- The final verification passed.
- The commit belongs to the expected Issue branch.
- The committed files match the approved selection.

If the user declines authorization, report CANCELLED.

If any required check fails, report BLOCKED.

Never execute merge, push, branch deletion .
