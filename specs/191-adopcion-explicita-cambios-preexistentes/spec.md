# Adopción explícita de cambios preexistentes

## Objetivo

Permitir que una issue retomada adopte de forma humana, explícita y auditable archivos completos que ya estaban modificados al inicio de la sesión, sin debilitar la protección predeterminada para cambios preexistentes.

## Alcance

- Añadir operaciones de solo lectura para proponer y validar adopciones de rutas clasificadas como `preexisting-path` en la evidencia vigente de fase 9.
- Exigir un manifiesto de autorización externo, firmado o emitido por un verificador de procedencia configurado, con identidad y temporalidad verificables.
- Vincular cada ruta aprobada con Issue, workflow, repositorio, rama, HEAD, hashes de baseline y de `pre_stage_evidence`, contenido, diff completo, modo y justificación.
- Permitir en Change Review Guard y en `prepare_staging` solamente rutas con una adopción vigente y coincidente byte a byte.
- Rechazar rutas no incluidas, artefactos excluidos, comodines, directorios, aprobaciones globales, cambios posteriores y archivos que mezclen trabajo fuera de la issue activa.
- Conservar el baseline histórico y registrar las evidencias, versiones, invalidaciones y reemplazos en la sesión en memoria.
- Actualizar la documentación del workflow y del Change Review Guard.

## Fuera de alcance

- Acceder, modificar, restaurar o reutilizar los cambios del worktree de la Issue #188.
- Persistencia o restauración de sesiones de la Issue #189.
- Runner asíncrono de la Issue #190.
- Aprobación implícita, automatizada por IA/Python o basada solo en `approved_by`.
- Adopción parcial de hunks, patrones glob, directorios o staging indiscriminado.

## Comportamiento esperado

1. `propose_preexisting_adoption` consume la evidencia actual de pre-stage y el baseline autenticado sin escribir Git; propone solo rutas `preexisting-path` no excluidas e informa modo, SHA-256 de contenido actual, SHA-256 de diff completo, hash del baseline, estado Git y clasificación técnica.
2. La autorización se verifica frente a un recibo externo de procedencia que no puede fabricar el proceso del harness. La autorización enumera únicamente archivos completos y sus hashes exactos.
3. `validate_preexisting_adoption` vuelve a comprobar identidad de la sesión, vigencia, referencias, contenido y diff. Solo emite evidencia para rutas que coinciden exactamente.
4. Una ruta preexistente solo puede superar el Change Review Guard si la adopción válida se referencia desde la evidencia actual de revisión y las justificaciones permiten atribuir el archivo completo a la issue activa.
5. `prepare_staging` vuelve a validar la adopción antes de publicar el índice privado; cualquier ruta adicional, contenido distinto, staging parcial o archivo mezclado bloquea la operación.
6. Los archivos no adoptados y los excluidos permanecen protegidos y se preservan en el worktree.

## Criterios de aceptación

- La propuesta solo incluye `preexisting-path` y excluye `__pycache__/`, `*.pyc`, `audit/` y `opencode.json` de forma predeterminada.
- Autorizaciones ausentes, falsas, de otra issue/sesión/repositorio/rama/HEAD, caducadas o con hashes incompletos producen `BLOCK`.
- Un cambio posterior de contenido, modo o diff invalida la adopción y nunca llega a staging.
- La adopción de subconjuntos solo acepta rutas exactas aprobadas; no admite directorios ni comodines.
- Los archivos con mezcla de hunk atribuible a otra issue o a trabajo fuera del alcance bloquean la adopción y se mantienen protegidos.
- Las pruebas unitarias e integradas cubren propuesta, verificación de procedencia, validación, guard, staging selectivo e invariantes de preservación del worktree.
- `hyssue.md` y `change-review.md` describen el flujo y sus límites.
