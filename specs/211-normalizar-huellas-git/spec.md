# Spec - Normalizar huellas Git en `project_final`

## Objetivo

Evitar el falso `BLOCK` de `verification_runner.project_final` cuando Git
transforma finales de linea mediante atributos como `eol=crlf` o `eol=lf`, sin
aceptar contenido no verificado ni debilitar las validaciones de integridad.

## Alcance

- Ajustar el calculo y la comparacion de huellas entre `fingerprint`,
  `run_checks` y `project_final` en `scripts/harness/verification_runner.py`.
- Documentar en los contratos del harness como se vincula la fuente verificada
  antes del commit con el arbol Git confirmado despues del commit.
- Anadir regresiones en `scripts/harness/tests/` con repositorios Git
  temporales para atributos EOL y cambios de contenido.

## Fuera de alcance

- No modificar `backend/mvnw.cmd`, `.gitattributes`, codigo de producto ni el
  alcance de la Issue #207.
- No modificar `/issue`, `/finish-issue`, guards ni politicas Git.
- No resolver la auditoria externa completa de acciones ni la lectura GitHub de
  `documentation.static_summary` pendiente en la fase 13.

## Comportamiento esperado

La evidencia de verificacion conserva una representacion canonica de cada
archivo regular que permite comparar, tras el commit, el contenido del blob
Git con los bytes que se verificaron en el arbol de trabajo. La representacion
debe respetar los atributos y filtros configurados por Git. Si Git no puede
producir una equivalencia fiable, `project_final` debe bloquear de forma
explicita. Los enlaces simbolicos, modos y el inventario completo mantienen
sus comprobaciones actuales.

## Criterios de aceptacion

- AC1: Se reproduce en un repositorio temporal el caso de un archivo no
  modificado con `eol=crlf`; tras una verificacion y commit sin cambio
  semantico, `project_final` devuelve `PASS`.
- AC2: El mismo tratamiento cubre `eol=lf` y un archivo modificado que se
  verifica y se commitea legitimamente.
- AC3: Si se altera el contenido semantico/canonico entre la verificacion y el
  commit, `project_final` devuelve `BLOCK`.
- AC4: Una transformacion Git o filtro sin equivalencia fiable produce un
  `BLOCK` explicito, nunca un `PASS` por defecto.
- AC5: Las pruebas positivas y negativas se incorporan a
  `scripts/harness/tests/` y la suite completa del harness permanece en PASS.
- AC6: El criterio y sus limites quedan documentados en los contratos del
  harness sin relajar guards, politicas Git ni el alcance de la Issue #207.

## Restricciones

- No se anaden dependencias, servicios ni capas nuevas.
- No se fabrican huellas ni se omiten comprobaciones de ownership, caducidad o
  integridad de evidencia.
- La solucion debe usar comandos o APIs Git observables para las
  transformaciones de contenido, no una normalizacion manual incompleta.
