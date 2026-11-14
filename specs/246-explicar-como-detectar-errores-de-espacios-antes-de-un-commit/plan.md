# Plan de implementación

## Enfoque técnico

Crear un único documento Markdown autocontenido en `docs/`. Usará un bloque de
código `bash` para el comando y secciones breves que expliquen qué revisa, cómo
interpretar una ejecución correcta y su límite frente a las pruebas del
proyecto.

## Componentes afectados

- `docs/git-staged-whitespace-check.md`: nueva guía de comprobación local de
  cambios preparados.
- `specs/246-explicar-como-detectar-errores-de-espacios-antes-de-un-commit/`:
  trazabilidad y seguimiento de la Issue.

## Estrategia de implementación

1. Crear el documento con el comando exacto `git diff --cached --check`.
2. Describir que Git informa errores de espacios en los cambios preparados.
3. Indicar que una salida vacía con código de salida `0` no detecta esos
   errores.
4. Aclarar explícitamente que la comprobación no reemplaza las pruebas
   funcionales.
5. Revisar el contenido y el diff para confirmar que solo se añadieron el
   documento autorizado y el SDD.

## Verificación

- Comprobar que el archivo existe y contiene el comando exacto.
- Ejecutar `git diff --check` para validar que los cambios no introducen errores
  de espacios.
- Revisar `git diff --check --cached` para confirmar que la comprobación
  documentada funciona sin errores sobre el índice actual.
- Revisar `git status --short` y `git diff -- docs/git-staged-whitespace-check.md`
  para confirmar que no hay cambios de aplicación ni documentos ajenos.
