# Plan: registro de auditoría de acciones del harness

## Enfoque técnico

1. Caracterizar `git_policy.final_check` mediante una prueba diagnóstica que
   construya el contexto mínimo con un registro válido y capture sus inventarios
   `checks` y `failures`.
2. Incorporar un componente interno y de solo escritura para el controlador:
   inicializa `issue-start`, asigna secuencias y registra el resultado de cada
   llamada manejada por el MCP. El estado expuesto es una copia de solo lectura.
3. Integrar el registro en la invocación de `final_check` desde el controlador
   y validar su estructura antes de confiar en ella. Extraer `commit_sha` y
   `comment_id` solo de evidencia satisfactoria ya registrada.
4. Capturar las referencias de `origin` en el inicio y al acercarse a la fase
   final. Comparar ambas observaciones para bloquear una publicación remota que
   haya movido una referencia. Documentar que no prueba autoría ni eventos fuera
   de las referencias observables.
5. Extender pruebas unitarias y de integración MCP, actualizar la documentación
   del contrato y sincronizar ambos comandos `hyssue.md`.

## Componentes afectados

- `scripts/harness/workflow_controller.py`
- `scripts/harness/harness_mcp.py` si necesita preservar el límite MCP
- `scripts/harness/workflow_audit.py`
- `scripts/harness/git_policy.py` y pruebas de `final_check`
- `scripts/harness/tests/`
- `scripts/harness/final_check_contract.md`
- `docs/hyssue-audit-202.md`
- `.opencode/commands/hyssue.md`
- `.claude/commands/hyssue.md`

## Estrategia de verificación

- Ejecutar las pruebas nuevas y afectadas de auditoría, controlador, MCP y
  `final_check`.
- Ejecutar la suite completa `scripts/harness/tests/`.
- Comparar byte a byte los dos comandos `hyssue.md`.
- Ejecutar el chequeo de espacios Git y la validación estructural SDD.

## Riesgos

- Un registro visible que el llamador pueda reemplazar no aporta procedencia;
  la integración debe tomar el registro directamente del estado privado del
  controlador.
- Comparar referencias remotas detecta cambios, pero no puede atribuirlos a una
  acción local concreta ni cubrir ramas no observadas; el contrato debe declarar
  esa limitación.
