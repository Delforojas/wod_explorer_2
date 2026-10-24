# Plan: Boton "Volver arriba" en el catalogo publico de WODs

## Enfoque

Implementar la interaccion localmente en `WodsList`, que ya contiene la
presentacion del catalogo y su estado de interfaz. Extraer solo las decisiones
deterministas de umbral y comportamiento de desplazamiento a un modulo pequeno
para poder probarlas con Vitest sin introducir una libreria de testing DOM.

## Componentes afectados

- `frontend/src/views/wods/components/WodsList.tsx`: estado de visibilidad,
  escucha del scroll, boton nativo y gestion del foco del encabezado.
- `frontend/src/views/wods/wodScroll.ts`: umbral y funciones puras para
  visibilidad y `scroll-behavior`.
- `frontend/src/views/wods/wodScroll.test.ts`: pruebas de visibilidad y
  reduced motion.
- `frontend/src/styles/wod.css`: posicion fija, apariencia, foco, separacion
  del dock movil y reduced motion.
- `specs/083-back-to-top-wod-catalog/`: trazabilidad de requisitos, plan,
  tareas y verificaciones.

## Estrategia de implementacion

1. Definir un umbral constante de `400px` y una funcion pura que indique si el
   boton debe mostrarse cuando `window.scrollY` lo supera.
2. Definir una funcion pura que traduzca la preferencia de movimiento reducido
   a `auto` o `smooth`.
3. En `WodsList`, registrar un listener de `scroll` pasivo con limpieza en
   `useEffect`, evaluar el estado inicial y derivar la visibilidad sin tocar el
   estado de busqueda ni el filtrado.
4. Renderizar un `button type="button"` con el texto visible "Volver arriba".
   Al activarlo, llamar a `window.scrollTo({ top: 0, behavior })` y trasladar
   el foco al encabezado `h1` con `tabIndex={-1}` y `preventScroll` para evitar
   perder el contexto del teclado.
5. Aplicar los tokens y patrones de foco existentes. En pantallas con dock
   movil, colocar el boton por encima del dock y del area segura; en pantallas
   grandes usar una separacion normal del viewport.
6. Mantener el CSS de movimiento reducido sin transiciones adicionales y usar
   la preferencia actual del sistema al pulsar el boton.

## Verificacion

- Ejecutar `npm run test` desde `frontend/`.
- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Revisar `git diff --check`.
- Revisar que solo se modifican archivos del frontend y del SDD, manteniendo
  `opencode.json` fuera del commit.
- Derivar validacion manual para visibilidad por scroll, activacion con
  teclado, foco, reduced motion, movil/tablet/escritorio y ausencia de
  regresiones del catalogo.
