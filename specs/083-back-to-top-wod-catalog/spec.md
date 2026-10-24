# Especificacion: Boton "Volver arriba" en el catalogo publico de WODs

## Objetivo

Mejorar la navegacion del catalogo publico de WODs cuando el usuario recorre
una lista larga, proporcionando una accion para volver rapidamente al inicio de
la pagina.

## Alcance

- Modificar unicamente el frontend del catalogo publico de WODs.
- Mantener la busqueda, los filtros, la seleccion de WODs y la navegacion
  existentes sin cambios funcionales.
- Reutilizar React, TypeScript, CSS, tokens y patrones de accesibilidad
  existentes.
- No introducir dependencias nuevas.
- No modificar backend, API, base de datos, autenticacion ni contratos.

## Comportamiento esperado

- El catalogo observa el desplazamiento de la ventana y muestra un boton nativo
  "Volver arriba" al superar un umbral fijo de desplazamiento.
- El boton permanece oculto cerca del inicio de la pagina y vuelve a ocultarse
  al regresar a esa zona.
- Al activarlo, la ventana vuelve a la posicion superior.
- El desplazamiento usa comportamiento suave normalmente y comportamiento
  instantaneo cuando `prefers-reduced-motion: reduce` esta activo.
- El boton tiene un nombre accesible en espanol, es operable con teclado y
  conserva un foco visible y logico despues de la accion.
- La posicion fija y el espacio inferior respetan el dock de navegacion movil,
  los objetivos tactiles y el contenido del catalogo.

## Criterios de aceptacion

- [ ] El boton no se muestra al cargar el catalogo mientras la pagina esta
      cerca del inicio.
- [ ] El boton aparece al superar un umbral de desplazamiento definido y
      consistente.
- [ ] El boton vuelve a ocultarse al regresar cerca del inicio.
- [ ] Al activarlo, la pagina vuelve al inicio.
- [ ] El desplazamiento es suave si el usuario no solicita reducir movimiento.
- [ ] Con `prefers-reduced-motion: reduce`, el desplazamiento es instantaneo.
- [ ] El control es un boton nativo, tiene nombre accesible en espanol y
      funciona mediante teclado.
- [ ] El foco visible se conserva y, tras la accion, queda en una posicion
      logica sin perderse.
- [ ] En movil el boton no tapa el dock inferior, filtros, acciones ni
      contenido relevante.
- [ ] El comportamiento funciona en escritorio, tablet y movil sin overflow
      horizontal.
- [ ] La solucion reutiliza estilos y componentes existentes y no anade
      dependencias.
- [ ] No hay regresiones en busqueda, filtros, seleccion de WODs o navegacion.
- [ ] Las pruebas cubren las decisiones puras de visibilidad y reduced motion;
      la interaccion visual y de foco queda preparada para validacion manual
      porque el proyecto no tiene un harness DOM ni una libreria de testing de
      componentes instalada.
- [ ] No se modifican backend, API, base de datos ni contratos existentes.

## Restricciones

- Mantener la arquitectura basada en React, TypeScript, CSS y Vitest.
- No crear un componente global o una abstraccion compartida sin otro
  consumidor real.
- No cambiar rutas, contratos API ni logica del catalogo no relacionada con la
  navegacion vertical.
