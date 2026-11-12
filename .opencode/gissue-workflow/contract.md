# Subagent Output Contract

Return only this YAML block. Omit optional keys that do not apply.
Maximum 40 lines, plus one line per `static_updates.context` or
`static_updates.manifest` item , plus the handoff block (handoff manual only).

```yaml
status: PASS | FAIL | BLOCKED
phase: <number or range, as requested>
mode: <mode, as requested>
summary: <one line>

evidence:                # observed facts only
  - key: <name>
    value: <value>
    source: <command | file path | MCP call>
    observed_at: <ISO-8601>

static_updates:          # optional: keys to add or replace in state.static
  <key>: <value>
invalidates: []          # optional: state.static keys this phase made obsolete
mutable_updates:         # optional: values re-observed now, with observed_at
  observed_at: <ISO-8601>
  <key>: <value>
mutated: false           # true if this phase changed Git, GitHub, or the working tree

outcome: NO_CHANGES      # existing-content-validation phase 13 only; requires controller evidence
not_applicable:          # optional, profile route only
  - operation: <operation>
    authorized: true
    required_check: false
    reason: <why it does not apply>
    evidence: [<current evidence reference>]

no_change_documentation: # handoff phases only; no remote publication is implied
  outcome: NO_CHANGES
  issue_state: open
  manual_validation: pending
  branch: null
  commit: null
  publication: null

files:                   # optional: files this phase created, modified, deleted, or renamed
  - path: <path>
    change: A | M | D | R

failures:                # FAIL only
  - check: <name | guard condition>
    command: <exact command>          # verification checks only
    kind: failed | incomplete | warning   # verification checks only
+   file: <affected file or SDD section>   # planning failures only
    result: <observed result, summarized>
    cause: <likely root cause, if known>

corrections:             # sdd-writer `fix` only; one per fix applied
  - condition: <failed guard condition>
    file: <SDD file>
    problem: <problem detected>
    correction: <correction applied>

handoff:                 # handoff `manual` only
  summary: <final summary items: Issue/branch, SDD, checks, commit, files, git status, Issue status, limitations>
  manual_validation: |   # markdown checklist (unchecked) or explicit statement that none applies
    - [ ] <task-specific check>

blocker: <condition + evidence>       # BLOCKED only
needs: <minimum intervention>         # BLOCKED only
```
