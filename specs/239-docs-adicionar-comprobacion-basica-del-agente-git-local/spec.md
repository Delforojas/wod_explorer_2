# Spec: comprobación básica del agente Git local

## Objetivo

Añadir una documentación mínima para comprobar de extremo a extremo el agente
`git-local` y el workflow de issues, sin modificar la aplicación.

## Alcance

- Crear `docs/git-local-smoke-test.md`.
- Documentar el uso de `git status --short` y `git branch --show-current`.
- Incluir el título exacto `# Prueba del agente Git local`.
- Indicar expresamente que esta prueba no debe modificar código de frontend,
  backend ni base de datos.

## Fuera de alcance

- Código funcional de frontend o backend.
- Esquema, migraciones o configuración de base de datos.
- Scripts del harness, flujos de Git, dependencias o configuración del
  proyecto.

## Comportamiento esperado

El documento debe permitir identificar de forma concisa:

- Qué archivos modificados o no rastreados muestra `git status --short`.
- Qué rama local activa informa `git branch --show-current`.
- Que la comprobación es documental y no autoriza cambios en la aplicación ni
  en sus datos.

## Criterios de aceptación

1. Existe `docs/git-local-smoke-test.md` con el título indicado y una
   explicación de ambos comandos.
2. No se modifica código funcional ni configuración del proyecto.
3. El cambio queda limitado a la documentación indicada y `git diff --check`
   finaliza correctamente.

## Restricciones

- Redactar la documentación en español conforme a las convenciones del
  proyecto.
- Mantener el cambio mínimo y no añadir dependencias ni automatizaciones.
