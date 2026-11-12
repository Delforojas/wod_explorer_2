# Tasks

- [x] Map the current `/gissue` profile, state, phase, evidence, and audit contracts; identify the minimal extension points. Dependencies: none. Check: reviewed implementation and contract tests.
- [x] Implement the explicit disabled-by-default existing-content profile, baseline snapshot, criterion evidence matrix, freshness, protected-path, and attributable-commit controls. Dependencies: contract map. Check: focused positive and negative harness tests.
- [x] Synchronize `/gissue` state, contracts, command/agent/guardrail behavior, including a pre-route authorized `NOT_APPLICABLE` manifest, required applicable verification, and truthful no-change handoff evidence while preserving the ordinary path. Dependencies: profile controls. Check: state/controller and ordinary-flow regression tests.
- [x] Add complete positive, negative, resumption, revert/mutation, and #213 read-only validation coverage. Dependencies: profile and workflow integration. Check: focused tests plus required full unittest suite.
- [x] Run all required verification, synchronize this SDD with completed work, and prepare the Issue-only commit manifest. Dependencies: all implementation tasks. Check: required unittest suite (349 tests) and `git diff --check`.
