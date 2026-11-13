---
description: Prepare a GitHub Issue locally using Git and GitHub CLI
---

# Prepare Issue

Prepare GitHub Issue **#$1** for the `/dev-issue` workflow.

This command performs only the preparation steps.

Do not implement code, create an SDD, stage files, commit, merge, or push.

## 1. Verify repository state

Run:

```bash
git status --short
git branch --show-current
```

If the working tree is not clean, STOP.

If the current branch is not `main`, ask:

"Estás en la rama `<current-branch>`, no en main. ¿Quieres cambiar a main para preparar la Issue #$1?"

Continue only after explicit confirmation.

## 2. Update main

Run:

```bash
git switch main
git pull --ff-only origin main
```

If either command fails, STOP.

## 3. Prepare Issue branch

Retrieve the Issue title using:

```bash
gh issue view $1 --json title
```

Determine a short, descriptive branch name following repository conventions:

`feat/<issue-number>-<slug>`

Show the proposed branch name and obtain user confirmation.

Check whether the branch already exists.

If it exists, STOP and report the conflict. Never overwrite it.

Create the branch:

```bash
git switch -c <approved-branch-name>
```

## 4. Save Issue locally

Run:

```bash
mkdir -p .workflow/issues
gh issue view $1 --json number,title,body,state > .workflow/issues/$1.json
```

Validate that the Issue was retrieved successfully and that the saved JSON contains the correct Issue number.

Do not overwrite an existing local Issue file without checking its contents and obtaining authorization.

## 5. Final verification

Verify:

- Active branch matches the approved Issue branch.
- The Issue JSON exists and is valid.
- The Issue number matches the requested Issue.
- The working tree has no unexpected changes.
- No commits or pushes were performed.

Report the results.

## Final output

If all checks pass, report:

PREPARED_FOR_DEV_ISSUE

- Issue: #$1
- Branch: <active-branch>
- Local Issue: .workflow/issues/$1.json

Next command:

`/dev-issue $1`

If any mandatory check fails, report BLOCKED and the exact reason.
