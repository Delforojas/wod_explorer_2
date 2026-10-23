
# DOMAIN.md — WOD Explorer 2.0

## 1. Purpose and Scope

This document is the **single source of truth for the functional domain** of WOD Explorer 2.0.

It defines business entities, relationships, permissions, behavior, and invariants. It does not define implementation technologies, API contracts, database schemas, or UI architecture.

- `PRODUCT.md`: product vision, users, capabilities, and exclusions.
- `PROJECT.md`: architecture, technology, and infrastructure.
- `DOMAIN.md`: functional business rules and invariants.
- `specs/`: approved implementation requirements.

Do not infer missing business decisions. Resolve conflicts with approved specifications before changing domain behavior.

## 2. Domain Boundaries

The current domain covers:

- System-managed exercise catalog.
- Public, system-managed generic WODs.
- Private, user-owned personal WODs.
- Ordered WOD exercise prescriptions.
- Versioned WOD definitions.
- Private workout attempts and results.
- Personal workout history and personal records.
- User identity and resource ownership.

Social features, competitions, gym management, user-generated exercise catalogs, shared personal WODs, public results, and training schedules are outside the current scope.

## 3. Actors and Access

### Visitor

An unauthenticated visitor may:

- Browse, search, and filter catalog exercises.
- Browse, search, and filter generic WODs.
- View generic WOD details and ordered exercises.

Visitors cannot create WODs, record results, or access private resources.

### Registered User

An authenticated user may additionally:

- Create and manage their own personal WODs.
- Record multiple attempts for generic or owned personal WODs.
- View, correct, and delete their own results.
- Access their own workout history and personal records.

Every private operation must validate ownership using the authenticated identity, not merely a resource identifier.

## 4. Core Entities

### 4.1 User

A user represents a registered account and owns:

- Personal WODs.
- Workout results.
- Derived personal history and records.

Only the minimum identity data necessary for account management is required.

Authentication credentials and session mechanisms are technical concerns, not part of the sporting domain model.

### 4.2 Exercise

An exercise is a system-managed catalog entry.

Conceptual attributes:

- Identifier.
- Name.
- Category.
- Measurement type.

Categories may include weightlifting, gymnastics, strongman, cardio, and other.

Measurement types may include weight, repetitions, time, distance, weight-distance, and other.

Rules:

- Exercises must exist in the catalog before being referenced by a WOD.
- Users cannot create or modify catalog exercises.
- Exercise names must identify catalog entries unambiguously.
- Removing an exercise from a WOD does not delete its catalog entry.

### 4.3 WOD

A WOD is an ordered workout definition composed of one or more catalog exercises.

Two origins are supported:

| Origin | Owner | Visibility | Management |

|---|---|---|---|

| Generic | System | Public | System only |
| Personal | Registered user | Private | Owner only |

Conceptual attributes include:

- Identifier and name.
- Origin and optional user ownership.
- Workout modality.
- Applicable time limit and round count.
- Creation date.
- Ordered exercise prescriptions.
- Version and lifecycle information.

WOD names are **not unique**, including within one user's personal collection.

Difficulty levels are not required by the current domain.

### 4.4 WOD Version

A WOD version preserves a specific workout definition.

Rules:

- Editing a personal WOD creates a new version.
- Results reference the exact version performed.
- Existing results are never reassigned to newer versions.
- Historical versions used by results must remain available.
- A personal WOD with existing results is archived rather than physically deleted.
- Archived WODs do not accept new results.
- Generic WODs remain system-managed.

The exact storage and migration mechanisms are implementation decisions.

### 4.5 WOD Exercise Item

A WOD exercise item associates a catalog exercise with a specific position and prescription in a WOD version.

Its prescription may contain:

- Repetitions.
- Load.
- Distance.
- Duration.

Units:

- Load: kilograms (`kg`).
- Distance: meters (`m`).
- Duration: seconds (`s`).

Rules:

- An available WOD must contain at least one exercise item.
- Exercise order is significant and deterministic.
- The same catalog exercise may occur multiple times at different positions.
- Each item references an existing catalog exercise.
- Items belong to their WOD definition and cannot exist independently.

## 5. Workout Modalities

The supported modalities are `FOR_TIME`, `AMRAP`, and `EMOM`.

Result validation and comparison must respect the modality and the specific WOD version performed.

### 5.1 FOR_TIME

The objective is to complete the prescribed work in the shortest possible time.

**Completed attempt:**

- Records a positive completion time.
- May participate in personal-record comparison.

**Incomplete attempt:**

- Records that the workout was not completed.
- Preserves the applicable time limit and work completed.
- Progress may identify rounds, exercise position, and achieved quantity.
- Does not compete with completed attempts for the fastest-time personal record.

For equivalent completed attempts, **the lowest time wins**.

### 5.2 AMRAP

The objective is to complete as much prescribed work as possible within a fixed time.

A result records:

- Completed rounds.
- Additional repetitions.

Both values must be non-negative.

For comparable attempts:

1. More complete rounds wins.
2. If rounds are equal, more additional repetitions wins.

Comparison is only valid between equivalent WOD definitions and result rules.

### 5.3 EMOM

EMOM stands for *Every Minute On the Minute*.

Its result is binary:

- `COMPLETED`: the prescribed workout was completed.
- `NOT_COMPLETED`: the prescribed workout was not completed.

Rules:

- No partial progress, achieved minute, or repetition breakdown is recorded.
- EMOM results do not generate ranked personal records.
- Multiple EMOM attempts may be recorded.
- Results remain associated with the exact WOD version performed.
- Users may correct or delete their own EMOM results.

## 6. Workout Results

A workout result represents one attempt by one registered user.

Conceptual attributes:

- Identifier.
- Owner.
- WOD and exact version performed.
- Performance date and time.
- Modality-specific result.
- Completion status when applicable.

Business rules:

- Only authenticated users may record results.
- Users may record attempts for generic WODs or their own active personal WODs.
- Multiple attempts for the same WOD are permitted.
- Recording an attempt never replaces previous attempts.
- Users may view, modify, correct, and delete **only their own results**.
- Correcting one attempt must not change other attempts.
- Corrections must preserve ownership, WOD-version association, and modality compatibility.
- Result changes must not retroactively modify the definition of the WOD performed.
- Results are private and cannot be accessed by other users.

Notes are outside the current result model.

## 7. History and Personal Records

### 7.1 Personal History

Workout history is a **derived view** of a user's existing results, not an independently editable domain entity.

It must support chronological access to:

- The WOD performed.
- Performance date.
- Recorded result.
- Generic or personal WOD origin.
- The relevant historical WOD definition.

Search, filters, and sorting must never expose another user's private results.

### 7.2 Personal Records

A personal record is derived from valid, comparable results.

Rules:

- Personal records are not independently created or edited.
- Creating, modifying, or deleting a result must be reflected when records are recalculated.
- Only comparable attempts may compete.
- WODs with identical names are not automatically equivalent.
- Historical version compatibility must be respected.
- `FOR_TIME`: lowest valid completed time.
- `AMRAP`: highest valid rounds and additional repetitions.
- `EMOM`: no ranked personal records.

A personal record must always be traceable to an existing valid attempt.

## 8. Domain Aggregates

### WOD Aggregate

The WOD is the aggregate root for its definition, versions, and ordered exercise composition.

Its consistency responsibilities include:

- Valid ownership and origin.
- Non-empty published composition.
- Valid catalog references.
- Deterministic ordering.
- Version preservation.
- Appropriate active or archived lifecycle.

### Result Aggregate

A result is an independent aggregate associated with:

- One owning user.
- One WOD.
- The exact WOD version performed.

Its consistency responsibilities include:

- Valid modality-specific values.
- Ownership enforcement.
- Historical version integrity.
- Independent modification and deletion of individual attempts.

History and personal records are derived projections, not separate mutable aggregates.

## 9. Domain Invariants

The following conditions must always hold:

1. A personal WOD belongs to exactly one user; a generic WOD is system-managed.
2. Available WODs have at least one valid, ordered exercise item.
3. Every referenced exercise belongs to the catalog.
4. WOD names need not be unique.
5. Every result has an owner, performance date, WOD, and exact version.
6. A result conforms to its workout modality.
7. Users may access or modify only their own private resources.
8. Modifying a WOD never changes the meaning of recorded historical attempts.
9. A WOD with historical results cannot be physically deleted in a way that invalidates them.
10. An archived personal WOD cannot receive new results.
11. Result corrections do not modify other attempts or historical WOD definitions.
12. History and personal records derive from actual stored results.
13. Personal records compare only compatible attempts.
14. EMOM results contain completion status only and have no ranked personal record.

## 10. Search and Filtering

Search and filtering are query capabilities, not independent domain entities.

The exercise catalog supports filtering by name, category, and measurement type.

Generic and personal WOD collections support relevant filtering by name, modality, and origin.

Personal history supports filtering by WOD and date range, with additional modality or origin filters where useful.

Authorization must be applied before returning private resources.

## 11. Pending Domain Decisions

The versioning and historical handling of the **system-managed exercise catalog** remain undecided.

Do not introduce exercise catalog versioning, deletion behavior, or historical compatibility policies without an approved specification.

Other new domain behavior requires an explicit scope decision.

## 12. Domain Terminology

| Term | Meaning |

|---|---|

| Exercise | System-managed catalog movement or activity |
| WOD | Ordered workout definition |
| Generic WOD | Public, system-managed workout |
| Personal WOD | Private workout owned by a registered user |
| WOD Version | Historical snapshot of a specific workout definition |
| WOD Exercise Item | Ordered exercise prescription within a WOD version |
| Result | One user's recorded workout attempt |
| History | Chronological projection of personal attempts |
| Personal Record | Best comparable valid result derived from existing attempts |
| Archived WOD | WOD retained for history but unavailable for new attempts |

Domain decisions take precedence over implementation convenience. When existing code, schemas, or specifications disagree with these rules, report the conflict before making changes.
