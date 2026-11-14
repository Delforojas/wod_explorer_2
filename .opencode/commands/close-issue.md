---
description: Verify and close a published GitHub Issue with explicit user confirmation
agent: git-local
---

# Close Issue Workflow

Close GitHub Issue **#$1** only after verifying that its implementation
has been merged and published to `origin/main`.

This command performs only read-only Git verification and GitHub Issue closure.

Do not execute `scripts/close_issue.py` or any other Python script.

## 1. Execution Rules

- Follow applicable AGENTS.md instructions.
- Never create, rename, switch or delete branches.
- Never modify source files or configuration.
- Never stage files or create commits.
- Never execute merge, pull, push, reset or rebase.
- Never force changes to Git or GitHub.
- Never bypass a BLOCKED result.
- Never invent verification evidence.
- Never approve the closure on behalf of the user.
- Stop immediately if a required verification fails.

## 2. Validate Issue Number

Verify that `$1` is a positive integer.

If invalid, report BLOCKED and stop.

## 3. Verify Git State

Execute:

```bash
git branch --show-current
git status
git ls-files -u
git rev-parse --absolute-git-dir
```

Require:

- Current branch is exactly `main`.
- No unresolved conflicts.
- No merge, rebase, cherry-pick or revert in progress.
- No unrelated tracked or staged changes.

Untracked `.workflow/issues/*.json` files may be ignored
for cleanliness checks.

They must never be modified or staged during verification.

The only permitted deletion is `.workflow/issues/$1.json`
during Step 11, after confirmed GitHub closure.

If any requirement fails, report BLOCKED.

## 4. Verify Published Main

Fetch the latest remote state:

```bash
git fetch origin main
```

Then execute:

```bash
git rev-parse main
git rev-parse origin/main
```

Require both SHA values to be identical.

If different, report:

BLOCKED: main is not synchronized with origin/main.

Do not attempt to resolve synchronization automatically.

## 5. Identify Issue Branch

Execute:

```bash
git for-each-ref --format='%(refname:short)' refs/heads/
```

Identify exactly one local branch matching:

`<prefix>/$1-<slug>`

Rules:

- Do not create branches.
- Do not guess a branch name.
- Do not select the first match automatically.
- If zero or multiple branches match, report BLOCKED.

Record the exact branch name and SHA:

```bash
git rev-parse <issue-branch>
```

## 6. Verify Published Integration

Execute:

```bash
git merge-base --is-ancestor <issue-branch> origin/main
```

Interpret the exit code:

- `0`: Issue branch is integrated into published main.
- `1`: Issue branch is not integrated. Report BLOCKED.
- Any other code: Verification failed. Report BLOCKED.

Do not continue unless the exit code is exactly `0`.

## 7. Verify GitHub Issue

Execute:

```bash
gh issue view $1 \
  --repo Delforojas/wod_explorer_2 \
  --json number,state,url,title
```

Require:

- Issue number matches `$1`.
- Issue exists.
- Issue state is `OPEN`.

If state is `CLOSED`, report ALREADY_CLOSED and stop.

If GitHub cannot be queried, report BLOCKED.

## 8. Request Closure Authorization

Present the verified information:

- Issue number and title.
- GitHub Issue URL.
- Current branch.
- Identified Issue branch.
- Published integration verification.
- SHA of `main` and `origin/main`.

Ask:

"Todas las verificaciones de la Issue #$1 han pasado.
¿Autorizas cerrar esta Issue en GitHub como completada?"

STOP and wait for explicit user confirmation.

Only an affirmative response from the user authorizes closure.

Never infer authorization from previous messages or instructions.

## 9. Execute Closure

After explicit user confirmation, repeat the critical checks:

```bash
git branch --show-current
git fetch origin main
git rev-parse main
git rev-parse origin/main
git merge-base --is-ancestor <issue-branch> origin/main
gh issue view $1 --repo Delforojas/wod_explorer_2 --json state
```

Require all previously verified conditions to remain valid.

If anything changed, report BLOCKED.

Only then execute:

```bash
gh issue close $1 \
  --repo Delforojas/wod_explorer_2 \
  --reason completed
```

If this command fails, report BLOCKED.

## 10. Final Verification

Execute:

```bash
gh issue view $1 \
  --repo Delforojas/wod_explorer_2 \
  --json number,state,url
```

Require state `CLOSED`.

If the result cannot be verified, report INCOMPLETE.

## 11. Cleanup Local Workflow State

Only after GitHub confirms that Issue #$1 is CLOSED,
clean up its local workflow state file.

Target:

`.workflow/issues/$1.json`

Rules:

- Delete only the JSON belonging to Issue #$1.
- Never use wildcards for deletion.
- Never delete JSON files belonging to other Issues.
- Never delete the file before successful GitHub closure.
- Never delete tracked or staged files.
- Never modify Git history.
- Never use `git rm`, `git reset` or `git restore`.
- Cleanup is the only permitted local file modification
  in this workflow.

### 11.1. Check File Existence

Execute:

```bash
test -e ".workflow/issues/$1.json"
```

If the file does not exist:

Report CLEANUP_NOT_NEEDED.

Do not execute deletion.

### 11.2. Verify File Is Not Tracked

If the file exists, execute:

```bash
git ls-files --error-unmatch -- ".workflow/issues/$1.json"
```

If the command exits with code 0:

Report CLEANUP_BLOCKED.

Do not delete the file.

If the command exits with code 1, continue only if
the failure indicates that the path is not tracked.

If verification fails for another reason, report
CLEANUP_BLOCKED.

Also verify that the file has no staged changes.

### 11.3. Delete Issue JSON

Only when the file exists and is confirmed untracked:

```bash
rm -- ".workflow/issues/$1.json"
```

Never substitute a wildcard or another path.

### 11.4. Verify Cleanup

Execute:

```bash
test ! -e ".workflow/issues/$1.json"
```

If verification succeeds:

CLEANUP_COMPLETED

Otherwise:

CLEANUP_BLOCKED

A cleanup failure must not change an already verified
ISSUE_CLOSED result.

## Final Output

Report:

- Issue number.
- Issue URL.
- Verified Issue branch.
- GitHub Issue state.
- Remote integration status.
- Closure result.

Final states:

- `ISSUE_CLOSED`: GitHub confirms closure.
- `ALREADY_CLOSED`: Issue was already closed.
- `BLOCKED`: A required condition failed.
- `CANCELLED`: User declined authorization.
- `INCOMPLETE`: Closure could not be verified.

Never execute additional Git operations after closure.
