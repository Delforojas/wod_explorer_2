# SDD: Navegación global responsive

## Objetivo

Construir la navegación global de WOD Explorer sobre el `AppLayout` existente,
con variantes específicas para desktop y mobile, separación entre contenido
público y privado, y acciones básicas relacionadas con la sesión.

La Issue prepara también destinos navegables reales para Mis WODs, Historial y
Mejores marcas. Esas páginas serán placeholders estructurales sin lógica de
negocio, carga de datos ni integración específica con backend.

## Alcance

- Reemplazar el `Navbar` plano por una composición de componentes pequeños:
  marca, navegación desktop, acciones de autenticación, botón mobile y
  navegación mobile.
- Mantener una única configuración de las opciones de navegación para evitar
  duplicar destinos entre desktop y mobile.
- Mostrar siempre los enlaces públicos a Ejercicios y WODs.
- Mostrar las opciones privadas solo cuando exista un token de sesión local.
- Añadir acceso estructurado a Mis WODs, Historial y Mejores marcas.
- Crear rutas y páginas placeholder privadas para esos tres destinos.
- Proteger las rutas privadas redirigiendo a `/login` cuando no exista sesión.
- Implementar apertura y cierre del menú mobile con un botón accesible.
- Añadir únicamente CSS estructural para comprobar desktop, mobile, foco y
  distribución.

## Comportamiento esperado

- En desktop se muestra la marca, navegación pública, grupo `Mi actividad` si
  hay sesión y las acciones de autenticación.
- En mobile se oculta la navegación desktop y aparece un botón real de menú.
- El botón mobile expone `aria-expanded`, `aria-controls` y un nombre accesible.
- El menú mobile abierto muestra las opciones públicas, las privadas cuando
  corresponda y la acción de sesión.
- Navegar desde el menú mobile lo cierra.
- Un visitante ve Ejercicios, WODs e Iniciar sesión, pero no ve opciones
  privadas.
- Un usuario con token ve Mis WODs, Historial y Mejores marcas.
- Cerrar sesión elimina el token local, vuelve al inicio y oculta las opciones
  privadas.
- Las rutas privadas son `/my-wods`, `/history` y `/personal-bests`.
- Las tres páginas privadas muestran únicamente contenido placeholder semántico.
- El teclado puede alcanzar enlaces y botón de menú, con foco visible.
- Desktop y mobile comparten la misma definición de destinos.

## Criterios de aceptación

- [ ] Existe navegación diferenciada para desktop y mobile.
- [ ] La navegación pública incluye Ejercicios y WODs.
- [ ] Las funcionalidades privadas solo aparecen con sesión autenticada.
- [ ] `Mi actividad` estructura el acceso a Mis WODs, Historial y Mejores marcas.
- [ ] El menú mobile puede abrirse y cerrarse.
- [ ] El estado del menú mobile es accesible.
- [ ] La navegación utiliza `nav`, listas y botones semánticos.
- [ ] La navegación es utilizable mediante teclado y tiene foco visible.
- [ ] Las opciones no se definen por duplicado entre variantes.
- [ ] Desktop y mobile utilizan la misma arquitectura global.
- [ ] Las rutas privadas tienen destinos reales placeholder.
- [ ] Solo se utiliza CSS estructural mínimo.
- [ ] No se implementa el diseño visual definitivo ni lógica de negocio.
- [ ] No se añade integración backend ni dependencia nueva.

## Restricciones

- No implementar funcionalidades de Mis WODs, Historial o Mejores marcas.
- No realizar carga de datos ni llamadas API para los placeholders.
- No introducir un sistema de autenticación nuevo; se reutiliza el token local
  que ya guarda `LoginPage`.
- No cambiar los contratos de API ni las rutas públicas existentes.
- No añadir dependencias.
- No implementar diseño visual definitivo, dropdowns avanzados, animaciones o
  integración con MCP de diseño.
- Mantener el frontend en el puerto `5174`.
