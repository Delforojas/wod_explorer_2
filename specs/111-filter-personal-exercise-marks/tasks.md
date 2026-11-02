# Tareas

## Preparación

- [x] Confirmar Issue #111, alcance, restricciones y preservación de privacidad,
      resultados y ruta de mejores marcas.
- [x] Crear el SDD único y verificar su trazabilidad con el contexto frontend.

## Implementación

- [x] Añadir helper puro de filtrado de resultados por `exerciseId` y pruebas de
      ID, nombres repetidos, vacío, limpieza y cambios rápidos.
- [x] Añadir reintento seguro de carga en `MyExerciseResultsPage` y conectar el
      callback con la vista.
- [x] Añadir selector accesible con «Todos los ejercicios», selección por ID y
      estados de vacío global/filtrado.
- [x] Retirar solo el CTA «Mejores marcas» y conservar «+ Registrar marca».
- [x] Ajustar estilos responsive, foco y estados del selector sin cambiar el
      formato existente de las marcas.
- [x] Añadir pruebas de presentación para selector, CTA, estados y recuperación.

## Verificación y handoff

- [x] Revisar que no haya cambios backend/API ni referencias huérfanas a la
      funcionalidad de mejores marcas.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Preparar la validación manual específica y mantenerla pendiente de
      aprobación del usuario.
