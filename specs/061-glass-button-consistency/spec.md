# Issue #61 - Consistencia glass y botones

## Objetivo
Unificar el material glass y los bordes de botones en las vistas interiores existentes del main.

## Alcance
- Extender `.glass-panel` a listas, detalles y formularios de Ejercicios, WODs, Mis WODs, Crear/editar WOD, Historial y resultados existentes.
- Reutilizar variants de botón para asegurar bordes visibles en acciones de texto e icono.
- Preservar comportamiento, API, navegación, Pulsar Grid y fallback sin blur.

## Criterios
- Las superficies existentes usan el mismo material glass sin fondos opacos internos.
- Abrir, Ver WOD y flechas tienen borde visible en reposo.
- Primary, secondary y destructive mantienen semántica, foco y tamaño adecuados.
- No hay cambios funcionales ni overflow móvil.
