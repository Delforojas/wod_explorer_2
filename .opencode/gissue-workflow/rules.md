# Gissue Workflow — Shared Rules

Every `/gissue` subagent reads this file first. It replaces section 0 of the
former monolithic `/gissue` command.

## Authority

- The GitHub Issue defines requirements.
- `DOMAIN.md`, `PROJECT.md`, and approved specifications govern their
  respective areas.
- Follow the root `AGENTS.md` and the specialized `AGENTS.md` files listed in
  `static.context` of the state file.

## Execution

- Do only the phase and mode you were given.
- Load a `guardarails/`, `hooks/`, or `loops/` file only when your mode lists it.
- Markdown hooks are procedures to follow and verify, not executable programs.
- Read static context from the paths recorded in `static.context`. Do not
  rediscover or reread context that is already recorded and unchanged.
- Never invent requirements, results, commands, decisions, or files.
- Never discard, overwrite, stash, or include unrelated work.
- Never push, merge, rebase, force-push, or rewrite Git history.
- Never weaken verification or security controls to reduce token usage.

## Evidence

- Report a value only after observing it. If it was not observed, omit it.
  Never infer it.
- Every evidence item carries its source (command, file path, or MCP call) and
  its observation time.
- `mutable` data is valid only while `mutable.stale` is `false`. If it is
  `true`, or if you mutate Git, GitHub, or the working tree, re-observe the
  affected values before acting on them and report them in `mutable_updates`.

## Status

- `PASS`: every required check of the phase passed.
- `FAIL`: a check failed and the cause is within the Issue scope, so the
  orchestrator can route it to its repair step. Fill `failures`.
- `BLOCKED`: a mandatory guard failed, essential information is missing, or an
  operation requires authorization.

Before returning `BLOCKED`:

1. Stop. Do not start the next operation.
2. Preserve existing changes and collected evidence.
3. Fill `blocker` with the condition and its supporting evidence.
4. Fill `needs` with only the intervention required to continue.

## Guards and Hooks

Guard and hook files were written for a single interactive agent. As a
subagent you never talk to the user directly. Map their instructions:

"Informa al usuario del bloqueo" / "Indica qué fuentes están en conflicto"
→ `blocker`, with the condition and the conflicting sources.
-"Solicita la aclaración / información / decisión necesaria" → `needs`.

- "DETENTE" / "No continúes con las siguientes fases" → return `BLOCKED`
  immediately.

- Guard passed → add an `evidence` item `guard:<name> = PASS`.
- Hook or guard result `FAIL` or `BLOCK` → status `BLOCKED`. Only the
  verification phase uses `FAIL`, and only for repairable check failures.
- Observations produced by hooks (`branch_evidence`, `post_commit_evidence`,
  …) stay inside your invocation. Never write them to files and never return
  them whole: return only the fields the contract lists.

## Output

Return exactly the contract defined in `.opencode/gissue-workflow/contract.md`.
No logs, no prose outside the contract.
