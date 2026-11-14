# Revisar los archivos incluidos en un commit

Después de ejecutar `/commit-issue`, puedes comprobar qué archivos contiene el
commit local más reciente. Estas consultas son de solo lectura: no modifican el
historial ni los archivos del repositorio.

```bash
git show --stat --oneline HEAD
git show --name-only --format= HEAD
```

`git show --stat --oneline HEAD` muestra el identificador abreviado y el mensaje
del commit, seguido de un resumen con los archivos modificados y la cantidad de
líneas añadidas o eliminadas en cada uno.

`git show --name-only --format= HEAD` oculta la cabecera del commit y muestra
los nombres de los archivos afectados antes de su contenido modificado. Úsalo
cuando solo necesites confirmar las rutas incluidas en el commit.

Por ejemplo, tras `/commit-issue`, ejecuta primero el comando con `--stat` para
revisar el alcance y el volumen de cambios. Si las estadísticas son las
esperadas, ejecuta el comando con `--name-only` para confirmar que las rutas
pertenecen a la Issue antes de continuar con el siguiente paso del workflow.
