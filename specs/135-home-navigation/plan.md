# Plan técnico

## Componentes afectados

- `frontend/src/components/layout/navigation.ts`: catálogo único para Inicio y la selección guest/auth del dock y sidebar.
- `frontend/src/components/layout/NavigationLinks.tsx`: coincidencia exacta del enlace raíz.
- `frontend/src/components/layout/NavigationPlacement.test.tsx`: cobertura observable de orden, visibilidad, ruta activa y accesibilidad básica.
- `frontend/src/styles/mobile-dock.css`: distribución fluida de seis enlaces entre 320 y 380 px.

## Estrategia

1. Añadir el icono de casa al tipo de iconos y definir Inicio como el primer elemento de navegación pública.
2. Construir la navegación primaria móvil autenticada con exactamente los seis destinos solicitados; los visitantes consumen la colección pública de tres enlaces. El sidebar reutiliza las mismas colecciones para preservar reglas de sesión.
3. Configurar el enlace `/` con coincidencia exacta de React Router para evitar su activación en todas las rutas descendientes.
4. En el ancho más pequeño, sustituir los tamaños fijos que no caben por seis columnas flexibles dentro del ancho disponible del dock. Conservar etiquetas, enlaces, foco y objetivos táctiles existentes.
5. Añadir pruebas de orden y visibilidad guest/auth, de estado activo exacto y de los nombres accesibles. Las pruebas existentes de Home validan que el contenido permanece derivado de autenticación.

## Verificación

- Ejecutar las pruebas dirigidas de navegación.
- Ejecutar `npm run lint`, `npm run test`, `npm run build` y `git diff --check` desde sus ubicaciones definidas.
- Revisar manualmente `/` como visitante y autenticado, la transición de sesión y el dock en 320, 390, tablet y escritorio.
