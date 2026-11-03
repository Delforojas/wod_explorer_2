# Tareas

- [x] Definir Inicio y el icono de casa en el catálogo de navegación compartido.
- [x] Ajustar los conjuntos de enlaces de sidebar y dock para visitante y autenticado, conservando visibilidad por sesión.
- [x] Asegurar coincidencia activa exacta de Inicio en `/`.
- [x] Adaptar el dock móvil para seis accesos entre 320 y 380 px sin overflow ni pérdida de accesibilidad.
- [x] Actualizar pruebas de navegación para orden, sesión, estado activo y nombres accesibles.
- [x] Ejecutar lint, pruebas, build y comprobación de diff.
- [x] Sincronizar el SDD con la implementación y las verificaciones completadas.

## Dependencias

- Las tareas de UI y pruebas dependen del catálogo de navegación compartido.
- La validación manual depende de la implementación y de las verificaciones automáticas superadas.

## Verificaciones completadas

- `npm run test -- src/components/layout/NavigationPlacement.test.tsx`: PASS (1 archivo, 8 tests).
- `npm run lint`: PASS.
- `npm run test`: PASS (27 archivos, 111 tests).
- `npm run build`: PASS.
- `git diff --check`: PASS.
