# DESIGN.md

## Fuente de verdad visual

`DESIGN.md` es la fuente de verdad del lenguaje visual de WOD Explorer.

Toda decisión visual compartida, incluidos tokens, patrones de componentes y reglas responsive, debe consolidarse en este archivo antes de aplicarse de forma generalizada. Este documento define cómo se presenta el producto; no define ni modifica el dominio, permisos, contratos API ni reglas de negocio.

La dirección visual aprobada es **Pizarra de Rendimiento Mobile-First**.

---

## Uso de 21st

`21st` es el MCP de diseño de apoyo configurado para WOD Explorer.

Puede utilizarse para explorar referencias, layouts, jerarquía, componentes, spacing y alternativas visuales. Sus propuestas deben evaluarse frente a la spec activa, este documento, el sistema visual existente, la accesibilidad y las restricciones del producto.

`21st` no sustituye a `DESIGN.md`, no crea requisitos funcionales y no debe aplicarse automáticamente.

---

## Jerarquía de decisiones

Aplicar este orden cuando existan varias fuentes de decisión:

1. Spec activa.
2. `DESIGN.md`.
3. Sistema visual existente.
4. MCP de diseño `21st`.
5. Skills de diseño.

Las decisiones visuales no pueden modificar los requisitos funcionales, las reglas de privacidad, propiedad o historial definidos por el dominio.

---

## Identidad visual

- Nombre del producto: `WOD Explorer`.
- Dirección: `Pizarra de Rendimiento Mobile-First`.
- Carácter: herramienta personal de rendimiento, precisa, sobria y atlética.
- Lenguaje: superficies oscuras, datos de alto contraste y jerarquía guiada por cifras y estructura.
- Debe evitar una estética de competición, red social, comunidad, gamificación o ranking.
- Idioma de interfaz: español.

### Tema

- Tema principal y único consolidado: oscuro.
- El tema claro no forma parte de esta decisión y no debe introducirse como variante local.
- El fondo oscuro debe conservar separación suficiente entre fondo base, superficies y superficies elevadas.

---

## Tokens

Los valores siguientes son la base para variables CSS compartidas. No introducir valores equivalentes arbitrarios en pantallas o componentes concretos.

### Colores y roles semánticos

| Rol | Valor | Uso visual |
| --- | --- | --- |
| Fondo base | `#101314` | Fondo de la aplicación |
| Fondo elevado | `#171B1D` | Navegación y áreas persistentes |
| Superficie | `#1E2426` | Cards, formularios y listas |
| Superficie elevada | `#283033` | Hover, panel secundario y fila destacada |
| Borde | `#394345` | Separación de superficies y controles |
| Texto principal | `#F1F5F2` | Títulos, cifras y contenido primario |
| Texto secundario | `#B4BFBA` | Metadatos y labels |
| Texto tenue | `#7F8C87` | Ayuda y placeholders |
| Acento principal | `#B6E642` | Acción primaria, foco destacado y dato principal |
| Información | `#73C7E3` | Información neutral y enlaces |
| Éxito | `#56C596` | Confirmación de interfaz |
| Advertencia | `#F2B45B` | Atención no destructiva |
| Error | `#EF6B6B` | Error, validación y acción destructiva |

- El color nunca es el único medio para comunicar origen, modalidad, estado de finalización, error o éxito.
- El acento principal no implica por sí mismo una mejora, marca personal o estado deportivo.
- Mantener contraste suficiente entre texto y todas las superficies oscuras.

### Tipografía y escala

- Familia: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Usar figuras tabulares para tiempos, fechas, rondas y repeticiones cuando el navegador las soporte.
- Pesos: 400 para cuerpo, 500 para controles, 600 para títulos y 700 para métricas.

| Token | Tamaño / interlineado | Uso |
| --- | --- | --- |
| `text-xs` | `12px / 16px` | Ayuda y metadatos |
| `text-sm` | `14px / 20px` | Texto base compacto, controles y tablas |
| `text-base` | `16px / 24px` | Lectura y labels principales |
| `text-lg` | `20px / 28px` | Títulos de sección |
| `text-xl` | `24px / 32px` | Títulos de pantalla |
| `metric-lg` | `32px / 36px` | Métricas destacadas |
| `metric-xl` | `40px / 44px` | Métrica principal de detalle |

- Reservar las mayúsculas sostenidas para etiquetas muy breves y acompañarlas de tracking ligero.
- No usar tamaños inferiores a `12px`.

### Spacing

- Unidad base: `4px`.
- Escala: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`.
- Padding interno mínimo de controles: `12px`.
- Padding de card: `16px` en móvil y `20px` en escritorio.
- Separación de bloques: `24px` en móvil y `32px` en escritorio.
- Mantener el ritmo vertical con esta escala en todas las pantallas.

### Bordes y radios

| Token | Valor | Uso |
| --- | --- | --- |
| `radius-sm` | `6px` | Badges, chips e inputs compactos |
| `radius-md` | `10px` | Botones, inputs, filas interactivas y cards |
| `radius-lg` | `14px` | Paneles de página y modales |
| `border-default` | `1px solid #394345` | Controles y separación de superficies |

- No usar bordes gruesos salvo para focus visible o error.
- Evitar radios excesivamente grandes o formas decorativas.

### Sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `shadow-surface` | `0 1px 2px rgb(0 0 0 / 18%)` | Superficie estándar |
| `shadow-raised` | `0 8px 24px rgb(0 0 0 / 28%)` | Panel o card elevada |
| `shadow-modal` | `0 20px 48px rgb(0 0 0 / 45%)` | Modal |

- Las sombras indican elevación, no estados semánticos.
- No usar efectos glow decorativos como patrón general.

---

## Layout y grid

- Contenedor principal: ancho máximo de `1280px`.
- Gutter exterior: `16px` en móvil, `24px` en tablet y `32px` en escritorio.
- Escritorio: navegación persistente, contenido principal y columna contextual opcional cuando aporte información ya disponible.
- Móvil: una columna; el contexto secundario se muestra después del contenido principal.
- Las pantallas de detalle priorizan identidad, modalidad y composición; los metadatos disponibles quedan en segundo plano.

| Rango | Columnas | Gap |
| --- | --- | --- |
| Móvil | 4 | `16px` |
| Tablet | 8 | `20px` |
| Escritorio | 12 | `24px` |

- Las cards de métrica ocupan el ancho disponible en móvil y de 2 a 4 columnas en escritorio según contenido.
- Formularios y listas usan una columna en móvil. Dos columnas se permiten cuando los campos pertenecen al mismo bloque y siguen siendo legibles.

### Breakpoints

| Nombre | Rango |
| --- | --- |
| Base | `0px–599px` |
| Tablet | `600px–899px` |
| Escritorio | `900px–1199px` |
| Escritorio amplio | `1200px` en adelante |

Los breakpoints reorganizan densidad y estructura; no ocultan información esencial.

---

## Estrategia responsive y navegación

El diseño es mobile-first: primero se resuelven lectura vertical, controles táctiles y una tarea principal por pantalla; escritorio añade densidad y contexto sin duplicar controles.

### Navegación

- Los destinos disponibles se muestran con etiquetas visibles y jerarquía consistente.
- En móvil, utilizar navegación inferior fija con un máximo de cinco destinos y etiquetas siempre visibles.
- En escritorio, utilizar navegación lateral persistente con icono y etiqueta.
- Las acciones proporcionadas por la aplicación se agrupan en el contexto visual del recurso que representan.
- Las áreas y estados privados proporcionados se distinguen mediante etiquetas y contexto visual consistentes.

### Adaptación

- En móvil, las listas se presentan como filas o cards de una columna; en escritorio pueden usar tabla cuando mejore la comparación.
- Los filtros pasan de barra lateral o línea horizontal a panel desplegable accesible en pantallas estrechas.
- Las acciones secundarias pueden agruparse en un menú contextual solo si siguen siendo alcanzables por teclado.
- Los valores numéricos no se truncan; el contexto puede saltar de línea antes de comprimir una cifra.
- Los formularios no usan dos columnas por debajo de `600px`.

---

## Componentes y patrones

### Botones

- Altura estándar: `44px`; objetivo táctil mínimo: `44px × 44px`.
- Primario: fondo de acento principal, texto de fondo base y peso 600.
- Secundario: superficie elevada, borde estándar y texto principal.
- Terciario: sin fondo persistente, texto principal o de información.
- Destructivo: color de error, reservado para acciones destructivas ya definidas por el producto.
- Estados visuales obligatorios: default, hover, focus-visible, disabled y loading.
- Focus visible: anillo de `3px` en el acento principal, separado `2px` del control.

### Inputs y formularios

- Altura mínima: `44px`.
- Fondo: fondo elevado; borde: borde estándar; texto: texto principal.
- Focus: borde de acento y anillo visible.
- Label persistente sobre cada control; el placeholder es solo ayuda contextual.
- Texto de ayuda: `text-xs`.
- Error: icono, color y mensaje textual; no depender únicamente del borde rojo.
- Agrupar campos por finalidad visual, sin añadir campos no definidos por los contratos y el dominio.
- La presentación de un resultado debe conservar su estructura específica: `FOR_TIME` muestra tiempo; `AMRAP` muestra rondas completas y repeticiones adicionales.

### Cards y superficies

- Card estándar: superficie, borde estándar, radio medio, sombra de superficie y padding definido por breakpoint.
- Card interactiva: misma base, con elevación suave y borde más visible en hover.
- Card de métrica: cifra como foco y contexto textual debajo; no requiere gráficos decorativos.
- Card de WOD: nombre, modalidad, origen y composición resumida cuando esos datos estén disponibles.
- La composición usa una secuencia numerada de ejercicios para preservar el orden visualmente.
- No usar imágenes deportivas de stock como requisito de la identidad.

### Listas y tablas

- En móvil, usar filas o cards de una columna: título primero y metadatos debajo.
- En escritorio, usar tablas cuando comparen información de forma más eficaz; filas de al menos `48px`.
- Toda tabla debe tener representación móvil estructurada y no depender del desplazamiento horizontal para contenido básico.
- Alinear cifras a la derecha y usar figuras tabulares.
- Usar borde como separador principal, no sombras entre filas.
- Priorizar nombre, resultado representado según modalidad, fecha disponible y origen cuando se muestre información conjunta.

### Badges y estados de entidad

- Badge compacto: `text-xs`, radio pequeño y padding horizontal de `8px`.
- Puede representar visualmente modalidad, origen de WOD, categoría, tipo de medición, estado de finalización cuando corresponda y archivado cuando exista ese dato.
- Un badge nunca es la única representación de un dato relevante.

### Estados de interfaz

- Loading: skeleton con dimensiones cercanas al contenido final; no sustituir toda la pantalla por un spinner.
- Empty: icono simple, título, explicación breve y acción solo cuando ya exista funcionalmente en el contexto.
- Error: panel con borde de error, descripción clara y reintento cuando la operación técnica lo permita.
- Success: confirmación breve con color de éxito y texto; no usarlo como estado permanente ni como mensaje de logro.
- Los estados vacíos no sugieren contenido, resultados, historial o marcas inexistentes.

---

## Métricas y estadísticas

- Las métricas usan tipografía grande, cifras tabulares y etiqueta explícita.
- Los resultados conservan la estructura de su modalidad:
  - `FOR_TIME`: tiempo.
  - `AMRAP`: rondas completas y repeticiones adicionales.
- Cuando la aplicación proporcione una mejor marca, su card prioriza el valor, la identificación del WOD y su contexto textual.
- Las cards de métrica muestran la identificación y el contexto proporcionados junto al valor para evitar ambigüedad visual.
- Los gráficos son opcionales: deben ser simples, no prometer comparativas o interpretaciones no definidas y contar con alternativa textual.

---

## Accesibilidad visual

- Mantener contraste suficiente para texto, controles y estados en todas las superficies.
- Mantener focus visible y consistente en todos los elementos interactivos.
- No depender solo del color para comunicar origen, modalidad, estado, error o éxito.
- Mantener objetivos táctiles mínimos de `44px × 44px`.
- Mantener labels asociados a controles y texto auxiliar legible.
- Respetar navegación mediante teclado, jerarquía de encabezados y orden de foco coherente con el orden visual.
- Preferir elementos semánticos nativos; ARIA solo cuando la semántica nativa no sea suficiente.
- La animación debe ser discreta, no necesaria para comprender información y respetar preferencias de movimiento reducido.
- Los gráficos deben disponer de etiquetas y resumen textual equivalente.

---

## Reglas de consistencia entre pantallas

- Usar los mismos roles de color, radios, bordes y sombras en todo el producto.
- Usar de forma consistente la terminología de dominio: WOD, ejercicio, WOD genérico, WOD personal, resultado, historial y mejor marca.
- Representar modalidad, origen y estado con el mismo patrón de badge y texto en todas las pantallas.
- Usar el mismo formato de resultado en detalle, listados, historial y mejores marcas.
- Mantener el mismo orden visual de acciones: primaria, secundaria y destructiva.
- Expresar la privacidad con contexto y etiquetas, no mediante datos, secciones o funciones inventadas.
- No crear iconos, colores, radios, sombras o patrones de card exclusivos de una pantalla si existe un patrón del sistema que responde a la misma necesidad.
- Toda nueva decisión compartida debe añadirse primero a este documento como token o regla antes de aplicarse de forma general.

---

## Guardrails visuales

Solicitar autorización antes de:

- sustituir completamente la dirección visual aprobada;
- introducir un tema claro global;
- incorporar un design system externo;
- cambiar la identidad visual fundamental;
- sustituir `DESIGN.md` como fuente de verdad visual;
- aplicar una propuesta de 21st que contradiga decisiones consolidadas.

Nunca:

- tratar una propuesta del MCP como requisito automático;
- introducir funcionalidades, estados de negocio, permisos o reglas de dominio a través de una decisión visual;
- modificar el dominio para adaptarlo a la interfaz;
- ignorar accesibilidad, responsive o foco visible;
- ampliar el alcance de una spec por una recomendación visual;
- introducir dependencias o sistemas de estilos alternativos como efecto de implementar este diseño.

---

## Principios

- Priorizar claridad, legibilidad y accesibilidad.
- Reutilizar tokens y patrones antes de crear variantes locales.
- Mantener coherencia entre móvil, tablet y escritorio.
- Usar 21st como apoyo de exploración, no como sustituto de decisiones del proyecto.
- Mantener el sistema visual separado de las reglas funcionales y de negocio.
