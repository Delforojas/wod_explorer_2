# Plan técnico

## Enfoque

Ampliar únicamente la rama autenticada de `HomeView` con un segundo enlace de
registro y un acceso rápido a Benchmarks. Los enlaces reutilizarán las rutas
privadas ya declaradas en `App.tsx`; la rama pública conservará exactamente sus
acciones actuales.

La actividad reciente seguirá usando `getWodResults` y la presentación WOD ya
existente. Se añadirá una marca visual del tipo WOD porque ese dato está
disponible, pero no se incorporará una consulta de resultados de ejercicios ni
se inventarán eventos que Home no recibe.

El espacio de seguridad se resolverá en el contenedor de Home autenticada para
que el contenido pueda desplazarse por encima del dock fijo en anchos móviles y
de tablet donde el dock está visible. El cálculo incluirá una reserva estable y
`env(safe-area-inset-bottom)`.

## Componentes afectados

- `frontend/src/views/home/HomeView.tsx`: segundo CTA, acceso Benchmarks,
  agrupación de CTAs, wrap del saludo y tipo WOD en actividad.
- `frontend/src/styles/home.css`: jerarquía sólida/outline, composición
  responsive, wrap del nombre, actividad y clearance inferior del dock.
- `frontend/src/views/home/homePresentation.test.tsx`: navegación, visibilidad
  auth/guest, actividad disponible y regresiones de presentación.
- `specs/127-home-score-cta/`: SDD y trazabilidad.

No se modificarán `App.tsx`, APIs, backend, entidades, autenticación,
autorización, navegación global ni `DOMAIN.md`, porque las rutas y el estado de
sesión existentes son suficientes.

## Estrategia

1. Confirmar las rutas privadas existentes y separar la rama autenticada de la
   pública en los tests de presentación.
2. Envolver los CTAs autenticados en un grupo responsive: columna en móvil y
   composición de dos columnas desde el breakpoint de escritorio de Home.
3. Añadir el enlace Benchmarks al bloque de accesos rápidos conservando todos
   los enlaces actuales.
4. Añadir una clase de copia al saludo con `min-width: 0` y reglas de wrap para
   usernames largos.
5. Marcar la actividad disponible como WOD sin ampliar sus fuentes de datos ni
   modificar su contenido.
6. Añadir clearance inferior a Home autenticada para el dock fijo y la safe area.
7. Ejecutar lint, tests, build y `git diff --check`, y revisar que solo se
   modifican archivos de Home y el SDD.

## Verificación

- Frontend: `npm run lint` desde `frontend/`.
- Frontend: `npm run test` desde `frontend/`.
- Frontend: `npm run build` desde `frontend/`.
- Revisión: `git diff --check`.
- Revisión estática: rutas existentes, rama guest sin CTAs privados, accesos
  completos, actividad sin datos inventados y ausencia de cambios backend/API.
- Verificación automática completada: lint, 25 suites/96 tests, build y
  `git diff --check`.
- Validación manual pendiente: CTAs, navegación, responsive, wrap de nombres,
  actividad y scroll final sin solapamiento del dock.
