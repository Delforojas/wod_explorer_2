# Plan técnico

## Enfoque

Aplicar una sustitución puntual de copy en las fuentes activas de navegación y
en la vista de resultados de ejercicios. Se conservarán los valores internos
del modo (`all` y `best`), los destinos de navegación, la lógica de estado y
los contratos de API. Solo se ajustará el CSS local de la vista si los textos
nuevos necesitan una protección adicional para anchos pequeños.

## Componentes afectados

### Navegación

- `frontend/src/components/layout/navigation.ts`: etiquetas visibles de la
  entrada de Benchmarks en las fuentes de navegación activas.
- `frontend/src/components/layout/NavigationLinks.tsx`: solo se revisará si la
  evidencia de renderizado demuestra que necesita cambios; no se prevé tocar su
  lógica.
- `frontend/src/components/layout/NavigationPlacement.test.tsx`: cobertura de
  etiqueta y destino en navegación autenticada.

### Pantalla de resultados

- `frontend/src/views/exercise-results/MyExerciseResultsView.tsx`: título, CTA,
  selector, etiqueta accesible del buscador y referencias visibles de la
  sección.
- `frontend/src/styles/my-exercise-results.css`: evitar wrap o desbordamiento
  de los textos nuevos en móvil respetando tokens existentes.
- `frontend/src/views/exercise-results/myExerciseResultsPresentation.test.tsx`:
  actualizar expectativas de copy y preservar las regresiones de modo, estados,
  CTA y distintivo PR.

No se modificarán `frontend/src/pages/MyExerciseResultsPage.tsx`, APIs,
schemas, tipos de resultados, backend, rutas, persistencia ni el componente de
PR salvo que una prueba revele una dependencia directa del copy aprobado.

## Estrategia

1. Confirmar las fuentes de navegación que realmente se renderizan en desktop y
   mobile, y actualizar únicamente sus etiquetas de Benchmarks.
2. Sustituir los textos visibles aprobados en `MyExerciseResultsView`, dejando
   intactos los estados, handlers, rutas y valores internos del modo.
3. Ajustar el tamaño/nowrap de los botones del selector en el breakpoint móvil
   solo si es necesario para los textos `All Scores` y `Personal Records`.
4. Actualizar pruebas de presentación y navegación para cubrir los textos,
   destinos, `aria-pressed`, placeholder, CTA y accesibilidad del PR.
5. Revisar que no haya referencias visibles antiguas dentro del alcance y que no
   se hayan tocado contratos o cálculos.
6. Ejecutar lint, tests, build y `git diff --check` desde las rutas del proyecto.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión estática de rutas, endpoints, APIs, schemas y archivos backend sin
  cambios.
- Validación manual pendiente de aprobación: navegación autenticada, CTA,
  selector, búsqueda, PR, teclado y responsive en 320–390 px, 600–899 px y
  desktop.
