# Comprobar sincronización de main

Para saber si la rama local `main` coincide con la referencia remota local
`origin/main`, consulta los hashes de commit de ambas referencias:

```bash
git rev-parse main
git rev-parse origin/main
```

`git rev-parse main` muestra el hash del commit al que apunta la rama local
`main`. `git rev-parse origin/main` muestra el hash de la referencia remota
`origin/main` almacenada en el repositorio local. Los hashes deben coincidir
cuando ambas referencias apuntan al mismo commit.

La comparación usa las referencias disponibles localmente. Si se necesita
actualizar la información de `origin/main` antes de comprobarla, ejecuta:

```bash
git fetch origin main
```

Este comando actualiza la información remota local; no integra commits en la
rama actual.
