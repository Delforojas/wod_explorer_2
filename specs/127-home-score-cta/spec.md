# SDD: Mejorar accesos de Home autenticada

## Objetivo

Mejorar la Home autenticada como punto de entrada para registrar resultados,
acceder a Benchmarks y consultar la actividad reciente, manteniendo la Home
pública sin acciones privadas y corrigiendo el solapamiento del dock móvil.

## Alcance

- Mostrar en «Tu entrenamiento» los CTAs existentes para registrar un resultado
  de WOD y un resultado de ejercicio.
- Mantener el CTA de WOD como acción naranja sólida y añadir el CTA de ejercicio
  como acción outline naranja, ambos con texto, flecha, foco y rutas existentes.
- Añadir Benchmarks a «Accesos rápidos» sin retirar Mis WODs, Crear WOD personal
  ni Explorar WODs.
- Hacer que el saludo y los nombres largos puedan envolver sin overflow.
- Reservar espacio inferior seguro en la Home autenticada para el dock móvil
  fijo, incluyendo `env(safe-area-inset-bottom)`.
- Identificar visualmente la actividad WOD que ya entrega la Home sin inventar
  eventos de ejercicios ni crear una nueva consulta de actividad.
- Mantener intacta la Home pública para visitantes.

## Comportamiento esperado

1. Un usuario autenticado ve dos CTAs de registro dentro de «Tu entrenamiento»:
   `/my-wod-results/new` para WOD y `/exercise-results/new` para ejercicio.
2. El CTA WOD conserva fondo naranja sólido; el CTA de ejercicio usa borde y
   texto naranja sobre fondo transparente. Ambos son enlaces accesibles y
   conservan la flecha visible.
3. «Accesos rápidos» contiene Mis WODs, Crear WOD personal, Explorar WODs y
   Benchmarks enlazado a `/my-exercise-results`.
4. Nombres largos del usuario se muestran con wrap legible, sin desbordamiento
   horizontal en móvil, tablet o escritorio.
5. La actividad reciente conserva los resultados WOD existentes, muestra su
   tipo disponible y no crea entradas de resultados de ejercicios que Home no
   recibe actualmente.
6. El contenido inferior de Home queda separado del dock fijo en anchos donde
   el dock existe, respetando la zona segura del dispositivo.
7. La Home pública conserva sus CTA de visitante y no muestra CTAs, accesos ni
   actividad privados.

## Criterios de aceptación

- [x] Usuario autenticado ve y puede usar ambos CTAs de registro.
- [x] El CTA WOD es sólido naranja y el de ejercicio outline naranja, con foco
      visible y texto/flecha visibles.
- [x] Benchmarks aparece en accesos rápidos y conserva los tres accesos
      existentes.
- [x] El dock móvil no tapa actividad reciente ni el contenido inferior de Home,
      incluida la zona segura.
- [x] El saludo soporta nombres largos sin overflow horizontal.
- [x] Actividad reciente conserva sus datos WOD, identifica solo el tipo
      disponible y no inventa eventos de ejercicios.
- [x] La Home de visitantes no expone CTA privados ni cambia su flujo.
- [x] El resultado es responsive en móvil, tablet y escritorio, con teclado,
      foco visible y contraste correcto.
- [x] Existen pruebas de navegación, visibilidad autenticada/visitante y layout;
      lint, tests, build y `git diff --check` pasan.
- [x] Queda preparada una validación manual visual y funcional.
- [x] No hay cambios de API, entidades, base de datos, autorización ni
      `DOMAIN.md`.

## Restricciones

- Reutilizar las rutas y flujos existentes; no crear formularios ni endpoints.
- No cargar resultados de ejercicios desde un nuevo endpoint para esta Home.
- No inventar actividad reciente ni cambiar cálculos o reglas de dominio.
- No modificar la Home pública ni rediseñar la Home completa.
- No añadir dependencias ni cambiar el sistema visual aprobado.
