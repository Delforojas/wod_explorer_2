# Tareas

## Preparación

- [x] Confirmar la Issue #99 y sus dependencias.
- [x] Superar Context Guard y registrar la rama `standard-main` desde
      `origin/main`.
- [x] Consultar referencias visuales sin introducir dependencias externas.
- [x] Crear el SDD único de la Issue #99.

## Home autenticada

- [x] Separar la presentación guest de la experiencia autenticada usando
      `useAuth()`.
- [x] Añadir saludo con username y fallback seguro.
- [x] Añadir CTA para registrar resultado y accesos a Mis WODs, crear WOD y
      explorar WODs.
- [x] Cargar solo resultados autenticados mediante el API existente.
- [x] Mostrar actividad reciente propia, límite de tres elementos y enlace al
      historial completo.
- [x] Implementar estados de carga, vacío, error y reintento sin datos obsoletos.

## Responsive y accesibilidad

- [x] Estilizar la composición autenticada en mobile-first con tokens y patrón
      visual existente.
- [x] Verificar headings, foco visible, nombres accesibles, contraste y reduced
      motion.

## Pruebas y cierre local

- [x] Añadir pruebas de ramas pública/autenticada y transformación de actividad.
- [x] Cubrir cambio de sesión, vacío, error/reintento y logout según las
      capacidades existentes del entorno de pruebas.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`, revisar el diff y crear solo un commit local
      de la Issue #99.
