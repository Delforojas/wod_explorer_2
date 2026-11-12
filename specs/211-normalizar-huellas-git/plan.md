# Plan - Issue #211

## Enfoque tecnico

1. Inspeccionar el manifiesto que produce `fingerprint` y el arbol que observa
   `_tree_files` para identificar donde se mezclan bytes de working tree y
   blobs Git.
2. Extender el manifiesto de fuente con la huella de una representacion Git
   canonica por archivo regular, obtenida a traves de Git con los atributos del
   arbol verificado. Mantener la huella cruda existente para que la deteccion
   de cambios durante `run_checks` siga vinculada al arbol de trabajo exacto.
3. En `project_final`, comparar cada blob del commit con la huella canonica
   esperada y bloquear cuando falta o no se puede obtener esa equivalencia.
   Conservar inventario, modo, enlaces simbolicos y demas validaciones.
4. Anadir pruebas de repositorios temporales para CRLF, LF, cambio legitimo,
   alteracion semantica y filtro no verificable.
5. Actualizar el contrato de verification runner y, si corresponde, el de
   final check con el criterio y el limite de filtros no verificables.

## Componentes afectados

- `scripts/harness/verification_runner.py`
- `scripts/harness/verification_runner_contract.md`
- `scripts/harness/final_check_contract.md` si necesita reflejar el enlace de
  contenido canonico.
- `scripts/harness/tests/test_workflow_audit.py` o pruebas especificas del
  verification runner, segun la ubicacion coherente con el flujo existente.

## Verificacion

- Ejecutar las pruebas nuevas con repositorios Git temporales que cubran AC1 a
  AC4.
- Ejecutar la suite completa con el interprete configurado en `opencode.json`:
  `./.venv/bin/python -m unittest discover -s scripts/harness/tests -p
  "test_*.py"`.
- Ejecutar `git diff --check` sobre los cambios de la Issue.

## Limites

La correccion no certifica acciones externas ni resuelve los limites de
auditoria GitHub de la fase 13, que permanecen fuera del alcance de #211.
