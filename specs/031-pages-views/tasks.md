# Tasks: Separacion de Pages y Views del frontend

## Orden y dependencias

1. Completar el SDD y confirmar la base de trabajo.
2. Recuperar las funciones API de versiones y elementos de WOD.
3. Refactorizar las Pages publicas y de autenticacion.
4. Refactorizar las Pages de WOD y resultados.
5. Verificar imports, tipos, build y lint.
6. Revisar el diff y crear el commit de #31.

Las Views deben existir antes de integrar las Pages. La correccion de la API de
versiones debe preceder a la verificacion del build.

## Tareas ejecutables

- [x] Crear `spec.md`, `plan.md` y `tasks.md` para #31.
- [x] Añadir endpoints de `wod-versions` y `wod-version-items`.
- [x] Añadir mensajes de error para versiones y elementos.
- [x] Implementar `getWodVersions`, `getWodVersionById`, `getWodVersionItems` y
  `getWodVersionItemById`.
- [x] Integrar `HomeView` en `HomePage`.
- [x] Integrar `LoginView` en `LoginPage` sin cambiar login ni OAuth.
- [x] Integrar `ExercisesView` en `ExercisesPage`.
- [x] Integrar `WodsView` en `WodsPage`.
- [x] Integrar `CreateWodView` en `CreateWodPage`.
- [x] Integrar `MyWodsView` en `MyWodsPage`.
- [x] Integrar `HistoryView` en `HistoryPage`.
- [x] Integrar `MyExerciseResultsView` en `MyExerciseResultsPage`.
- [x] Integrar `PersonalBestsView` en `PersonalBestsPage`.
- [x] Integrar `WodVersionsView` en `WodVersionsPage`.
- [x] Integrar `WodVersionItemsView` en `WodVersionItemsPage`.
- [x] Mantener `GoogleCallbackPage.tsx` sin cambios y sin View.
- [x] Verificar que ninguna View importa API, endpoints, tokens o `localStorage`.
- [x] Verificar que no se introduce `any` ni se duplican tipos de dominio.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Revisar manualmente los flujos y estados visuales preservados.
- [x] Revisar el diff y excluir cambios ajenos del staging.
