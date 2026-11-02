# SDD: Ajuste visual y filtros por fecha de Historial

## Objetivo

Homogeneizar `/history` con el patrón visual de Benchmarks y simplificar sus
filtros a un rango inclusivo `Desde` / `Hasta` disponible en los tres modos,
sin alterar los datos, el orden, la privacidad ni los contratos de la Issue
#129.

## Alcance

- Sustituir los tres botones independientes de modo por un control segmentado
  de ancho completo, equilibrado y accesible, reutilizando el patrón visual de
  Benchmarks y `aria-pressed` para un selector de filtros.
- Mantener los modos `Todos`, `WODs` y `Ejercicios`, conservando el rango de
  fechas al cambiar de modo.
- Eliminar del Historial los filtros de WOD, modalidad y origen, junto con el
  estado y código frontend que queden inutilizados.
- Mantener `Desde` / `Hasta`, su aplicación explícita y limpieza en cualquier
  modo, con rango inclusivo basado en `performedAt`.
- Mostrar un mensaje accesible y evitar aplicar un rango inválido cuando
  `Desde` sea posterior a `Hasta`.
- Eliminar el contenedor negro exterior y presentar las entradas como filas
  ligeras integradas en el fondo, con separadores sutiles y sin tarjetas
  pesadas.
- Mantener nombre, tipo, fecha, puntuación, modalidad/origen relevantes,
  resultados mixtos, estados parciales, loading, vacío, error y reintentos.
- Ocultar el `wodVersionId` técnico de la presentación sin cambiar el dato del
  contrato ni la trazabilidad interna.
- Mantener accesibilidad, foco visible, teclado, responsive móvil/tablet/
  escritorio y el espacio de la navegación inferior.

## Comportamiento esperado

1. El selector de modo ocupa el ancho del contenido y conserva el modo activo
   con el mismo tratamiento segmentado que Benchmarks.
2. Los únicos campos visibles son `Desde` y `Hasta`, independientemente del
   modo activo.
3. Aplicar filtra ambos tipos por el día completo de `performedAt`; limpiar
   elimina ambas fechas y restablece los resultados sin filtros.
4. Cambiar entre modos no borra ni reaplica de forma inesperada el rango de
   fechas.
5. Un rango inválido se comunica de forma accesible y no se aplica.
6. Las entradas aparecen como filas independientes sobre el fondo general,
   con separación horizontal ligera y sin contenedor negro o tarjeta exterior.
7. No se muestra ningún ID técnico de versión en la UI.
8. La funcionalidad y los estados heredados de #129 permanecen intactos.

## Criterios de aceptación

- [x] El selector `Todos / WODs / Ejercicios` usa el patrón visual segmentado y
  ancho completo de Benchmarks.
- [x] Las entradas se muestran sin contenedor negro ni tarjeta exterior, con
  filas ligeras, separadores sutiles y espaciado correcto.
- [x] Solo aparecen `Desde` y `Hasta` en los tres modos.
- [x] Aplicar, limpiar, rango inclusivo y conservación del rango al cambiar de
  modo funcionan correctamente.
- [x] El rango inválido se comunica y no sustituye los datos por un filtro
  inválido.
- [x] Datos mixtos, orden, formatos WOD/ejercicio y estados incompletos se
  conservan.
- [x] Los nombres y fechas son claros y no muestran IDs técnicos de versión.
- [x] Loading, vacío, error parcial y reintentos continúan funcionando.
- [x] La UI mantiene foco, teclado, etiquetas y adaptación responsive sin
  overflow ni solapamiento con la navegación inferior.
- [x] Existen pruebas frontend para selector, fechas, render, estados y
  presentación.
- [x] Lint, tests, build y `git diff --check` pasan.
- [x] No se modifican backend, DB, ownership, contratos API, dominio ni la
  funcionalidad de #129.
- [ ] Se prepara validación visual comparativa con Benchmarks, sin aprobarla
  automáticamente.

## Restricciones

- No crear endpoints ni modificar backend, base de datos o contratos API.
- No modificar Benchmarks ni pantallas de detalle.
- No añadir edición, eliminación ni estadísticas nuevas desde Historial.
- No cambiar la ordenación cronológica ni las reglas de privacidad de #129.
- Reutilizar tokens CSS, estados, clientes API y utilidades de presentación
  existentes.
