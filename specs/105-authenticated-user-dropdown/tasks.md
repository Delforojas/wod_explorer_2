# Tareas

## Preparación

- [x] Confirmar la Issue #105, sus restricciones y las fuentes de autenticación
      y navegación existentes.
- [x] Crear este SDD único y validar su trazabilidad antes de implementar.

## UserMenu compartido

- [x] Implementar `UserMenu` con trigger de cuenta, avatar, chevron y panel
      único con `Cerrar sesión`.
- [x] Gestionar apertura, Escape, clic fuera, navegación, foco y logout sin
      duplicar el sistema de sesión.
- [x] Integrarlo en `AuthActions` para sidebar desktop y Navbar responsive,
      manteniendo login público para visitantes.

## Responsive y accesibilidad

- [x] Estilizar desktop y mobile con tokens existentes, safe area, overflow,
      estados hover/focus y reduced motion.
- [x] Definir `placement="bottom"` para Navbar/sidebar responsive y eliminar
      las acciones de cuenta del dock mobile sin duplicar `UserMenu`.
- [x] Verificar que no se muestran opciones ficticias ni controles duplicados.

## Pruebas y cierre local

- [x] Añadir pruebas de ramas guest/autenticada y contrato accesible del menú.
- [x] Añadir pruebas de orientación para Navbar/sidebar y de ausencia de cuenta
      en el dock mobile.
- [x] Cubrir con pruebas o validación manual las interacciones de Escape, clic
      fuera, navegación, logout, redirección y responsive según el entorno.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar alcance, staging y estado final; crear un único commit de #105.
