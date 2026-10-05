# Plan de implementación

## Navegación actual

`NavigationLinks` renderiza los `NavLink` reales definidos en `navigation.ts`. `DesktopNavigation` lo consume en la sidebar y `MobileNavigation` lo reutiliza para la bottom navigation y el menú Más. La clase `nav-link-active` ya comunica el destino activo con tokens de #48.

## Enfoque

- Crear un componente visual pequeño junto a los componentes de layout, sin crear `/components/ui`.
- Usar `Array.from(label)` para conservar caracteres Unicode y espacios de los labels españoles.
- Renderizar dos capas `aria-hidden`: la primera parte desde `translateY(0)` y la segunda desde `translateY(100%)`; ambos grupos de caracteres comparten delays calculados desde el centro a `35 ms` por carácter.
- Mantener el nombre accesible en el `NavLink` mediante `aria-label`, por lo que los lectores de pantalla no reciben texto duplicado.
- Añadir una prop explícita a `NavigationLinks` para usar Text Roll únicamente desde `DesktopNavigation`; mobile mantiene el texto actual.

## CSS y accesibilidad

- Aplicar transiciones de `transform` únicamente a los caracteres y `overflow: hidden` al contenedor visual para evitar reflow, cambios de ancho o alto y overflow horizontal.
- Activar el efecto desde `.nav-link:hover` y `.nav-link:focus-visible`; conservar los tokens active y el outline global de foco.
- En `prefers-reduced-motion: reduce`, desactivar las transiciones y mostrar únicamente la capa superior sin ocultar texto, foco o estado active.
- Reutilizar exclusivamente tokens existentes de #48 para los estados de navegación; no se añade `motion` porque CSS cubre el comportamiento requerido sin dependencias.

## Cambios previstos

- `frontend/src/components/layout/TextRoll.tsx`: capas visuales y stagger calculado.
- `frontend/src/components/layout/NavigationLinks.tsx`: integrar el componente visual solo cuando se solicite y mantener un nombre accesible único.
- `frontend/src/components/layout/DesktopNavigation.tsx`: activar Text Roll para la sidebar.
- `frontend/src/components/layout/AuthActions.tsx` y `Navbar.tsx`: aplicar el mismo tratamiento al login/logout desktop sin afectar sus handlers ni la versión mobile.
- `frontend/src/index.css`: estilos del roll y reduced motion, sin modificar el sistema de tokens.

## Verificación

- Ejecutar 21st-ui-review, `npm run lint`, `npm run test`, `npm run build` y `git diff --check`.
- Validar manualmente hover, Tab/focus, navegación real, reduced motion, labels españoles y mobile sin animación.
