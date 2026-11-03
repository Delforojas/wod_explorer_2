# Plan técnico

## Enfoque

`WodsList` ya obtiene `category` desde `useSearchParams` y lo combina con la
búsqueda mediante `filterWods`. Se añadirá una barra de botones nativos en esa
vista, usando el mismo modelo de selección única (`aria-pressed`) que Historial.
La URL seguirá siendo la fuente de verdad de categoría: al seleccionar una
pestaña se preservarán los demás parámetros y se establecerá o eliminará
`category`.

Los estilos residirán en `wod.css`, próximos al catálogo. Reutilizarán
superficies, bordes, espaciado y foco existentes, con un contenedor flexible
para las etiquetas largas en pantallas pequeñas.

## Componentes afectados

- `frontend/src/components/wodFilter/WodsList.tsx`: control segmentado y
  actualización compatible de `category` en URL.
- `frontend/src/components/wodFilter/WodsList.test.tsx`: renderizado,
  categoría desde URL, filtrado, URL e interacción de búsqueda.
- `frontend/src/styles/wod.css`: estilos responsive y accesibles del control.
- `specs/151-wod-category-filter-bar/`: trazabilidad de la issue.

No se modifican endpoints, contratos, Home, Historial, autenticación ni base
de datos.

## Estrategia

1. Conservar `isWodCategory` y `filterWods` como lógica de validación y
   filtrado, con `category` de URL como fuente única de estado.
2. Añadir los tres botones después del buscador y antes del contador.
3. Al seleccionar Todos, eliminar solo `category`; al seleccionar una
   categoría válida, actualizar solo ese parámetro.
4. Estilizar la barra con botones de al menos 44 px, `aria-pressed`, foco
   visible y ajuste responsive.
5. Probar resultados, estados combinados, URL inicial y cambios de pestaña;
   ejecutar las verificaciones del frontend.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Validación manual de las tres pestañas, búsqueda combinada, enlaces de Home,
  navegación atrás/adelante y diseño móvil/escritorio.
