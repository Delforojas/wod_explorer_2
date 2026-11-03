# SDD: Unificar la Home autenticada con la portada pública

## Objetivo

Actualizar la Home autenticada para que comparta la jerarquía visual de la
portada pública renovada, sin perder su función de dashboard personal ni los
flujos existentes de registro y consulta de actividad.

## Alcance

- Rediseñar el hero autenticado con saludo real, soporte para nombres largos y
  los dos CTAs existentes de registro.
- Conservar Mis WODs, Benchmarks, Crear WOD personal y Explorar WODs como
  accesos rápidos.
- Mantener la actividad reciente privada y sus estados de carga, vacío y error.
- Añadir accesos secundarios al catálogo filtrado por CROSSTRAINING y HYBRID.
- Aplicar composición responsive, foco visible y reducción de movimiento al
  dashboard autenticado.

## Comportamiento esperado

1. El usuario autenticado ve su saludo, los CTAs para resultados de WOD y de
   ejercicio, y los cuatro accesos rápidos con sus rutas existentes.
2. La actividad reciente conserva datos reales y privados, incluido el acceso
   al historial y los estados existentes.
3. Las tarjetas de descubrimiento enlazan a `/wods?category=CROSSTRAINING` y
   `/wods?category=HYBRID`.
4. En móvil el contenido mantiene una columna legible, espacio para el dock y
   áreas táctiles accesibles; en escritorio se aprovecha una composición de
   dos columnas.

## Criterios de aceptación

- [x] La Home autenticada comparte el lenguaje visual de la portada pública sin
      sustituir la personalización ni los flujos privados.
- [x] Se preservan ambos registros y los cuatro accesos rápidos con sus rutas.
- [x] La actividad reciente mantiene datos privados y estados de carga, vacío y
      error.
- [x] CROSSTRAINING y HYBRID usan los filtros reales del catálogo.
- [x] El saludo admite nombres largos.
- [x] El layout incluye reglas responsive, foco visible y reduced motion.
- [x] No se modifican la Home pública, backend, API, autenticación, dominio ni
      base de datos.

## Restricciones

- Reutilizar rutas, datos y tokens existentes; no crear endpoints ni métricas
  ficticias.
- No añadir dependencias ni cambiar el sistema de autenticación.
- Mantener la interfaz en español y la semántica de enlaces existente.
