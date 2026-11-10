# Especificación: Persistencia auditable de sesiones y Runtime Version Guard

## Objetivo

Permitir que una sesión activa de `WorkflowController` se recupere de forma
explícita, íntegra y auditable después de reiniciar el servidor MCP, sin
debilitar los gates, los bloqueadores ni las garantías de evidencia. Detectar
además cuando el runtime Python cargado difiere del código del harness en disco
antes de ejecutar una operación que pueda mutar estado o generar evidencia.

## Alcance

- Persistir snapshots completos y versionados del controlador y del ledger de
  evidencia, incluidas evidencias vigentes, invalidadas y superseded,
  decisiones e historial de guards, eventos, bloqueadores y base canónica.
- Crear snapshots de forma atómica y con permisos restrictivos; verificar
  esquema, integridad y contenido antes de restaurarlos.
- Añadir una restauración MCP explícita y controlada que valide identidad de la
  sesión, repositorio, compatibilidad de esquema y código, estado Git y huellas
  de evidencia antes de instalar una sesión restaurada.
- Exponer en `harness_status` los fingerprints del runtime cargado y de los
  módulos relevantes en disco, y si coinciden.
- Bloquear operaciones mutables cuando detecte una divergencia de runtime,
  manteniendo disponibles diagnóstico, exportación histórica y salida segura.
- Registrar en el historial las operaciones de snapshot, restauración,
  reinicio, invalidación y recuperación relevantes; tras restaurar, invalidar
  observaciones mutables que ya no pueden considerarse actuales.
- Documentar ubicación, permisos, retención y protocolo de parada, reinicio y
  reanudación de snapshots.
- Añadir pruebas unitarias e integración para recuperación, corrupción,
  incompatibilidad, discrepancias de versión, invalidación y conservación del
  historial.

## Fuera de alcance

- No se modifica el flujo funcional de la Issue #188 ni se reinicia su sesión.
- No se presenta `export_static` como un mecanismo de restauración.
- No se cambian políticas Git, operaciones de push, merge, cierre de Issues ni
  validación manual.
- No se añaden dependencias externas para serialización, integridad o locking.

## Comportamiento esperado

1. Al iniciar el MCP, el adapter calcula y conserva un fingerprint determinista
   del conjunto de módulos del harness que participan en la sesión.
2. `harness_status` informa la versión cargada, la versión observada en disco y
   el estado de coincidencia sin modificar la sesión.
3. Antes de operaciones que mutan una sesión, crean evidencia o modifican Git,
   el adapter rechaza la ejecución si un módulo relevante cambió en disco desde
   la carga. Las operaciones de diagnóstico y exportación histórica permanecen
   disponibles.
4. Una operación explícita de snapshot escribe un único artefacto versionado de
   modo atómico y con permisos privados. El contenido no incluye secretos y su
   integridad se comprueba con un digest del payload canónico.
5. Una operación explícita de restauración rechaza snapshots ausentes,
   manipulados, corruptos, incompatibles o que no correspondan a la Issue,
   repositorio, runtime o estado Git solicitados. Un rechazo nunca reemplaza la
   sesión activa.
6. Cuando la restauración es válida, el controlador reconstruye el estado y
   conserva su historial. Las observaciones mutables sujetas a cambios de
   proceso o repositorio se invalidan para obligar una nueva observación antes
   de avanzar o ejecutar gates posteriores.
7. El resumen de `export_static` sigue siendo histórico y no permite restaurar
   evidencia mutable ni evadir guards.

## Criterios de aceptación

- Una sesión activa se recupera tras reiniciar MCP cuando snapshot, identidad,
  esquema, runtime y estado Git son compatibles y verificados.
- Un snapshot corrupto, manipulado, ambiguo o incompatible se rechaza con un
  diagnóstico explícito sin alterar una sesión activa.
- `harness_status` diferencia runtime cargado y código vigente en disco e
  informa desajustes.
- Cambios en módulos relevantes, incluido `sdd_manager.py`, bloquean nuevas
  operaciones mutables que usarían una implementación obsoleta.
- Tras una restauración, las evidencias que ya no son vigentes se invalidan y
  deben reobservarse; guards, fases y bloqueadores no se pueden omitir.
- Existen pruebas unitarias e integración para reinicio, restauración,
  incompatibilidad, corrupción, cambios de versión, invalidación y preservación
  del historial.

## Restricciones

- Mantener los contratos actuales de `harness_session_contract.md`,
  `harness_mcp.py` y `workflow_controller.py` salvo extensiones compatibles.
- Conservar una única sesión MCP activa; la restauración no puede sustituirla.
- No persistir secretos ni observaciones protegidas en archivos intermedios
  distintos del snapshot autorizado.
- Usar únicamente la biblioteca estándar de Python y mantener las operaciones
  de diagnóstico sin efectos mutables.
