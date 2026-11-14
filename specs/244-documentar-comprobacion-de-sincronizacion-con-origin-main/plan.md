# Plan - Issue #244

## Enfoque

Crear una guía Markdown independiente en `docs/` que compare las referencias
locales `main` y `origin/main`, y que explique cómo actualizar la segunda antes
de una comprobación actualizada, sin alterar código ni integrar commits.

## Componentes afectados

- `docs/git-main-sync-check.md`: nueva guía de comparación de referencias Git.
- `specs/244-documentar-comprobacion-de-sincronizacion-con-origin-main/`:
  trazabilidad de la Issue.

## Estrategia de implementación

1. Crear la guía con el título exacto y describir que cada comando
   `git rev-parse` imprime el hash del commit referenciado localmente por
   `main` u `origin/main`.
2. Incluir ambos comandos en un bloque etiquetado `bash` y explicar que los
   hashes coinciden cuando las dos referencias apuntan al mismo commit.
3. Explicar que `origin/main` es una referencia remota almacenada localmente y
   que `git fetch origin main` actualiza su información sin integrar commits en
   la rama actual.
4. Revisar que los cambios se limiten a la guía y al SDD, y validar el formato
   con `git diff --check`.

## Verificación

- Leer `docs/git-main-sync-check.md` para confirmar el título exacto, los dos
  comandos, el bloque `bash`, la condición de coincidencia y la distinción con
  `git fetch origin main`.
- Ejecutar `git diff --check`.
- Revisar el diff y el estado Git para confirmar que no se modificaron archivos
  funcionales, scripts, configuración ni dependencias.
