# SDD: Actualizar frontend/AGENTS.md según la arquitectura real (#157)

## Objetivo

Alinear la sección de arquitectura de `frontend/AGENTS.md` con la estructura
real de `frontend/src`, eliminando referencias a carpetas inexistentes
(`src/app`, `src/features`, `src/hooks`, `src/assets`) y documentando las
responsabilidades de `pages/`, `views/`, `auth/` y `styles/`.

## Alcance

- Reescribir el mapa de directorios de `frontend/AGENTS.md` únicamente con
  rutas existentes y responsabilidades verificadas en el código.
- Ajustar las reglas de arquitectura para que sean coherentes con la separación
  real `pages/` (contenedores) vs `views/` (presentación) y con el CSS
  centralizado en `src/index.css` + `src/styles/`.
- Separar visualmente reglas obligatorias de orientación, manteniendo el
  documento breve.
- Corregir el carácter aislado `ç` de la tabla de skills (línea 148), que rompe
  el renderizado del documento.
- Verificar que todas las rutas citadas existen.

## Fuera de alcance

- Modificar `PROJECT.md`, el `AGENTS.md` raíz, `DESIGN.md`, skills, workflow o
  cualquier otro documento.
- Cambiar código, estilos, dependencias, configuración o tests.
- Documentar `src/app`, `src/features`, `src/hooks` o `src/assets` como
  existentes o como arquitectura objetivo.
- Reescribir las secciones de stack, TypeScript, API, UI, accesibilidad, estado,
  testing o guardrails.

## Comportamiento esperado

`frontend/AGENTS.md` debe permitir a un agente saber, sin inspeccionar el árbol,
dónde vive cada responsabilidad y qué reglas son obligatorias. Cada ruta citada
debe existir. Las referencias a `PROJECT.md` y a la configuración real se
mantienen.

## Criterios de aceptación

- [ ] Cada ruta del documento existe o se identifica expresamente como
      propuesta futura.
- [ ] `pages/`, `views/`, `auth/`, `styles/` y sus responsabilidades se
      documentan según código real.
- [ ] Instrucciones concisas, no redundantes ni contradictorias con el
      `AGENTS.md` raíz.
- [ ] `git diff --check` sin errores; sin cambios funcionales.
- [ ] Resumen antes/después con referencias exactas en el handoff de la Issue.

## Restricciones

- Solo documentación; ningún cambio funcional.
- No inventar carpetas ni presentar arquitectura futura como implementada.
- No convertir preferencias en reglas obligatorias.
- Mantener el idioma y el estilo existentes del documento.
- No tocar trabajo no relacionado ni el resto de documentos del proyecto.

## Evidencia de contexto

- Auditoría integrada: `specs/157-auditoria-arquitectura-frontend/audit.md`
  (F1 y F10).
- Decisión previa: `specs/036-frontend-alignment/spec.md` documenta que la
  estructura real es `pages/` + `views/`, no feature-based.
- Estructura verificada en `frontend/src` y en `frontend/src/index.css`.
