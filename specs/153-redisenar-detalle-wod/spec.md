# SDD: Rediseñar detalle de WOD con lectura tipo pizarra de box

## Objetivo

Rediseñar el detalle compartido de WOD para comunicar inmediatamente la
modalidad, el tiempo disponible, las rondas y la prescripción ordenada con una
lectura compacta inspirada en la pizarra de un box, sin alterar el contrato ni
el comportamiento actual.

## Alcance

- Reorganizar el detalle visual compartido de WOD y sus estilos relacionados.
- Hacer prominentes modalidad, tiempo/límite de tiempo, rondas y prescripciones
  existentes.
- Mantener el orden real de composición y todos los campos disponibles de cada
  ejercicio: repeticiones, carga, distancia y duración.
- Adaptar la presentación a `AMRAP`, `FOR_TIME` y `EMOM` usando solo los campos
  que expone el contrato actual.
- Conservar los controles `Volver` y `Registrar resultado`, su navegación y sus
  reglas actuales de autorización.
- Añadir pruebas de presentación para la jerarquía, modalidades y prescripciones.

## Fuera de alcance y limitaciones

- No se modifican APIs, schemas, backend, persistencia, permisos, rutas ni
  lógica de registro de resultados.
- El contrato actual no expone variantes MEN/WOMEN, progresiones ni extensiones
  de tiempo; no se mostrarán valores inventados ni se añadirá alcance de backend.
- No se rediseñan los listados ni otras pantallas.

## Comportamiento esperado

1. El encabezado muestra el nombre, modalidad y tiempo/límite disponible. Las
   rondas se comunican como ciclos cuando el dato existe.
2. La composición es una lista ordenada, compacta y legible donde la
   prescripción precede al nombre del movimiento, respetando exactamente el
   orden recibido.
3. Las prescripciones compuestas conservan cada dato disponible sin ocultar
   carga, distancia ni duración.
4. `AMRAP`, `FOR_TIME` y `EMOM` se presentan sin afirmar semántica adicional
   que el contrato no proporciona.
5. Los controles existentes siguen siendo enlaces o botones nativos, accesibles
   por teclado y con foco visible en móvil y escritorio.

## Criterios de aceptación

- [ ] Un WOD AMRAP de 20 minutos con 5, 10 y 15 repeticiones comunica ciclos y
      permite interpretar inmediatamente la prescripción.
- [ ] La composición tiene densidad de pizarra: prescripción prominente, orden
      claro, sin numeración decorativa dominante ni tarjetas repetidas.
- [ ] Las tres modalidades y las prescripciones disponibles se representan con
      datos reales, manteniendo orden y ejercicios repetidos.
- [ ] El detalle responde correctamente en móvil y escritorio; `Volver` y
      `Registrar resultado` preservan su comportamiento.
- [ ] No se introducen datos de ejemplo ni cambios al contrato backend.
- [ ] Las pruebas, lint y build de frontend, junto con `git diff --check`,
      superan la verificación automatizada.
- [ ] Se prepara revisión manual visual de WODs representativos antes de
      cualquier commit, según el Issue.

## Restricciones

- Reutilizar React, TypeScript, CSS y tokens/componentes actuales.
- Mantener tema oscuro, acentos naranjas existentes, semántica HTML, contraste,
  foco visible y comportamiento responsive.
- No añadir dependencias ni realizar refactorizaciones ajenas.

## Fuentes

- GitHub Issue #153.
- `DOMAIN.md` (secciones 4.3, 4.5 y 5).
- `PROJECT.md`, `PRODUCT.md`, `DESIGN.md`, `AGENTS.md` y `frontend/AGENTS.md`.
- `specs/119-unify-wod-details/`.
- `frontend/src/components/wodDetail/WodDetail.tsx` y
  `frontend/src/styles/wod-detail.css`.
