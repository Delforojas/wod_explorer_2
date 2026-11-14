# Identificar archivos sin seguimiento

Antes de preparar cambios para un commit, revisa todos los archivos que Git no
está siguiendo todavía:

```bash
git status --short --untracked-files=all
```

La salida corta muestra `??` delante de cada archivo sin seguimiento. Por
ejemplo:

```text
?? .workflow/issues/NNN.json
```

`.workflow/issues/NNN.json` es estado temporal del workflow. Revísalo antes de
preparar archivos y no lo incluyas en el commit de una issue.

No uses `git add .` para incluir archivos indiscriminadamente. Después de
revisar la salida, prepara solo las rutas concretas que pertenecen al cambio.
