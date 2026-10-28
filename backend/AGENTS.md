# AGENTS.md — Backend

## 1. Scope

Applies to `backend/`.

Follow the root `AGENTS.md` for global rules, documentation, safety, and workflow.

For database schema, migrations, or infrastructure changes, also consult `Docker/AGENTS.md`.

## 2. Stack

- Java 21
- Spring Boot 3.5.5
- Maven Wrapper
- Spring Data JPA / Hibernate
- MySQL 8.4
- JUnit 5 + Spring Boot Test
- API base path: `/api`

`PROJECT.md`, `pom.xml`, and the actual repository configuration determine installed versions and dependencies.

Use the project's Maven Wrapper. Do not assume global Maven or unconfigured dependencies.

## 3. Architecture

Follow the existing layered architecture:

Controller → Service → Repository → JPA/Hibernate → MySQL

Responsibilities:

- **Controller:** HTTP requests, input validation, response DTOs, status codes.
- **Service:** business rules, use cases, orchestration, transactions.
- **Repository:** persistence operations and database queries.
- **Entity:** internal persistence representation.
- **DTO:** explicit API request and response contracts.
- **Mapper:** entity/DTO transformations when necessary.

Rules:

- Keep business logic out of controllers and repositories.
- Do not expose sensitive or internal entity fields through APIs.
- Prefer explicit DTOs over exposing JPA entities directly.
- Use constructor-based dependency injection.
- Favor simple, readable Java code and standard Spring mechanisms.
- Avoid unnecessary architectural layers or abstractions.
- Do not introduce CQRS, hexagonal architecture, or other architectural patterns without authorization.

## 4. Persistence and Domain Rules

- `DOMAIN.md` is the source of truth for functional
  entities, ownership, WOD versioning, and result semantics.
- `Docker/AGENTS.md` defines database and migration guardrails.
- `PROJECT.md` defines the approved persistence stack.
- Follow the active spec for implementation scope.

- Enforce resource ownership in backend operations.
- Allow users to create and delete only their own results; results are immutable after creation.
- Preserve the exact WOD version associated with each result.
- Validate FOR_TIME, AMRAP, and EMOM results against DOMAIN.md.
- Do not calculate ranked personal records for EMOM.
- Never change historical WOD definitions or stored results after creation.
- Do not use Hibernate schema generation as a replacement
  for the approved migration strategy.
- Inspect the existing schema before making persistence changes.

## 5. REST API

Use the existing `/api` conventions.

- Apply appropriate HTTP methods and status codes.
- Validate request data at application boundaries.
- Keep response contracts explicit and consistent.
- Use centralized exception handling when appropriate.
- Never expose stack traces, credentials, or internal implementation details.
- Do not swallow exceptions or report failed operations as successful.
- Preserve backward compatibility unless changes are explicitly authorized.

Do not invent endpoints, DTO fields, response structures, or business rules.

## 6. Validation and Security

- Prefer existing Spring validation mechanisms.
- Keep structural validation separate from business rules.
- Never rely exclusively on frontend validation.
- Enforce authentication, authorization, and resource ownership on the backend when applicable.
- Never store plaintext passwords.
- Never return password hashes or expose tokens and secrets.
- Use appropriate password hashing when required.
- Apply least-privilege access.
- Never bypass security mechanisms to make tests pass.

Do not introduce authentication mechanisms, JWT, OAuth2, roles, or additional security infrastructure unless required by the approved scope.

## 7. Testing

Use JUnit 5 and Spring Boot Test.

- Add tests proportional to the change.
- Prioritize business rules, API contracts, validation, security, and persistence behavior.
- Keep unit tests independent of external infrastructure where practical.
- Use integration tests when interactions with Spring or MySQL matter.
- Test observable behavior rather than implementation details.
- Do not remove, disable, or weaken tests to hide failures.

## 8. Build and Verification

Use `./mvnw` from the directory containing the Maven Wrapper.

Before running commands:

- Inspect `pom.xml`, Maven Wrapper, and relevant configuration.
- Verify available Maven goals, profiles, and environment requirements.
- Do not invent commands or assume external services are available.

Before completion:

1. Review changes and architecture compliance.
2. Run applicable compilation, tests, and build checks.
3. Verify affected API contracts and persistence behavior.
4. Check for exposed credentials or sensitive information.
5. Report failures, skipped checks, and unmet requirements.
6. Follow the root agent's completion requirements.

Do not claim completion when mandatory checks fail.

## 9. Skills

Backend skills are located under `.agents/skills/backend/`.

Load only the relevant `SKILL.md` files:

| Skill                      | Use                                                   |
| -------------------------- | ----------------------------------------------------- |
| `java-springboot`          | Java, Spring Boot fundamentals, controllers, services |
| `springboot-patterns`      | REST APIs, DTOs, transactions, architectural patterns |
| `spring-data-jpa`          | Entities, relationships, repositories, queries        |
| `spring-boot-security-jwt` | Authentication, authorization, JWT, security          |

Rules:

- Verify skill availability before use.
- Load only skills relevant to the current task.
- Skills provide guidance, not new requirements.
- Do not introduce technologies or dependencies solely because a skill recommends them.

## 10. MCPs

Use configured tools only when relevant:

- `database`: inspect actual database structures and data.
- `github`: inspect remote Issues, Pull Requests, and repository state.
- `context7`: consult current Java, Spring Boot, and JPA documentation.

Tool availability does not authorize unrelated, destructive, or out-of-scope operations.

## 11. Backend Guardrails

Require authorization before:

- Replacing core backend technologies or architecture.
- Introducing incompatible public API changes.
- Removing endpoints or existing functionality.
- Replacing authentication or authorization mechanisms.
- Modifying sensitive security configuration.
- Performing destructive database operations.

Never expose credentials, disable security controls, suppress compilation errors, or bypass mandatory tests.

Follow the root `AGENTS.md` and applicable database instructions for additional guardrails.
