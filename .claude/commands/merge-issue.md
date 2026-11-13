---
description: Merge and publish a completed Issue with explicit user confirmation
---

# Merge Issue Workflow

Integrate GitHub Issue **#$1** into `main` and publish it.

This command must ask for explicit user confirmation before
the merge and before the push.

Do not use `scripts/merge_issue.py` in this workflow,
because its interactive input() calls are not supported
by the current OpenCode shell execution environment.

## 1. Execution Rules

- Follow applicable AGENTS.md rules.
- Never force push.
- Never reset or discard changes.
- Never bypass failed checks.
- Never approve operations on behalf of the user.
- Never execute merges or pushes without explicit confirmation.
- Do not stage files or create development commits.
- Do not close the GitHub Issue.
- Stop on unexpected Git states.

## 2. Verify Repository State

Run read-only commands:

```bash
git status
git branch --show-current
git branch --list
```

Verify:

- No unresolved conflicts exist.
- No merge or rebase is pending.
- The Issue has a dedicated committed branch.
- No unrelated tracked or staged changes exist.
- The branch is not ambiguous.

If any validation fails, STOP.

## 3. Identify Issue Branch

Find the local branch associated with Issue #$1.

Use:

```bash
git for-each-ref --format='%(refname:short)' refs/heads/
```

Require exactly one branch whose name matches:

`<prefix>/$1-<slug>`

Do not guess branch names.

If multiple branches match, STOP.

Record the actual branch name and HEAD SHA.

## 4. Update Main

Show the current branch and ask:

"Voy a cambiar a main y actualizarla desde origin/main. ¿Autorizas esta operación?"

Continue only after explicit confirmation.

Execute:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, STOP.

## 5. Review Pending Integration

Run:

```bash
git status
git log --oneline main..<issue-branch>
git diff --stat main...<issue-branch>
```

Verify that the Issue branch has commits to integrate.

Check whether it is already merged:

```bash
git merge-base --is-ancestor <issue-branch> main
```

If already merged, do not repeat the merge.

If not merged, show the actual commits and changed files.

Ask:

"¿Autorizas integrar la rama <issue-branch> en main?"

Continue only after explicit confirmation.

## 6. Execute Merge

Run:

```bash
git merge --no-ff --no-edit <issue-branch>
```

If conflicts occur, STOP and preserve Git state.

Do not automatically resolve conflicts.

After a successful merge, verify:

```bash
git status
git log --oneline -3
```

## 7. Confirm Publication

Before pushing, check:

```bash
git status
git log --oneline origin/main..main
```

Show every commit that would be published.

Ask:

"Estos son los commits pendientes de publicar en GitHub. ¿Autorizas git push origin main?"

Continue only after explicit confirmation.

## 8. Publish Main

Execute:

```bash
git push origin main
```

Then verify:

```bash
git fetch origin main
git status
git rev-parse main
git rev-parse origin/main
```

Require `main` and `origin/main` to have the same commit SHA.

## Final Output

When all checks pass:

MERGE_PUBLISHED

Report:

- Issue number.
- Integrated branch.
- Merge commit.
- Published commits.
- Remote synchronization status.

If the merge completed without push:

MERGED_LOCALLY

If any required operation fails:

BLOCKED

Never delete branches or close GitHub Issues.
