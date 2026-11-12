# Technical Plan

## Approach

1. Inspect the existing `/gissue` rules, state schema, contract, command, guards, hooks, agents, and harness modules to identify the smallest shared representation for a selected profile and global outcome.
2. Extend deterministic harness/evidence controls with a profile-aware baseline snapshot and validation of criterion coverage, `NOT_APPLICABLE` provenance, freshness, mutation detection, and no attributable commits.
3. Update the persistent `/gissue` state schema and orchestrator-facing contracts so profile selection, rationale, evidence, reconciliation, and the final `NO_CHANGES` result are represented without inventing commits or branches.
4. Adapt only the `/gissue` phases and guardrails that need alternate treatment. Each skipped mutation must remain explicit, authorized, evidence-bound, and unavailable to the ordinary profile; applicable verification, including `git diff --check`, remains required.
5. Add focused unit and integration tests covering valid existing content, missing coverage, stale or changed snapshots, fake/reverted commits, invalid non-applicability, resumption, and ordinary-flow requirements.
6. Run the harness test suite and static Git validation. Perform a controlled #213 read-only validation only if the implementation exposes a deterministic test path that does not access or mutate its state.

## Affected Components

- `.opencode/gissue-workflow/`: rules, state schema, and contract.
- `.opencode/commands/gissue.md`, applicable guardrails/hooks, and `/gissue` agents.
- `scripts/harness/`: controller, evidence ledger, audit/final verification, Git policy, and tests.
- `specs/218-existing-content-validation/`: the delivery SDD.

## Verification

- `python3 -B -m unittest discover -s scripts/harness/tests -p 'test_*.py'`
- Focused unittest execution for newly added tests while iterating.
- `git diff --check` before review and commit.
- Review the final changed-file manifest to confirm that only Issue #218 paths are staged; preserve the preexisting `/issue` command change and #213 state file.

## Verification Result

- `python3 -B -m unittest scripts.harness.tests.test_existing_content_validation scripts.harness.tests.test_workflow_controller`: PASS (45 tests).
- `python3 -B -m unittest discover -s scripts/harness/tests -p 'test_*.py'`: BLOCKED after 342 tests because the local environment lacks the `mcp` package required by `test_harness_mcp`; no implementation test failure was reported.
- `git diff --check`: PASS.
