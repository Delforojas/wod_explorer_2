# Plan técnico

## Enfoque

Auditoría de solo lectura sobre el estado integrado de `main`. Se combina un
inventario estructural con lecturas dirigidas de archivos representativos y
búsquedas puntuales para confirmar cada hallazgo. El resultado se documenta en
`audit.md` como informe accionable; no se modifica código.

## Estrategia

1. Registrar el estado Git de referencia (rama, `HEAD`, árbol de trabajo) y
   confirmar que #155 está integrado en el commit auditado.
2. Inventariar `src/`: páginas, vistas, componentes, API, esquemas, tipos,
   utilidades, autenticación y hojas CSS, incluyendo tamaños y duplicidades de
   nombre.
3. Leer archivos representativos por capa:
   - composición y rutas (`App.tsx`, `AppLayout`);
   - páginas con lógica (`WodsPage`, `HomePage`, `HistoryPage`, `MyWodsPage`);
   - vistas y componentes grandes (`CreateWodView`, `MyWodEditForm`,
     `WodDetail`, `PulsarGridBackground`);
   - infraestructura de API y errores (`api/client/*`, `wodsApi`);
   - contratos y validación (`schemas/*`, `utils/wodDefinitionValidation`);
   - autenticación y sesión (`auth/*`);
   - arquitectura CSS (`index.css`, `styles/README.md`, `tokens.css` y hojas
     con consumidores solapados).
4. Confirmar duplicaciones y acoplamientos con búsquedas concretas (imports
   cruzados, componentes homónimos, selectores repetidos, tipos reexportados).
5. Clasificar cada hallazgo por tipo, impacto, esfuerzo, riesgo y prioridad,
   citando archivo y línea cuando aporte precisión.
6. Redactar el roadmap incremental con issues pequeñas, orden y criterios de
   aceptación, sin crearlas.
7. Verificar que el diff contiene exclusivamente documentación del SDD y del
   informe, y ejecutar las comprobaciones del frontend para confirmar que el
   estado analizado permanece intacto.

## Verificación

Desde `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
Además: `git diff --check` y revisión del manifiesto de cambios para confirmar
que no se tocó código de producción, estilos, dependencias, configuración ni
pruebas.
