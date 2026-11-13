# Spec - Reaplicar el arreglo de #211 (falso BLOCK de `project_final` con CRLF)

## Objetivo

Reaplicar sobre `main` el arreglo de la Issue #211 (commit `fc45d8c`, PR #215),
perdido tras el retroceso de `main` del 2026-11-13 (`a56a057`), para que
`verification_runner.project_final` deje de bloquear falsamente por
transformaciones de fin de línea (`eol=crlf`, `eol=lf`) aplicadas por Git, sin
dejar de bloquear cuando el contenido realmente difiere.

## Alcance

- Reintroducir en `scripts/harness/verification_runner.py` la representación
  canónica (`git_blob_oid`, obtenida con `git hash-object --stdin --path=<ruta>`)
  que `fingerprint` añade a cada archivo regular y que `project_final` usa
  para comparar el blob del árbol confirmado con el contenido verificado.
- Reintroducir la documentación del criterio y sus límites en
  `scripts/harness/verification_runner_contract.md`.
- Reintroducir y adaptar las regresiones de `fc45d8c` en
  `scripts/harness/tests/test_workflow_audit.py`, conservando las pruebas de
  `ActionAudit`/`workflow_controller` añadidas después por la Issue #220, que
  no existían cuando se escribió el arreglo original.
- Crear un SDD propio en `specs/225-reaplicar-fix-211-crlf/` que cite a #211 y
  `fc45d8c` como origen del cambio, sin reintroducir
  `specs/211-normalizar-huellas-git/`.

## Fuera de alcance

- Modificar `backend/mvnw.cmd`, `.gitattributes` o código de producto.
- Recuperar otros commits descartados en el retroceso de `main` (#216,
  `gissue`, #218).
- Modificar `/issue`, `/finish-issue`, guards o políticas Git.
- Modificar `scripts/harness/final_check_contract.md` u otro contrato no
  tocado por `fc45d8c`.

## Comportamiento esperado

`fingerprint` sigue vinculando la huella al contenido crudo del working tree
(detección de cambios durante la observación) y, además, calcula para cada
archivo regular (no symlink) el OID de blob que Git produciría al aplicar sus
atributos/filtros de check-in sobre esos mismos bytes. `project_final` ya no
compara el `sha256` crudo del working tree contra el `sha256` del blob Git del
árbol confirmado (comparación que mezcla representaciones distintas y
produce falsos BLOCK bajo `eol=crlf`/`eol=lf`); en su lugar compara el
`object_id` real del blob confirmado contra el `git_blob_oid` canónico
esperado. Si la evidencia verificada carece de `git_blob_oid` para un archivo
regular, o Git no puede producir una identidad de blob válida, el resultado es
`BLOCK` explícito, nunca `PASS` por defecto. El inventario completo, los
modos, los enlaces simbólicos (que siguen comparándose por `sha256`) y el
resto de comprobaciones de `project_final` no cambian.

## Criterios de aceptación

- AC1: Un archivo sin cambios con `eol=crlf`, verificado y commiteado, deja a
  `project_final` en `PASS`.
- AC2: Lo mismo para `eol=lf` y para un archivo modificado legítimamente antes
  del commit.
- AC3: Si el contenido cambia entre la verificación y el commit,
  `project_final` devuelve `BLOCK`.
- AC4: Si falta la evidencia canónica de contenido Git para un archivo
  regular, `project_final` devuelve `BLOCK` explícito.
- AC5: La suite completa de `scripts/harness/tests/` permanece en `OK`,
  incluidas las pruebas de `ActionAudit` de la Issue #220.
- AC6: Los contratos del harness afectados quedan actualizados.
- AC7: Existe `specs/225-reaplicar-fix-211-crlf/` con spec, plan y tasks
  propios, y no se añade `specs/211-normalizar-huellas-git/`.

## Restricciones

- No se añaden dependencias, servicios ni capas nuevas.
- No se debilitan comprobaciones existentes de `project_final` ni de otros
  checks del harness.
- No se modifica código de producto ni `.gitattributes`.
