# Plan: Estabilización del harness

## Enfoque técnico

1. Completar la matriz de auditoría a partir de `hyssue.md`, el controlador, el ledger de evidencia, la política Git, el runner, el adaptador MCP y sus pruebas.
2. Ajustar la clasificación de `branch_preparation_evidence` para evaluar explícitamente el estado previo/final observado. La evidencia debe incluir los datos mínimos para demostrar que HEAD, índice y árbol no cambiaron cuando corresponde; los datos ausentes bloquean o invalidan.
3. Reforzar la recuperación histórica de evidencia comprobando estrictamente la referencia canónica antes de devolver una versión superseded.
4. Introducir una proyección de verificación final que enlace el resultado real del runner con el árbol que se comprometerá y con los hashes SDD. La proyección debe ser read-only y fallar cerrada si no puede probar la correspondencia.
5. Alinear las interfaces de la fase post-commit y los contratos de sesión/final con las operaciones realmente implementadas, manteniendo explícito que la auditoría de acciones externas no puede inferirse del controlador.
6. Añadir regresiones unitarias y una integración con repositorio temporal que cubra las transiciones y bloqueos modificados. Ejecutar además los checks del harness aplicables y un intento real controlado de `/hyssue` sobre el Issue documental #201, sin declarar como éxito ningún tramo que el entorno no permita automatizar.

## Componentes afectados

- `scripts/harness/evidence_manager.py` y sus pruebas.
- `scripts/harness/workflow_controller.py` y sus pruebas.
- `scripts/harness/git_policy.py` y pruebas de política/finalización.
- `scripts/harness/verification_runner.py` y sus pruebas si requiere la proyección.
- `scripts/harness/harness_mcp.py` y pruebas de transporte cuando la operación nueva se exponga por el controlador.
- `.opencode/commands/hyssue.md` y contratos Markdown del harness.
- `docs/` para el informe de auditoría.

## Verificación

- Ejecutar las pruebas unitarias afectadas y la suite completa de `scripts/harness/tests`.
- Ejecutar comprobación de sintaxis Python sobre los módulos modificados.
- Ejecutar `git diff --check`.
- Registrar el resultado del intento controlado de workflow real, distinguiendo pasos completados de límites del entorno.
- Antes del commit, registrar la dependencia explícita de AC5 en la Issue #201;
  la ejecución real queda fuera de este árbol hasta que la corrección esté en
  `main` y debe conservar su estado pendiente.
