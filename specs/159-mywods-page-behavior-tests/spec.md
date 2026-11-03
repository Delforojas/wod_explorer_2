# SDD: Tests de comportamiento de MyWodsPage (#159)

## Objetivo

Añadir una red de seguridad de pruebas de comportamiento/regresión para
`frontend/src/pages/MyWodsPage.tsx` sin modificar la página ni su
comportamiento, de forma que una issue posterior pueda refactorizarla con
confianza.

## Contexto

- Auditoría #157 (F2, F8): `MyWodsPage` concentra carga, selección, edición,
  borrado, validación y guards; no existe ningún test bajo `pages/`.
- Dependencia de workflow: #158 (alineación de `frontend/AGENTS.md`) ya está
  integrada en `main`.
- `MyWodsPage` es un contenedor: estado propio, efectos y llamadas a
  `src/api/wodsApi.ts` y `src/api/exercisesApi.ts`; la presentación vive en
  `src/views/my-wods/`. El guard de autenticación está en la ruta
  (`components/auth/RequireAuth.tsx`), no en la página.

## Alcance

- Añadir `frontend/src/pages/MyWodsPage.test.tsx` con tests de comportamiento
  observable y de contrato con la API (módulos mockeados de forma determinista).
- Cubrir únicamente comportamientos realmente implementados:
  - estado de carga inicial;
  - carga con datos y recuento;
  - carga vacía;
  - error de carga inicial;
  - selección de WOD (detalle) y error de selección;
  - descarte de una selección obsoleta cuando llega una respuesta anterior;
  - volver desde el detalle;
  - apertura de edición con datos precargados;
  - cancelación de edición;
  - cambio de modalidad (FOR_TIME → AMRAP) y campos visibles;
  - validación previa al guardado sin llamada a la API;
  - guardado correcto (actualización visible en el listado);
  - error de guardado (formulario permanece);
  - borrado: cancelación en la confirmación, éxito y error.
- Añadir dependencias exclusivas de test si son imprescindibles para probar
  una página con estado, efectos e interacciones en Vitest.

## Fuera de alcance

- Modificar `MyWodsPage.tsx`, `MyWodsView`, subcomponentes de `views/`, `api/`,
  `schemas/`, `types/`, CSS o cualquier código de producción.
- Probar autenticación/permisos en la página: no existe lógica de auth en
  `MyWodsPage`; pertenece a `RequireAuth` y a la configuración de rutas.
- Refactorizar la página, extraer hooks o cambiar su estructura.
- Probar detalles internos (estado, refs, guards) que acoplen los tests a la
  implementación y dificulten la refactorización futura.
- Cubrir comportamientos no implementados (por ejemplo, confirmación inline de
  borrado, reintentos, paginación o edición de resultados).

## Comportamiento esperado

Los tests deben fallar ante una regresión funcional de los recorridos cubiertos
y seguir pasando si se refactoriza la orquestación sin cambiar el
comportamiento observable. Las aserciones se apoyan en texto/roles accesibles y
en llamadas a la API, no en clases CSS decorativas ni en el estado interno.

## Decisiones técnicas

- **Entorno DOM de test**: se añaden como `devDependencies` `jsdom` y
  `@testing-library/react` (con `@testing-library/dom`), imprescindibles para
  renderizar una página con `useEffect`, interacciones y eventos en Vitest. Son
  dependencias exclusivas de test; no afectan al bundle ni al runtime.
- **Entorno por archivo**: se usa `// @vitest-environment jsdom` en el test
  nuevo para no alterar la configuración global ni los tests SSR existentes.
- **Aislamiento de API**: se mockean `../api/wodsApi` y `../api/exercisesApi`;
  ninguna petición real ni `fetch`.
- **Confirmación de borrado**: se stubea `window.confirm` para probar
  aceptación y cancelación sin diálogos del navegador.

## Criterios de aceptación

- [ ] Existen pruebas de página para los recorridos principales y los errores
      y estados realmente implementados.
- [ ] Se documenta la cobertura conseguida y las lagunas pendientes sin
      inventar escenarios.
- [ ] `npm run test`, `npm run lint`, `npm run build` y `git diff --check`
      pasan (o se documenta un fallo preexistente).
- [ ] No hay cambios funcionales ni refactorización de `MyWodsPage`.
- [ ] Los tests son una base reutilizable para la futura refactorización.

## Restricciones

- Solo se modifican archivos de test y el manifiesto de dependencias de test.
- Ningún cambio en código de producción, CSS, DTOs, API ni arquitectura.
- Mocks deterministas; sin esperas arbitrarias ni tests dependientes del orden
  de ejecución.
- No debilitar ni desactivar tests existentes.
