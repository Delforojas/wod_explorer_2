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

## Mandatory Real Tool Execution

All Git and GitHub CLI commands MUST be executed
using the actual bash tool.

- Never simulate command execution or output.
- Never assume Git or GitHub state.
- Never invent branch names, commits, Issue states or SHAs.
- Never use expected results as verification evidence.
- Never use previous conversation text as current evidence.
- Never proceed while a tool execution is pending.
- Never execute scripts/close_issue.py or closeissue.

A verification is valid only after the actual command
has completed and its output and exit code have been checked.

If bash or gh is unavailable, report BLOCKED and stop.

Only an explicit user confirmation authorizes
the GitHub Issue closure.

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

No staged or unstaged tracked changes are permitted.

Untracked `.workflow/issues/*.json` files do not block verification.

Never modify or delete local files in this workflow.

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
git branch --list "*/$1-*"
```

Require:

- Exactly one matching local branch.
- The branch matches `<prefix>/$1-<slug>`.
- The branch is not `main` or `master`.

If zero or multiple branches match, report BLOCKED and stop.

Record the exact branch name returned by Git.

Execute:

```bash
git rev-parse <issue-branch>
```

Replace `<issue-branch>` with the exact branch name returned by Git.

Require a valid commit SHA.

Never invent, assume or reconstruct branch names.

Never continue without successful branch verification.


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

If the Issue state is CLOSED:

- Report ALREADY_CLOSED.
- Do not execute `gh issue close` again.
- Do not request closure authorization.
- Stop the workflow.

If the Issue state is OPEN:

- Continue to Step 8.
- Require explicit user authorization before closure.

If GitHub verification fails or the state is unexpected:

- Report BLOCKED and stop.

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

- Current branch is exactly main.
- main and origin/main have identical SHA values.
- Issue branch ancestry check returned exit code 0.
- GitHub Issue state is still OPEN.
- The user explicitly authorized closure.

If any condition fails, report BLOCKED.

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
