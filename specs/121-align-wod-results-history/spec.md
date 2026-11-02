# SDD: Alinear el historial de resultados WOD

## Objetivo

Unificar la vista privada `/my-wod-results` con el lenguaje visual ligero,
oscuro y naranja de `Benchmarks`, eliminando el enlace redundante `Resultados`
sin cambiar sus rutas, datos, eliminación, contratos API ni reglas de dominio.

## Alcance

- Eliminar únicamente el botón/tab `Resultados` que aparece dentro de
  `/my-wod-results`; conservar los accesos a esa ruta desde otras vistas.
- Mantener la cabecera `Mis WODs` y aclarar que la pantalla representa el
  historial de resultados registrados.
- Reutilizar la navegación y el CTA compacto naranja ya usados por Benchmarks
  para `+ Registrar resultado`, conservando `/my-wod-results/new`.
- Sustituir las tarjetas pesadas por filas ligeras con separadores que muestren
  nombre del WOD, modalidad, origen, fecha y resultado registrado.
- Mantener todos los formatos existentes de `FOR_TIME`, `AMRAP` y `EMOM`,
  incluidos resultados incompletos y sus líneas de progreso.
- Ocultar `wodVersionId` de la presentación general sin eliminarlo del objeto
  de datos ni alterar la trazabilidad del dominio.
- Mantener `Eliminar resultado` como acción secundaria/destructiva, accesible y
  protegida por la confirmación nativa existente en la página.
- Conservar loading, vacío, error, foco visible, teclado y responsive sin
  overflow ni solapamiento con el dock móvil.
- Añadir regresiones de presentación para navegación, contenido, formatos,
  eliminación y estados.

## Comportamiento esperado

1. `/my-wod-results` no renderiza el enlace `Resultados` dentro de la página.
2. La cabecera identifica la pantalla como historial de resultados de WOD.
3. `+ Registrar resultado` conserva su ruta y usa el mismo tratamiento naranja
   compacto que el CTA de Benchmarks.
4. Cada fila muestra el WOD, modalidad, origen, fecha y todas las líneas del
   resultado correspondiente.
5. La versión interna no aparece como metadato destacado ni se elimina del
   contrato de datos.
6. La acción de eliminación mantiene su handler, estado disabled y confirmación
   nativa existente.
7. Los estados de carga, vacío y error permanecen claros y accesibles.
8. No cambian endpoints, payloads, tipos de dominio, permisos, persistencia,
   histórico ni reglas de `DOMAIN.md`.

## Criterios de aceptación

- [ ] No aparece `Resultados` como botón o tab dentro de `/my-wod-results` ni
      queda espacio residual por su eliminación.
- [ ] La página comparte jerarquía, CTA, tipografía, densidad, separadores y
      tokens visuales con Benchmarks y Mis WODs.
- [ ] Las entradas se presentan como filas o una cuadrícula ligera, sin tarjetas
      voluminosas anidadas.
- [ ] WOD, modalidad, origen, fecha y resultado son visibles.
- [ ] `FOR_TIME`, `AMRAP`, `EMOM` y progreso incompleto conservan todos sus
      valores representados actualmente.
- [ ] `Eliminar resultado` sigue accesible, secundario/destructivo y protegido
      por la confirmación existente.
- [ ] Loading, vacío, error, foco, teclado y responsive se conservan.
- [ ] No se modifican endpoints, entidades, permisos, persistencia, histórico,
      backend ni reglas de dominio.
- [ ] Pasan lint, tests, build y `git diff --check`.
- [ ] Queda documentada la validación manual visual pendiente en móvil y
      desktop.

## Restricciones

- No modificar `MyWodResultsPage` salvo que una regresión demostrable lo exija.
- No cambiar cálculo, formatos, modalidades o contratos de resultados.
- No añadir filtros, ordenación, endpoints, dependencias ni nuevos tokens
  globales.
- No rediseñar el listado de Mis WODs ni Benchmarks.
- No modificar backend, base de datos, schemas, `DOMAIN.md` ni persistencia.

## Fuentes

- GitHub Issue #121.
- `specs/117-align-my-wods-layout/` y `specs/119-unify-wod-details/`.
- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`.
- `frontend/src/styles/my-exercise-results.css`.
- `frontend/src/views/wod-results/MyWodResultsView.tsx` y sus componentes.
- `frontend/src/styles/my-wods-results.css`, `wod.css` y `resources.css`.
- `PROJECT.md`, `DESIGN.md`, `DOMAIN.md`, `AGENTS.md` y
  `frontend/AGENTS.md`.
