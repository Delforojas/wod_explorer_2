# Existing Content Validation Guard

Pass only when the controller's current `existing_content_validation_evidence`
has `status: PASS` and `outcome: NO_CHANGES`. Confirm the explicit profile
authorization, unchanged baseline/head/tree/index/reflog, protected hashes,
complete current criterion evidence, and an independent semantic review that
covers every criterion. Confirm the pre-route manifest covers phases 3-6 and
8-12 and every entry has authorization, reason, current evidence, and
`required_check: false`. Confirm phase 7 runner evidence passed all applicable
checks, including `git diff --check`; verification itself is never waived.

Any mutation, reverted or attributable commit, missing/stale evidence, failed or
incomplete required check, or invented branch/commit/publication is `BLOCKED`.
This guard is only for the opt-in profile; it cannot waive ordinary workflow
requirements.
