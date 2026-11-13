# Comprobación de rama activa

Antes de trabajar en una Issue, comprueba que la rama local activa corresponde
a la tarea que vas a realizar. Esta comprobación evita aplicar cambios en otra
rama, especialmente en `main`.

Ejecuta esta consulta de solo lectura:

```bash
git branch --show-current
```

El comando muestra el nombre de la rama activa. Verifica que identifica la
Issue antes de modificar archivos o iniciar las siguientes etapas del workflow.
