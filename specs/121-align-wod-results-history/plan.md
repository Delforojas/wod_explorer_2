# Plan técnico

## Enfoque

Aplicar un cambio localizado en la vista, sus componentes de presentación y el
CSS específico de resultados WOD. La navegación redundante se eliminará del
JSX; el CTA conservará la ruta actual y reutilizará las clases visuales de
Benchmarks. Las filas usarán semántica de `article`, encabezado, metadatos y
acción nativa, sin alterar los handlers recibidos por props.

## Archivos afectados

- `frontend/src/views/wod-results/MyWodResultsView.tsx`: retirar
  `MyWodsNavigation`, ajustar el copy de contexto y aplicar la navegación/CTA
  compartida de Benchmarks.
- `frontend/src/views/wod-results/components/WodResultsList.tsx`: cambiar el
  wrapper visual de grid de tarjetas por un listado ligero específico.
- `frontend/src/views/wod-results/components/WodResultCard.tsx`: reorganizar
  cada resultado como fila, mantener todos los valores y omitir únicamente el
  identificador técnico de la UI.
- `frontend/src/styles/my-wods-results.css`: reemplazar reglas de tarjetas y
  paneles anidados por filas, separadores, CTA, acciones, focus-visible y
  breakpoints mobile-first.
- `frontend/src/views/wod-results/myWodResultsPresentation.test.tsx`: añadir
  regresiones para navegación, formatos, contenido, eliminación y estados.
- `specs/121-align-wod-results-history/{spec,plan,tasks}.md`: mantener la
  trazabilidad del trabajo y sus verificaciones.

No se modificarán `MyWodResultsPage.tsx`, APIs, schemas, tipos de dominio,
backend, rutas, confirmación nativa ni persistencia.

## Estrategia

1. Eliminar el wrapper `MyWodsNavigation` de la vista y conservar solo el CTA
   de registro con `exercise-results-navigation`, `exercise-results-nav-link`
   y `exercise-results-nav-action`.
2. Mantener cabecera, contador y estados existentes, cambiando únicamente el
   subtítulo para distinguir historial de resultados de WODs creados.
3. Renderizar la colección con un contenedor `resource-list` específico y cada
   resultado como fila con nombre, modalidad/origen, fecha, todas las líneas
   del resultado y botón de eliminación.
4. Mantener el dato `wodVersionId` dentro de `WodResultResponse`, sin
   presentarlo como metadato de usuario.
5. Aislar estilos en `.my-wod-results-page` y `.my-wod-result-*`, con controles
   de al menos 44px, wrapping seguro, dock padding y `prefers-reduced-motion`.
6. Añadir tests estáticos de presentación para resultados completos/incompletos,
   AMRAP/EMOM y los estados de carga, vacío y error.
7. Ejecutar lint, tests, build y `git diff --check`; revisar que el diff no
   toque contratos ni backend.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de rutas, APIs, schemas, backend, `DOMAIN.md` y archivos
  modificados.
- Validación manual pendiente: resultados completos/incompletos de las tres
  modalidades, CTA, eliminación/confirmación, loading/vacío/error, teclado,
  foco y viewports móvil, tablet y desktop.
