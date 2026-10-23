# Plan de implementación

## Enfoque

Sustituir los estilos globales heredados de Vite por el sistema de tokens y primitives CSS de `DESIGN.md`. Adaptar el shell existente para que su estructura responsive cambie entre navegación inferior móvil y sidebar de escritorio, preservando rutas, autenticación local y componentes de navegación actuales.

## Componentes afectados

- `frontend/src/index.css`: tokens, reset, primitives, layout y breakpoints.
- `frontend/src/components/layout/AppLayout.tsx`: estructura semántica del shell.
- `frontend/src/components/layout/Navbar.tsx`: composición de navegación de escritorio y móvil.
- `frontend/src/components/layout/DesktopNavigation.tsx`: sidebar persistente.
- `frontend/src/components/layout/MobileNavigation.tsx`: barra inferior y menú Más accesible.
- `frontend/src/components/layout/NavigationLinks.tsx`: iconos y etiquetas de navegación.
- `frontend/src/components/layout/navigation.ts`: metadatos de icono y agrupación de destinos sin alterar rutas.

## Cambios técnicos previstos

1. Definir variables CSS basadas exclusivamente en los tokens de `DESIGN.md` y aplicar el tema oscuro global.
2. Crear classes CSS reutilizables para superficies, cards, badges y estados, además de estilos base para elementos de formulario y botones nativos.
3. Reorganizar visualmente el shell con gutters, ancho máximo, espacio para la barra inferior y sidebar desde 900px.
4. Mantener cinco destinos visibles en móvil. Implementar Más como botón semántico con estado expandido, cierre explícito y cierre al navegar.
5. Añadir iconos SVG inline decorativos a los enlaces de navegación, con etiquetas textuales visibles como nombre accesible.

## Estrategia de verificación

- Ejecutar `npm run lint`, `npm run test` y `npm run build` desde `frontend/`.
- Revisar manualmente la navegación y el foco en los rangos 0-599px, 600-899px, 900-1199px y desde 1200px.
- Confirmar que las rutas existentes siguen accesibles, que Más abre/cierra mediante teclado y que no existe scroll horizontal inesperado.
