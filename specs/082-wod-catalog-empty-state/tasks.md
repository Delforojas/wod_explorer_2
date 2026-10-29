# Tareas: Estado vacio del catalogo publico de WODs

- [x] Actualizar `WodsList` para distinguir catalogo sin WODs, busqueda sin
      coincidencias y busqueda con resultados usando el estado existente.
- [x] Renderizar un estado vacio semantico con copy diferenciado y sin accion
      innecesaria cuando el catalogo no tiene WODs.
- [x] Mostrar la accion existente `Limpiar filtros` en el estado vacio solo
      cuando una busqueda activa deja cero coincidencias, y conservarla en el
      buscador cuando hay resultados.
- [x] Añadir estilos responsive y accesibles para el estado vacio en `wod.css`
      usando tokens y patrones existentes.
- [x] Revisar que seleccion, enlaces autenticados, contador, filtrado y
      `Volver arriba` no cambien de comportamiento.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check` y revisar el alcance del diff.
- [ ] Realizar validacion manual pendiente de aprobacion en movil y escritorio,
      incluyendo teclado, foco visible, catalogo vacio y filtros sin
      coincidencias.
