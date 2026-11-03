# Tareas

- [x] Añadir el control no operativo de recuperación bajo Contraseña.
- [x] Aplicar estilos secundarios, responsive y de estado deshabilitado.
- [x] Añadir pruebas de texto, estado no operativo y posición en el formulario.
- [x] Ejecutar checks frontend aplicables.
- [x] Sincronizar el SDD con la implementación y verificaciones reales.

## Dependencias

- El estilo y las pruebas dependen del control renderizado en `LoginView`.
- La validación manual depende de los checks automatizados superados.

## Verificaciones completadas

- `npm run test -- src/views/login/LoginView.test.tsx`: PASS (1 archivo, 1 test).
- `npm run lint`: PASS.
- `npm run test`: PASS (28 archivos, 112 tests).
- `npm run build`: PASS.
- `git diff --check`: PASS.
