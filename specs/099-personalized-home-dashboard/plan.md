# Plan técnico

## Enfoque

Mantener `HomePage` como frontera de datos y `HomeView` como presentación. La
página leerá `useAuth()` y solo cuando `isAuthenticated` sea verdadero llamará
`getWodResults()`. Cada transición de sesión limpiará el estado previo antes de
cargar, evitando que el resultado de otra cuenta sobreviva a un cambio de
sesión. La respuesta se limitará a los tres primeros elementos que ya llegan
ordenados por `performedAt desc, id desc` desde backend.

La vista tendrá dos ramas semánticas: la composición guest actual, conservada
sin cambios funcionales, y un dashboard autenticado compacto con encabezado,
CTA principal, accesos secundarios y actividad reciente. La actividad reutiliza
`formatWodResultDate`, `formatWodType` y `getWodResultLines`; no se crea una
segunda representación de resultados ni se modifica el contrato REST.

## Componentes afectados

- `frontend/src/pages/HomePage.tsx`: estado de actividad, carga autenticada,
  reintento y limpieza al cambiar la sesión.
- `frontend/src/views/home/HomeView.tsx`: ramas guest/authenticated, acciones,
  sección de actividad y estados accesibles.
- `frontend/src/styles/home.css`: composición responsive del dashboard,
  superficies, CTA, filas y estados respetando tokens existentes.
- `frontend/src/index.css`: solo si es necesario importar una hoja local nueva;
  se prioriza mantener las reglas de Home en `home.css`.
- `frontend/src/views/home/homePresentation.ts` y su prueba, si una función
  pura de selección/formateo reduce lógica no visual sin crear abstracción
  innecesaria.

## Estrategia de implementación

1. Confirmar este SDD y superar el Planning Guard antes de tocar código de la
   funcionalidad.
2. Añadir los tipos mínimos para props y estados de Home, reutilizando
   `WodResultResponse` y las funciones de presentación existentes.
3. Implementar en `HomePage` un efecto autenticado con cleanup, reset de estado,
   captura de errores y handler de reintento; no solicitar actividad para
   invitados.
4. Implementar en `HomeView` el render guest existente y el dashboard
   autenticado con enlaces reales y estados `loading`, `error`, `empty` y
   `success`.
5. Ajustar `home.css` con una jerarquía editorial compacta, botones y filas de
   actividad accesibles, responsive mobile-first y `prefers-reduced-motion`.
6. Añadir pruebas unitarias de la lógica pura extraída y, si el entorno actual
   lo permite sin dependencias nuevas, pruebas observables de las ramas de Home;
   no introducir otra librería de testing para esta Issue.
7. Ejecutar lint, tests, build, diff check y revisión visual de los breakpoints
   afectados.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión de cambios de sesión: invitado, autenticado, logout y cambio de
  cuenta sin datos obsoletos.
- Revisión manual de carga, actividad con resultados, vacío, error/reintento,
  teclado, móvil y escritorio.
- `21st review` sobre los archivos frontend modificados si el CLI está
  disponible.
