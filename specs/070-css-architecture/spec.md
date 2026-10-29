# Especificacion: Auditoria y refactorizacion de arquitectura CSS

## Objetivo

Completar la auditoria de la arquitectura CSS del frontend y aplicar una
refactorizacion segura que reduzca duplicacion demostrable sin cambiar la
apariencia, el comportamiento, las rutas, la accesibilidad ni el sistema de
estilos actual.

La interfaz conserva intencionadamente su direccion visual naranja, negra y
glass. La discrepancia existente con `DESIGN.md` no forma parte de esta tarea.

## Alcance

- Auditar `frontend/src/index.css`, `frontend/src/styles/` y sus consumidores
  reales en `frontend/src/components/`, `frontend/src/views/` y
  `frontend/src/pages/`.
- Mantener `frontend/src/index.css` como unico punto de entrada CSS.
- Consolidar solo valores y declaraciones con equivalencia semantica
  demostrable.
- Retirar solo reglas duplicadas u obsoletas con evidencia de uso y cascada.
- Mantener los breakpoints, estados responsive, foco, hover, reduced motion y
  reduced transparency salvo que una consolidacion sea demostrablemente
  equivalente.
- Actualizar referencias React unicamente si fueran necesarias para mantener
  consumidores CSS reales.
- Mantener fuera del alcance backend, API, dominio, dependencias, rutas,
  comportamiento funcional y rediseño visual.

## Baseline P0 verificado

Referencia: `main` y `origin/main` en `c8d84a14b46a008b8102eef57831cf32046c4c4e`.

- 37 archivos CSS versionados en `frontend/src/`, incluido `index.css`.
- 9.292 lineas fisicas CSS.
- 102 ocurrencias de `@media`: 52 de ancho y 50 de interaccion o
  accesibilidad.
- 36 hojas importadas una vez desde `frontend/src/index.css`.
- No hay imports CSS desde componentes o vistas.
- No hay hojas CSS bajo `frontend/src/components/`.
- Los componentes publicos movidos por PR #88 viven en
  `components/ExerciseFilter/` y `components/wodFilter/`.

Los valores historicos `#ff6b00`, `#ff9a3c` y
`rgba(255, 255, 255, 0.09)` ya tienen tokens y no requieren duplicar tokens.

## Hallazgos P0

- `tokens.css`, `base.css` y el orden de `index.css` ya proporcionan una
  separacion global, compartida y local.
- `styles/README.md` documenta responsabilidades, convenciones e importacion
  unica, pero no existe un informe de auditoria independiente en el repositorio.
- Los archivos usan `kebab-case`, pero permanecen valores literales repetidos
  fuera de los tokens; solo se moveran los que tengan un rol compartido claro.
- Existen reglas claramente redundantes en `surfaces.css` para
  `.form-layout.glass-panel`, porque repiten propiedades ya definidas por
  `.glass-panel` con los mismos valores efectivos.
- Las media queries repetidas no se moveran automaticamente: sus selectores,
  cascada o estados pueden ser locales.
- La verificacion visual con capturas no esta disponible en el entorno actual;
  debe quedar como validacion manual pendiente.

## Criterios de aceptacion

- [x] El trabajo CSS historico integrado en `main`, incluido PR #88 y la rama
      historica de #70, queda identificado sin repetirlo.
- [x] La auditoria y sus limitaciones quedan documentadas antes de los cambios.
- [x] El inventario final usa el mismo alcance y procedimiento que el baseline.
- [x] Los problemas detectados tienen evidencia de consumidores, cascada o
      ausencia de uso.
- [ ] Las referencias visuales iniciales y finales se comparan en desktop,
      tablet y movil, o se documenta la limitacion de forma explicita.
- [x] Las declaraciones repetidas consolidadas conservan los valores efectivos.
- [x] Las reglas eliminadas tienen evidencia de duplicacion o ausencia de uso.
- [x] Los imports siguen resolviendo una sola vez y conservan el orden necesario.
- [x] Las responsabilidades de tokens, base, layout, shared UI, pagina y
      componente quedan trazables.
- [x] No se crean abstracciones globales o genericas sin consumidores reales.
- [x] No se alteran rutas, funcionalidad, dependencias ni contratos.
- [ ] Se conservan responsive, foco, teclado, reduced motion y reduced
      transparency.
- [ ] Se conservan navegacion desktop, mobile dock, formularios, tarjetas y
      estados loading, error, empty y success.
- [ ] No aparece overflow horizontal nuevo.
- [x] `npm run lint`, `npm run test`, `npm run build` y `git diff --check`
      pasan.
- [x] El informe final incluye metricas iniciales y finales, tokens,
      duplicaciones, reglas eliminadas, validaciones, limitaciones, deuda
      tecnica y archivos modificados.
- [ ] La validacion visual y manual pendiente se documenta sin afirmar
      equivalencia no observada.

## Restricciones

- No introducir framework CSS, tooling nuevo ni dependencias.
- No modificar `DOMAIN.md`, backend, API, base de datos ni Specs existentes.
- No cambiar la direccion visual actual.
- No eliminar una regla basandose solo en una busqueda textual.
- No consolidar media queries si la cascada efectiva no es equivalente.
