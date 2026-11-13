# SDD: Copiar el nombre de un WOD desde su detalle

## Objetivo

Permitir que una persona copie al portapapeles exactamente el nombre visible de
un WOD desde el detalle compartido, con una confirmación breve y veraz.

## Alcance

- Añadir la acción `Copiar nombre` junto al título en el componente de detalle
  reutilizado por los WOD públicos y personales.
- Copiar únicamente `selectedWod.name` después de una interacción explícita.
- Informar mediante un mensaje de estado accesible cuando la copia finalice o
  falle.
- Reutilizar los estilos y patrones de interacción de `wod-detail.css`.
- Cubrir los resultados de éxito y fallo mediante pruebas de interacción.

No se modificarán páginas, rutas, API, backend, persistencia, autenticación,
autorización, contratos ni reglas de dominio.

## Comportamiento esperado

1. Al visualizar un WOD, su cabecera muestra un botón nativo `Copiar nombre`
   junto al nombre sin modificar el título ni las demás acciones.
2. Al activar el botón con ratón, Enter o Espacio, se solicita copiar
   exactamente `selectedWod.name` mediante la API del portapapeles.
3. `Copiado` se muestra solo cuando la operación asíncrona se resuelve.
4. Si la API no está disponible o rechaza la operación, se muestra un mensaje
   explícito de fallo y nunca una confirmación de éxito.
5. El feedback se anuncia sin desplazar el foco y se elimina tras un intervalo
   breve.

## Criterios de aceptación

- [ ] El detalle visible de un WOD incluye la acción `Copiar nombre`.
- [ ] El portapapeles recibe exactamente el nombre mostrado, sin ID ni texto
      adicional.
- [ ] La acción es un control nativo etiquetado y operable con ratón y teclado.
- [ ] El éxito se comunica solo tras completarse la copia; un fallo muestra un
      mensaje no engañoso.
- [ ] La acción y el feedback respetan el lenguaje visual, foco y responsive
      existentes sin alterar título ni acciones actuales.
- [ ] Las pruebas cubren éxito y fallo y pasan los checks frontend aplicables.

## Restricciones

- El cambio se limita al frontend y no añade dependencias ni un sistema global
  de notificaciones.
- La implementación conserva la arquitectura de presentación compartida y los
  estilos importados desde `src/index.css`.
- Deben respetarse `AGENTS.md`, `frontend/AGENTS.md`, `DESIGN.md`, `DOMAIN.md`
  y `docs/consitucion.md`.

## Fuentes

- Issue local preparada #232: `.workflow/issues/232.json`.
- `frontend/src/components/wodDetail/WodDetail.tsx`.
- `frontend/src/styles/wod-detail.css`.
- `frontend/src/components/wodDetail/WodDetail.test.tsx`.
- `PROJECT.md`, `DESIGN.md`, `DOMAIN.md`, `AGENTS.md` y
  `frontend/AGENTS.md`.
