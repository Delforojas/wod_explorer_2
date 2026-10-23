# Aplicar el sistema visual 21st al contenido principal

## Objetivo

Extender el sistema visual 21st ya adoptado a los consumidores reales dentro de `main`, para que el canvas, las páginas y la navegación pertenezcan perceptiblemente al mismo producto.

## Alcance

- Adaptar los consumidores existentes de listas, detalles, formularios, métricas y estados en el frontend.
- Reutilizar exclusivamente los tokens, superficies, controles y patrones de `frontend/src/index.css` y `DESIGN.md`.
- Mantener la composición, datos, rutas, handlers, autenticación y contratos existentes.
- Crear una presentación coherente para los loading states existentes, sin cambiar la lógica que los activa.

## Fuera de alcance

- Backend, base de datos, dominio, endpoints, contratos API, rutas, autenticación y permisos.
- Tailwind, shadcn, librerías UI, componentes demo, datos falsos, dashboards o métricas nuevas.
- Rediseños de composición por página y un segundo sistema de tokens o colores.

## Comportamiento esperado

- El canvas, superficies, filas, formularios, controles, estados y métricas reales usan una jerarquía visual coherente basada en los niveles dark existentes.
- Los headers mantienen título, contexto y metadata claramente diferenciados.
- Las filas solo indican interactividad visual cuando contienen una acción real.
- Los formularios existentes aplican el patrón compartido de label, espaciado y control sin alterar validación ni envío.
- Carga, vacío, error y éxito mantienen sus condiciones actuales y se representan con los patrones existentes.
- La interfaz conserva foco visible, semántica nativa, navegación por teclado y comportamiento responsive.

## Criterios de aceptación

- [ ] El `main` consume perceptiblemente el sistema visual 21st y se integra con sidebar/nav.
- [ ] Canvas, surfaces, filas, controles y acciones mantienen una jerarquía dark clara sin un segundo sistema visual.
- [ ] Page headers, metadata y métricas existentes usan la jerarquía tipográfica y visual del sistema.
- [ ] Las resource rows y sus acciones reflejan interactividad real; las filas pasivas no simulan ser interactivas.
- [ ] Formularios, inputs, selects, labels, botones y acciones destructivas existentes usan patrones coherentes sin cambiar lógica.
- [ ] Loading, empty, error y success existentes tienen una presentación coherente; error y success combinan fondo, borde y texto cuando corresponda.
- [ ] No quedan hardcodes visuales injustificados cuando haya una primitiva o token existente.
- [ ] Mobile no presenta overflow horizontal y desktop usa el ancho junto al sidebar.
- [ ] Focus visible, contraste y navegación por teclado se conservan.
- [ ] No se modifican comportamiento funcional, rutas, backend, dominio ni dependencias.
- [ ] `21st-ui-review`, `npm run lint`, `npm run test`, `npm run build` y `git diff --check` finalizan correctamente.
