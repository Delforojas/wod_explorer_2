# AGENTS.md — WOD Explorer 2

## 1. Purpose

WOD Explorer is a Full Stack application for exploring CrossFit exercises and WODs, recording results, and tracking user progress.

This file defines global rules and routes agents to task-specific context.

`PROJECT.md` and the actual repository configuration determine the stack, versions, tools, and available commands.

## 2. Context Routing

Identify the task scope before loading additional documentation.

| Area | Instructions |

|---|---|
| Frontend, UI, UX | `frontend/AGENTS.md` |
| Backend, APIs, authentication | `backend/AGENTS.md` |
| Database, migrations, MySQL infrastructure | `Docker/AGENTS.md` |

- Read only the area instructions relevant to the task.
- For cross-area tasks, read every applicable agent file.
- If a referenced file is missing, do not invent its rules.
- Verify actual project configuration before running commands.

## 3. Documentation

Load documentation according to task relevance:

- `docs/constitution.md`: global principles for project changes.
- `specs/`: active spec when implementing features or executing tasks.
- `PRODUCT.md`: product goals and constraints when relevant.
- `DOMAIN.md`: domain rules; required for domain or persistence changes.
- `DESIGN.md`: visual decisions for UI or UX changes.
- `PROJECT.md`: technical configuration, versions, tools, and commands.
- `.agents/skills/`: task-relevant skills only.

Do not load unrelated specs, skills, or documentation.

Do not modify `DOMAIN.md` without an explicit request. Respect the repository's rules for editing `specs/`.

## 4. Implementation Rules

- Stay within the authorized scope and existing architecture.
- Avoid unnecessary features, dependencies, abstractions, or infrastructure.
- Do not change major versions or fundamental architectural decisions without authorization.
- Separate presentation, business logic, persistence, and infrastructure responsibilities.
- Validate data at appropriate application boundaries.
- Avoid duplicate sources of truth.
- Do not change schemas, models, or migrations outside the authorized scope.
- Avoid unrelated refactoring.

## 5. Skills and Tools

- Use only skills relevant to the task.
- Skills provide technical guidance, not new requirements.
- Use `context7` when up-to-date technical documentation is necessary.
- Use the `database` MCP when live MySQL verification is needed.
- Use local Git for local operations and the `github` MCP for relevant remote operations.
- Never assume documented state matches actual state.

## 6. Safety

Request authorization before destructive changes, modifying secrets, overwriting unclear existing work, or making fundamental changes outside the approved scope.

Never:

- Commit real secrets or credentials.
- Disable tests, validation, or security controls to hide failures.
- Ignore known errors.
- Perform Git or GitHub write operations unless explicitly authorized or permitted by the active workflow.

## 7. Verification and Reporting

After completing work:

1. Run applicable checks defined by the affected area instructions and actual project configuration.
2. Do not invent commands or skip mandatory checks.
3. Report changed files and executed checks.
4. Disclose failures, skipped checks, and unmet requirements.
5. Do not claim implementation is complete when mandatory checks fail.

## 8. Instruction Conflicts

Follow higher-priority environment instructions first, then applicable project rules.

Within project documentation:

- The constitution defines global principles.
- The active spec defines scope and requirements.
- `PRODUCT.md` and `DOMAIN.md` define product and domain decisions.
- Area-specific agents define technical conventions.
- `DESIGN.md` defines applicable visual decisions.
- Skills provide specialized guidance.

No technical instruction or skill may override requirements or expand the approved scope.

If a conflict cannot be resolved, report it before making the affected change.

## 9. Language

- Write agent instructions and technical identifiers in English.
- Preserve the language of existing project documentation.
- Communicate with the user in Spanish unless requested otherwise.
