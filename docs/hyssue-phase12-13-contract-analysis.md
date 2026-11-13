# Analisis de contratos entre las fases 12 y 13 de `/hyssue`

## 1. Resumen ejecutivo del fallo y alcance

La incompatibilidad investigada esta demostrada en el codigo actual: la fase 13 exige un evento de auditoria satisfactorio llamado `github-documentation` con el mismo `comment_id` que el comentario de GitHub observado. La unica transicion admitida por el controlador en la fase 12 recibe `github_documentation_evidence` mediante `record_external`. Al registrar esa llamada, `perform()` anota la operacion como `record-external`, no como `github-documentation`.

El comentario se puede publicar mediante una operacion externa del cliente GitHub, pero esa operacion no forma parte de `harness_mcp.py` ni puede producir, de forma controlada por el harness, el recibo y el evento que consume `final_check`. Por ello, una ejecucion que preserve la integridad de la auditoria no puede satisfacer ambos contratos de extremo a extremo. Este diagnostico no prueba que toda ejecucion previa bloqueada haya tenido exactamente esa causa: no se analizaron logs de una sesion real.

El alcance de este documento es analisis y diseno. No cambia codigo, configuracion, contratos, historiales ni guardrails.

## 2. Contratos reales y trazabilidad del flujo actual

### Hechos verificados

1. `scripts/harness/final_check_contract.md` define para la fase 13 una evidencia `documentation` con `status`, `source`, `comment_id`, `body_sha256` y `static_summary` (lineas 107-110). Tambien exige en `actions.events` un `github-documentation` satisfactorio con ese `comment_id` (lineas 111-123).
2. `scripts/harness/workflow_controller.py` asigna a la fase 12 el requisito mutable `github_documentation_evidence` (linea 36). `record_external()` admite esa clave exclusivamente en fase 12 y la trata como evidencia externa (lineas 144-161).
3. El mapa `ALLOWED` no contiene operaciones invocables de fase 12; solo incluye operaciones locales para las fases 3-11 y 13 (lineas 40-50). Por tanto, no existe una operacion controlada del harness que publique o confirme la documentacion.
4. `perform()` convierte toda llamada `record_external` en la operacion de auditoria `record-external`. Aunque agrega un `comment_id` cuando la clave es `github_documentation_evidence`, no renombra el evento (lineas 427-481; en particular 467 y 477-481).
5. `scripts/harness/workflow_audit.py:validate_action_log()` permite tanto `record-external` como `github-documentation`, pero solo comprueba forma, secuencia y lista blanca; no transforma ni acredita la procedencia de un evento (lineas 28-48).
6. `scripts/harness/git_policy.py:final_check()` localiza el comentario mediante `documentation.comment_id`, valida el hash SHA-256 y el bloque JSON, y despues exige un evento distinto llamado `github-documentation` con el mismo identificador (lineas 3073-3108 y 3109-3137).
7. `scripts/harness/harness_mcp.py` solo expone `harness_start`, `harness_status` y `harness_call` (lineas 50-152). No expone publicar comentarios, consultar comentarios ni confirmar una publicacion de GitHub.
8. `.opencode/commands/hyssue.md` ordena actualizar la Issue con el MCP de GitHub y verificar que se publico en la Issue correcta (lineas 2017-2063), pero no especifica una operacion controlada que produzca el recibo ni el evento exigido por fase 13. `.claude/commands/hyssue.md` tiene el mismo SHA-256 en la revision analizada `52fdfca`, por lo que conserva esta misma instruccion.
9. La Issue #220 introdujo el action log controlado y la comprobacion de refs remotas. `docs/hyssue-audit-202.md` describe ese limite residual (lineas 33-44). Eso fundamenta el origen del requisito de auditoria, pero no proporciona una operacion de publicacion de GitHub.

### Flujo observado

```text
Fase 12
  modelo -> GitHub MCP externo -> comentario o actualizacion de Issue
  modelo -> harness_call(record_external, github_documentation_evidence)
            -> controller.evidence mutable
            -> action log: record-external [con comment_id si se proporciono]

Fase 13
  final_check(context.documentation, context.github, action log)
    -> busca comment_id entre comments observados
    -> compara body_sha256 y bloque JSON
    -> exige action log: github-documentation PASS con el mismo comment_id
    -> falla porque el productor real solo registro record-external
```

### Hipotesis y limites no demostrados

- No hay evidencia de una ejecucion real concreta en esta Issue que permita atribuir el bloqueo a un campo diferente de los descritos arriba.
- No se ha verificado aqui el permiso efectivo de la cuenta GitHub para crear comentarios. La herramienta GitHub disponible incluye `github_add_issue_comment`, pero esa disponibilidad no equivale a una operacion dentro de `harness_mcp.py`.
- El action log puede registrar un `comment_id` adjunto a `record-external`, pero no hay codigo que demuestre que ese valor procede de la respuesta de GitHub o que sea autentico.

## 3. Matriz de contratos e incompatibilidades

| Requisito de fase 13 | Fuente real en fase 12 | Requerido vs generado | Operacion responsable | Validacion actual | Resultado | Evidencia de codigo | Cambio necesario |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Evidencia de documentacion | `github_documentation_evidence` mutable | `documentation` requiere `status`, fuente, comentario, hash y resumen; la evidencia externa no tiene esquema local equivalente demostrado | `record_external` | El controlador acepta la clave por fase, no valida el recibo semantico | Incompatible | `workflow_controller.py:36, 144-161`; contrato lineas 107-110 | Definir recibo tipado y validarlo antes de grabarlo |
| `comment_id` | Payload suministrado a `record_external` | Fase 13 lo usa para localizar exactamente un comentario; fase 12 solo lo copia si `status == PASS` | Modelo/GitHub MCP externo y `perform()` | `perform()` lo adjunta a `record-external` | Incompatible en procedencia y nombre de evento | `workflow_controller.py:477-481`; `git_policy.py:3085-3088, 3133-3137` | Obtenerlo de la respuesta de publicacion controlada |
| `body_sha256` | Payload de documentacion | Fase 13 exige SHA-256 del cuerpo realmente observado; no hay productor ni recomputacion controlada en fase 12 | No demostrado | Hash del cuerpo observado en final check | No demostrado | `final_check_contract.md:107-110`; `git_policy.py:3089-3091` | Publicador debe devolver cuerpo canonico y digest; confirmador debe releerlo |
| Bloque JSON estatico | Cuerpo del comentario | Fase 13 exige que `static_summary` sea un objeto de un bloque `json`; fase 12 solo indica persistir resumen | Modelo compone cuerpo; GitHub MCP publica | Parseo estructural en final check | Compatible solo si se publica exactamente; no hay productor controlado | `hyssue.md:2033-2041`; `git_policy.py:3092-3108` | Constructor de cuerpo controlado o validador previo reutilizable |
| Comentario observado | `github.comments` | Debe incluir una sola entrada con el ID solicitado, Issue abierta y observacion vigente | GitHub MCP externo | Final check valida origen, URL, estado, ventana temporal | Compatible si la observacion se suministra fresca; la obtencion no esta integrada | `final_check_contract.md:102-106`; `git_policy.py:3074-3084` | Operacion de confirmacion que normalice respuesta del MCP |
| Action log | `ActionAudit` interno | Secuencia continua desde `issue-start`; requiere `github-documentation` PASS con `comment_id` | `WorkflowController.perform` | `validate_action_log` acepta ambos nombres, final check exige el especifico | Incompatible de secuencia/semantica | `workflow_audit.py:28-48`; `workflow_controller.py:467-481`; `git_policy.py:3110-3137` | Registrar el evento solo tras recibo autentico del publicador |
| Entrega a `final_check` | `context` in-memory | Documentacion, GitHub y auditoria deben estar completas y frescas | `WorkflowController.invoke(final_check)` | Inserta action log del controlador, pero no crea publicacion | Incompatible mientras no exista productor del evento | `workflow_controller.py:226-230`; `git_policy.py:2915-2931` | Introducir transicion explicita publicacion-confirmacion-auditoria |

## 4. Causas raiz demostradas y cuestiones abiertas

### Causas demostradas

- **Desajuste de nombres y semantica de evento.** El controlador registra `record-external`, mientras `final_check` exige `github-documentation`. Ningun adaptador transforma el primero en el segundo.
- **Falta de productor controlado de la evidencia de publicacion.** En fase 12 no hay operacion permitida por `ALLOWED` para publicar, releer y registrar un comentario. El adaptador MCP tampoco expone esa capacidad.
- **Esquema parcial y procedencia no enlazada.** La fase 13 vincula comentario observado, digest, resumen y action log; fase 12 acepta una carga externa sin demostrar ese vinculo.

### Riesgos de estados parciales

- Comentario publicado y timeout antes del recibo: el comentario existe, pero no debe registrarse como `github-documentation` hasta una confirmacion idempotente.
- Recibo confirmado y fallo antes del evento: el estado debe permitir reanudar una confirmacion que detecte el mismo comentario, no publicar otro.
- Doble solicitud: el identificador de idempotencia debe impedir comentarios duplicados o identificar de manera determinista el comentario ya publicado.
- Sesion `BLOCKED`: debe conservar el recibo inmutable y el motivo de bloqueo; no se debe fabricar el evento ni reparar el action log manualmente.

## 5. Alternativas de adaptacion

| Opcion | Cambios por archivo y contrato | Ventajas | Riesgos y coste | Errores y reintentos |
| --- | --- | --- | --- | --- |
| A. Adaptador de documentacion controlado por harness | Anadir una operacion de fase 12 al controlador y una herramienta MCP que invoque un cliente GitHub autorizado. Entrada: resumen estatico y plan manual ya aprobados; salida: recibo `{comment_id, body, body_sha256, issue, repository, published_at, idempotency_key}`. Registrar `github-documentation` solo despues de releer el comentario. Actualizar `harness_mcp.py`, `workflow_controller.py`, `workflow_audit.py`, contrato, comandos y tests. | Conserva la fuente de verdad en GitHub y une publicacion, recibo y auditoria. Superficie semantica clara. | Mayor cambio y gestion segura de permisos/credenciales del proceso MCP. Requiere cliente GitHub fiable. | Buscar primero por clave de idempotencia dentro del bloque JSON; tras timeout, confirmar antes de crear; el evento se emite una vez por recibo confirmado. |
| B. Adaptar fase 13 a evidencia externa firmemente normalizada | Cambiar contrato y `final_check` para aceptar `record-external` mas un recibo normalizado por un limite de confianza externo. `workflow_audit` debe vincular digest, ID y fuente del recibo. | Menos integracion directa del harness con GitHub. | Reduce la confianza si el modelo puede declarar o modificar el recibo; solo es viable con un verificador externo independiente. No es recomendable sin ese limite. | El verificador debe resolver duplicados y devolver el mismo recibo; ante datos incompletos, `FAIL` sin promocionar el evento. |
| C. Separar publicacion, confirmacion y auditoria | Mantener la llamada GitHub externa, pero agregar operaciones controladas distintas: `begin-github-documentation`, `confirm-github-documentation` y `record-github-documentation`. Solo la confirmacion, que consume respuesta/relectura verificable de un cliente de confianza, puede emitir el evento auditado. | Recuperabilidad explicita, transiciones observables y pruebas precisas de cada fallo parcial. Compatible con clientes OpenCode y Claude Code si ambos usan el mismo protocolo. | Mas estados y contratos que A; requiere definir almacenamiento de recibo de sesion y ownership. | `begin` crea clave, `confirm` es idempotente, `record` rechaza un recibo no confirmado; `BLOCKED` preserva el estado de sesion. |

La opcion B se descarta salvo que exista un verificador independiente que el modelo no pueda influir. Tratar un payload del modelo como recibo seria una regresion de autenticidad y contradice la prohibicion de falsificar `comment_id` o `PASS`.

## 6. Recomendacion y adaptacion propuesta

Se recomienda la **opcion A con la separacion interna de confirmacion de la opcion C**: un unico adaptador controlado por el harness, con etapas explicitas de construir, publicar/reutilizar, releer y auditar.

### Responsabilidades y contratos

- `harness_mcp.py`: expone una herramienta de documentacion de fase 12; el modelo no escribe el action log ni suministra `comment_id`.
- Cliente GitHub controlado: publica o encuentra el comentario por clave de idempotencia y devuelve la respuesta remota.
- `workflow_controller.py`: acepta la operacion solo en fase 12, conserva un recibo de sesion y registra `github-documentation` con `comment_id` solo tras confirmacion. `record_external` deja de ser el productor de esta evidencia.
- `workflow_audit.py`: valida el evento con `comment_id` entero y, si se define, digest y clave de idempotencia; no certifica por si solo al cliente remoto.
- `final_check_contract.md` y `git_policy.py`: consumen un recibo con forma exacta y comprueban que ID, cuerpo, digest, bloque JSON y evento coinciden.
- Ambos `hyssue.md`: ordenan invocar la operacion controlada y describen la reanudacion tras timeout, sin pedir al modelo que reconstruya datos.

La entrada debe contener solo evidencia ya aprobada y el contenido documental permitido. La salida debe contener como minimo repositorio, Issue, `comment_id`, cuerpo observado, `body_sha256`, marca temporal, clave de idempotencia y estado de confirmacion. El modelo recibe una copia para decidir el guard, pero no una operacion que edite el registro.

## 7. Plan de implementacion y estrategia de pruebas

1. Definir el recibo y las transiciones de fase 12 en el contrato antes de modificar el codigo.
2. Implementar el adaptador de GitHub con permisos minimos para crear y leer comentarios de la Issue objetivo.
3. Extender el controlador y la auditoria para que el evento se origine exclusivamente despues de una confirmacion valida.
4. Ajustar `final_check` para consumir el recibo nuevo y conservar sus comprobaciones de Issue abierta, hash, bloque JSON y prohibiciones.
5. Sincronizar los comandos de OpenCode y Claude Code desde una unica fuente o verificar identidad byte a byte.

Pruebas necesarias:

- Unitarias de `workflow_audit`: evento valido, evento sin `comment_id`, secuencia duplicada y operaciones no clasificadas.
- Unitarias de controlador: la fase 12 rechaza IDs suministrados por el modelo, registra una sola vez tras confirmacion y mantiene la sesion bloqueada si falta recibo.
- Integracion MCP con cliente GitHub simulado: primera publicacion, repeticion idempotente, timeout despues de publicar, comentario preexistente y fallo de lectura.
- `test_final_check`: transicion realista fase 12 a 13 con recibo controlado; hashes o IDs alterados deben fallar.
- End-to-end por cada CLI: ejecutar una Issue documental temporal hasta `AWAITING_MANUAL_VALIDATION`, confirmar el comentario y el action log, sin push ni `/finish-issue`.

## 8. Riesgos, limites y decisiones pendientes

- Falta decidir el mecanismo de autenticacion y los permisos concretos del cliente GitHub controlado.
- Falta decidir donde vive la clave de idempotencia de la sesion si el proceso MCP se reinicia. No debe escribirse como evidencia protegida a un archivo intermedio sin un contrato de persistencia seguro.
- La observacion de refs remotos sigue siendo un detector de cambios, no prueba de autoria ni de toda ausencia de push, como ya documenta `docs/hyssue-audit-202.md`.
- Debe confirmarse si las herramientas GitHub disponibles ofrecen el detalle completo de comentarios requerido para la relectura en ambos clientes.
- Ninguna alternativa autoriza rebajar guardrails, editar el action log desde el modelo, inventar `comment_id`, ni falsificar `PASS`.
