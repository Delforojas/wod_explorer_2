# SDD: Línea temporal unificada de Historial

## Objetivo

Convertir `/history` en una línea temporal privada que combine los resultados
propios de WODs y de ejercicios individuales registrados en Benchmarks, usando
`performedAt` como fecha de actividad y manteniendo las reglas de privacidad,
formato y diseño existentes.

## Alcance

- Enriquecer `ExerciseResultResponse` con `exerciseName` y `measurementType`.
- Mantener el histórico de ejercicios inactivos sin depender de
  `GET /api/exercises`.
- Ordenar resultados de ejercicios por `performedAt DESC, id DESC` en backend.
- Consultar `/api/wod-results` y `/api/exercise-results` desde Historial.
- Normalizar ambos contratos a una unión discriminada `WOD | EXERCISE`.
- Añadir los modos `Todos`, `WODs` y `Ejercicios`.
- Mantener el rango de fechas como filtro común e inclusivo sobre `performedAt`.
- Mostrar filtros WOD solo cuando el modo activo sea `WODs`; al abandonar ese
  modo se limpian sus valores para evitar filtros ocultos o ambiguos.
- Mostrar tipo, nombre, fecha y resultado con los formatos existentes.
- Conservar modalidades WOD, origen, resultados incompletos y los seis tipos de
  medición de ejercicios.
- Mantener privacidad, ruta protegida y ausencia de acciones destructivas.
- Permitir resultados parciales cuando una fuente falla, con mensaje y reintento
  específico sin ocultar los datos de la otra fuente.

## Comportamiento esperado

1. Historial consulta ambos endpoints autenticados y muestra sus entradas en una
   sola lista cronológica.
2. La lista ordena por `performedAt DESC`; para fechas iguales usa el tipo fijo
   (`EXERCISE` antes que `WOD`) y después el ID dentro del tipo, sin comparar IDs
   entre tablas como criterio temporal.
3. `Todos` muestra ambos tipos, `WODs` solo resultados WOD y `Ejercicios` solo
   resultados de ejercicios.
4. El rango `Desde`/`Hasta` incluye el día completo y se aplica a ambos tipos.
5. Los filtros WOD (WOD, modalidad y origen) solo aparecen y funcionan en
   `WODs`; cambiar a otro modo los limpia.
6. Cada fila identifica explícitamente `WOD` o `Ejercicio` y muestra el nombre,
   fecha y resultado formateado.
7. Los ejercicios muestran correctamente `WEIGHT`, `REPS`, `TIME`, `DISTANCE`,
   `WEIGHT_DISTANCE` y `DISTANCE_TIME`, incluidos valores opcionales válidos.
8. Un error de una fuente conserva las entradas de la otra y ofrece reintento;
   un error de ambas muestra un estado de error claro.
9. La ruta continúa protegida y solo se muestran resultados del usuario actual.

## Criterios de aceptación

- [ ] Historial incluye resultados propios de WODs y ejercicios en una única cronología.
- [ ] Filtros `Todos`, `WODs` y `Ejercicios` funcionan y el rango de fechas es común.
- [ ] Se conservan los filtros por WOD, modalidad y origen en modo `WODs`.
- [ ] El orden descendente por `performedAt` tiene desempate determinista.
- [ ] Cada entrada presenta tipo, nombre, fecha y puntuación correcta.
- [ ] Se preservan `FOR_TIME`, `AMRAP`, `EMOM`, estados incompletos y los seis tipos de medición.
- [ ] Los ejercicios desactivados conservan nombre y `measurementType`.
- [ ] No se exponen resultados de otros usuarios y `/history` sigue siendo privada.
- [ ] Un fallo parcial no oculta los datos disponibles de la otra fuente.
- [ ] El diseño mantiene accesibilidad, responsive y consistencia con Benchmarks/WOD Results.
- [ ] Existen pruebas frontend y backend para datos mixtos, filtros, orden, formato, errores, mapeo, inactivos y privacidad.
- [ ] Lint, tests, build, validación backend y `git diff --check` pasan.
- [ ] Se prepara validación visual manual sin marcarla como aprobada.

## Restricciones

- No crear `/api/history`.
- No añadir paginación global.
- No modificar el esquema SQL.
- No añadir edición o eliminación desde Historial.
- No cambiar reglas de récords personales ni cálculos de Benchmarks.
- No depender de `GET /api/exercises` para resolver resultados históricos.
- Reutilizar clientes API, utilidades de presentación, tokens y filas existentes.
