# Plan técnico

## Enfoque

Analizar los contratos existentes (props de `MyWodsView`, API `wodsApi`/`exercisesApi`, utils `asyncRequest`, `submissionGuard`, `wodDefinitionValidation`) antes de mover código.

## Estrategia

- Extraer estado, efectos y acciones a un hook `useMyWods` (colocado por patrón de feature como `useAuth`).
- Mantener `MyWodsPage` en composición/presentación y el hook en datos, efectos y acciones.

## Verificación

- Pruebas de #159 (`frontend/src/pages/MyWodsPage.test.tsx`).
- Lint, tests, build, `git diff --check`, revisión visual.
