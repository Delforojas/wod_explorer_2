# Tasks: Estabilización del harness

- [x] T1: Elaborar la matriz de auditoría de las 15 fases y registrar hallazgos, causas y límites comprobados. Dependencia: contexto del Issue. Verificación: revisión de trazabilidad con `hyssue.md` y los módulos del harness.
- [x] T2: Corregir y probar la clasificación de mutaciones de `branch_preparation_evidence`, incluidos casos sin cambios, cambios reales e información incompleta. Dependencia: T1. Verificación: pruebas de `evidence_manager`, política Git y controlador.
- [x] T3: Reforzar y probar la validación de referencias históricas/superseded contra manipulación. Dependencia: T1. Verificación: pruebas negativas de `evidence_manager`.
- [x] T4: Implementar y probar la proyección verificable desde resultados de verificación al árbol final y hashes SDD. Dependencia: T1. Verificación: pruebas del runner, controlador y final check con casos PASS y FAIL.
- [x] T5: Alinear interfaces y contratos de post-commit, sesión y finalización con las operaciones reales sin ocultar límites de auditoría externa. Dependencia: T1. Verificación: pruebas CLI/controlador y revisión de contratos.
- [x] T6: Registrar AC5 como validación posterior obligatoria en la Issue #201, sin ejecutar ni declarar PASS para `/hyssue` o la auditoría externa antes de integrar #202 en `main`. Dependencia: T2, T3, T4, T5. Verificación: #201 existe abierta y este SDD/documentación identifican la dependencia y el límite.

## Validación posterior obligatoria

La ejecución integral de `/hyssue 201` no está aprobada ni completada. Debe
realizarse desde `main` limpio después de integrar #202, conservar evidencia
GitHub y una auditoría externa de acciones completa, y registrar cualquier
bloqueo sin declararlo éxito. Esta obligación se sigue en la Issue #201.
