# Base visual Pizarra de Rendimiento Mobile-First

## Objetivo

Implementar la infraestructura visual global y reutilizable definida en `DESIGN.md` para que el frontend adopte la dirección Pizarra de Rendimiento Mobile-First sin modificar reglas funcionales ni rediseñar individualmente las vistas.

## Alcance

- Tokens CSS globales para color, tipografía, cifras tabulares, spacing, bordes, radios, sombras, fondos y superficies.
- Estilos base reutilizables para controles, formularios, superficies, cards, badges y estados visuales compartidos.
- Layout principal mobile-first con los breakpoints de `DESIGN.md`.
- Navegación inferior fija en móvil y navegación lateral persistente en escritorio.
- Estados interactivos, `focus-visible`, objetivos táctiles y accesibilidad visual.

## Comportamiento esperado

- La aplicación usa únicamente el tema oscuro y los roles visuales definidos en `DESIGN.md`.
- En móvil, la navegación autenticada muestra cinco destinos fijos: Ejercicios, WODs, Crear WOD, Historial y Más.
- Más abre un menú de navegación accesible con Mis WODs, Mis marcas y Mejores marcas. No añade rutas ni comportamiento de dominio.
- En escritorio, la navegación lateral muestra los siete destinos existentes con icono y etiqueta, organizados sin el límite móvil de cinco destinos.
- El shell y los estilos globales no alteran rutas, contratos, datos, permisos ni comportamiento funcional de las vistas.

## Criterios de aceptación

- [ ] Los tokens y patrones visuales corresponden con `DESIGN.md`.
- [ ] Colores, tipografía, spacing, bordes, radios, sombras y superficies usan los valores definidos.
- [ ] El layout y los breakpoints siguen un enfoque mobile-first.
- [ ] La navegación móvil fija muestra como máximo cinco destinos y Más es accesible mediante teclado y tecnologías de asistencia.
- [ ] La navegación lateral de escritorio muestra los destinos existentes con icono y etiqueta.
- [ ] Botones, inputs, formularios, cards, superficies, badges y estados compartidos tienen estilos reutilizables y estados interactivos aplicables.
- [ ] Existe `focus-visible` claro y los controles cumplen el objetivo táctil mínimo de 44px cuando aplica.
- [ ] Las páginas existentes continúan funcionando sin introducir reglas funcionales, dependencias, cambios de backend, base de datos, `DOMAIN.md` o `DESIGN.md`.
- [ ] `npm run lint`, `npm run test` y `npm run build` finalizan correctamente.

## Restricciones

- No rediseñar las vistas de WODs, ejercicios, historial o estadísticas de forma individual.
- No añadir dependencias ni rutas nuevas.
- No modificar el dominio, contratos API, backend, persistencia, `DOMAIN.md` ni `DESIGN.md`.
- Reutilizar el shell y los componentes de navegación existentes cuando sea posible.
