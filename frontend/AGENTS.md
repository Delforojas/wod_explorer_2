# AGENTS.md — Frontend

## 1. Scope

Applies to `frontend/`.

Follow the root `AGENTS.md` for global rules, documentation, safety, and workflow. For cross-area tasks, load the relevant area instructions.

## 2. Stack

- React + TypeScript 5.x
- Vite + npm
- CSS for styling
- Zod for runtime validation
- Vitest for testing
- React native state management
- API base path: `/api`
- UI language: Spanish

Verify versions and dependencies against `PROJECT.md` and the actual configuration.

Do not introduce alternative frameworks, styling systems, or state libraries without an approved architectural need.

## 3. Architecture

The current structure is pages/containers plus views/presentation, with shared
layers. It is not feature-based.

- `src/pages/`: route containers. Own page state, effects, API calls, and
  composition.
- `src/views/`: per-domain presentation, pure presentation modules, and local
  subcomponents. Views receive props and do not import `api/`.
- `src/components/`: shared UI across pages: layout and navigation, auth guard,
  reusable WOD detail and list components.
- `src/api/`: one client per domain. `src/api/client/` centralizes HTTP,
  endpoints, and error handling.
- `src/auth/`: session context, persistence, and expiration.
- `src/schemas/`: Zod schemas and the source of truth for external contracts.
- `src/types/`: TypeScript types and re-exports derived from schemas.
- `src/utils/`: shared pure utilities for requests, guards, scroll, and
  validation.
- `src/styles/`: CSS by responsibility. `src/index.css` is the only entry point;
  its cascade order is documented in `src/styles/README.md`.

Required rules:

- Keep page orchestration in `pages/` and presentation in `views/`.
- Call HTTP only through `src/api/`; never use `fetch` in views or components.
- Import each CSS sheet once from `src/index.css`.
- Extract shared code only when genuinely reused.
- Separate presentation, state, business logic, and data access.
- Avoid unnecessary cross-domain dependencies.
- Do not create empty directories or speculative architecture.
- `src/app/`, `src/features/`, `src/hooks/`, and `src/assets/` do not exist;
  do not add them without an approved architectural decision.

Guidance:

- Prefer component composition over unnecessary abstractions.
- Keep components focused and state close to its consumers.

## 4. TypeScript and Validation

- Preserve the project's type-safety settings.
- Prefer explicit, inferred, and reusable types.
- Never use unsafe casts or assertions to hide type errors.
- Treat external data as untrusted.
- Validate relevant API responses, forms, and external inputs with Zod.
- Prefer `z.infer` over duplicated type definitions.
- Frontend validation never replaces backend validation.

## 5. API Integration

Use the existing `/api` contracts.

- Handle loading, empty, success, and error states.
- Validate external responses when appropriate.
- Keep reusable HTTP logic outside visual components.
- Avoid hardcoded URLs when configuration exists.
- Never invent endpoints, payloads, parameters, or response contracts.
- Never silently modify existing API contracts.
- Enforce authorization and ownership on the backend.

If a required API contract is missing, inspect the active spec and backend definitions. Report unresolved dependencies rather than inventing contracts.

## 6. UI and Styling

Read `DESIGN.md` before visual changes.

- Reuse existing design tokens, CSS variables, and components.
- Follow the existing CSS architecture.
- Maintain mobile-first responsive behavior.
- Verify relevant mobile, tablet, and desktop layouts.
- Avoid unnecessary styling frameworks, global tokens, or visual patterns.
- Use the `21st` MCP when external design references are useful.
- Adapt external proposals to the existing design system.

Do not introduce fundamental visual-system changes without authorization.

## 7. Accessibility

- Use semantic HTML and native interactive elements.
- Support keyboard navigation and visible focus.
- Associate labels with form controls.
- Maintain sufficient contrast and heading hierarchy.
- Use buttons for actions and links for navigation.
- Provide accessible feedback for loading, errors, and form validation.
- Use ARIA only when native semantics are insufficient.
- Never rely on color alone to communicate essential information.

## 8. State and Performance

- Prefer `useState` for simple local state.
- Use `useReducer` for complex local transitions.
- Use Context only when shared state justifies it.
- Avoid duplicated or unnecessarily elevated state.
- Derive values instead of storing redundant state.
- Keep server data distinct from UI state.
- Avoid redundant requests and unnecessary renders.
- Measure performance issues before introducing memoization, caching, or complex optimizations.

## 9. Testing

Use Vitest and the project's existing testing infrastructure.

- Test observable user behavior, not implementation details.
- Cover relevant interactions, validation, forms, navigation, API states, and accessibility.
- Mock only necessary dependencies.
- Update existing tests only when approved requirements change.
- Never disable or weaken tests to hide failures.

## 10. Commands and Verification

Run commands from the appropriate frontend directory.

- Install: `npm install`
- Development: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`

Verify scripts in `package.json` before execution.

Before completion:

1. Review the changed files and affected contracts.
2. Run applicable lint, tests, type checks, and build.
3. Validate responsive behavior and accessibility for UI changes.
4. Verify affected loading, empty, success, and error states.
5. Report failures and skipped checks.
6. Follow the root agent's completion requirements.

## 11. Skills and MCPs

### Skill Selection and Context Loading

Available skills: `.agents/skills/frontend/`

| Skill | Load when |

|---|---|
| `vercel-react-best-practices` | React performance, rendering, optimization |
| `vercel-composition-patterns` | Component composition, architecture, prop design |
| `typescript-advanced-types` | Complex TypeScript types or inference |
| `zod` | Schemas, runtime validation, data contracts |
| `accessibility` | Accessibility, keyboard interaction, ARIA |

Rules:

- Inspect the task and affected code before selecting skills.
- Load skills based on actual need, not technology alone.
- Use no skill when project instructions are sufficient.
- Prefer one skill when sufficient; combine only for distinct needs.
- Verify skill availability before loading.
- For narrowly scoped tasks, prefer selective reads of `SKILL.md` and relevant `rules/` or `references/` files.
- Avoid invoking the skill tool when it unnecessarily embeds complete `AGENTS.md` guides.
- Load complete guides only when comprehensive coverage is required.
- Do not reload guidance already present in context.
- Never sacrifice correctness, security, or accessibility to reduce tokens.

### MCPs

| MCP | Purpose |

|---|---|

| `21st` | Design exploration and UI references |
| `context7` | Current technical documentation |
| `github` | Remote repository information |
| `database` | Database inspection when relevant |

- Use MCPs only when required by the task.
- MCP access does not override project rules.
- Frontend communication must remain API-based.
- Never introduce direct database access from frontend code.

## 12. Frontend Guardrails

Require authorization before:

- Replacing React, CSS, or the existing state architecture.
- Making fundamental changes to the design system.
- Breaking public API contracts.
- Removing existing functionality.
- Performing destructive or cross-area changes outside the approved scope.

Never expose credentials in frontend code, bypass security checks, or suppress TypeScript, lint, test, or build failures.

Follow the root `AGENTS.md` for all other guardrails.
