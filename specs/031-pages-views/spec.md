# SDD: Separacion de Pages y Views del frontend

## Objetivo

Separar la coordinacion de cada pantalla, mantenida en `frontend/src/pages/`,
de su presentacion especifica, mantenida en `frontend/src/views/`, sin cambiar
el comportamiento observable de la aplicacion.

## Alcance

- Mantener en las Pages el estado, efectos, llamadas API, handlers y
  coordinacion.
- Mover a las Views el JSX y la presentacion especifica de cada pantalla.
- Crear props tipadas para datos, estado y callbacks.
- Integrar las 11 Views existentes y vacias con sus Pages correspondientes.
- Mantener `GoogleCallbackPage.tsx` sin View.
- Recuperar las funciones de API de versiones y elementos de WOD que ya son
  importadas por las Pages y faltan en `wodsApi.ts`.
- Mantener el contrato visual y funcional actual.

## Pages y Views

| Page | View |
|---|---|
| `CreateWodPage.tsx` | `views/create-wod/CreateWodView.tsx` |
| `ExercisesPage.tsx` | `views/exercises/ExercisesView.tsx` |
| `HistoryPage.tsx` | `views/history/HistoryView.tsx` |
| `HomePage.tsx` | `views/home/HomeView.tsx` |
| `LoginPage.tsx` | `views/login/LoginView.tsx` |
| `MyExerciseResultsPage.tsx` | `views/exercise-results/MyExerciseResultsView.tsx` |
| `MyWodsPage.tsx` | `views/my-wods/MyWodsView.tsx` |
| `PersonalBestsPage.tsx` | `views/personal-bests/PersonalBestsView.tsx` |
| `WodsPage.tsx` | `views/wods/WodsView.tsx` |
| `WodVersionsPage.tsx` | `views/wod-versions/WodVersionsView.tsx` |
| `WodVersionItemsPage.tsx` | `views/wod-versions/WodVersionItemsView.tsx` |

`GoogleCallbackPage.tsx` queda fuera porque su responsabilidad actual es
procesar el callback y redirigir, sin una presentacion especifica que separar.

## Comportamiento esperado

Cada Page conserva sus estados, `useEffect`, llamadas a `api/`, handlers y
decisiones de flujo. Cada View recibe mediante props los datos y callbacks que
necesita para renderizar y no importa la capa API, tokens, endpoints ni
`apiClient`.

La direccion de dependencias debe ser:

```text
View -> callbacks -> Page -> API -> Backend
Backend -> API -> Page -> props -> View
```

Las Views pueden contener logica de presentacion como formateo de fechas,
modalidades y resultados, pero no logica de acceso al backend ni ownership.

Las cuatro funciones siguientes deben existir en `wodsApi.ts` y utilizar la
infraestructura API existente:

- `getWodVersions()`;
- `getWodVersionById(id)`;
- `getWodVersionItems()`;
- `getWodVersionItemById(id)`.

## Criterios de aceptacion

- [ ] Cada una de las 11 Pages indicadas utiliza su View correspondiente.
- [ ] `GoogleCallbackPage.tsx` no importa ni utiliza una View nueva.
- [ ] Las Pages conservan estado, efectos, llamadas API y handlers de flujo.
- [ ] Las Views reciben datos y acciones mediante props tipadas.
- [ ] Ninguna View importa funciones API, `fetch`, endpoints, `apiClient`,
  tokens o `localStorage`.
- [ ] `CreateWodPage` conserva la creacion, edicion de campos, prescripciones,
  eliminacion de ejercicios y reset del formulario.
- [ ] `WodsPage` conserva listado, detalle, seleccion y vuelta al listado.
- [ ] `MyWodsPage` conserva listado, detalle, edicion, eliminacion y registro
  AMRAP.
- [ ] `WodVersionsPage` conserva carga, seleccion, filtrado por version y
  detalle de composicion.
- [ ] `WodVersionItemsPage` conserva carga, seleccion y detalle de items.
- [ ] `HistoryPage` y `MyExerciseResultsPage` conservan sus estados y
  presentacion de resultados.
- [ ] `LoginPage` conserva login, almacenamiento del token, redireccion y
  acceso OAuth existente.
- [ ] No se modifica el diseño visual ni el comportamiento funcional fuera de
  la separacion estructural.
- [ ] No se introduce `any` ni se duplican innecesariamente los tipos de
  `frontend/src/types/`.
- [ ] Las funciones de versiones y elementos utilizan `apiClient`/endpoints
  existentes y mantienen sus respuestas tipadas.
- [ ] El frontend compila y el lint finaliza correctamente.
- [ ] Los tests existentes, si los hubiera, continúan pasando.

## Restricciones

- No rediseñar la interfaz.
- No añadir funcionalidades de producto.
- No cambiar rutas de React Router.
- No cambiar contratos del backend.
- No introducir dependencias nuevas.
- No cambiar autenticacion ni estado global.
- No introducir llamadas HTTP en Pages como solucion temporal.
- No implementar una View para `GoogleCallbackPage.tsx`.
- No mover API, tipos ni componentes generales a `views/`.

## Fuentes

- GitHub Issue #31.
- `frontend/src/pages/` actual.
- `frontend/src/api/` y `frontend/src/types/` actuales.
- `DOMAIN.md`, `PRODUCT.md` y `PROJECT.md`.
