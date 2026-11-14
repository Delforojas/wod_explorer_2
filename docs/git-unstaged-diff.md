# Consultar cambios sin preparar

`git diff` muestra los cambios locales que todavía no se han preparado para el
próximo commit. Es una consulta de solo lectura que permite revisar el contenido
modificado antes de decidir si debe añadirse al área de preparación.

```bash
git diff
git diff --cached
```

Mientras `git diff` muestra los cambios sin preparar, `git diff --cached`
muestra los cambios que ya están preparados para el próximo commit. Ambos
comandos no modifican el repositorio; revisa manualmente su salida antes de
realizar un merge.
