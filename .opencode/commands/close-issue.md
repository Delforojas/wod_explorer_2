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

If the Issue state is CLOSED:

- Report ALREADY_CLOSED.
- Do not execute `gh issue close` again.
- Skip closure authorization.
- Continue directly to Step 11 for safe local cleanup.

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

### 11.1. Verify and Clean Local Issue State

Only after GitHub confirms Issue #$1 is CLOSED,
check the exact local file:

`.workflow/issues/$1.json`

Rules:

- Never use wildcards.
- Never modify files belonging to other Issues.
- Never delete tracked or staged files.
- Never use git rm, git reset or git restore.
- Never delete directories.
- Never perform cleanup before confirmed closure.

Execute using the actual bash tool:

```bash
file=".workflow/issues/$1.json"

if [ ! -e "$file" ]; then
    echo "CLEANUP_NOT_NEEDED"
elif git ls-files --error-unmatch -- "$file" \
    >/dev/null 2>&1; then
    echo "CLEANUP_BLOCKED: tracked file"
elif [ -n "$(git ls-files --stage -- "$file")" ]; then
    echo "CLEANUP_BLOCKED: staged file"
elif [ ! -f "$file" ] || [ -L "$file" ]; then
    echo "CLEANUP_BLOCKED: unexpected file type"
else
    rm -- "$file"

    if [ ! -e "$file" ]; then
        echo "CLEANUP_COMPLETED"
    else
        echo "CLEANUP_BLOCKED: deletion failed"
    fi
fi
```

Interpret the actual output.

Never report successful cleanup without real verification.

A cleanup failure must not change an already
verified ISSUE_CLOSED result.

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
