# PROJECT.md — WOD Explorer 2.0

## 1. Overview

- Product: WOD Explorer 2.0
- Type: Full Stack CrossFit web application
- Features: exercise catalog, WOD exploration, personal WODs, results, and history
- Primary language: Spanish
- Domain rules: `DOMAIN.md`

This document records confirmed technical decisions. Verify actual repository configuration before execution. Never assume pending or undefined values.

## 2. Frontend

| Property | Configuration |

|---|---|
| Framework | React |
| Language | TypeScript 5.x |
| Build | Vite |
| Package manager | npm |
| Architecture | Feature-based |
| Styling | CSS |
| Validation | Zod |
| State | React hooks and Context when needed |
| Testing | Vitest |
| UI language | Spanish |
| API base | `/api` |

- Instructions: `frontend/AGENTS.md`
- Visual design: `DESIGN.md`
- Command source: `frontend/package.json`

### Commands frontend

Run from `frontend/`:

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`

## 3. Backend

| Property | Configuration |

|---|---|

| Language | Java 21 |
| Framework | Spring Boot 3.5.5 |
| Build | Maven Wrapper |
| Architecture | Controller → Service → Repository |
| Persistence | Spring Data JPA / Hibernate |
| Database | MySQL 8.4 |
| Testing | JUnit 5 + Spring Boot Test |
| API base | `/api` |

- Instructions: `backend/AGENTS.md`
- DTOs define API contracts.
- Input validation occurs at application boundaries.
- Business logic belongs in services.

### Commands backend

Run from `backend/`:

- Run: `./mvnw spring-boot:run`
- Validate: `./mvnw -q -DskipTests validate`
- Test: `./mvnw -q test`
- Build: `./mvnw -q package`
- Install/setup command: not yet defined

### Environment

Create `../.env` from `.env.example` and configure the required variables.

For local runs, `application.properties` optionally imports `../.env`.

Maven does not automatically load `.env` files.

Explicitly exported environment variables and Docker Compose-injected variables take precedence.

Required variables:

- `JWT_SECRET`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

These variables must be configured before running the application or tests.

## 4. Database

| Property | Configuration |

|---|---|
| Engine | MySQL 8.4 |
| Database | `wod_explorer_2` |
| Docker service | `mysql` |
| Image | `mysql:8.4` |
| Host port | `${MYSQL_PORT:-3309}` |
| Container port | `3306` |
| Volume | `mysql_data` |
| Initialization | `Docker/mysql/init/NNN_*.sql` |

### Schema and Migrations

- Schema source: `Docker/mysql/init/001_baseline.sql` and subsequent numbered SQL scripts.
- Scripts execute in order when Docker Compose initializes an empty volume.
- Applied scripts must not be modified.
- Existing volumes require an explicit migration procedure.
- No additional migration framework is currently approved.

Database instructions: `Docker/AGENTS.md`.

## 5. Design

- Visual source of truth: `DESIGN.md`
- Design MCP: not configured according to current documented configuration
- Concrete visual reference: pending

Do not assume the `21st` MCP is available without verification.

## 6. MCPs

| MCP | Purpose |

|---|---|
| `database` | Live MySQL inspection |
| `github` | Remote repository, Issues, PRs, Actions |
| `context7` | Current technical documentation |

Verify tool availability before use.

## 7. Sources of Truth

| Responsibility | Source |

|---|---|
| Product | `PRODUCT.md` |
| Domain | `DOMAIN.md` |
| Technical configuration | `PROJECT.md` and actual repository files |
| Visual design | `DESIGN.md` |
| Global agent rules | `AGENTS.md` |
| Frontend instructions | `frontend/AGENTS.md` |
| Backend instructions | `backend/AGENTS.md` |
| Database instructions | `Docker/AGENTS.md` |
| Feature requirements | Active spec under `specs/` |
| Database schema | Versioned SQL scripts under `Docker/mysql/init/` |

## 8. Pending Decisions

- Backend installation/setup command
- Concrete visual reference
- Design MCP configuration

Resolve pending decisions only when required by an approved task. Never invent missing configuration.
