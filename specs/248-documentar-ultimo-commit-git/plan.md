# Plan - Issue #248

## Enfoque

Extender la guía existente en `docs/git-last-commit.md` con dos secciones de
consulta de solo lectura. La primera conservará y completará la explicación de
la vista breve del último commit; la segunda describirá el resumen y los
archivos modificados del commit apuntado por `HEAD`.

## Componentes afectados

- `docs/git-last-commit.md`: guía existente que se amplía con explicaciones y
  ejemplos de ambos comandos.
- `specs/248-documentar-ultimo-commit-git/`: trazabilidad de la Issue.

## Estrategia de implementación

1. Revisar el contenido existente para preservar la explicación de solo
   lectura y extenderlo sin duplicar la guía previa.
2. Añadir ejemplos de salida coherentes e ilustrativos para ambos comandos,
   junto con la explicación de los campos que muestran.
3. Comprobar que el documento cubre todos los criterios de aceptación y que
   los cambios se limitan a la guía y al SDD.

## Verificación

- Leer `docs/git-last-commit.md` para confirmar ambos comandos, sus ejemplos
  de salida y las explicaciones correspondientes.
- Ejecutar `git diff --check` para comprobar el formato del parche.
- Revisar el diff y el estado Git para confirmar que no se modifican archivos
  de aplicación ni se incluye `.workflow/issues/248.json`.
