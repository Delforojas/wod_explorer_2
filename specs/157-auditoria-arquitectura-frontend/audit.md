# Auditoría de arquitectura frontend

Estado de referencia: `main` @ `e5cd8d805b0e3f5bc58fb41ff4a9c9e4cdeb27b2` (incluye #155),
rama de trabajo `feat/157-auditoria-arquitectura-frontend`, sin cambios en código.

## Resumen ejecutivo

El frontend tiene una base sólida: TypeScript estricto, contratos Zod en el
límite HTTP, una única entrada CSS con cascada documentada, cero `!important` y
una separación razonable entre `api/`, `types/` y `views/` de presentación.

La deuda principal no es visual ni de dependencias, sino de **ubicación y
propiedad**: la documentación para agentes describe una estructura que no existe,
la orquestación de datos vive dentro de páginas grandes, y el CSS compartido
tiene selectores con dueños solapados. Hay además una dependencia declarada sin
uso y CSS probablemente muerto.

Refactorizar ahora: dependencia `gsap` sin uso, alineación de `AGENTS.md`,
limpieza verificada de CSS muerto y consolidación de los selectores `.ui-*`.
Después: extracción incremental de hooks por página y tests de páginas.
No tocar: identidad visual, contrato Zod/#155, almacenamiento de sesión y
estructura de rutas.

## 1. Mapa actual

```text
src/
  api/        client/ (apiClient, endpoints, errores) + *Api.ts por dominio
  auth/       AuthContext, sessionContext, authSession (localStorage + eventos)
  components/ auth/, layout/, wodDetail/, wodFilter/, ExerciseFilter/, DeleteIconButton
  pages/      19 contenedores conectados a rutas (App.tsx)
  views/      16 dominios con subcomponentes y módulos de presentación
  schemas/    7 archivos Zod
  types/      7 archivos; reexportan schemas y modelos auxiliares
  utils/      asyncRequest, submissionGuard, validación, scroll, selección
  styles/     40 hojas CSS (10 767 líneas) importadas desde index.css
```

Volumen: 13 941 líneas TS/TSX + 10 767 líneas CSS. 31 archivos de test.

Recorrido de datos: `pages/*` → `api/*Api.ts` → `api/client/apiClient.ts`
(fetch + `parseJson` con Zod) → backend. El estado de sesión se comparte por
`AuthContext`; las páginas mantienen su propio estado de carga/error/edición.

## 2. Fortalezas verificadas

- **Límite HTTP único.** No hay `fetch` fuera de `api/`; `parseJson`
  (`api/client/apiClient.ts:24`) valida con Zod y unifica el error de respuesta.
- **Contratos tipados.** `schemas/*` define los DTO; `types/*` reexporta y
  `api/apiTypes.ts` compone. El contrato de #155 está integrado.
- **CSS centralizado.** `src/index.css` es la única entrada y el orden de
  cascada está documentado en `src/styles/README.md`; 0 `!important` reales.
- **Configuración estricta.** `strict`, `noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax`, ESLint con hooks y refresh.
- **Sesión centralizada.** Expiración por temporizador y sincronización por
  evento de almacenamiento (`auth/AuthContext.tsx:29-49`).
- **Lógica de presentación extraída y testeada** (`wodFilters`,
  `historyPresentation`, `homePresentation`, `myWodsPresentation`).
- **Accesibilidad base.** Skip-link (`components/layout/AppLayout.tsx:19-21`),
  `aria-*` presente en 40 componentes.

## 3. Hallazgos

### F1. La documentación de estructura no coincide con el repositorio

- **Evidencia:** `frontend/AGENTS.md:28-36` declara `src/app/`, `src/features/`,
  `src/hooks/` y `src/assets/`. Esas carpetas no existen; sí existen `pages/`,
  `views/`, `auth/` y `styles/`, que no están documentadas.
- **Tipo:** deuda de documentación. **Impacto:** alto para agentes; bajo para el
  runtime. **Esfuerzo:** bajo. **Riesgo:** nulo.

### F2. La orquestación de datos vive en páginas grandes, sin capa de hooks

- **Evidencia:** `pages/MyWodsPage.tsx` (341 líneas) mezcla fetch, selección,
  edición, borrado, guards y render; concentra 17 usos de `useState`/`useEffect`.
  `pages/HomePage.tsx` (165), `pages/HistoryPage.tsx` (202) repiten el patrón
  carga/error/última-petición con `utils/asyncRequest` y
  `utils/submissionGuard`, pero no lo comparten.
- **Tipo:** deuda técnica. **Impacto:** alto para mantenibilidad y testabilidad.
  **Esfuerzo:** medio por página. **Riesgo:** medio (flujos asíncronos).

### F3. CSS compartido con propiedad solapada y duplicaciones

- **Evidencia:** 56 selectores aparecen en 2+ hojas. Ejemplos:
  `.ui-error/.ui-success/.ui-empty` se reparten entre `forms.css:86-91` (margen)
  y `surfaces.css:9-15` (borde/fondo/padding); los campos de resultado
  (`.amrap-result-fields`, `.emom-result-fields`, `.for-time-result-fields` y sus
  cabeceras) se definen tanto en su hoja específica como en `preferences.css` y
  `forms.css`.
- **Tipo:** deuda técnica. **Impacto:** medio (ambigüedad de cascada, cambios
  con efecto colateral). **Esfuerzo:** medio. **Riesgo:** medio (visual).
- Nota: una coincidencia textual de selector no prueba equivalencia; cada
  consolidación requiere comparar consumidores y cascada.

### F4. CSS probablemente muerto en `mobile-dock.css`

- **Evidencia:** de 14 clases del archivo (548 líneas), 7 no aparecen en ningún
  TS/TSX: `mobile-more-button`, `mobile-more`, `mobile-more-icon`,
  `mobile-more-menu`, `mobile-more-list`, `mobile-more-close`,
  `mobile-navigation-items-4`. Solo `mobile-dock-item` y `mobile-dock-label`
  tienen consumidor (`NavigationLinks.tsx:55,71`).
- **Tipo:** deuda técnica. **Impacto:** medio (peso y ruido). **Esfuerzo:** bajo
  tras verificar clases dinámicas. **Riesgo:** bajo.

### F5. Dependencia declarada sin uso

- **Evidencia:** `gsap ^3.15.0` en `frontend/package.json`; 0 importaciones en
  `src/`. La animación real usa canvas + `requestAnimationFrame`
  (`components/layout/PulsarGridBackground.tsx`).
- **Tipo:** deuda de dependencias. **Impacto:** medio (instalación y superficie
  de suministro). **Esfuerzo:** bajo. **Riesgo:** bajo.

### F6. Indirección de tipos en tres capas

- **Evidencia:** `schemas/wodSchemas.ts` → `types/Wod.ts` (reexport) →
  `api/apiTypes.ts` (reexport). 28 archivos importan desde `types/Wod`; solo los
  7 archivos de `api/` usan `apiTypes`. `api/wodsApi.ts:1-6` importa tipos desde
  `apiTypes` pero esquemas directamente desde `schemas/wodSchemas`.
- **Tipo:** preferencia/consistencia. **Impacto:** bajo. **Esfuerzo:** bajo.
  **Riesgo:** bajo. **Recomendación:** posponer; no aporta valor inmediato.

### F7. Dos componentes homónimos `WodDetail` y regla de ubicación difusa

- **Evidencia:** `components/wodDetail/WodDetail.tsx` es el layout compartido
  (`WodDetailLayoutProps`), mientras `components/wodFilter/WodDetail.tsx` es un
  envoltorio de WOD público que inyecta autenticación. Ambos se llaman
  `WodDetail` y el segundo no se llama como su rol.
- **Tipo:** deuda de nomenclatura. **Impacto:** bajo-medio (confusión al
  importar). **Esfuerzo:** bajo. **Riesgo:** bajo.

### F8. Páginas sin tests; la lógica testada está en presentación

- **Evidencia:** 31 tests en `components/`, `views/`, `utils/`, `schemas/` y
  `auth/`; ninguno en `pages/`. Los flujos de fetch, edición, borrado y guards de
  `MyWodsPage` no tienen cobertura directa.
- **Tipo:** deuda de calidad. **Impacto:** medio. **Esfuerzo:** medio.
  **Riesgo:** bajo. Depende de F2 para testear sin acoplar al componente.

### F9. Fondo animado global montado en todas las rutas

- **Evidencia:** `PulsarGridBackground` se monta dentro de `AppLayout`
  (`components/layout/AppLayout.tsx:24`) para toda la aplicación; usa canvas y
  `requestAnimationFrame`, con límite `MAX_DEVICE_PIXEL_RATIO = 2`.
- **Tipo:** mejora opcional de rendimiento. **Impacto:** bajo-medio; no medido.
  **Esfuerzo:** bajo. **Riesgo:** bajo. Requiere medición antes de cambiar.

### F10. Duplicación estructural `pages/` + `views/` sin contrato escrito

- **Evidencia:** las 19 páginas son contenedores y las 16 carpetas de `views/`
  contienen presentación y subcomponentes, pero esa convención no está en
  `frontend/AGENTS.md`.
- **Tipo:** deuda de documentación/consistencia. **Impacto:** medio para nuevos
  cambios. **Esfuerzo:** bajo. **Riesgo:** nulo. Se resuelve documentando, no
  reestructurando.

## 4. Priorización

| # | Recomendación | Impacto | Esfuerzo | Riesgo | Prioridad |
|---|---|---|---|---|---|
| 1 | Alinear `frontend/AGENTS.md` con la estructura real (F1, F10) | Alto | Bajo | Nulo | Alta |
| 2 | Eliminar `gsap` si se confirma sin uso (F5) | Medio | Bajo | Bajo | Alta |
| 3 | Retirar CSS muerto de `mobile-dock.css` tras verificar (F4) | Medio | Bajo | Bajo | Alta |
| 4 | Consolidar `.ui-*` y campos de resultado duplicados (F3) | Medio | Medio | Medio | Media |
| 5 | Extraer hooks por página, empezando por `MyWodsPage` (F2) | Alto | Medio | Medio | Media |
| 6 | Añadir tests de páginas sobre los hooks extraídos (F8) | Medio | Medio | Bajo | Media |
| 7 | Renombrar el envoltorio `wodFilter/WodDetail` (F7) | Bajo | Bajo | Bajo | Baja |
| 8 | Simplificar la indirección de tipos (F6) | Bajo | Bajo | Bajo | Baja |
| 9 | Medir y, si procede, condicionar el fondo animado (F9) | Bajo | Bajo | Bajo | Baja |

## 5. Roadmap incremental propuesto

Issues pequeñas e independientes, en este orden. Ninguna se crea en esta Issue.

1. **docs(frontend): alinear AGENTS.md con `pages/`, `views/`, `auth/`, `styles/`.**
   Criterio: cero referencias a carpetas inexistentes; describe la regla
   contenedor (`pages/`) vs presentación (`views/`).
2. **chore(frontend): retirar `gsap` si no se usa.**
   Criterio: `npm run build` y `npm run test` pasan; lockfile coherente.
3. **refactor(css): eliminar selectores sin consumidor en `mobile-dock.css`.**
   Criterio: búsqueda de clases dinámicas documentada; paridad visual revisada;
   lint/test/build pasan.
4. **refactor(css): un único propietario para `.ui-error/.ui-success/.ui-empty`.**
   Criterio: cada selector definido en una sola hoja; cascada equivalente
   verificada en estados de error, éxito y vacío.
5. **refactor(css): base compartida para campos de resultado AMRAP/EMOM/For Time.**
   Criterio: sin duplicación entre `preferences.css`, `forms.css` y las hojas por
   tipo; verificación visual de los tres formularios.
6. **refactor(hooks): extraer `useMyWods` de `MyWodsPage`.**
   Criterio: la página queda como composición; comportamiento de selección,
   edición, borrado y guards idéntico; tests del hook.
7. **refactor(hooks): extraer carga de datos de Home e History.**
   Criterio: reutiliza `asyncRequest`; sin regresiones en estados vacío/error.
8. **test(pages): cubrir flujos de fetch, error y mutación.**
   Criterio: los hooks de 6 y 7 tienen cobertura de éxito y fallo.

## 6. Arquitectura objetivo mínima

Solo donde la evidencia la respalda:

```text
pages/      contenedores: params de ruta, composición y llamada a hooks
hooks/      estado de datos por dominio (loading/error/última petición/mutaciones)
views/      presentación + módulos puros ya testeados
api/        cliente HTTP, endpoints, errores y *Api por dominio
schemas/    contrato Zod (fuente de verdad)
types/      tipos derivados/reexportados
styles/     tokens, patrones compartidos, hojas por página/componente
```

No se propone migrar a otro sistema de estilos, ni introducir gestores de
estado, `features/` o `app/`. La estructura actual funciona; el objetivo es
nombrarla, reducir propiedad ambigua y aislar la orquestación.

## 7. No tocar

- Identidad visual naranja/negro/glass y orden de cascada de `index.css`.
- Contrato Zod y modelos de #155.
- Persistencia y expiración de sesión en `auth/`.
- Rutas y guards de `App.tsx`.
- `DESIGN.md`, skills y workflow: solo se documentan discrepancias.

## 8. Verificación

Ejecutado en `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
Además `git diff --check`. El diff de esta Issue solo contiene documentación del
SDD y este informe.
