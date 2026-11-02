# SDD: Alinear terminología de Benchmarks

## Objetivo

Alinear la nomenclatura visible de la pantalla privada de marcas de ejercicios
con una terminología de CrossFit más reconocible, sin cambiar el dominio de
`ExerciseResult`, las rutas ni el comportamiento existente.

## Alcance

- Renombrar la entrada activa de navegación de `/my-exercise-results` a
  `Benchmarks` en sidebar, dock y cualquier fuente activa equivalente.
- Cambiar el título visible de la pantalla a `Benchmarks`.
- Cambiar el CTA visible `+ Registrar marca` a `+ Add Score`, conservando el
  enlace `/exercise-results/new` y el flujo existente.
- Cambiar las etiquetas del selector a `All Scores` y `Personal Records`,
  conservando los valores internos, el modo inicial, la búsqueda persistente y
  la carga independiente de datos.
- Cambiar la etiqueta visible del buscador a `Buscar ejercicio` y mantener el
  placeholder `Buscar ejercicio...`.
- Mantener `PR`, su icono y el nombre accesible `Récord personal`.
- Revisar el layout responsive de los textos nuevos en móvil, tablet y desktop
  sin introducir un rediseño ni un sistema de traducciones.
- No modificar rutas, endpoints, entidades, DTOs, consultas, cálculos PR,
  permisos, ownership, persistencia ni el flujo de registro.

## Comportamiento esperado

1. La navegación autenticada enlaza a `/my-exercise-results` y muestra
   `Benchmarks` en los puntos activos de desktop y mobile.
2. La pantalla conserva sus solicitudes, estados de carga/error/vacío,
   búsqueda, cambio de modo, datos y acciones; solo cambia el copy aprobado.
3. El CTA `+ Add Score` abre el mismo flujo de `/exercise-results/new`.
4. `All Scores` selecciona el historial completo y `Personal Records` selecciona
   las mejores marcas, sin cambiar los valores internos ni los cálculos.
5. El buscador conserva su comportamiento y muestra la etiqueta `Buscar
   ejercicio` junto al placeholder existente.
6. Los distintivos `PR` continúan siendo visibles y exponen `Récord personal`
   mediante sus atributos accesibles existentes.
7. `Benchmarks` y `Personal Records` no se cortan, desbordan ni solapan en
   anchos de 320–390 px, 600–899 px y desktop.

## Criterios de aceptación

- [x] Sidebar y dock/navbar muestran `Benchmarks` y enlazan a la ruta actual.
- [x] La cabecera muestra `Benchmarks`.
- [x] El CTA muestra `+ Add Score` y conserva el mismo flujo.
- [x] El selector muestra `All Scores` y `Personal Records` con el comportamiento original.
- [x] El buscador mantiene la etiqueta `Buscar ejercicio` y filtra igual.
- [x] Los distintivos `PR` siguen funcionando y son accesibles.
- [ ] No existen cortes, desbordamientos ni solapamientos en los anchos aprobados.
- [x] No se modifican rutas, endpoints, entidades, consultas, cálculos PR, permisos, ownership ni persistencia.
- [x] Pasan lint, tests, build y `git diff --check`.
- [ ] Queda definida una validación manual visual y funcional en navegador autenticado.

## Restricciones

- No renombrar `ExerciseResult`, tablas SQL, DTOs, endpoints ni contratos REST.
- No modificar el cálculo de mejores marcas, el registro de resultados ni los
  filtros.
- No traducir la aplicación completa ni añadir i18n.
- No modificar la página/ruta independiente de mejores marcas salvo que un
  texto sea parte de la sección activa de esta Issue.
- No añadir dependencias ni alterar la estructura general de navegación.

## Fuentes

- GitHub Issue #115.
- Issue #111 y `specs/111-filter-personal-exercise-marks/`.
- Issue #113 y `specs/113-toggle-exercise-personal-bests/`.
- `frontend/src/components/layout/navigation.ts`.
- `frontend/src/components/layout/NavigationLinks.tsx`.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
- `frontend/src/styles/my-exercise-results.css`.
- `frontend/src/views/exercise-results/myExerciseResultsPresentation.test.tsx`.
- `PROJECT.md`, `DESIGN.md`, `AGENTS.md` y `frontend/AGENTS.md`.
