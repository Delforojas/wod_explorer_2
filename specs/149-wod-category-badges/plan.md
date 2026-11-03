# Plan técnico

## Enfoque

El backend ya expone `category` en `WodAggregateResponse`; el catálogo recibe
ese dato mediante el esquema y API existentes. Se ajustará el esquema de
respuesta para aceptar un valor de categoría opcional o futuro sin invalidar
toda la respuesta. La categoría se presentará exclusivamente en `WodsList`
mediante una función de formato y clases de estilo derivadas del valor recibido.

Los badges reutilizarán el contenedor de metadatos y los tokens/estilos de
`wod.css`. Las acciones de fila no cambian.

## Componentes afectados

- `frontend/src/schemas/wodSchemas.ts`: tolerancia de categoría de catálogo.
- `frontend/src/components/wodFilter/WodsList.tsx`: badge, texto y fallback.
- `frontend/src/components/wodFilter/WodsList.test.tsx`: badges conocidos,
  fallback y conservación de acciones.
- `frontend/src/styles/wod.css`: variantes de badge dentro de metadatos.
- `specs/149-wod-category-badges/`: trazabilidad.

No se modifican backend, rutas, filtros, autenticación, base de datos ni
componentes de detalle.

## Estrategia

1. Conservar `WodCategory` estricto para filtros URL y ampliar solo la categoría
   del payload de catálogo para que pueda mostrarse un valor real futuro o nulo.
2. Añadir el badge de categoría al final de `my-wod-meta`, después del tiempo
   cuando exista.
3. Aplicar las variantes HYBRID, CROSSTRAINING y neutra con contraste legible.
4. Añadir pruebas de presentación sin cambiar acciones ni navegación.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión visual manual de badges, acciones, móvil y escritorio.
