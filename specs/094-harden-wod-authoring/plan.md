# Plan técnico

## Enfoque

Centralizar las reglas puras de prescripción en una utilidad de validación que
reciba la definición del WOD y el catálogo de ejercicios disponible. La página
de creación y el formulario de edición usarán esa misma función antes de
llamar a `createWod` o `updateWod`, evitando duplicar reglas en la interfaz.
Los campos de cada medición se renderizarán desde el `measurementType` real del
ejercicio, incluyendo `DISTANCE_TIME`, y se conservarán al editar.

Para la concurrencia se usarán identificadores monotónicos por flujo de
selección y flags de actividad en efectos de carga. El estado solo se aplicará
si la respuesta sigue siendo la más reciente y el componente continúa montado.
Los handlers de submit tendrán una guarda síncrona independiente del batching de
React y los controles reflejarán el estado ocupado.

## Componentes afectados

- `frontend/src/schemas/wodSchemas.ts`: conservar el contrato y reforzar los
  valores estructurales de las prescripciones.
- `frontend/src/utils/`: nueva validación pura y pruebas asociadas.
- `frontend/src/pages/CreateWodPage.tsx`: validación, submit único y carga
  segura de ejercicios.
- `frontend/src/views/create-wod/`: campos y mensajes para
  `DISTANCE_TIME` y estado de envío.
- `frontend/src/pages/MyWodsPage.tsx`: validación, submit único y selección
  segura de WOD.
- `frontend/src/views/my-wods/components/MyWodEditForm.tsx`: edición de todos
  los campos de medición y errores por prescripción.
- `frontend/src/pages/ExercisesPage.tsx`: selección de detalle race-safe.
- `frontend/src/pages/WodsPage.tsx`, `WodVersionsPage.tsx` y
  `WodVersionItemsPage.tsx`: selección de detalle race-safe donde corresponda.
- `frontend/src/pages/RegisterExerciseResultPage.tsx`: carga segura de
  ejercicios sin actualizar estado después del desmontaje.
- `frontend/src/utils/*.test.ts` y pruebas existentes relacionadas: cobertura
  de reglas y carreras observables.

## Estrategia de implementación

1. Crear y validar este SDD antes de tocar código.
2. Auditar los tipos y componentes de creación/edición para no perder campos
   existentes.
3. Añadir la tabla explícita de campos requeridos por `measurementType` y
   errores identificables por índice/nombre de ejercicio.
4. Integrar la validación en ambos submits, manteniendo los contratos API.
5. Añadir `DISTANCE_TIME` a los selectores, inputs, serialización y
   presentación de prescripciones.
6. Añadir guardas de envío y hacer deterministas las selecciones/cargas
   asíncronas afectadas.
7. Añadir pruebas unitarias de cada medición, combinaciones inválidas, doble
   submit y respuestas fuera de orden.
8. Ejecutar lint, tests, build y revisión de diff.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión manual de creación, edición, errores, carga, selección y estados
  ocupados en desktop y móvil.
