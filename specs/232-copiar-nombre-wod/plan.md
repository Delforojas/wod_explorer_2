# Plan técnico

## Enfoque

El único punto de extensión será el componente presentacional compartido
`WodDetail`. Mantendrá un estado local de feedback y, tras una activación,
llamará a `navigator.clipboard.writeText(selectedWod.name)`. El control
validará que la API está disponible y tratará su ausencia igual que un rechazo.
Solo se confirmará éxito al resolverse la promesa. Un temporizador local
retirará el feedback breve y se limpiará al desmontar el componente.

El botón será nativo, con texto visible y un estado en vivo para el resultado.
Los estilos se limitarán a la fila de título, el botón, su foco y el mensaje de
estado en `wod-detail.css`, reutilizando sus tokens y breakpoints existentes.

## Componentes afectados

- `frontend/src/components/wodDetail/WodDetail.tsx`: acción de copia, estado y
  feedback accesible en la cabecera compartida.
- `frontend/src/styles/wod-detail.css`: disposición, tamaño de objetivo, foco y
  presentación del feedback de la nueva acción.
- `frontend/src/components/wodDetail/WodDetail.test.tsx`: pruebas jsdom de
  interacción para éxito y fallo de la API del portapapeles.

No se modificarán wrappers públicos o personales, páginas, rutas, APIs,
schemas, tipos, backend ni base de datos.

## Estrategia de implementación

1. Añadir estado local de feedback y gestión segura de su temporizador en
   `WodDetail`.
2. Agrupar visualmente título y acción, usando un botón `type="button"` que
   copie el nombre exacto y comunique el resultado con una región de estado.
3. Añadir estilos mobile-first coherentes para evitar desbordamientos y
   preservar el foco visible y el objetivo táctil.
4. Extender la prueba del detalle a jsdom para mockear `writeText`, comprobar
   el valor exacto, el éxito tras resolución y el fallo tras rechazo.

## Dependencias

- La implementación depende de que `selectedWod` exista, condición que el
  componente ya asegura antes de renderizar la cabecera.
- La copia depende de la API estándar del navegador; su indisponibilidad se
  maneja como un resultado fallido, sin dependencia adicional.

## Verificación

- Ejecutar la prueba específica de `WodDetail` para los flujos de éxito y fallo.
- Ejecutar `npm run lint`, `npm run test` y `npm run build` desde `frontend/`.
- Ejecutar `git diff --check` desde la raíz.
- Revisar el diff para confirmar que solo cambia el detalle compartido, sus
  estilos, pruebas y SDD.
- Revisar manualmente que el botón tiene texto visible, foco visible, orden de
  tabulación lógico y comportamiento seguro en anchuras móvil y escritorio.
