# PRODUCT.md — WOD Explorer 2.0

<!-- impeccable:product-schema 1 -->

## 1. Overview

WOD Explorer 2.0 is a CrossFit web application for discovering exercises and WODs, creating personal workouts, recording results, and tracking progress.

**Product goal:** Enable users to find or create a WOD, record their performance, and review their workout history and personal bests.

**Positioning:** A personal workout exploration and tracking tool, not a social network, gym management platform, or competition system.

## 2. Users

### Visitors

- Browse, search, and filter public exercises and system-managed WODs.
- Cannot create WODs, record results, or access private resources.

### Registered Users

In addition to visitor capabilities, they can:

- Create, edit, and delete personal WODs.
- Use existing catalog exercises to build workouts.
- Record multiple attempts for generic or personal WODs.
- Review personal history and best performances.
- Access and manage only their own private resources.

## 3. Core Capabilities

- Public exercise and generic WOD catalogs.
- Search and filtering.
- Private personal WOD management.
- Personal workout result tracking.
- Workout history and personal records derived from results.

These describe product capabilities, not necessarily implemented features. The active spec determines implementation scope.

## 4. Product Constraints

- Generic WODs are public and system-managed.
- Personal WODs and results belong to one user and remain private.
- Exercise order matters; exercises may repeat within a WOD.
- History and personal records must derive from stored results.
- Results must preserve WOD modality semantics.
- Editing or deleting WODs must not invalidate historical results.
- Private resource access must enforce ownership.
- Unresolved domain decisions require explicit specification.

Refer to `DOMAIN.md` for detailed rules and invariants.

## 5. Out of Scope

The current version excludes:

- Communities and gym management.
- Leagues, rankings, and competitions.
- User following or social interactions.
- Comments, reactions, and ratings.
- Publishing or discovering other users' WODs.
- User-managed exercise catalogs.
- Public workout results.
- Training plans and session scheduling.

Do not introduce excluded capabilities without an approved scope change.

## 6. Data and Implementation

- `DOMAIN.md` defines functional domain rules.
- `PROJECT.md` defines the technical stack and configuration.
- MySQL 8.4 is the persistent source of truth after migration.
- Legacy JSON files are not authoritative after the corresponding migration.
- Active specs under `specs/` define implementation requirements.
- Do not present planned features as already implemented.

## 7. Language and Brand

- Official name: WOD Explorer 2.0.
- UI and project documentation: Spanish unless explicitly specified otherwise.
- Domain terminology: WOD, exercise, generic WOD, personal WOD, result, history, personal record.
- No additional brand commitments are currently defined.

## 8. Product Principles

- Prioritize simple workflows for exploring WODs, creating workouts, and recording results.
- Preserve privacy, data ownership, and historical traceability.
- Maintain a single authoritative source for domain data.
- Avoid unnecessary infrastructure, dependencies, and out-of-scope functionality.
- Distinguish planned functionality from implemented functionality.

## 9. Accessibility

Use semantic HTML, keyboard navigation, visible focus, accessible labels, understandable errors, sufficient contrast, and readable interfaces.

Support the screen sizes defined by the project.

No specific WCAG version or conformance level has been established.
