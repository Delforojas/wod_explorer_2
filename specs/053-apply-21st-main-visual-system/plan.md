# Plan de implementación

## Contexto y enfoque

La Issue #48 ya introdujo los tokens, controles, surfaces y breakpoints en `frontend/src/index.css`; #49 añadió la interacción de navegación. La Issue #53 no añade un sistema ni una dependencia: completa la adopción de esos primitives en consumidores reales de `main`.

La revisión de inspiración 21st para listas compactas dark, formularios y focus confirma que los patrones existentes son suficientes. No se recuperará ni instalará código externo.

## Inventario de consumidores reales

| Consumidor actual | Tratamiento actual | Token/primitiva 21st | Acción |
| --- | --- | --- | --- |
| `AppLayout` / `.app-main` | Canvas elevado, gutters y sidebar existentes | `.app-main`, tokens de canvas | MANTENER |
| Home y Login | Headers, acciones, form layout y separadores ya coherentes | `.page-header`, `.form-layout`, botones | MANTENER |
| Exercises y WODs | Lists, rows y detail sections ya usan surfaces; loading solo textual | `.resource-row`, `.detail-section`, `.ui-loading` | ADAPTAR loading compartido |
| Create WOD | Campos base usan `.form-field`; campos condicionales y repetibles no | `.form-field`, `.repeatable-item`, `.form-field-grid` | ADAPTAR agrupación de campos |
| My WODs | Edición y registro AMRAP contienen campos sin patrón; placeholder de resultado sin surface | `.form-layout`, `.form-field`, `.ui-empty`, `.ui-loading` | ADAPTAR formularios y estado existente |
| History y resultados por ejercicio | Filas pasivas reciben hover y resultados son texto plano | `.resource-row`, `.resource-meta`, `.metric-*` | ADAPTAR affordance y métricas |
| Versiones y elementos de versiones | Metadatos y detalle usan párrafos sin jerarquía ni separación | `.resource-meta`, `.detail-data`, `.exercise-sequence` | ADAPTAR metadata y detalle |
| Google callback y mejores marcas | Callback no usa loading compartido; mejores marcas es placeholder coherente | `.ui-loading`, `.page-header`, `.ui-empty` | ADAPTAR callback; MANTENER placeholder |

## Cambios técnicos previstos

1. Refinar primitives CSS existentes para loading estructurado, metadata/datos de detalle, filas pasivas y formularios responsive, con tokens actuales y sin cambiar la paleta.
2. Aplicar las clases ya disponibles a los campos condicionales y repetibles de crear/editar WOD y registrar AMRAP.
3. Reestructurar únicamente el marcado de metadata y datos de resultados existentes para usar las primitives de lista, detalle y métrica, preservando datos y handlers.
4. Aplicar los estados de loading existentes a la jerarquía de página correspondiente, sin alterar su control de carga.

## Accesibilidad y responsive

- Mantener elementos nativos, etiquetas asociadas, focus global y roles de alert existentes.
- Usar layout mobile-first y la cuadrícula de campos existente a partir de `600px`.
- Conservar el espacio para la navegación inferior en móvil y el canvas junto al sidebar desde `900px`.
- No usar el color como única señal: el estado de resultado conserva texto y las acciones sus etiquetas.

## Estrategia de verificación

- Ejecutar `21st review` sobre los cambios de `frontend/src`, `npm run lint`, `npm run test`, `npm run build` y `git diff --check` desde `frontend/` cuando corresponda.
- Verificar manualmente Home, catálogos, formularios, historial/resultados, detalles, callback de autenticación y estados en móvil, tablet y desktop; revisar foco visible y ausencia de overflow horizontal.
