# SDD: Alinear filtros de Historial con el sistema visual

## Objetivo

Unificar visualmente el panel de filtros de Historial con el lenguaje actual de
WOD Explorer: superficies oscuras, bordes sutiles, controles legibles, acento
naranja y composición responsive, sin cambiar el flujo de filtrado.

## Alcance

- Ajustar únicamente la presentación del contenedor `.history-filters`.
- Alinear labels, selects, campos de fecha y botones con los tokens y patrones
  CSS existentes.
- Añadir estados visuales coherentes para hover, focus-visible, disabled y la
  affordance de los selects.
- Mantener controles de al menos 44px, labels asociados y operación por teclado.
- Mantener el apilado móvil, la distribución tablet/desktop y evitar overflow.
- Conservar exactamente los valores, filtros, fechas, callbacks, resultados,
  estados de carga y errores existentes.

## Fuera de alcance

- Cambiar `HistoryPage`, los handlers, endpoints, contratos o semántica de
  fechas.
- Añadir filtros u opciones nuevas.
- Rediseñar el listado de resultados o estilos globales compartidos.
- Añadir librerías, iconos externos o un sistema CSS alternativo.

## Comportamiento esperado

1. El panel usa una superficie oscura coherente con el canvas y un borde/radio
   sutiles sin aumentar innecesariamente su altura.
2. Los cinco campos mantienen sus labels y valores, con la misma altura,
   tipografía, fondo y borde.
3. Los selects conservan su opción seleccionada y muestran una affordance de
   desplegable integrada; las fechas mantienen su control nativo y legible.
4. `Aplicar filtros` es la acción primaria naranja y `Limpiar` una acción
   secundaria/terciaria, ambos con foco visible y estados hover/disabled.
5. En móvil los campos se apilan y los botones siguen siendo operables sin
   desbordamiento horizontal; en tablet/desktop se aprovechan dos columnas.
6. La lógica de filtrado y los resultados no cambian.

## Criterios de aceptación

- [x] No quedan colores, inputs o botones azules incongruentes en el panel.
- [x] WOD, modalidad, origen y fechas tienen estilos y estados coherentes.
- [x] Aplicar y Limpiar mantienen jerarquía y comportamiento.
- [x] Móvil no presenta overflow ni controles truncados y desktop usa bien el
      espacio.
- [x] Labels, foco visible, contraste y teclado siguen siendo correctos.
- [x] Los filtros conservan exactamente sus resultados, estados de carga y
      errores.
- [x] No hay regresiones en otras pantallas porque los cambios permanecen
      limitados a clases de Historial.
- [x] `npm run lint`, `npm run test`, `npm run build` y `git diff --check` pasan.

## Verificación realizada

- `npm run lint` desde `frontend/`: correcto.
- `npm run test` desde `frontend/`: 11 archivos y 44 tests correctos.
- `npm run build` desde `frontend/`: TypeScript y Vite correctos.
- `git diff --check`: correcto.
- `HistoryPage.tsx`, `HistoryView.tsx` y los clientes API no tienen cambios.
- La revisión visual en navegador, overflow real y navegación de teclado quedan
  como validación manual pendiente por limitación del entorno.

## Restricciones y fuentes

- GitHub Issue #100: objetivo, alcance, restricciones y criterios.
- `frontend/AGENTS.md`: CSS modular, responsive, accesibilidad y verificaciones.
- `DESIGN.md`: tokens, tamaños táctiles, focus ring y breakpoints.
- `frontend/src/views/history/HistoryView.tsx`: consumidores y semántica real.
- `frontend/src/styles/history.css`: reglas locales a corregir.
- `frontend/src/styles/tokens.css` y `forms.css`: valores/patrones existentes.
