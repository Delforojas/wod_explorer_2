# Plan: Separacion de Pages y Views del frontend

## Enfoque

Mantener cada Page como coordinador del flujo y trasladar su JSX especifico a
una View con una interfaz de props explicita. El refactor se hara Page por Page,
preservando las condiciones de carga, error, vacio, detalle y formulario
actuales.

Las Views no tendran imports desde `frontend/src/api/`. Las funciones de
formateo y renderizado que no dependan de efectos o estado de negocio podran
vivir dentro de la View para mantener la presentacion junto a su JSX.

## Componentes afectados

- 11 archivos de `frontend/src/pages/`.
- 11 archivos de `frontend/src/views/`.
- `frontend/src/api/wodsApi.ts`.
- `frontend/src/api/client/apiEndpoints.ts`.
- `frontend/src/api/client/apiError.ts`.

No se modificara `GoogleCallbackPage.tsx`, `App.tsx`, el backend ni las rutas.

## Cambios tecnicos

1. Definir una interfaz de props por View con tipos existentes del dominio.
2. Trasladar JSX, formularios, listados, mensajes y estados visuales a las
   Views.
3. Sustituir handlers inline de las Pages por callbacks nombrados cuando sea
   necesario para conservar la coordinacion en la Page.
4. Mantener en Pages las llamadas API y los cambios de estado.
5. Añadir las rutas de versiones y elementos a `API_ENDPOINTS`.
6. Añadir las cuatro funciones de lectura faltantes en `wodsApi.ts`, con
   manejo de errores y tipos existentes.
7. Ejecutar build y lint, y revisar que las Views no importen API ni tokens.

## Estrategia de verificacion

- `npm run build` desde `frontend/` para type checking y build.
- `npm run lint` desde `frontend/`.
- Buscar imports prohibidos desde `frontend/src/views/`.
- Revisar que `GoogleCallbackPage.tsx` no cambie.
- Verificar que las cuatro funciones de versiones/items dejan de producir
  imports sin exportar.
- Comparar rutas y estructura de `App.tsx` antes y despues.
- Revisar manualmente los flujos de carga, detalle, formularios y callbacks.
