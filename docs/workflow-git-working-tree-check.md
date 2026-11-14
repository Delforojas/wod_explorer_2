# Comprobación de cambios pendientes

Antes de seleccionar archivos para un commit, revisa los cambios pendientes en
el arbol de trabajo. Esta comprobacion permite identificar archivos modificados,
nuevos o eliminados antes de decidir cuales deben incluirse.

Ejecuta esta consulta de solo lectura:

```bash
git status --short
```

El comando muestra un resumen conciso del estado de los archivos. Revisa su
salida antes de seleccionar archivos para un commit. La consulta no autoriza
ejecutar `git add` ni `git commit` automaticamente.
