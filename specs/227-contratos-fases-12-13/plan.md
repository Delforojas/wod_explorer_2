# Plan: contratos de las fases 12 y 13

## Enfoque

1. Trazar los requisitos de `final_check_contract.md` y `git_policy.final_check` hacia el controlador, el validador de auditoria y el adaptador MCP.
2. Comparar los productores realmente accesibles en fase 12 con la evidencia consumida en fase 13, incluyendo la operacion `record_external` y el action log controlado por el controlador.
3. Usar los tests de `final_check`, `workflow_controller` y `workflow_audit` para diferenciar las garantias comprobadas de los datos simulados.
4. Documentar una matriz de contratos y al menos tres opciones de adaptacion, con recuperacion e idempotencia.
5. Validar solo el contenido documental mediante `git diff --check`.

## Componentes afectados

- Nuevo: `docs/hyssue-phase12-13-contract-analysis.md`.
- Nuevo SDD: `specs/227-contratos-fases-12-13/`.
- Sin cambios en los archivos de produccion del harness.

## Verificacion

- `git diff --check` sobre el arbol de trabajo.
- Revision de alcance para confirmar que solo se agregan el informe y el SDD.
