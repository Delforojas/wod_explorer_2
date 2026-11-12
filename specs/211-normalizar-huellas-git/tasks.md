# Tasks - Issue #211

## 1. Analisis e implementacion

- [x] 1.1 Definir y aplicar la representacion Git canonica en el manifiesto de
  `fingerprint`, conservando la deteccion de cambios por bytes del working
  tree.
- [x] 1.2 Adaptar `project_final` para comparar el arbol confirmado mediante
  la representacion canonica y bloquear transformaciones no verificables.

## 2. Pruebas de regresion

- [x] 2.1 Anadir caso temporal con `eol=crlf` y archivo no modificado que
  supera `project_final`.
- [x] 2.2 Anadir casos para `eol=lf` y archivo modificado/commiteado de forma
  legitima.
- [x] 2.3 Anadir casos negativos para contenido semantico alterado y filtro o
  transformacion no verificable.

## 3. Documentacion

- [x] 3.1 Documentar el criterio de representacion canonica y sus limites en
  los contratos afectados del harness.

## 4. Verificacion

- [x] 4.1 Ejecutada `./.venv/bin/python -m unittest discover -s
  scripts/harness/tests -p "test_*.py"`: `Ran 337 tests in 209.170s`, `OK`.
- [x] 4.2 Ejecutado `git diff --check`: sin salida, PASS. Los cambios se
  limitan al runner, su contrato, sus pruebas y el SDD de esta Issue.
