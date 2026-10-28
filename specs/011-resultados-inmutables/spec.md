# SDD: Contrato de resultados WOD inmutables

## Objetivo

Resolver la contradiccion entre el dominio append-only de los resultados WOD y la
documentacion historica que describia correcciones mediante `PUT`. La politica
vigente sera que un resultado personal no puede modificarse despues de registrarse.

## Decision funcional

- Un resultado WOD es un intento inmutable despues de su creacion.
- La API no ofrece `PUT` ni `PATCH` para resultados WOD.
- Solo el propietario autenticado puede consultar y eliminar sus resultados.
- Cada resultado conserva la referencia exacta a la version historica del WOD
  ejecutado.
- El historial y las mejores marcas se derivan de los resultados almacenados.
  Crear un resultado puede cambiar la mejor marca derivada y eliminarlo puede
  hacer que se derive otra, sin persistir una segunda fuente de verdad.
- Las correcciones de rendimiento se registran como un nuevo intento, no como una
  mutacion del intento existente.

## Contradicciones identificadas

| Fuente | Estado observado | Resolucion |
| --- | --- | --- |
| `DOMAIN.md` y Spec #1 | Ya describian resultados inmutables, pero `DOMAIN.md` aun incluia verbos de modificacion/correccion en reglas relacionadas. | Mantener append-only y retirar las referencias a corregir o modificar resultados. |
| `backend/AGENTS.md` | Indicaba que el usuario podia crear, corregir y eliminar resultados propios. | Sustituir correccion por inmutabilidad y conservar creacion/eliminacion por ownership. |
| `Docker/AGENTS.md` | Indicaba soporte para correcciones autorizadas por propietario. | Alinear la instruccion de persistencia con resultados inmutables. No se cambia el esquema. |
| `specs/005-personal-wod-results/spec.md` y `plan.md` | Describian DTO, endpoint `PUT` y recalculo despues de corregir. | Marcar la decision historica como supersedida por esta Issue y actualizar el contrato vigente. |
| `WodResultUpdateRequest.java` | DTO de correccion sin consumidor. | Eliminarlo porque ya no representa un contrato soportado. |
| `WodResultController.java` y `WodResultService.java` | No contienen actualmente `PUT` ni una operacion de actualizacion. | Mantener la ausencia del endpoint y no introducir una operacion de actualizacion. |
| `WodResultServiceTest.java` | Contenia un test y referencias a `update` y `WodResult.update`, metodos que no existen en la implementacion actual. | Eliminar el test obsoleto y cubrir la ausencia del contrato de edicion, ownership de borrado y derivacion de mejores marcas. |

La Spec #1 se conserva como evidencia de la decision original de inmutabilidad.
La Spec #5 conserva la referencia historica a la politica anterior mediante una
nota de supersesion, pero su contrato vigente queda alineado con esta SDD.

## Alcance

- Actualizar las reglas de dominio y las instrucciones aplicables al backend y a
  la persistencia.
- Alinear el contrato documental de resultados personales con operaciones de
  creacion, consulta, eliminacion e historico derivado.
- Eliminar el DTO de correccion no utilizado.
- Ajustar los tests afectados para que no esperen una operacion de actualizacion
  y cubran ownership, eliminacion y mejores marcas derivadas.

## Comportamiento esperado

### API

- `POST /api/wod-results` registra un nuevo intento.
- `GET /api/wod-results` y `GET /api/wod-results/{id}` consultan resultados propios.
- `DELETE /api/wod-results/{id}` elimina unicamente un resultado propio.
- `GET /api/wod-results/personal-bests` calcula la mejor marca desde resultados
  validos existentes.
- `PUT /api/wod-results/{id}` y `PATCH /api/wod-results/{id}` no existen.

### Integridad historica

La eliminacion no reasigna ni modifica otros resultados y no cambia la version del
WOD asociada a ningun intento. Las mejores marcas no se almacenan como entidad ni
columna derivada; cada consulta usa los resultados actuales y compatibles.

## Criterios de aceptacion

- [ ] Existe una unica politica documentada de resultados inmutables y append-only.
- [ ] `DOMAIN.md`, las instrucciones aplicables y las Specs vigentes no describen
  una correccion de resultados como operacion soportada.
- [ ] La API no expone endpoints `PUT` o `PATCH` para `/api/wod-results/{id}`.
- [ ] El DTO y las referencias de implementacion de correccion no existen.
- [ ] Los tests cubren que solo el propietario puede eliminar, que se conservan
  multiples intentos y que las mejores marcas se derivan de los resultados
  existentes tras una eliminacion.
- [ ] No se crea una segunda fuente persistida para historial o mejores marcas y
  no se modifica el esquema SQL.

## Fuera de alcance y restricciones

- No se implementa interfaz frontend ni nuevos flujos de edicion.
- No se modifican modalidades, versionado del catalogo de ejercicios,
  autenticacion, esquema SQL, migraciones ni dependencias.
- No se reescriben las Specs #1 y #5 para borrar su evidencia historica; los
  cambios documentales deben identificar expresamente la supersesion de la
  politica anterior.
- No se incluyen cambios locales preexistentes del frontend, `opencode.json` ni
  otros archivos ajenos a la Issue.
