---
description: Merge and publish a completed GitHub Issue using the local Python harness
---

# Merge Issue Workflow

Merge GitHub Issue **#$1** into `main` using the local Python script.

This command performs only the final integration of an already committed Issue.

Do not implement code, modify application files, create SDDs, stage changes, create development commits, or close GitHub Issues.

## 1. Execution Rules

- Follow the applicable `AGENTS.md` instructions.
- Use the existing local script `scripts/merge_issue.py`.
- Do not duplicate its Git operations manually.
- Never bypass a BLOCK or failed Git command.
- Do not force Git operations.
- Never discard local changes.
- Do not invent verification results.
- Keep context and token consumption minimal.

## 2. Verify Preconditions

Before executing the script, check:

- Issue number is valid.
- `scripts/merge_issue.py` exists.
- `/dev-issue $1` completed with `READY_FOR_STAGING`.
- The Issue has a committed implementation.
- No unresolved Git conflicts exist.
- No merge or rebase is pending.

If preparation cannot be verified, report BLOCKED.

Do not automatically repeat development or verification phases.

## 3. Execute Local Merge Script

Run exactly:

```bash
python3 scripts/merge_issue.py $1
```

The Python script is responsible for:

1. Detecting the current branch.
2. Identifying the Issue branch.
3. Checking Git status.
4. Switching to `main`.
5. Updating `main` with `git pull --ff-only origin main`.
6. Checking whether the Issue is already merged.
7. Showing pending commits.
8. Requesting explicit confirmation before the merge.
9. Executing `git merge --no-ff --no-edit`.
10. Showing Git status and recent commits.
11. Requesting explicit confirmation before push.
12. Executing `git push origin main` once.

Do not independently run these Git commands.

If the script requests user input, preserve the interactive confirmation process.

If the execution environment cannot support interactive input, STOP and instruct the user to run `missue $1` directly in the terminal.

Never automatically answer confirmation prompts.

## 4. Handle Failures

If the script returns an error:

- Stop immediately.
- Preserve the current repository state.
- Report the exact error.
- Do not retry merges automatically.
- Do not run `git reset --hard`, force push, rebase or conflict resolution without authorization.

A failed merge must never be reported as successful.

## 5. Final Verification

After the script reports success, run read-only checks:

```bash
git branch --show-current
git status
git log --oneline -3
```

Verify:

- Active branch is `main`.
- Issue branch was integrated.
- No merge operation remains pending.
- The push was successfully completed.
- No unrelated work was discarded.

Do not interpret `MERGED_LOCALLY` as `MERGE_PUBLISHED`.

## Final Output

If the script reports successful integration and publication:

MERGE_PUBLISHED

Report:

- Issue number.
- Integrated branch.
- Merge commit hash.
- Target branch: main.
- Push status.
- Remaining local files or warnings.

If the merge completed but the push was not performed:

MERGED_LOCALLY

If any mandatory condition fails:

BLOCKED

Do not delete branches or close GitHub Issues.
