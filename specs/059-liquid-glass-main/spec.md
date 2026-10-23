# Issue #59 - Liquid Glass en el contenido principal

## Objetivo

Aplicar superficies Liquid Glass sobrias a Ejercicios, WODs y Crear WOD, conservando el fondo Pulsar Grid, navegación, datos e interacciones actuales.

## Alcance

- Paneles de lista de Ejercicios y WODs, sus filas y el formulario Crear WOD.
- Campos de formulario, separadores, estados hover/focus y acciones ya existentes dentro de esos paneles.
- Tokens CSS compartidos, fallback sin `backdrop-filter` y respeto a `prefers-reduced-transparency` y movimiento reducido.

## Fuera de alcance

- Fondo, navegación, contratos API, comportamiento de formularios, dependencias y otras vistas.

## Comportamiento esperado

Los paneles muestran un tinte azul oscuro translúcido, desenfoque moderado, borde tenue, reflejo superior y sombra contenida. El contenido permanece nítido, los campos son más opacos que el panel y los controles conservan su foco visible y funcionalidad.

## Criterios de aceptación

- Ejercicios, WODs y Crear WOD comparten material glass coherente.
- Pulsar Grid y navegación permanecen sin cambios.
- Se percibe el fondo a través de los paneles sin reducir la legibilidad.
- Bordes, reflejos y sombras aportan volumen controlado.
- Texto, iconos, foco de teclado, formularios y acciones existentes permanecen accesibles y funcionales.
- No hay recortes ni desbordamiento horizontal en móvil.
- Hay fallback legible sin `backdrop-filter` y transparencia reducida.
- Se ejecutan lint, tests, build, revisión visual automatizada y comprobación de diff.
