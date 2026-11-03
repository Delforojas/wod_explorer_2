# Plan técnico

## Enfoque

Mantener `WodDetail` como vista compartida para WOD público y personal. Se
derivarán textos de presentación únicamente de `WodAggregateResponse`: modalidad,
rondas, límite de tiempo y campos de cada ítem de composición. El marcado pasará
de filas con índice decorativo y metadatos secundarios a una composición con una
columna de prescripción prominente y otra para el movimiento.

## Componentes afectados

- `frontend/src/components/wodDetail/WodDetail.tsx`: estructura semántica,
  formato de modalidad/tiempo y presentación de prescripciones.
- `frontend/src/styles/wod-detail.css`: layout compacto de pizarra, responsive,
  foco visible y jerarquía visual con tokens existentes.
- `frontend/src/components/wodDetail/WodDetail.test.tsx`: regresiones del
  contrato visual, orden, modalidades, prescripciones y CTA existente.

No se modificarán los wrappers público/personal, API, schemas, rutas, backend o
persistencia porque el contrato actual ya provee toda la información del alcance.

## Estrategia de implementación

1. Inspeccionar y conservar las rutas y props del componente compartido.
2. Formatear el tiempo existente para lectura breve y describir rondas como
   ciclos, diferenciándolos visualmente de las repeticiones de cada ítem.
3. Renderizar los valores de prescripción como el primer contenido de cada fila;
   renderizar el nombre del movimiento después y conservar los campos secundarios
   presentes.
4. Reescribir solo el CSS del detalle para eliminar el aspecto de tarjetas e
   índices circulares, manteniendo los tokens, la densidad móvil y foco visible.
5. Añadir pruebas con AMRAP, FOR_TIME, EMOM, prescripción compuesta, orden y CTA.
6. Ejecutar lint, tests, build y revisión de whitespace; realizar revisión visual
   manual antes de crear un commit, tal como exige el Issue.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check` desde la raíz.
- Revisión manual pendiente de Cindy AMRAP, un FOR_TIME con rondas y cargas, y un
  EMOM con duración/distancia en viewport móvil y escritorio.
