---
description: Propose and create a GitHub Issue with existing labels and explicit confirmation
---

# Create GitHub Issue

Create one new GitHub Issue from `$ARGUMENTS` in the current repository.

This command only collects, classifies, confirms, creates, and verifies the
Issue. It must not implement code, create or modify SDD files, create or change
branches, commit, push, close or edit existing Issues, execute `/issue` or
`/finish-issue`, or create labels. Use `gh` for the creation; do not use GitHub
MCP or another write mechanism.

Do not load `/issue`, `/finish-issue`, roadmap procedures, implementation
specifications, hooks, loops, or guardrails unless a specific user-provided
reference is necessary to understand the proposal. A path mentioned in text is
not automatically loaded.

## Canonical Record

Maintain one record for the entire command:

```text
proposal.repository    exact owner/name and repository URL
proposal.title         confirmed Issue title
proposal.body          confirmed Markdown body
proposal.labels        confirmed existing label names
proposal.source_arguments  exact user input used to build the proposal

state.gh_available     verified before proposal preparation
state.gh_authenticated verified before proposal preparation
state.repository_verified  verified before proposal and again before creation
state.confirmation     none, revise, cancelled, or create
state.creation_attempted  false until gh issue create starts
state.created_url      URL returned by gh, when unambiguous
state.verification     pending, verified, failed, or uncertain
```

The record is the only source of truth for the proposal. Any change to title,
body, labels, or repository invalidates the previous confirmation.

## 1. Preflight

Perform read-only checks before preparing or showing the proposal:

1. Require non-empty `$ARGUMENTS`. If it is missing or insufficient to identify
   the requested work, ask for a description and stop until one is provided.
2. Confirm that the current directory belongs to a valid Git repository. Use
   read-only Git inspection such as `git rev-parse --show-toplevel`.
3. Confirm that `gh` is available and authenticated with `gh auth status`.
4. Resolve the GitHub repository unambiguously with `gh repo view`, and record
   its exact `owner/name` and URL in `proposal.repository`.
5. Obtain a complete structured snapshot of existing labels, including names
   and descriptions. Use `gh label list --json name,description --limit <limit>`
   with an explicit limit. Treat the result as complete only when it returns
   fewer entries than the limit. If it reaches the limit, use supported
   pagination or repeat with a larger explicit limit until exhaustion is
   proven. If the CLI cannot prove that all labels were returned, stop. An
   empty label set is valid.

If any preflight check fails, report the observed failure and stop. Do not use a
different write mechanism or continue to proposal confirmation.

## 2. Proposal

Set `proposal.source_arguments` to the exact user input. Derive only information
clearly supported by that input and the verified repository context:

- title;
- objective;
- context;
- requirements;
- observable acceptance criteria;
- references explicitly supplied by the user or necessary to understand the request.

Do not invent functional decisions, requirements, technical constraints,
references, acceptance criteria, or implementation plans. Acceptance criteria
must describe observable results, not implementation tasks.

Ask only for information that is essential or whose ambiguity could materially
change the Issue scope. Do not ask for information that can be inferred safely.

Build `proposal.body` from the collected information using this exact structure:

~~~markdown
## Objective

<problem to solve or result to achieve>

## Context

<information needed to understand the request>

## Requirements

- <required behavior, capability, or constraint>

## Acceptance Criteria

- [ ] <observable and verifiable result>

## References

- <user-provided reference, or omit this section when none exists>
~~~

If a user-provided external reference must be read, load only that reference
and only the relevant portion. Do not expand the command into project analysis.

## 3. Classification

Classify `proposal.labels` using only the preflight label snapshot.

- Select only labels that exist and are justified by the actual Issue scope.
- Use a label's name and description, not the mere presence of its technology or area in the project.
- Use multiple labels only when each represents a distinct real dimension of the work.
- Do not invent, create, modify, substitute, or silently normalize labels.
- Do not apply a label whose meaning is materially ambiguous.

If no existing label represents a category, record that information for the
proposal and continue without a substitute. No labels is valid.

## 4. Confirmation

Before any Issue creation, show the complete canonical proposal:

- exact repository `owner/name` and URL;
- exact title;
- exact Markdown body;
- exact labels, or `none`;
- the requested source description when useful to explain the result.

State clearly that the Issue has not been created. Use an interactive question
with these distinct choices:

- `Create Issue`;
- `Review proposal`;
- `Cancel`.

Do not interpret comments, partial approval, silence, or ambiguous text as
authorization. Only the explicit `Create Issue` choice authorizes the creation
attempt for the complete displayed proposal.

### Review

If the user selects `Review proposal`, ask only for requested changes. Preserve
all unmodified fields, update the canonical record, show the complete proposal
again, and reset `state.confirmation` to `none`. A changed proposal requires a
new explicit `Create Issue` choice.

### Cancel

If the user selects `Cancel`, set `state.confirmation` to `cancelled`, report
that no Issue was created, and end the command without any write operation.

## 5. Creation

Proceed only when the user explicitly selected `Create Issue` for the current
canonical proposal.

Before the write, perform read-only revalidation:

1. Re-run `gh repo view` and compare its exact `owner/name` and URL with
   `proposal.repository`.
2. Confirm that title, body, labels, and `source_arguments` still equal the
   confirmed record.
3. Re-read the complete structured label snapshot using the same limit or
   pagination strategy and confirm that every confirmed label still exists. If
   the repository or label snapshot changed, invalidate the confirmation,
   update the proposal, show it again, and require a new explicit confirmation.

Set `state.creation_attempted` to `true` immediately before starting the only
allowed creation attempt. Never reset it or retry creation after any result.

Invoke `gh issue create` exactly once with an argument list, not a concatenated
shell string:

- pass the confirmed title as one quoted argument to `--title`;
- write the confirmed body to a securely created temporary body file and pass
  that path to `--body-file`;
- pass one separately quoted `--label` argument for each confirmed label; never
  concatenate labels into one string, shell fragment, or unescaped interpolation;
- omit `--label` when the confirmed label set is empty;
- do not pass assignees, projects, milestones, or other unconfirmed metadata.

Do not use `eval`, `sh -c`, unquoted interpolation, command substitution on
user content, or a second creation mechanism. Remove the temporary body file
after the attempt and retain `proposal.body` in the canonical record.

If `gh` is unavailable, authentication fails, revalidation fails, or the
creation command returns an ordinary error, report the error and stop. Do not
claim success and do not retry.

## 6. Verification And Result

Capture only the URL returned by `gh issue create`; do not construct or guess a
number, URL, or identifier. If the output does not identify one Issue safely,
set `state.verification` to `uncertain` and perform only read-only checks that
can resolve the result without creating or editing anything. Never create a
second Issue to resolve uncertainty.

When a safe URL is available, run `gh issue view` for that Issue and verify:

- repository and Issue identity;
- Issue number and URL;
- exact title;
- body exactly equal to `proposal.body` after normalizing CRLF and CR to LF on
  both values; any other difference is a verification failure;
- final label set exactly matching `proposal.labels`.

If verification fails or any field differs, report the observed discrepancy and
do not edit the Issue automatically. A created but unverified or mismatched
Issue must not be reported as successfully completed.

Set `state.verification` to `verified` only after all required fields match.
Then show only:

- Issue number;
- title;
- labels, or `none`;
- URL;
- confirmation that the Issue was created and verified.

If creation failed or remains uncertain, report the error or uncertainty and do
not show a successful-creation summary. End the command in every case. Do not
execute `/issue`, `/finish-issue`, or any later workflow.

## Failure And Safety Policy

- One creation attempt maximum.
- No GitHub MCP or alternate write mechanism.
- No edits, closures, labels, projects, milestones, assignees, branches, commits, push, or SDD changes.
- Preserve unrelated local work and perform only the read-only Git checks required by preflight.
- Never invent or infer unverified GitHub data.
- Never continue after failed preflight, failed confirmation, failed revalidation, failed creation, or failed verification.
