# Tareas

## Implementación

- [x] Añadir al detalle compartido la acción nativa `Copiar nombre`, la copia
      exacta de `selectedWod.name` y el feedback de éxito o fallo.
  - Dependencias: ninguna.
  - Comprobación: la UI no confirma éxito antes de que `writeText` se resuelva.

- [x] Estilar la acción y el feedback junto al título sin alterar la jerarquía,
      acciones existentes, foco visible o adaptación móvil.
  - Dependencias: acción de copia implementada.
  - Comprobación: control de al menos 44 px de alto y wrapping seguro en móvil.

- [x] Añadir pruebas de interacción para la resolución y el rechazo de la API
      del portapapeles.
  - Dependencias: acción de copia implementada.
  - Comprobación: verifica texto copiado exacto, éxito tras resolución y mensaje
    de fallo tras rechazo.

## Sincronización y verificación

- [x] Sincronizar este SDD con la implementación final y confirmar que no hay
      cambios fuera del alcance frontend.
  - Dependencias: tareas de implementación completadas.

- [x] Ejecutar las verificaciones aplicables: prueba específica, lint, suite de
      tests, build y `git diff --check`.
  - Dependencias: SDD sincronizado.
  - Comprobación: cada comando termina con código 0.
