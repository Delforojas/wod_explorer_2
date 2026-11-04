# SDD: Extraer useMyWods manteniendo los flujos actuales

## Contexto

La auditoría #157 detectó `frontend/src/pages/MyWodsPage.tsx` (~341 líneas) que combina fetch, edición, borrado y guards. La issue #159 aporta primero pruebas de comportamiento para proteger estos flujos.

## Objetivo

Extraer la lógica de carga, mutaciones y estados a un hook `useMyWods` (o nombre equivalente consistente con la arquitectura real), conservando exactamente la semántica y UX.

## Alcance

- Analizar los contratos y responsabilidades antes de mover código; no extraer todo ciegamente.
- Mantener `MyWodsPage` centrada en composición/presentación y el hook en datos, efectos y acciones.
- Preservar autenticación, permisos, loading, errores, estados vacíos, edición, borrado y navegación.
- Reutilizar contratos API/Zod actuales; evitar estado duplicado, fetches extra y nuevas dependencias.
- No rediseñar la página ni cambiar los endpoints.

## Fuera de alcance

- Rediseño de la página o cambios funcionales.
- Cambios en endpoints o contratos API/Zod.
- Mezcla con otras issues.

## Comportamiento esperado

- Hook `useMyWods` testeable con límites claros de responsabilidad.
- Sin alteración funcional ni UX.

## Criterios de aceptación

- [ ] Pruebas de #159 pasan sin cambiar sus expectativas de comportamiento.
- [ ] Hook testable con límites claros de responsabilidad; sin alteración funcional.
- [ ] Lint, tests, build, `git diff --check`, y verificación visual aprobados.

## Restricciones

- Detenerse para aprobación del usuario antes de commit, push, PR, merge o cierre.
