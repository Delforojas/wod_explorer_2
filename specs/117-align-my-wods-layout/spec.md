# SDD: Alinear el layout de Mis WODs

## Objetivo

Adaptar la pantalla privada de `Mis WODs` al lenguaje visual ligero de
`Benchmarks`, conservando todas las operaciones actuales, sus rutas, contratos
de API, protecciones de ownership y el tema oscuro con acentos naranjas.

## Alcance

- Reutilizar la jerarquía de cabecera, CTA, superficies y espaciado ya
  presentes en `Benchmarks` y en los estilos compartidos del frontend.
- Mantener el título, descripción y contador de entrenamientos con una
  jerarquía clara y equivalente a la pantalla de referencia.
- Dar a `+ Crear WOD` el tratamiento de CTA primaria compacta y naranja, sin
  cambiar su destino `/create-wod`.
- Sustituir la presentación de tarjetas voluminosas por un listado o cuadrícula
  ligera con separadores discretos, conservando nombre, modalidad y metadatos
  disponibles del WOD.
- Presentar `Ver WOD`, `Editar` y `Eliminar` como acciones secundarias
  compactas, nativas y accesibles junto a cada WOD. La eliminación seguirá
  usando el handler existente y una confirmación nativa previa, alineada con el
  flujo de eliminación de resultados.
- Mantener el enlace `Resultados` y sus rutas existentes.
- Conservar los estados de carga, vacío y error y alinearlos visualmente con la
  pantalla, sin inventar contenido ni acciones nuevas.
- Ajustar el layout para móviles estrechos, tablet y desktop, incluyendo el
  espacio del dock inferior, foco visible y ausencia de overflow.
- Añadir regresiones de presentación para textos, rutas, acciones y estados sin
  modificar lógica de negocio.

## Comportamiento esperado

1. `Mis WODs` mantiene el título, descripción y contador de entrenamientos.
2. `+ Crear WOD` sigue enlazando a `/create-wod` y es la acción visual primaria.
3. `Resultados` sigue enlazando a `/my-wod-results`.
4. Cada WOD conserva su nombre, modalidad y tiempo límite cuando existe.
5. `Ver WOD` mantiene la selección asíncrona existente; `Editar` mantiene el
   formulario existente; `Eliminar` mantiene el handler y confirmación/protección
   existentes.
6. Los estados de carga, vacío y error siguen siendo claros y accesibles.
7. La presentación funciona sin cortes, overflow ni solapamientos en móviles
   estrechos, tablet y desktop, con acciones alcanzables por teclado.
8. No cambian endpoints, payloads, entidades, permisos, ownership, resultados,
   rutas ni reglas descritas en `DOMAIN.md`.

## Criterios de aceptación

- [ ] `Mis WODs` y `Benchmarks` comparten claramente cabecera, CTA, tipografía,
      espaciado, superficies y separadores.
- [ ] `+ Crear WOD` tiene jerarquía primaria y estilo compacto naranja
      equivalente a `+ Add Score`.
- [ ] Los WODs usan una distribución más ligera que las tarjetas actuales sin
      perder nombre ni modalidad.
- [ ] `Ver WOD`, `Editar` y `Eliminar` siguen accesibles y funcionales, y la
      eliminación conserva su confirmación y protecciones actuales.
- [ ] `Resultados` conserva comportamiento y navegación.
- [ ] El responsive evita overflow, texto cortado y acciones ocultas por el
      dock en móvil, tablet y desktop.
- [ ] Los estados vacío, carga y error permanecen claros.
- [ ] Se conserva la accesibilidad de teclado, foco y botones.
- [ ] No hay cambios funcionales en ownership, API, backend, DB, resultados ni
      `DOMAIN.md`.
- [ ] Existen tests de regresión para acciones, navegación y estados, y pasan
      lint, test, build y `git diff --check`.
- [ ] Queda definida una validación manual visual antes/después en móvil y
      desktop.

## Restricciones

- No rehacer la lógica CRUD ni añadir endpoints.
- No cambiar permisos de edición/borrado, versionado, histórico ni la
  confirmación nativa de eliminación fuera de añadirla como guardia previa al
  handler existente.
- No añadir búsquedas o filtros nuevos como parte del rediseño.
- No rediseñar `Benchmarks` ni otras secciones.
- No añadir dependencias, librerías UI, sistema de traducciones ni tokens
  globales nuevos.
- No modificar `DOMAIN.md`, backend, API, schemas, tipos de dominio ni
  persistencia.

## Fuentes

- GitHub Issue #117.
- Issue #115 y `specs/115-align-benchmark-terminology/` como referencia visual
  reciente.
- `frontend/src/views/my-wods/components/MyWodsList.tsx`.
- `frontend/src/views/my-wods/MyWodsView.tsx` y `frontend/src/pages/MyWodsPage.tsx`.
- `frontend/src/styles/my-wods.css`, `wod.css`, `resources.css` y
  `my-exercise-results.css`.
- `PROJECT.md`, `DESIGN.md`, `DOMAIN.md`, `AGENTS.md` y `frontend/AGENTS.md`.
