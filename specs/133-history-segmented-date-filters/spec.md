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
  modo, con rango inclusivo basado en `performedAt`, dentro de un panel de
  fechas desplegable cerrado por defecto.
- Mostrar bajo el selector de modo un resumen compacto con icono de calendario,
  `Todas las fechas` o `Filtro de fechas activo`, y un control para abrir u
  ocultar el panel.
- Mantener el resumen y el panel compactos en escritorio, con márgenes del
  contenido y adaptación sin overflow en móvil.
- Mantener separados los valores editados en el panel del rango aplicado; cerrar
  sin aplicar no modifica el filtro efectivo.
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
2. El resumen de fechas muestra `Todas las fechas` inicialmente y el panel
   permanece cerrado hasta activar `Filtrar por fecha`.
3. El panel abierto muestra únicamente `Desde`, `Hasta`, `Aplicar` y `Limpiar`;
   su control cambia a `Ocultar filtros` y expone `aria-expanded` y
   `aria-controls`.
4. Aplicar filtra ambos tipos por el día completo de `performedAt`, admite solo
   Desde, solo Hasta o ambos, actualiza el resumen a `Filtro de fechas activo` y
   cierra el panel.
5. Limpiar elimina ambas fechas, restablece `Todas las fechas`, muestra todos
   los resultados del modo seleccionado y cierra el panel.
6. Cerrar sin aplicar no modifica el rango efectivo ni la consulta activa.
7. Cambiar entre modos no borra el rango aplicado y conserva la separación entre
   valores editados y valores efectivos.
8. Un rango inválido se comunica de forma accesible, mantiene abierto el panel
   y no se aplica.
9. Las entradas aparecen como filas independientes sobre el fondo general,
   con separación horizontal ligera y sin contenedor negro o tarjeta exterior.
10. No se muestra ningún ID técnico de versión en la UI.
11. La funcionalidad y los estados heredados de #129 permanecen intactos.

## Criterios de aceptación

- [x] El selector `Todos / WODs / Ejercicios` usa el patrón visual segmentado y
  ancho completo de Benchmarks.
- [x] Las entradas se muestran sin contenedor negro ni tarjeta exterior, con
  filas ligeras, separadores sutiles y espaciado correcto.
- [x] El panel de fechas está cerrado inicialmente y muestra `Todas las fechas`.
- [x] Al abrirlo solo aparecen `Desde`, `Hasta`, Aplicar y Limpiar; el disparador
  expone el estado accesible y cambia entre `Filtrar por fecha`/`Ocultar filtros`.
- [x] El resumen y el panel son compactos en escritorio y respetan el viewport,
  el dock y los márgenes responsive en móvil.
- [x] Aplicar, limpiar, cierre automático, rangos parciales y conservación del
  rango al cambiar de modo funcionan correctamente.
- [x] El rango inválido se comunica, mantiene abierto el panel y no sustituye
  los datos por un filtro inválido.
- [x] Solo se mantienen los campos de fecha en la implementación.
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
