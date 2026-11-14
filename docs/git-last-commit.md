# Consultar el último commit

## Ver el último commit en una línea

Para ver el commit más reciente del repositorio local, ejecuta esta consulta de
solo lectura:

```bash
git log -1 --oneline
```

El comando muestra únicamente el último commit en una línea, con su identificador
abreviado y el mensaje asociado. Por ejemplo:

```text
3223060 docs: documentar consulta del ultimo commit local (#242)
```

En este resultado, `3223060` es el identificador abreviado del commit y el resto
de la línea es su mensaje. No modifica el historial ni el estado de los archivos
del repositorio.

## Ver el resumen y los archivos modificados

Para consultar el resumen del último commit y los archivos que modificó, usa:

```bash
git show --stat --oneline HEAD
```

`HEAD` se refiere al commit actual de la rama. La salida incluye su identificador
y mensaje, seguido de una lista de archivos y un resumen de líneas. Por ejemplo:

```text
3223060 docs: documentar consulta del ultimo commit local (#242)
 docs/git-last-commit.md | 12 ++++++++++++
 1 file changed, 12 insertions(+)
```

El ejemplo indica que el commit modificó `docs/git-last-commit.md`, añadió doce
líneas y no eliminó ninguna. Esta consulta también es de solo lectura.
