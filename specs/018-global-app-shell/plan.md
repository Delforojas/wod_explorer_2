# Plan: Shell global de la aplicación

## Enfoque

Introducir una composición mínima alrededor del `Routes` existente. El nuevo
`AppLayout` recibirá las rutas como `children` y renderizará la navegación, el
área principal y el footer sin cambiar la definición ni el comportamiento de
las rutas actuales.

Se reutilizará el `Navbar` existente trasladándolo a la organización requerida
por la Issue. El CSS añadido se limitará a la estructura del shell, la altura
disponible y el ancho seguro en viewport móvil. No se implementará lógica de
navegación responsive ni un sistema visual definitivo.

## Componentes y archivos afectados

- `frontend/src/components/layout/AppLayout.tsx`: contenedor estructural común.
- `frontend/src/components/layout/Navbar.tsx`: navegación global existente,
  conservando sus enlaces.
- `frontend/src/components/layout/Footer.tsx`: footer global básico.
- `frontend/src/App.tsx`: composición de `Routes` dentro de `AppLayout`.
- `frontend/src/index.css`: estilos mínimos del shell y landmarks.
- `frontend/src/components/Navbar.tsx`: traslado del componente existente, si
  no queda ninguna referencia válida a la ubicación anterior.

No se modificarán las páginas, APIs, tipos, rutas, `vite.config.ts`,
`package.json` ni la integración de Google OAuth.

## Cambios técnicos previstos

1. Crear `AppLayout` con `children: ReactNode`.
2. Crear el directorio `src/components/layout`.
3. Reubicar `Navbar` dentro de `components/layout` y conservar sus enlaces.
4. Añadir un `Footer` global sin diseño visual definitivo.
5. Envolver el `Routes` actual con `AppLayout`.
6. Añadir elementos semánticos `nav`, `main` y `footer` con clases estructurales.
7. Añadir únicamente CSS necesario para layout, altura y ancho responsive.
8. Verificar que el puerto `5174`, las rutas y Google OAuth no se alteran.

## Estrategia de verificación

- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Confirmar mediante inspección que no se añadieron dependencias y que
  `vite.config.ts` conserva el puerto `5174`.
- Comprobar manualmente las rutas existentes dentro del shell en desktop y
  viewport móvil, incluyendo `/login` y `/auth/google/callback`.
- Confirmar que no existe lógica de navegación responsive propia de la Issue
  #19 ni un rediseño visual definitivo.
