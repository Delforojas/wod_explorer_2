# Issue #135: Inicio en la navegación principal

## Objetivo

Añadir `Inicio` como primera opción de la navegación de escritorio y del dock móvil. El enlace debe llevar a `/`, que conserva la Home pública para visitantes y el dashboard personal para usuarios autenticados.

## Alcance

- Incorporar Inicio, con icono de casa existente en el sistema de iconos de navegación, al inicio de los catálogos de enlaces.
- Mostrar en el dock de visitante: Inicio, Ejercicios y WODs.
- Mostrar en el dock autenticado: Inicio, Ejercicios, WODs, Mis WODs, Benchmarks e Historial.
- Mantener las reglas actuales de visibilidad del sidebar y colocar Inicio como primer enlace.
- Marcar Inicio como activo únicamente para el pathname exacto `/`.
- Mantener la reactividad actual de `AuthProvider` para que el dock y la Home cambien con la sesión sin rutas ni Homes duplicadas.
- Ajustar únicamente el dock móvil para seis accesos en 320–390 px, sin overflow horizontal, cortes de etiquetas ni pérdida de objetivos táctiles.

## Fuera de alcance

- Crear o modificar rutas, Homes, endpoints, backend, modelo de datos, permisos o reglas de dominio.
- Rediseñar navegación fuera de los cambios necesarios para incluir Inicio.
- Cambiar el Historial de la Issue #133.

## Comportamiento esperado

- Inicio enlaza a `/` desde sidebar y dock; se muestra antes del resto de enlaces.
- La Home existente sigue resolviendo contenido público o personal desde el estado de `AuthProvider`.
- La coincidencia activa de Inicio es exacta: no se activa en `/exercises`, `/wods` ni rutas privadas.
- Los enlaces siguen siendo controles nativos de navegación, con nombre accesible, foco visible y teclado.

## Criterios de aceptación

- [ ] Inicio es la primera opción en sidebar y dock, enlazando a `/`.
- [ ] Sin sesión, `/` conserva la Home pública y el dock contiene Inicio, Ejercicios y WODs.
- [ ] Con sesión, `/` conserva la Home personal y el dock contiene Inicio, Ejercicios, WODs, Mis WODs, Benchmarks e Historial.
- [ ] Inicio solo tiene estado activo en `/`.
- [ ] La navegación responde al inicio y cierre de sesión sin mostrar enlaces privados a visitantes.
- [ ] El dock no genera overflow, cortes ni solapamiento en 320–390 px, tablet ni escritorio.
- [ ] Se conservan foco visible, teclado, enlaces y nombres accesibles.
- [ ] Las pruebas de navegación y todos los checks frontend requeridos pasan.
- [ ] La validación visual manual de visitante, autenticado y dock móvil queda pendiente antes del cierre.

## Restricciones

- Reutilizar React Router, `AuthProvider`, iconografía, CSS y tokens existentes.
- No añadir dependencias ni modificar contratos API.
- Mantener la interfaz en español y aplicar el diseño mobile-first existente.
