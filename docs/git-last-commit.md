# Consultar el último commit

Para ver el commit más reciente del repositorio local, ejecuta esta consulta de
solo lectura:

```bash
git log -1 --oneline
```

El comando muestra únicamente el último commit en una línea, con su identificador
abreviado y el mensaje asociado. No modifica el historial ni el estado de los
archivos del repositorio.
