# Issue #246: Explicar cómo detectar errores de espacios antes de un commit

## Objetivo

Documentar una comprobación local de Git para detectar errores de espacios en
los cambios preparados antes de crear un commit.

## Alcance

- Crear `docs/git-staged-whitespace-check.md`.
- Documentar el comando `git diff --cached --check`.
- Explicar los errores de espacios que comprueba Git.
- Explicar que una salida sin mensajes y código de salida `0` indica que Git no
  detectó esos errores.
- Diferenciar esta comprobación de las pruebas funcionales del proyecto.

## Fuera de alcance

- Modificar código de aplicación, configuración, pruebas o documentos
  existentes.
- Ejecutar comandos de preparación, commit o push.
- Sustituir las pruebas funcionales del proyecto por esta comprobación.

## Comportamiento esperado

El documento debe indicar cómo ejecutar `git diff --cached --check` sobre los
cambios ya preparados. Debe aclarar que el comando informa errores de espacios
detectados por Git y que no emitir mensajes con código de salida `0` significa
que no detectó esos errores. También debe indicar que esta comprobación no
valida el comportamiento funcional del proyecto ni reemplaza sus pruebas.

## Criterios de aceptación

- Existe `docs/git-staged-whitespace-check.md`.
- Incluye el comando correcto y una explicación de su resultado.
- Aclara que no sustituye las pruebas del proyecto.
- No hay cambios fuera del alcance, salvo los documentos SDD requeridos.

## Restricciones

- Redactar la documentación en español.
- Mantener el estilo conciso de los documentos Git existentes en `docs/`.
- No introducir requisitos funcionales ni decisiones arquitectónicas nuevas.
