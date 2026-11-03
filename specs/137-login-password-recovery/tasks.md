# Tareas

- [x] Añadir el control no operativo de recuperación bajo Contraseña.
- [x] Aplicar estilos secundarios, responsive y de estado deshabilitado.
- [x] Añadir pruebas de texto, estado no operativo y posición en el formulario.
- [x] Ejecutar checks frontend aplicables.
- [x] Sincronizar el SDD con la implementación y verificaciones reales.
- [x] Releer la Issue ampliada y documentar el acceso Entrar del dock móvil.
- [x] Añadir Entrar para visitantes usando la ruta existente `/login`.
- [x] Mantener Entrar oculto con sesión y ajustar el dock para cuatro elementos en pantallas pequeñas.
- [x] Añadir cobertura de destinos públicos y estado activo de Entrar.
- [x] Ejecutar checks frontend tras la ampliación.
- [x] Validar visualmente `/login` y el dock móvil con cuatro destinos (aprobado por usuario el 2026-11-03).

## Dependencias

- El estilo y las pruebas dependen del control renderizado en `LoginView`.
- La validación manual depende de los checks automatizados superados.

## Verificaciones completadas

- `npm run test -- src/views/login/LoginView.test.tsx`: PASS (1 archivo, 1 test).
- `npm run lint`: PASS.
- `npm run test`: PASS (28 archivos, 112 tests).
- `npm run build`: PASS.
- `git diff --check`: PASS.
- `npm run test -- src/components/layout/NavigationPlacement.test.tsx`: PASS (1 archivo, 9 tests).
- `npm run lint`: PASS.
- `npm run test`: PASS (28 archivos, 113 tests).
- `npm run build`: PASS.
- `21st review`: omitido; el binario `21st` no está instalado en el entorno.
