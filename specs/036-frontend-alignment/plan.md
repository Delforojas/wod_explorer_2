# Plan: Alineacion del frontend con `frontend/AGENTS.md`

## Enfoque

1. Auditar estructura, configuracion, Pages, Views, API, estado, estilos,
   accesibilidad y scripts con las fuentes de verdad disponibles.
2. Separar correcciones seguras de deudas que requieren migracion o decisiones
   adicionales.
3. Preservar el comportamiento existente, restaurando la pantalla de marcas de
   ejercicios y eliminando el rediseño local fuera de alcance.
4. Mantener la arquitectura Pages/Views actual como estado transitorio y
   documentar la migracion feature-based como trabajo posterior.
5. Verificar tipos, lint, build, diff y ausencia de cambios fuera del alcance.

## Archivos previstos

- `frontend/src/App.tsx`: restaurar la ruta existente.
- `frontend/src/views/**/*.Types.ts`: conservar tipos de props extraidos.
- `frontend/src/views/create-wod/CreateWodView.tsx` y
  `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`: conservar
  presentacion funcional y retirar estilos de rediseño no autorizados.
- `frontend/src/schemas/`: schemas Zod y tipos derivados para contratos de API.
- `frontend/src/api/`: validacion de payloads y respuestas en la frontera HTTP.
- `frontend/package.json` y `frontend/package-lock.json`: Vitest, Zod y script de
  test.
- `frontend/index.html`, `frontend/src/components/layout/AppLayout.tsx` y
  `frontend/src/index.css`: correcciones basicas de idioma, skip link y foco.
- `frontend/tsconfig.app.json` y `frontend/tsconfig.node.json`: modo estricto.
- `frontend/README.md`: comandos de verificacion.
- `specs/036-frontend-alignment/`: documentacion de la Issue.

## Decisiones

- No se crea una migracion completa a `features/` en esta Issue.
- No se añade una libreria de estilos ni estado global.
- No se modifica el backend ni los contratos API.
- Zod y Vitest se reportan como desviaciones de configuracion si no existe una
  necesidad concreta y acotada para implementarlos completamente.
- Los archivos de skills instalados localmente solo se incluyen si el diff
  final demuestra que forman parte del soporte de esta Issue; no se convierten
  automaticamente en cambios de producto.

## Verificacion

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`, reportando si el script no existe.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revision manual de rutas, imports de Views, API, estados de carga/error/vacio
  y cambios visuales.
