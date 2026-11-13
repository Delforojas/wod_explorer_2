---
description: Verify and close a completed GitHub Issue using the local Python script
---

# Close Issue Workflow

Close GitHub Issue **#$1** after verifying that its implementation has been merged and published to `main`.

Use the local script `scripts/close_issue.py`.

Do not implement code, modify application files, stage changes, create commits, merge branches, push or delete branches.

## 1. Execution Rules

- Follow applicable AGENTS.md instructions.
- Use the existing local Python script.
- Do not duplicate its Git or GitHub operations manually.
- Never bypass a BLOCK or failed verification.
- Never force changes to Git or GitHub.
- Never invent verification evidence.
- Keep context and token consumption minimal.

## 2. Verify Preconditions

Confirm that:

- The Issue number is valid.
- `scripts/close_issue.py` exists.
- The repository is accessible.
- No unresolved merge or rebase is in progress.
- The Issue has already been merged and pushed.

If the script is missing or any required condition cannot be verified, STOP.

Do not create missing scripts automatically.

## 3. Execute Local Close Script

Run:

```bash
python3 scripts/close_issue.py $1
```

The script must verify:

1. The active branch is `main`.
2. Local `main` matches `origin/main`.
3. The Issue has exactly one identifiable local branch.
4. That branch is integrated into the published `main`.
5. The Issue exists in GitHub.
6. The Issue is still open.
7. The user explicitly confirms its closure.

Only then may the script close the Issue with:

`gh issue close $1 --repo Delforojas/wod_explorer_2 --reason completed`

Do not execute this GitHub command separately.

If the execution environment does not support interactive input, STOP and ask the user to run `closeissue $1` directly in their terminal.

Never answer confirmation prompts automatically.

## 4. Handle Results

- `ISSUE_CLOSED`: closure was completed.
- `ALREADY_CLOSED`: Issue was already closed.
- `BLOCKED`: a required condition failed.
- `Cancelado`: user declined closure.

Never report success if the script failed or did not finish.

## 5. Final Verification

If the script reports `ISSUE_CLOSED`, verify the remote Issue state using a read-only command:

```bash
gh issue view $1 \
  --repo Delforojas/wod_explorer_2 \
  --json number,state,url
```

If the verification fails, report INCOMPLETE rather than claiming confirmed closure.

## Final Output

Report:

- Issue number.
- Verified Git branch.
- GitHub Issue state.
- Issue URL.
- Closure result.
- Any remaining blockers.

Final state:

ISSUE_CLOSED

Do not perform further Git operations.
