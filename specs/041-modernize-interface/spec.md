# Modernizar la interfaz y eliminar patrones visuales genéricos

## Objetivo

Refinar las vistas existentes de WOD Explorer para que funcionen como un registro operativo de entrenamiento: jerarquía guiada por nombres, modalidad, cifras y acciones, con menos superficies repetitivas y sin alterar rutas, datos, contratos ni comportamiento.

## Alcance

- Aplicar una composición visual consistente a las vistas de inicio, ejercicios, WODs, versiones, WODs personales, creación, historial, marcas, mejores marcas y acceso.
- Convertir listados y detalles en filas, secuencias y bloques de información con divisores, tipografía y alineación como recursos principales.
- Destacar métricas deportivas y acciones primarias con los tokens y primitives ya definidos en `DESIGN.md`.
- Agrupar formularios y ejercicios repetibles por propósito, conservando labels, validación y handlers existentes.
- Presentar estados de carga, error, éxito y vacío con la semántica existente y los primitives globales.
- Mantener el shell, la navegación inferior móvil y la sidebar de escritorio implementados en la Issue #39.

## Fuera de alcance

- Cambios de backend, base de datos, dominio, permisos, contratos API, rutas o lógica de formularios.
- Nuevas funcionalidades, estados de producto, gráficos, gamificación, rankings o elementos sociales.
- Dependencias nuevas, un sistema de estilos alternativo o un tema claro.
- Cambios a `DOMAIN.md` o `DESIGN.md`.

## Criterios de aceptación

- [ ] Las vistas usan menos cards y contenedores innecesarios; las listas se organizan con jerarquía, espacio y divisores.
- [ ] Los nombres de WOD, ejercicio y las métricas de entrenamiento dominan visualmente las vistas donde están disponibles.
- [ ] Botones, formularios, badges, listas, métricas y estados usan los tokens y patrones existentes de forma consistente.
- [ ] La interfaz evita gradientes, sombras decorativas, iconos ornamentales y layouts de dashboard genérico.
- [ ] La composición móvil prioriza lectura vertical, acciones accesibles y contenido esencial; escritorio aprovecha el ancho sin simetría artificial.
- [ ] La navegación de la Issue #39 se conserva sin cambios funcionales.
- [ ] Se preservan etiquetas, semántica, foco visible, contraste, objetivos táctiles y comportamiento de las vistas.
- [ ] No cambian rutas, contratos API, dominio ni comportamiento funcional existente.
- [ ] `npm run lint`, `npm run test` y `npm run build` finalizan correctamente.
