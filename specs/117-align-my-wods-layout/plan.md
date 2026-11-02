# Plan técnico

## Enfoque

Aplicar un cambio localizado en `MyWodsList` y `my-wods.css`. Se conservarán
los handlers recibidos por props y los destinos de navegación. La lista pasará
de tarjetas con acciones verticales a filas o tarjetas ligeras con una
jerarquía de contenido y acciones compactas; los selectores serán específicos
de `my-wods` para no alterar el catálogo público ni otras vistas que reutilizan
`.wod-card`.

## Componentes afectados

- `frontend/src/views/my-wods/components/MyWodsList.tsx`: estructura semántica
  del encabezado, CTA, contador, filas WOD y acciones.
- `frontend/src/styles/my-wods.css`: superficies, separadores, CTA primaria,
  acciones secundarias, estados de foco y breakpoints.
- `frontend/src/pages/MyWodsPage.tsx`: añadir únicamente la confirmación nativa
  previa al handler de eliminación, porque la Issue la exige y la fuente actual
  no la contiene; no se cambiarán la API, permisos ni el flujo posterior.
- `frontend/src/views/my-wods/MyWodsView.tsx`: solo si la evidencia demuestra
  que los estados de carga/error necesitan una envoltura visual específica; no
  se cambiarán sus decisiones ni mensajes.
- Nuevo test de presentación de `MyWodsList` y `MyWodsView`: rutas, contenido,
  acciones y estados de carga, vacío y error.

No se modificarán `wodsApi.ts`, schemas, tipos, backend ni rutas. La única
excepción al cambio visual en `MyWodsPage.tsx` es la confirmación nativa previa
al mismo handler de eliminación, requerida por la Issue.

## Estrategia

1. Confirmar las clases compartidas que hacen pesadas las tarjetas actuales y
   aislar los overrides dentro de `.my-wods-page`.
2. Mantener la cabecera y navegación semánticas, convirtiendo solo `+ Crear
   WOD` en CTA primaria y dejando `Resultados` como acción secundaria.
3. Renderizar cada WOD como una fila ligera con nombre, modalidad, tiempo límite
   cuando esté disponible y una barra de acciones compactas.
4. Mantener botones nativos para `Ver WOD`, `Editar` y `Eliminar`, sus handlers,
   etiquetas y orden de foco; no ocultar la acción destructiva detrás de un
   menú.
5. Proteger tamaños mínimos de control, wrapping de nombres/metadatos y padding
   inferior para el dock mediante CSS responsive y `prefers-reduced-motion`.
6. Añadir pruebas de presentación para lista con WOD, lista vacía y acciones;
   preservar los estados de página existentes.
7. Revisar diff para confirmar que no se alteraron contratos ni lógica y
   ejecutar lint, tests, build y `git diff --check`.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de APIs, rutas, tipos, backend, `DOMAIN.md` y ausencia de
  cambios fuera del alcance.
- Validación manual pendiente: listado autenticado con WODs, CTA, Resultados,
  Ver WOD, Editar, Eliminar y confirmación; estados de carga/vacío/error;
  teclado/foco; viewport móvil estrecho y desktop.
