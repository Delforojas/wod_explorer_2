# SDD: Eliminar CSS muerto verificado de mobile-dock.css (#161)

## Objetivo

Auditar y retirar exclusivamente los estilos de `frontend/src/styles/mobile-dock.css`
que no tengan consumidores demostrados, sin cambiar la navegación móvil, login,
responsive ni estados.

## Contexto

- Auditoría #157 (F4): 7 de 14 clases aparentemente sin referencias TSX en
  `frontend/src/styles/mobile-dock.css`.
- La Issue exige diferenciar usos reales (incluyendo generación dinámica) antes
  de retirar.

## Alcance

- Auditar y documentar con tabla de selectores el uso/no uso real.
- Retirar solo reglas sin consumidores demostrados del archivo
  `frontend/src/styles/mobile-dock.css`.
- No rediseñar ni unificar CSS fuera de esta hoja.

## Fuera de alcance

- Cambios en animaciones, componentes, estilos fuera de `mobile-dock.css` y
  bundler.
- Rediseño de la navegación móvil ni cambios funcionales.

## Comportamiento esperado

- La navegación móvil (dock, estados activos, hover/focus, responsive, auth)
  mantiene su comportamiento.
- Solo CSS muerto del archivo se elimina.

## Criterios de aceptación

- [ ] Tabla de selectores analizados y evidencia de uso/no uso.
- [ ] Solo CSS realmente muerto eliminado.
- [ ] Dock probado en móvil y escritorio, incluyendo estados activos, hover/focus
      y autenticación.
- [ ] Lint, tests, build y `git diff --check` correctos.

## Restricciones

- Cambios incrementales, sin ampliar alcance ni mezclar otras issues.
- Detenerse para aprobación del usuario antes de commit, push, PR, merge o cierre.
