# Issue #139: footer informativo y página Sobre

## Objetivo

Conservar el footer de WOD Explorer y añadir un acceso público a `/about`, donde se presenta de forma concisa el propósito, origen, funciones disponibles, autoría y evolución del proyecto.

## Alcance

- Añadir el enlace interno «Sobre WOD Explorer» bajo el lema actual del footer.
- Mantener la barra social, el lema y el copyright existentes.
- Crear `/about` como ruta pública dentro del `AppLayout` existente.
- Explicar solo las funciones implementadas y diferenciar las mejoras futuras.
- Reservar espacio móvil bajo el footer para evitar que el dock fijo oculte su contenido.

## Fuera de alcance

- Páginas o enlaces de política de privacidad, aviso legal o cookies.
- Cambios en autenticación, backend, base de datos, dock o navegación principal.
- Rediseño del footer o de la arquitectura existente.

## Criterios de aceptación

- [ ] El footer conserva sus cuatro enlaces sociales, lema y copyright.
- [ ] Muestra un enlace accesible a `/about` sin enlaces legales vacíos.
- [ ] `/about` es pública y presenta propósito, origen, funciones actuales, autoría y evolución.
- [ ] Footer y página se leen correctamente en escritorio y móvil sin quedar bajo el dock.
