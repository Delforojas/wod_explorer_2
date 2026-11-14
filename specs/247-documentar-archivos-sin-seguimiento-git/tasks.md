# Tareas

- [x] Crear `docs/git-untracked-files.md` con el comando
  `git status --short --untracked-files=all` y explicar el prefijo `??`.
  - Dependencias: ninguna.
  - Verificación: revisar el contenido del documento.

- [x] Incluir `.workflow/issues/NNN.json` como ejemplo temporal y advertir
  contra el uso indiscriminado de `git add .`.
  - Dependencias: guía creada.
  - Verificación: revisar el contenido del documento.

- [x] Validar formato, alcance y trazabilidad de los cambios.
  - Dependencias: tareas anteriores completadas.
  - Verificación: ejecutar `git diff --check` y revisar `git status --short` y
    los diffs.
