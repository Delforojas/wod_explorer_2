# Plan técnico

## Enfoque

1. Extender `EvidenceManager` con serialización canónica y restauración validada
   del ledger completo. El formato tendrá una versión de esquema, identidad de
   sesión, payload y digest de integridad; la validación rechazará campos,
   referencias y estados inconsistentes.
2. Añadir a `WorkflowController` exportación e importación explícitas del estado
   completo, incluyendo fase, estado, guards, `guard_history`, historial,
   bloqueadores, flags de commit, eventos y evidencia. La importación validará
   el estado antes de construir el controlador y registrará eventos de
   restauración e invalidación sin avanzar fases.
3. Crear un módulo pequeño de persistencia del harness que resuelva una ruta
   privada bajo el área local del harness, aplique escritura temporal seguida de
   `os.replace`, use permisos `0600`, aplique digest canónico y gestione una
   retención acotada de snapshots de la misma sesión.
4. Incorporar un registro de fingerprint para `harness_mcp.py`,
   `workflow_controller.py`, `evidence_manager.py`, `sdd_manager.py` y las
   dependencias de operaciones cargadas. El adapter comparará el fingerprint
   cargado con el de disco antes de llamadas mutables y lo expondrá en status.
5. Extender el adapter MCP con operaciones explícitas y seguras de snapshot y
   restauración. La restauración verificará que no existe una sesión activa,
   identidad de Issue/workflow/repositorio, schema, fingerprint, digest y una
   observación Git actual antes de instalar el controlador.
6. Actualizar el contrato del harness con ruta, permisos, retención, semántica
   de invalidación y protocolo de parada/reinicio/reanudación.
7. Añadir pruebas focalizadas para serialización, corrupción, incompatibilidad,
   restauración, invalidación, retención y Runtime Version Guard, incluyendo un
   proceso MCP reiniciado con una sesión restaurada.

## Componentes afectados

- `scripts/harness/evidence_manager.py`: snapshots internos y validación de
  integridad del ledger.
- `scripts/harness/workflow_controller.py`: estado persistible, restauración y
  preservación de historial y guards.
- `scripts/harness/harness_mcp.py`: fingerprint de runtime, guard de operaciones
  mutables, status y APIs explícitas de snapshot/restauración.
- Nuevo módulo local bajo `scripts/harness/`: almacenamiento atómico y privado
  de snapshots, sin dependencias externas.
- `scripts/harness/harness_session_contract.md`: protocolo operativo y límites
  de seguridad.
- Pruebas existentes del harness y nuevas pruebas focalizadas de persistencia.

## Estrategia de verificación

- Ejecutar las pruebas unitarias focalizadas de evidence manager, controller y
  adapter MCP durante la implementación.
- Ejecutar el conjunto de pruebas del harness definido por
  `scripts/harness/run-harness-tests.sh` como verificación de la Issue.
- Verificar manualmente el status de runtime y una restauración controlada en
  un repositorio temporal a través de las pruebas de integración, sin alterar la
  sesión de trabajo.

## Riesgos y mitigaciones

- Restaurar datos manipulados: checksum canónico, validación estricta de
  esquema/identidad y rechazo antes de reemplazar cualquier sesión.
- Restaurar observaciones antiguas como actuales: invalidación explícita de
  evidencia mutable y reobservación obligatoria.
- Runtime obsoleto: fingerprint de los módulos relevantes y bloqueo previo a
  operaciones mutables; diagnóstico sigue disponible.
- Exposición de datos: lista permitida de snapshot, permisos restrictivos y
  exclusión de secretos y logs voluminosos.
