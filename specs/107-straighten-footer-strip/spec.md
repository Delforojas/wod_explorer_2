# SDD: Franja social del footer horizontal

## Objetivo

Corregir la inclinación visual de la franja verde/turquesa del footer para que
sus bordes sean paralelos al viewport en desktop, tablet y móvil, conservando
su contenido, enlaces, estilo y animación.

## Alcance

- Eliminar la transformación rotacional aplicada a `.delfo-footer__marquee`.
- Mantener el layout, colores, tipografía, iconos, enlaces, marquee y foco
  actuales.
- Añadir una regresión que impida reintroducir una transformación en la franja.
- No modificar componentes, navegación, backend, API, autenticación ni base de
  datos.

## Comportamiento esperado

1. La franja social queda horizontal y sus bordes superior e inferior siguen
   líneas paralelas al viewport.
2. Los enlaces `LINKEDIN`, `GITHUB`, `PORTFOLIO` y `CONTACTO` conservan sus
   destinos y funcionamiento.
3. La animación horizontal del contenido continúa sin inclinación.
4. No aparece scroll horizontal, clipping ni espacio vacío en los extremos.
5. El footer conserva su comportamiento responsive y `prefers-reduced-motion`.

## Criterios de aceptación

- [ ] La franja es horizontal en los anchos visuales probados.
- [ ] Sus bordes son paralelos al viewport y el contenido permanece alineado.
- [ ] Los enlaces e iconos conservan su funcionamiento.
- [ ] No hay scroll horizontal ni clipping indeseado.
- [ ] El diseño responsive y las animaciones existentes se conservan.
- [ ] `npm run lint`, `npm run test`, `npm run build` y `git diff --check` pasan.
- [ ] La comprobación visual final en navegador queda preparada para validación
      manual con captura comparativa.

## Restricciones

- No rediseñar el footer.
- No modificar contenidos, enlaces o destinos.
- No compensar la inclinación con offsets arbitrarios.
- No añadir dependencias.

## Fuentes

- GitHub Issue #107.
- `frontend/src/components/layout/Footer.tsx`.
- `frontend/src/styles/footer.css`.
- `frontend/src/styles/preferences.css`.
- `DESIGN.md` y `frontend/AGENTS.md`.
