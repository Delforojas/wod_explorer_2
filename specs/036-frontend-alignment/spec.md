# Spec: Alineacion del frontend con `frontend/AGENTS.md`

## Objetivo

Comparar el frontend existente con las reglas tecnicas actuales y aplicar
unicamente correcciones seguras que mejoren la alineacion sin introducir
funcionalidad de producto ni realizar un rediseño visual.

## Hallazgos iniciales

- React, TypeScript, Vite, CSS, estado local de React y la ruta base `/api` ya
  forman parte de la implementacion existente.
- Pages coordinan estado, efectos y API; Views reciben props y no acceden a la
  API. La extraccion de props a archivos `*.Types.ts` mantiene esa separacion.
- El acceso HTTP esta centralizado en `src/api/`, pero las respuestas externas
  se convierten directamente con `response.json()` y no existe una frontera
  Zod.
- `package.json` no contiene Zod ni Vitest y no define el script `test`, aunque
  ambos forman parte de la configuracion declarada del frontend.
- La estructura existente es `pages/` + `views/`, no la estructura feature-based
  objetivo. Una migracion completa queda fuera de esta Issue porque requeriria
  un refactor amplio y no aporta una correccion segura aislada.
- `DESIGN.md` y `docs/constitution.md` no existen en el checkout, por lo que no
  se pueden aplicar decisiones visuales o constitucionales no documentadas.
- El estado local incluia cambios visuales no solicitados y la eliminacion de
  la ruta `/my-exercise-results`; ambos deben corregirse para conservar el
  comportamiento y respetar el alcance.

## Alcance

- Mantener la separacion Pages/Views y completar la extraccion segura de tipos
  de props ya iniciada.
- Restaurar rutas o comportamiento eliminado accidentalmente.
- Revertir cambios visuales locales que contradicen el requisito de no
  rediseñar.
- Configurar los scripts de verificacion que estan definidos por el proyecto y
  documentar cualquier herramienta declarada pero no instalable sin ampliar el
  alcance.
- Mejorar la comprobacion de tipos y lint solo cuando la configuracion actual
  lo permita sin cambiar contratos de API.
- Documentar las desviaciones feature-based y Zod/Vitest que requieren una
  decision o una migracion posterior.

## Fuera de alcance

- Migrar masivamente `pages/` y `views/` a `features/`.
- Rediseñar pantallas o modificar el sistema visual.
- Cambiar rutas, contratos backend, autenticacion o estado global.
- Introducir endpoints, dependencias de estado o funcionalidades de producto.
- Implementar validacion completa de todos los contratos API si requiere una
  decision adicional sobre schemas o una migracion de contratos.

## Criterios de aceptacion

- [x] Existe un informe de hallazgos y decisiones en el SDD de la Issue.
- [x] No se elimina ninguna funcionalidad existente.
- [x] No se realizan rediseños visuales.
- [x] Las Views no contienen acceso HTTP ni dependencias de infraestructura.
- [x] Los tipos de props no se duplican innecesariamente dentro de las Views.
- [x] Los comandos disponibles y las comprobaciones reales quedan alineados o
  documentados cuando falta infraestructura.
- [x] `npm run lint`, `npm run test` y `npm run build` finalizan correctamente.
- [x] La ausencia de `DESIGN.md` o la constitucion
  queda explicitamente reportada si no se resuelve dentro del alcance.

## Estado final

- Se añadieron schemas Zod para los contratos existentes y sus tipos se derivan
  mediante `z.infer`.
- La capa API valida payloads de mutacion y parsea las respuestas JSON antes de
  devolverlas a Pages.
- Se incorporo Vitest con un test de frontera para respuestas de ejercicios.
- Se habilito `strict` en las configuraciones TypeScript del frontend.
- Se restauro `/my-exercise-results` y se mantuvo la separacion Pages/Views.
- Se corrigieron labels dinamicos, errores anunciables, `lang="es"`, el titulo y
  el skip link sin introducir un rediseño visual.
- La migracion completa a `features/` queda documentada como trabajo posterior;
  la ausencia de `DESIGN.md` y `docs/constitution.md` queda reportada porque
  ambos archivos no existen en el checkout.
