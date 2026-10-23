# AGENTS.md — Database & Docker

## 1. Scope

Applies to database design, schema, migrations, MySQL persistence, and related Docker infrastructure.

Follow the root `AGENTS.md` for global rules, documentation, safety, and workflow.

For backend changes, also consult `backend/AGENTS.md`.

## 2. Stack and Configuration

- Database: MySQL 8.4
- Infrastructure: Docker Compose
- Database name: `wod_explorer_2`
- Administration: MySQL Workbench
- Database inspection: `database` MCP

`PROJECT.md` and the actual repository configuration define services, ports, volumes, credentials, and migration tooling.

Never reuse configuration from previous projects without verification.

Do not introduce migration tools, ORMs, or infrastructure dependencies without authorization.

## 3. Sources of Truth

- `DOMAIN.md`: domain rules and invariants.
- Active spec: approved task scope and requirements.
- `PROJECT.md`: technical decisions and configuration.
- Existing schema and migrations: implemented database structure.
- Live database: actual deployed state.

Never assume these sources are synchronized.

Inspect relevant sources before schema changes. Report unresolved conflicts or domain decisions rather than inventing requirements.

Legacy databases and diagrams are references, not authoritative specifications.

## 4. Domain and Schema

- Follow `DOMAIN.md` for domain entities, relationships, and invariants.
- Follow the active spec for approved schema changes.
- Use versioned SQL migrations as defined in `PROJECT.md`.
- Preserve ownership, privacy, exercise ordering, WOD versioning,
  modality-specific results, and historical integrity.
- Treat diagrams and legacy schemas as references only.
- Never infer missing domain requirements or database constraints.
- Support owner-authorized result corrections and deletions
- Follow `DOMAIN.md` for modality-specific result fields;
  EMOM records completion status only.

## 5. Schema Design

The initial proposed model includes:

- `users`: account identity and credentials.
- `exercises`: exercise catalog.
- `wods`: WOD identity, ownership, and lifecycle.
- `wod_versions`: versioned WOD definitions.
- `wod_version_items`: ordered exercises and prescriptions.
- `wod_results`: attempts linked to WOD versions.
- `exercise_results`: user exercise results.

This is a proposed model, not an automatically approved schema.

Validate tables, fields, relationships, and result semantics against `DOMAIN.md` and the active spec.

In particular, confirm versioning, modality-specific fields, historical preservation, and the inclusion of `exercise_results` before implementing affected structures.

## 6. Schema Conventions

- Use English `snake_case` for tables and columns.
- Define explicit primary keys.
- Use foreign keys for relationships.
- Support many-to-many relationships through junction tables when appropriate.
- Define nullability, uniqueness, and constraints from approved domain rules.
- Choose `ON DELETE` and `ON UPDATE` behavior deliberately.
- Preserve historical data integrity.
- Avoid unnecessary redundancy.
- Design indexes around real queries and access patterns.
- Verify MySQL 8.4 compatibility.

Do not infer missing constraints from diagrams.

## 7. Schema and Migrations

- Define the authoritative schema and migration strategy in `PROJECT.md`.
- Keep schema changes reproducible and version-controlled.
- Use only the approved migration mechanism.
- Never rely on undocumented manual schema changes.
- Never silently modify applied migrations.
- Use subsequent migrations when existing environments must evolve.
- Keep fresh database initialization consistent with the intended schema.
- Inspect affected data before modifying an existing database.
- Distinguish observed database state from desired schema.

Do not allow Hibernate schema generation to replace the approved migration strategy.

## 8. Database Inspection

Use the `database` MCP when available for tasks involving existing schema, relationships, constraints, migrations, or persistence state.

Before relevant changes:

1. Inspect affected tables, columns, keys, and constraints.
2. Compare the live schema with repository migrations.
3. Identify potential data compatibility issues.

After schema changes, verify the resulting state.

Prefer read-only inspection.

If the MCP is unavailable, report the limitation and use an approved alternative when possible. Never claim live verification without evidence.

MySQL Workbench may support manual inspection but does not imply agent access to the user's session.

## 9. Security and Data Protection

- Never commit real credentials or secrets.
- Keep `.env` excluded from Git.
- Use placeholder values in `.env.example`.
- Never connect the application as MySQL `root`.
- Apply least-privilege database access.
- Avoid exposing personal or sensitive data.
- Confirm the target environment before write operations.
- Establish backup and recovery procedures before risky changes.

Require explicit authorization before:

- `DROP DATABASE`, `DROP TABLE`, or `TRUNCATE`.
- Destructive schema migrations.
- Bulk data deletion.
- Removing persistent Docker volumes.
- Any operation with reasonable risk of irreversible data loss.

Never use the database MCP for undocumented structural changes that should be represented by migrations.

## 10. Skills and Tools

- Inspect the task before selecting skills or technical guidance.
- Do not assume a dedicated MySQL skill is installed.
- Load only relevant skills when available and necessary.
- Prefer targeted documentation over complete guides.
- Avoid unnecessary or repeated context reads.
- Use `database` for relevant live MySQL inspection.
- Use `context7` for version-specific documentation when needed.
- Use `github` for relevant remote repository information.

Skills and external tools do not override domain rules,
approved requirements, or safety constraints.

## 11. Verification

After relevant changes:

1. Verify MySQL connectivity when required.
2. Inspect modified schema objects and constraints.
3. Check relevant queries and data integrity.
4. Verify migration reproducibility and version control.
5. Confirm compatibility with existing data.
6. Report executed checks, failures, and limitations.

Never claim database changes were applied when they were only designed.

Follow the root `AGENTS.md` for final reporting and completion requirements.
