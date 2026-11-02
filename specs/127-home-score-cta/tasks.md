# Tareas

## Preparación

- [x] Confirmar requisitos de la Issue #127 y su independencia de cambios de
      backend, API y dominio.
- [x] Confirmar rutas privadas existentes y la separación Home autenticada/
      visitante.
- [x] Crear este SDD sobre la base verificada de `origin/main`.

## Implementación

- [x] Añadir CTA autenticado para registrar resultado de ejercicio y conservar
      el CTA existente de resultado de WOD.
- [x] Aplicar jerarquía sólida/outline, texto/flecha y foco visible con layout
      responsive.
- [x] Añadir Benchmarks a «Accesos rápidos» sin retirar los enlaces existentes.
- [x] Asegurar wrap legible de usernames largos sin overflow horizontal.
- [x] Reservar espacio inferior seguro para el dock fijo y safe area en Home.
- [x] Identificar actividad WOD disponible sin inventar resultados de ejercicios
      ni ampliar backend.
- [x] Mantener la Home pública sin CTAs privados.
- [x] Añadir o actualizar pruebas de navegación, auth/guest, actividad y layout.

## Verificación y handoff

- [x] Revisar que no existan cambios en backend, API, auth, dominio o BD.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run test` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff final y crear commit local sin push.
- [x] Preparar checklist de validación manual sin marcarla como aprobada.
