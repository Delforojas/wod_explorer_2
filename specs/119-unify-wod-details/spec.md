# SDD: Unificar detalles públicos y personales de WOD

## Objetivo

Unificar la presentación del detalle de WOD público y personal con el lenguaje
visual oscuro/naranja de `Benchmarks` y `Mis WODs`, mejorando jerarquía,
legibilidad y uso móvil sin cambiar comportamiento, dominio, ownership ni
contratos API.

## Alcance

- Auditar y reutilizar una única vista presentacional para los detalles público
  y personal cuando la estructura de datos sea equivalente.
- Mantener wrappers mínimos para conservar las diferencias de contexto:
  descripción/eyebrow y CTA de registro solo cuando la sesión autenticada y el
  contexto de ownership lo permiten.
- Presentar `Volver`, nombre y descripción opcional con una cabecera centrada y
  espaciada.
- Separar visualmente modalidad, rondas y límite de tiempo con badges legibles,
  incluyendo `FOR_TIME`, `AMRAP` y `EMOM` según los valores soportados.
- Mostrar la composición en una lista ordenada visible, conservando el orden y
  todos los valores existentes de repeticiones, carga, distancia y duración.
- Sustituir el enlace azul de registro personal por un CTA local naranja que
  conserve exactamente la ruta existente, aparezca también en el detalle de un
  WOD público cuando el usuario esté autenticado y no aparezca para invitados.
- Reemplazar tarjetas pesadas por filas con separadores sutiles, tokens
  existentes, fondo oscuro, acentos naranjas y tipografía actual.
- Unificar los estados de carga, error y vacío de las vistas afectadas cuando
  sea necesario para que usen la presentación existente de la aplicación.
- Ajustar responsive, foco visible, contraste, wrapping y espacio inferior del
  dock en móvil, tablet y desktop.
- Añadir tests de presentación para ambos contextos, prescripciones, rutas,
  CTA y estados.

## Comportamiento esperado

1. El detalle público y personal comparten estructura, clases visuales y
   jerarquía sin alterar sus diferencias de autorización.
2. `Volver` mantiene el handler y la navegación existente.
3. Modalidad, rondas y tiempo límite se muestran cuando existen, sin datos
   inventados ni valores omitidos.
4. Los ejercicios permanecen en el mismo orden de composición y muestran todas
   sus prescripciones disponibles, incluso combinaciones.
5. `Registrar resultado` no aparece para invitados en WODs públicos, aparece
   para usuarios autenticados en WODs públicos y se mantiene para el detalle
   personal propio; conserva `/my-wod-results/new?wodId=<id>` y utiliza el CTA
   naranja.
6. Los estados de carga, error y vacío mantienen mensajes y semántica
   comprensibles.
7. La vista no produce overflow horizontal, texto truncado ni solapamientos con
   navegación fija en los breakpoints soportados.
8. No cambian endpoints, payloads, entidades, versionado, ownership, permisos,
   resultados, persistencia ni reglas de `DOMAIN.md`.

## Criterios de aceptación

- [ ] Detalle público y personal comparten lenguaje visual y estructura
      equivalente donde los datos lo permiten.
- [ ] Modalidad, rondas, tiempo límite y prescripciones son claros y están
      separados visualmente.
- [ ] Se conserva exactamente el orden y todos los valores de prescripción.
- [ ] El CTA usa naranja y conserva ruta, autenticación y ownership: está oculto
      para invitados, visible en WODs públicos autenticados y visible en WODs
      personales propios.
- [ ] `Volver`, rutas y acciones siguen operativos.
- [ ] Móvil, tablet y desktop no tienen overflow ni solapamientos con el dock.
- [ ] Estados y accesibilidad de teclado, foco, semántica y contraste son
      correctos.
- [ ] No se modifican entidades, endpoints, API, DB, ownership, versionado ni
      reglas de `DOMAIN.md`.
- [ ] Tests de regresión, lint, test, build y `git diff --check` pasan.
- [ ] Queda definida validación visual manual en móvil y escritorio para ambos
      tipos de WOD.

## Restricciones

- No modificar CRUD, autorización, resultados, persistencia ni lógica de
  dominio.
- No añadir modalidades ni tipos de prescripción.
- No modificar `DOMAIN.md` ni contratos API.
- No rediseñar el listado de `Mis WODs` ni `Benchmarks`.
- No añadir dependencias ni librerías de UI.
- No ocultar la acción de registro cuando el contexto personal la autoriza.

## Fuentes

- GitHub Issue #119.
- Issue #117 y `specs/117-align-my-wods-layout/` como referencia visual
  aprobada para el detalle personal/listado.
- `frontend/src/components/wodFilter/WodDetail.tsx`.
- `frontend/src/views/my-wods/components/MyWodDetail.tsx`.
- `frontend/src/views/wods/WodsView.tsx` y
  `frontend/src/views/my-wods/MyWodsView.tsx`.
- `frontend/src/styles/wod-detail.css`, `wod.css`, `resources.css`,
  `my-wods.css` y `my-exercise-results.css`.
- `PROJECT.md`, `DESIGN.md`, `DOMAIN.md`, `AGENTS.md` y `frontend/AGENTS.md`.
