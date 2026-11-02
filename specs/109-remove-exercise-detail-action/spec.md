# SDD: Retirar acción de detalle del catálogo de ejercicios

## Objetivo

Eliminar la acción «Ver detalle» y el flujo de detalle asociado del catálogo de
ejercicios para visitantes y usuarios autenticados, conservando la exploración
del catálogo y el registro de resultados.

## Alcance

- Retirar el botón «Ver detalle» del listado compartido de ejercicios.
- Eliminar el estado, handler, carga por ID, componente y estilos que existan
  exclusivamente para mostrar el detalle inline.
- Retirar únicamente las referencias frontend al endpoint de detalle si quedan
  sin consumidores; no modificar ni eliminar endpoints backend sin verificar
  dependencias.
- Mantener búsqueda, filtrado, datos del catálogo, responsive, accesibilidad y
  la acción autenticada «Registrar resultado» con su `exerciseId`.
- No modificar otras vistas de ejercicios, WODs, resultados ni contratos REST.

## Comportamiento esperado

1. El catálogo no muestra «Ver detalle» ni una acción equivalente para ningún
   estado de autenticación.
2. Las tarjetas de ejercicios no abren, cargan ni renderizan una vista de
   detalle mediante clicks, iconos o handlers residuales.
3. El listado mantiene su búsqueda, contador, estados vacío/error y datos.
4. Un usuario autenticado conserva el enlace a
   `/exercise-results/new?exerciseId=<id>`.
5. La vista conserva semántica, foco, objetivos táctiles y layout responsive.
6. No se realizan peticiones de detalle desde el catálogo y no quedan
   referencias frontend huérfanas atribuibles solo a esa acción.

## Criterios de aceptación

- [ ] «Ver detalle» no aparece para visitantes ni usuarios autenticados.
- [ ] No existe camino residual desde tarjetas, iconos o acciones del catálogo
      para abrir el detalle.
- [ ] No quedan handlers, estado, componentes, estilos o referencias cliente
      huérfanos dedicados únicamente al detalle.
- [ ] Búsqueda, filtros, datos, responsive y accesibilidad se conservan.
- [ ] El enlace autenticado de registro conserva el `exerciseId` correcto.
- [ ] No se modifican contratos REST ni funcionalidades de registro de
      resultados.
- [ ] Las pruebas afectadas, lint y build pasan junto con `git diff --check`.
- [ ] La validación manual cubre visitante y usuario autenticado en móvil y
      escritorio.

## Restricciones

- No rediseñar completamente las tarjetas ni el catálogo.
- No eliminar ejercicios, resultados históricos ni funcionalidades de registro.
- No modificar backend, base de datos, contratos REST ni reglas de dominio.
- No añadir dependencias ni sustituir la arquitectura React + hooks existente.

## Fuentes

- GitHub Issue #109.
- `frontend/src/pages/ExercisesPage.tsx`.
- `frontend/src/views/exercises/ExercisesView.tsx`.
- `frontend/src/components/ExerciseFilter/ExercisesList.tsx`.
- `frontend/src/components/ExerciseFilter/ExerciseDetail.tsx`.
- `specs/092-exercise-result-selection/`.
- `AGENTS.md`, `frontend/AGENTS.md`, `PROJECT.md` y `DESIGN.md`.
