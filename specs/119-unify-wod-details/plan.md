# Plan técnico

## Enfoque

Extraer la estructura común de detalle a `components/wodDetail/WodDetail.tsx`
con props presentacionales explícitas: `selectedWod`, `onBack`, eyebrow,
descripción opcional y enlace de registro opcional. Los componentes público y
personal permanecerán como wrappers delgados para conservar sus imports,
contextos y permisos. El CSS común se concentrará en `wod-detail.css` y
reemplazará las tarjetas pesadas por filas numeradas con separadores.

## Componentes afectados

- `frontend/src/components/wodDetail/WodDetail.tsx`: nueva vista compartida de
  cabecera, metadata, composición ordenada y CTA opcional.
- `frontend/src/components/wodFilter/WodDetail.tsx`: wrapper público que
  conserva la API de props y no muestra registro.
- `frontend/src/views/my-wods/components/MyWodDetail.tsx`: wrapper personal que
  configura el CTA existente y el copy personal.
- `frontend/src/styles/wod-detail.css`: sistema visual compartido, filas,
  badges, CTA naranja, focus-visible y responsive.
- `frontend/src/views/my-wods/MyWodsView.tsx`: adaptar solo wrappers de carga y
  error a los estados visuales compartidos, manteniendo mensajes y decisiones.
- `frontend/src/components/wodDetail/WodDetail.test.tsx`: regresiones para
  contexto público/personal, rutas, CTA, orden y prescripciones.
- `frontend/src/views/wods/wodDetailsPresentation.test.tsx`: regresiones de
  estados público y personal sin cambiar sus handlers.

No se modificarán páginas, APIs, schemas, tipos de dominio, backend, rutas,
registro de resultados ni reglas de ownership.

## Estrategia

1. Crear la vista común con formato visual de modalidad y una numeración visible
   que siga usando `<ol>` para conservar semántica de orden.
2. Renderizar cada prescripción como texto independiente dentro de la fila,
   manteniendo los cuatro campos actuales y su combinación cuando exista.
3. Renderizar el CTA solo si recibe un destino autorizado; usar un enlace
   nativo con estilo local naranja y foco visible.
4. Reemplazar estilos de panel/tarjeta por una superficie de composición ligera
   con separadores, wrapping seguro y breakpoints mobile-first.
5. Hacer que el detalle personal use exactamente el mismo componente que el
   público y validar que `Volver`, selección y registro conservan destinos.
6. Añadir tests estáticos de presentación para ambos wrappers, estados y todos
   los valores de prescripción.
7. Ejecutar lint, test, build y `git diff --check`, además de revisar que el
   diff no toque contratos ni backend.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de rutas, APIs, schemas, backend, `DOMAIN.md` y manifiesto.
- Validación manual pendiente: detalle público y personal con cada modalidad y
  prescripciones compuestas, CTA autorizado, Volver, foco/teclado y viewport
  móvil, tablet y desktop.
