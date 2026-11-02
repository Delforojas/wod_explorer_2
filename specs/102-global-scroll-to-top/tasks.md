# Tareas

## Preparación y diseño

- [x] Confirmar la Issue #102, su referencia a #83 y el alcance frontend.
- [x] Auditar la implementación actual de #83 y los componentes del layout.
- [x] Crear el SDD único con trazabilidad de criterios y verificaciones.

## Extracción compartida

- [x] Mover el umbral y el comportamiento de scroll a un módulo utilitario
      compartido.
- [x] Crear pruebas Vitest para visibilidad en el umbral y reduced motion.
- [x] Crear `ScrollToTopButton` con botón semántico, estado inicial, listener
      pasivo con cleanup, reacción a cambios de ruta y foco lógico.
- [x] Montar una única instancia en `AppLayout`.
- [x] Retirar estado, listener, handler, botón y dependencia de scroll de
      `WodsList`.
- [x] Retirar los archivos y estilos específicos de WODs que queden sin
      consumidores.

## Estilos y alcance

- [x] Compartir los estilos del control con tokens existentes, estados de foco,
      hover, tamaño táctil, safe area, dock móvil y reduced motion.
- [x] Verificar que no se alteran filtros, listados, navegación, APIs, backend,
      contratos ni archivos protegidos.

## Verificación y cierre local

- [x] Sincronizar este archivo con las tareas realmente completadas.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar el diff y preparar un único commit con solo la Issue #102 y su
      SDD.

## Validación manual pendiente

- [ ] Comprobar en móvil Ejercicios, Historial y WODs después de superar el
      umbral, incluyendo el dock inferior y safe area.
- [ ] Comprobar rutas largas/cortas, cambios de ruta, click, teclado, foco,
      hover, tablet/escritorio y reduced motion.
