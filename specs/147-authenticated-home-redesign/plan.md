# Plan técnico

## Enfoque

Modificar solo la rama autenticada de `HomeView`. La rama pública permanece
inalterada. La vista reorganiza el hero, CTAs y accesos rápidos, añade un bloque
secundario de descubrimiento que reutiliza query params de categorías existentes
y conserva la actividad reciente con sus datos y estados actuales.

Los estilos se limitan a `home.css`: reutilizan tokens existentes, adaptan la
composición a móvil y escritorio, preservan el espacio para el dock móvil y
proporcionan foco visible y reduced motion.

## Componentes afectados

- `frontend/src/views/home/HomeView.tsx`: estructura autenticada, CTAs,
  accesos rápidos y enlaces de categorías.
- `frontend/src/styles/home.css`: jerarquía visual, grid responsive,
  accesibilidad de foco y movimiento reducido.
- `frontend/src/views/home/homePresentation.test.tsx`: presentación del saludo
  y navegación de categorías autenticadas.
- `specs/147-authenticated-home-redesign/`: trazabilidad de la issue.

No se modifican rutas globales, APIs, backend, entidades, autenticación,
autorización, `DOMAIN.md` ni la rama pública de Home.

## Estrategia

1. Componer el hero autenticado con saludo acentuado y los CTAs ya existentes.
2. Mantener los cuatro accesos rápidos y añadir el descubrimiento del catálogo
   como contenido secundario.
3. Conservar la sección de actividad y sus estados sin alterar sus fuentes de
   datos.
4. Aplicar estilos responsive y accesibles al dashboard.
5. Cubrir enlaces y presentación autenticada con las pruebas existentes.

## Verificación

- `npm run lint` desde `frontend/`.
- `npm run test` desde `frontend/`.
- `npm run build` desde `frontend/`.
- `git diff --check`.
- Revisión manual de escritorio y móvil, navegación de CTAs y categorías,
  actividad reciente, foco visible y ausencia de solapamiento del dock.
