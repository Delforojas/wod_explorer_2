# Arquitectura CSS

La referencia de la issue #70 es la apariencia actual: naranja, negro y glass.
La discrepancia con `DESIGN.md` está documentada en el informe de la auditoría;
este refactor no cambia la dirección visual ni carga fuentes nuevas.

## Responsabilidades y orden

`../index.css` es el único punto de entrada. Su orden forma parte de la cascada:

1. `tokens.css` y `base.css`: valores compartidos y estilos de elementos base.
2. `marks-navigation.css`, `layout.css`, `navigation.css`, `mobile-dock.css`, `footer.css`:
   navegación de secciones y estructura de la aplicación.
3. `surfaces.css`, `forms.css`, `resources.css`, `pages.css`: superficies,
   formularios, patrones compartidos de recursos y estructura de páginas.
4. Hojas de páginas y componentes: variantes, composición y responsive local.
5. `preferences.css`: alternativas para paneles con blur, al final para que
   prevalezcan sobre las variantes locales sin `!important` ni más especificidad.

`forms.css` comparte los controles de configuración, tarjetas de ejercicios y
resultados. `resources.css` comparte cabeceras, metadatos, tarjetas y estados.
`marks-navigation.css` contiene los enlaces de secciones (antes estaban en
`buttons.css`, aunque no son botones). Las excepciones de catálogo en
`surfaces.css` conservan intencionadamente las superficies negras existentes.

Los grupos enumeran sus consumidores reales: no añaden clases genéricas a React
ni hacen coincidir componentes ajenos mediante selectores parciales.
Las diferencias intencionadas y los estilos de hover/foco permanecen locales.

## Convenciones

- Hojas CSS en `kebab-case`; clases existentes con ámbito de página/componente.
- Importar cada hoja una sola vez desde `index.css`, sin imports encadenados.
- Reutilizar los tokens existentes cuando el valor y el significado coincidan.
  Los alias locales conservan el contexto del componente.
- Agrupar únicamente declaraciones equivalentes. Comprobar consumidores y
  cascada antes de moverlas; una coincidencia textual no demuestra equivalencia.
- Mantener los breakpoints efectivos de cada componente. CSS nativo no permite
  usar custom properties como condiciones de media queries; no sustituirlos por
  `var(...)` ni introducir tooling para ello.
- Las reglas de movimiento reducido deben alcanzar al menos la especificidad de
  las reglas animadas que anulan. Conservar el foco visible y estados disabled.

## Verificación

Desde `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
Comparar rutas, tamaños y estados iguales antes/después. Los tests actuales de
schemas no demuestran equivalencia visual ni cobertura de accesibilidad.
Las capturas y los informes de la issue se guardan fuera del repositorio.
