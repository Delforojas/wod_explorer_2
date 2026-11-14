# Plan de implementación

## Enfoque técnico

Crear una guía Markdown autocontenida en `docs/` con un bloque `bash`, una
explicación breve de la salida corta y una recomendación para preparar rutas
concretas. No se modificará código ni configuración.

## Componentes afectados

- `docs/git-untracked-files.md`: nueva guía para identificar archivos sin
  seguimiento antes de preparar un commit.
- `specs/247-documentar-archivos-sin-seguimiento-git/`: trazabilidad y
  seguimiento de la Issue.

## Estrategia de implementación

1. Crear la guía con `git status --short --untracked-files=all`.
2. Explicar que `??` representa un archivo sin seguimiento e incluir
   `.workflow/issues/NNN.json` como ejemplo temporal.
3. Indicar que se deben revisar y seleccionar rutas concretas en vez de usar
   `git add .` indiscriminadamente.
4. Revisar el contenido y el diff para confirmar que solo se añadieron la guía
   autorizada y el SDD.

## Verificación

- Comprobar que el documento existe y contiene el comando exacto, `??`, el
  ejemplo temporal y la advertencia sobre `git add .`.
- Ejecutar `git diff --check` para validar que los cambios no introducen errores
  de espacios.
- Revisar `git status --short` y los diffs para confirmar que no hay cambios de
  aplicación ni documentos ajenos, aparte del JSON local preexistente de la
  preparación.
