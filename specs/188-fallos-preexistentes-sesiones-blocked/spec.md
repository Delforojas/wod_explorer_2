# Objetivo

Definir e implementar una recuperación segura y auditable de sesiones del
harness que quedan en `BLOCKED` por una operación local o una decisión
semántica, sin convertir resultados fallidos en `PASS` ni permitir que se
salten guardrails.

## Alcance

- Extender el controlador y el registro de evidencias para conservar el
  resultado original de cada operación y decisión de guard.
- Permitir recuperar una sesión en la misma instancia solamente después de una
  repetición oficial exitosa o de una autorización explícita y verificable.
- Definir la clasificación de verificaciones preexistentes y el waiver
  delimitado que puede permitir continuar en fase 7 sin ocultar el `FAIL`.
- Actualizar los contratos del workflow y los tests del harness afectados.

No incluye modificar la utilidad o la prueba flaky de la Issue #186, alterar
manualmente sesiones existentes, ni aceptar waivers retroactivos.

## Comportamiento esperado

Una operación local que devuelve `BLOCK`, `FAIL` o `INCOMPLETE` conserva su
evidencia y un evento de historial inmutable. Si la misma operación se repite
oficialmente y devuelve `PASS`, se elimina solamente su bloqueo técnico. El
controlador puede restaurar `RUNNING` únicamente cuando no quedan bloqueos
técnicos activos, decisiones semánticas `BLOCK` pendientes, acciones
prohibidas, sesiones cerradas ni condiciones de seguridad incumplidas. La
recuperación se registra explícitamente en el historial y nunca avanza de fase
ni aprueba un guardrail por sí sola.

Las decisiones de guard reevaluadas conservan cada versión, incluyendo el
`BLOCK` original y la nueva decisión. Una decisión `PASS` posterior debe poder
restaurar la sesión solo si satisface las condiciones anteriores; no puede
ocultar una decisión pendiente de otro guardrail.

En fase 6, la evidencia de implementación debe reflejar tareas terminadas,
trazabilidad y pruebas específicas. La verificación integral pertenece a fase
7. Si un check integral falla, fase 7 conserva el `FAIL` y solo puede tratarlo
como preexistente tras reproducirlo sobre la base aprobada y la rama con el
mismo comando y entorno, identificar el test, comparar el diff y validar un
waiver humano acotado. Una regresión, evidencia parcial, cambio relevante de
SHA, fallo diferente o check no ejecutado bloquea el workflow.

El incidente reproducido en esta Issue es obligatorio en la cobertura: el
primer `sdd_manager.prepare` sin slug aprobado devuelve `BLOCK`; el reintento
oficial con slug aprobado devuelve `PASS` y crea el SDD. El controlador actual
conserva indebidamente el estado global `BLOCKED`; la solución debe registrar
la recuperación sin perder la evidencia del primer bloqueo.

## Criterios de aceptación

- Los contratos de workflow, guards, controlador, runner y manager describen
  responsabilidades coherentes entre fases 6 y 7.
- Un bloqueo técnico original y sus evidencias permanecen disponibles después
  de una repetición exitosa; el historial contiene un evento de recuperación.
- Una recuperación válida no cambia de fase, no declara un guard `PASS` y solo
  restaura `RUNNING` cuando no hay otros bloqueos ni restricciones activas.
- Una recuperación se rechaza cuando queda otro bloqueo, una decisión
  semántica pendiente, una acción prohibida, una sesión cerrada o evidencia
  inválida.
- Las decisiones de guard sustituidas conservan un historial independiente de
  versiones con sus referencias y razones.
- La política de fallo preexistente mantiene el `FAIL` original, exige
  reproducción comparable y waiver humano específico, con caducidad e
  invalidación ante cambios relevantes.
- Sin waiver válido, ante regresión nueva, diagnóstico ambiguo o ejecución
  incompleta, el workflow permanece bloqueado.
- Existen pruebas automatizadas positivas y negativas para recuperación
  técnica, recuperación rechazada, guard reevaluado, waiver válido, waiver
  ausente o caducado, reproducción insuficiente y pérdida de sesión.
- Se ejecutan las verificaciones configuradas del harness y se revisa el diff.

## Restricciones

- No se crean sesiones sustitutas ni se reconstruyen evidencias protegidas a
  partir de memoria conversacional o archivos intermedios.
- No se modifica directamente el estado interno del controlador.
- Ningún mecanismo de recuperación puede reemplazar la evaluación semántica de
  los guardrails ni autorizar push, merge, cierre de Issue o `/finish-issue`.
- Los waivers son explícitos, de alcance mínimo y no equivalen a un `PASS`.
