# Plan de implementación

## Enfoque

Adoptar una dirección de **registro operativo de entrenamiento**: cada página prioriza un título útil, la métrica o identidad del recurso y una acción clara. Las filas, separadores y el espacio vertical reemplazan la acumulación de tarjetas; una superficie solo agrupa información que se consume o edita en conjunto.

## Exploración visual

Se consultó 21st con `fitness training workout activity history metrics compact mobile sidebar` antes de implementar. No se recuperó ni instalará código de los resultados.

| Referencia | Decisión | Adaptación a WOD Explorer |
| --- | --- | --- |
| Activity Card, `@kokonutd` | Adoptar parcialmente | Jerarquía de actividad mediante nombre, metadatos y cifra; se eliminará la card aislada repetitiva en favor de filas separadas. |
| Workout Summary Card y Workout Card, `@ravikatiyar162` | Adoptar parcialmente | Prioridad de la modalidad, composición y acción de consulta; sin la composición de dashboard ni ornamentos. |
| Health Stat Card, `@ruixen.ui` | Adoptar parcialmente | Escala y alineación de métricas para tiempo, rondas, repeticiones, peso y marcas. |
| Sidebar, `@uniquesonu` | Conservar el patrón existente | La sidebar de #39 ya satisface el patrón; no se sustituye ni se añade otra navegación. |
| Weekly Fitness Card, Activity Stats Card y Card | Descartar | Refuerzan grids de cards y resúmenes decorativos incompatibles con la densidad operativa y el criterio de menos superficies. |

## Componentes afectados

- `frontend/src/index.css`: ampliar primitives de página, filas, datos, formularios y estados con tokens existentes y reglas mobile-first.
- `frontend/src/views/home/HomeView.tsx`: convertir la bienvenida en un punto de entrada compacto y orientado a acciones reales.
- `frontend/src/views/exercises/ExercisesView.tsx`: organizar catálogo y detalle como lista y bloque de datos.
- `frontend/src/views/wods/WodsView.tsx`: presentar catálogo, detalle y secuencia de ejercicios con jerarquía de entrenamiento.
- `frontend/src/views/wod-versions/WodVersionsView.tsx` y `WodVersionItemsView.tsx`: aplicar la misma estructura de lista y detalle a las rutas técnicas existentes.
- `frontend/src/views/my-wods/MyWodsView.tsx` y `create-wod/CreateWodView.tsx`: agrupar formularios, ejercicios repetibles, acciones y resultado registrado sin cambiar handlers.
- `frontend/src/views/history/HistoryView.tsx` y `exercise-results/MyExerciseResultsView.tsx`: priorizar el valor registrado, recurso y fecha.
- `frontend/src/views/personal-bests/PersonalBestsView.tsx`, `login/LoginView.tsx` y las páginas de callback: alinear los estados actuales con la nueva composición sin inventar datos o acciones.

## Cambios técnicos previstos

1. Definir clases reutilizables, limitadas a presentación, para encabezados, filas de recurso, metadatos, métricas, secuencias de ejercicios, bloques de formulario y estados de interfaz.
2. Aplicar dichas clases a la estructura semántica existente, conservando elementos nativos, atributos, textos de dominio y callbacks.
3. Reservar `.surface` para formularios, detalle seleccionado o mensajes que necesiten contención; usar listas con divisores para información repetitiva.
4. Usar una columna en móvil y ampliar campos afines y filas de datos a partir de 600px, sin ocultar información esencial.
5. No modificar el shell ni la navegación: los cambios de #41 se limitan a contenido y primitives de presentación necesarios para ello.

## Estrategia de verificación

- Ejecutar `npm run lint`, `npm run test` y `npm run build` desde `frontend/`.
- Revisar manualmente las rutas existentes en móvil, tablet y escritorio, incluyendo foco, navegación inferior, sidebar y formularios.
- Ejecutar el detector mecánico de Impeccable sobre los archivos de interfaz modificados una vez terminada la implementación.
- Confirmar mediante revisión de diff que no se modificaron contratos, rutas, handlers, dominio ni dependencias.
