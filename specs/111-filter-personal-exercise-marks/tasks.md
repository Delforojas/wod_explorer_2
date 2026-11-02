# Tareas

## Preparación

- [x] Confirmar Issue #111, alcance, restricciones y preservación de privacidad,
      resultados y ruta de mejores marcas.
- [x] Crear el SDD único y verificar su trazabilidad con el contexto frontend.

## Implementación

- [x] Sustituir el selector por un helper de búsqueda parcial por nombre que
      resuelva resultados mediante `exerciseId`.
- [x] Añadir reintento seguro de carga en `MyExerciseResultsPage` y conectar el
      callback con la vista.
- [x] Añadir input accesible con lupa, filtrado en tiempo real, limpieza rápida
      y estados de vacío global/sin coincidencias.
- [x] Retirar solo el CTA «Mejores marcas» y conservar «+ Registrar marca».
- [x] Ajustar estilos responsive, foco y estados del input sin cambiar el
      formato existente de las marcas.
- [x] Actualizar pruebas de búsqueda parcial, mayúsculas/minúsculas, vacío,
      ausencia, limpieza, CTA, estados y recuperación.

## Verificación y handoff

- [x] Revisar que no haya cambios backend/API ni referencias huérfanas a la
      funcionalidad de mejores marcas.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Preparar la validación manual específica y mantenerla pendiente de
      aprobación del usuario.
