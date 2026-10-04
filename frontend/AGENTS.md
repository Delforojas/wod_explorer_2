# AGENTS.md — Frontend

Este archivo aplica a todo el contenido dentro de `frontend/`.

Las reglas globales definidas en el `AGENTS.md` raíz siguen siendo obligatorias.

Toda tarea frontend debe respetar las fuentes de verdad y reglas definidas por el proyecto.

Cuando una tarea requiera cambios en otras capas, deberán respetarse también los `AGENTS.md` correspondientes.

Si existe un conflicto entre reglas, aplicar la jerarquía definida por el proyecto.

---

## Tecnología y configuración

La configuración del frontend de WOD Explorer 2.0 es:

- Framework: React
- Lenguaje: TypeScript
- Versión: TypeScript 5.x
- Build tool: Vite
- Sistema de estilos: CSS
- Librería de validación: Zod
- Gestión de estado: estado local de React (`useState`, `useReducer`, Context cuando sea necesario)
- Framework de testing: Vitest
- Ruta base de API: `/api`
- Idioma principal de la interfaz: español

No asumir tecnologías, librerías o herramientas que no hayan sido definidas.

Seguir las convenciones propias de React, TypeScript y Vite configuradas en el proyecto.

No añadir ni sustituir tecnologías principales del frontend sin autorización cuando el cambio tenga impacto arquitectónico.

No introducir una librería global de gestión de estado mientras el estado pueda resolverse adecuadamente mediante las capacidades nativas de React.

No introducir un framework o librería de estilos adicional sin una necesidad justificada y aprobación previa.

---

## Arquitectura

Respetar la arquitectura frontend definida por el proyecto y su estructura existente.

Arquitectura:

```text
Arquitectura por features (feature-based).

frontend/src/
├── app/          # configuración y composición global de la aplicación
├── features/     # funcionalidades organizadas por dominio o caso de uso
├── components/   # componentes reutilizables entre múltiples features
├── api/          # infraestructura y configuración común de acceso HTTP
├── schemas/      # schemas Zod compartidos
├── types/        # tipos TypeScript compartidos
├── hooks/        # hooks reutilizables entre múltiples features
├── utils/        # utilidades puras compartidas
└── assets/       # recursos estáticos
```

Organizar principalmente el código específico de negocio dentro de `features/`.

Las features deben corresponder a funcionalidades o áreas funcionales reales del producto.

Ejemplos de features de WOD Explorer 2.0:

- `auth`;
- `exercises`;
- `wods`;
- `results`;
- `history`;
- `personal-records`.

Cada feature debe contener únicamente las partes que necesite.

Por ejemplo:

```text
features/
└── exercises/
    ├── components/
    ├── api/
    ├── schemas/
    ├── types/
    └── hooks/
```

No exigir la misma estructura interna a todas las features ni crear carpetas vacías para cumplir una estructura teórica.

Mantener una separación clara de responsabilidades.

Separar cuando corresponda:

- presentación;
- composición;
- lógica de aplicación;
- acceso a datos;
- estado;
- validación;
- tipos;
- schemas;
- utilidades.

Mantener dentro de cada feature el código que pertenezca únicamente a esa funcionalidad.

Mover código a áreas compartidas únicamente cuando exista reutilización real entre múltiples features.

Los componentes compartidos no deben contener reglas de negocio específicas de una feature.

Evitar dependencias innecesarias entre features.

Cuando varias features necesiten una misma capacidad, extraer únicamente la parte realmente compartida.

No crear nuevas capas, carpetas o abstracciones sin una necesidad real.

No reorganizar la arquitectura existente como efecto secundario de una tarea no relacionada.

No realizar refactors arquitectónicos fuera del alcance de la spec activa.

## Componentes

Cuando el framework utilice componentes, estos deben mantener responsabilidades claras y acotadas.

Los componentes visuales deben centrarse principalmente en:

- presentación;

- composición;

- interacción;

- representación de estado.

Evitar componentes con:

- demasiadas responsabilidades;

- lógica de negocio compleja;

- acceso a datos mezclado innecesariamente con presentación;

- estado innecesariamente elevado;

- efectos secundarios difíciles de controlar;

- dependencias innecesarias.

Extraer lógica reutilizable cuando aporte claridad real.

Preferir composición cuando resulte apropiado.

No crear abstracciones únicamente para reducir líneas de código.

No crear componentes genéricos prematuramente.

---

## Lenguaje y tipado

Utilizar:

TypeScript 5.x

Seguir las convenciones idiomáticas del lenguaje y framework configurados.

Cuando exista tipado estático:

- mantener el nivel de seguridad de tipos definido por el proyecto;

- preferir tipos explícitos y reutilizables;

- utilizar tipos derivados cuando eviten duplicación;

- tratar datos externos como no confiables hasta validarlos;

- evitar mecanismos que desactiven innecesariamente el sistema de tipos.

No utilizar assertions, casts o mecanismos equivalentes únicamente para ocultar errores.

Priorizar:

- código legible;

- nombres descriptivos;

- responsabilidades claras;

- estructuras simples;

- tipos seguros;

- inmutabilidad cuando sea apropiada.

---

## Validación

Sistema de validación:

Zod

Validar datos externos cuando corresponda.

Esto puede incluir:

- respuestas de API;
- formularios;
- parámetros;
- almacenamiento local;
- archivos;
- datos importados;
- configuración externa.

Utilizar esquemas Zod como frontera de validación para datos no confiables.

Cuando un tipo TypeScript represente exactamente los datos definidos por un esquema Zod, preferir derivarlo mediante `z.infer` en lugar de mantener manualmente ambas definiciones.

Evitar mantener múltiples representaciones equivalentes de un mismo contrato cuando puedan derivarse de una única fuente.

La validación frontend mejora la experiencia de usuario, pero no sustituye la validación realizada por el backend.

Las reglas de negocio y restricciones de seguridad deben seguir siendo validadas y aplicadas por el backend.

No eliminar ni debilitar validaciones únicamente para evitar errores durante la implementación.

---

## API

Ruta base:

`/api`

Toda integración HTTP deberá:

- manejar errores;
- gestionar estados de carga cuando corresponda;
- gestionar estados vacíos cuando corresponda;
- gestionar correctamente estados de éxito;
- evitar URLs hardcodeadas cuando exista configuración;
- mantener la lógica reutilizable de acceso a datos separada de componentes puramente visuales;
- validar con Zod las respuestas externas cuando corresponda;
- respetar los contratos existentes;
- tratar adecuadamente respuestas inesperadas.

Los componentes visuales no deben contener directamente lógica HTTP reutilizable.

No asumir contratos API no definidos.

No inventar endpoints, parámetros, payloads, códigos de respuesta ni estructuras de datos.

No modificar silenciosamente contratos existentes para adaptar el frontend.

Las reglas de autorización y propiedad definidas por el dominio deben ser aplicadas por el backend. El frontend puede reflejarlas en la interfaz, pero no constituye una frontera de seguridad.

Si una funcionalidad necesita un endpoint o contrato inexistente:

1. identificar la dependencia;
2. comprobar la spec activa;
3. consultar las fuentes de verdad disponibles;
4. comprobar si el contrato está definido por el backend;
5. detener la implementación si falta una decisión necesaria.

---

## Diseño

`DESIGN.md` es la fuente de verdad del lenguaje visual del proyecto.

Debe consultarse antes de implementar o modificar cualquier interfaz visual.

La spec define qué debe conseguir una pantalla o funcionalidad.

`DESIGN.md` define cómo debe expresarse visualmente dentro del producto.

Antes de realizar cambios visuales:

1. comprobar la spec activa;

2. leer `DESIGN.md`;

3. identificar tokens, patrones y componentes existentes;

4. consultar el MCP de diseño configurado cuando resulte relevante;

5. reutilizar soluciones existentes cuando sean adecuadas;

6. implementar respetando las decisiones visuales establecidas.

No introducir decisiones visuales que contradigan `DESIGN.md` salvo que la spec autorice explícitamente una evolución del sistema visual.

No introducir sin justificación:

- nuevas familias tipográficas;

- nuevos colores globales;

- nuevos radios;

- nuevas sombras;

- nuevos patrones de componentes;

- nuevos estilos de navegación;

- nuevas convenciones visuales.

Cuando exista un token o patrón equivalente, reutilizarlo.

Si una necesidad visual no está contemplada en `DESIGN.md`, no crear silenciosamente una nueva convención global.

Determinar si se trata de:

- una necesidad local;

- una variante de un patrón existente;

- una evolución del sistema visual.

Cuando una decisión suponga una evolución relevante del sistema visual, actualizar `DESIGN.md` únicamente cuando la spec o el alcance de la tarea lo permita.

---

## Estilos

Sistema principal:

CSS

Utilizar CSS como sistema principal de estilos del frontend.

Seguir las convenciones y la organización de estilos definidas por el proyecto.

Mantener una estrategia mobile-first para el diseño responsive.

Evitar:

- introducir sistemas de estilos alternativos sin necesidad;
- incorporar Tailwind CSS, CSS-in-JS, Sass u otros sistemas sin una decisión explícita;
- mezclar estrategias de estilos incompatibles;
- duplicar grandes cantidades de estilos;
- crear abstracciones visuales prematuras;
- introducir valores arbitrarios cuando existan tokens equivalentes;
- utilizar estilos inline para sustituir reglas que deberían formar parte del sistema de estilos.

Reutilizar tokens, variables CSS, primitives y patrones visuales existentes cuando estén disponibles.

Los valores visuales compartidos, como colores, espaciados, tipografía, radios o dimensiones recurrentes, deben reutilizar los tokens existentes antes de introducir nuevos valores.

No modificar el sistema visual global como efecto secundario de implementar una funcionalidad concreta.

## Responsive

Aplicar la estrategia responsive definida en `DESIGN.md`.

Cuando no exista una estrategia específica, priorizar un enfoque mobile-first.

Comprobar los tamaños o breakpoints relevantes para la funcionalidad modificada.

Cuando corresponda, validar:

- móvil;

- tablet;

- escritorio.

No asumir únicamente tamaños desktop durante la implementación.

Evitar layouts rígidos cuando no sean necesarios.

---

## Accesibilidad

La accesibilidad forma parte de los requisitos obligatorios de calidad del frontend.

Mantener cuando corresponda:

- HTML semántico;

- labels asociados a controles;

- navegación mediante teclado;

- focus visible;

- contraste suficiente;

- jerarquía correcta de encabezados;

- botones reales para acciones;

- links reales para navegación;

- estados comprensibles para tecnologías de asistencia.

Preferir elementos interactivos nativos frente a recreaciones innecesarias mediante elementos genéricos.

Añadir ARIA únicamente cuando la semántica nativa no sea suficiente.

No eliminar comportamiento accesible existente para simplificar una implementación.

No depender únicamente del color para transmitir información relevante.

---

## Formularios

Los formularios deberán:

- mostrar errores comprensibles;

- mantener una jerarquía visual clara;

- comunicar estados de carga;

- evitar múltiples envíos accidentales;

- gestionar correctamente estados de éxito y error;

- preservar accesibilidad;

- validar los datos cuando corresponda.

No depender exclusivamente de la validación frontend para garantizar:

- reglas de negocio;

- integridad;

- autorización;

- seguridad.

---

## Estado

Sistema de gestión de estado:

React (`useState`, `useReducer` y Context cuando corresponda)

Mantener el estado lo más cerca posible del lugar donde se utiliza.

Utilizar:

- `useState` para estado local simple;
- `useReducer` cuando un estado local tenga transiciones o lógica suficientemente complejas;
- Context para estado compartido por una parte relevante del árbol de componentes cuando evite prop drilling significativo.

Evitar:

- elevar estado sin necesidad;
- utilizar Context para problemas puramente locales;
- utilizar estado global para problemas locales;
- duplicar el mismo estado en múltiples fuentes;
- almacenar como estado valores que puedan derivarse de otro estado existente;
- introducir nuevas librerías de estado sin justificación.

Distinguir entre estado de interfaz, estado de aplicación y datos procedentes del backend. No copiar innecesariamente datos remotos a múltiples estados locales.

No introducir o sustituir una solución global de estado salvo que:

1. la spec lo requiera;
2. exista una necesidad arquitectónica clara;
3. las herramientas existentes no resuelvan adecuadamente el problema;
4. el cambio respete los Guardrails.

## Rendimiento

Evitar optimizaciones prematuras.

Priorizar:

- renders simples;

- componentes con responsabilidades claras;

- estructuras de datos adecuadas;

- carga eficiente de recursos;

- evitar trabajo innecesario;

- evitar peticiones redundantes.

No introducir memoización, caching u optimizaciones complejas sin una razón concreta.

Cuando exista un problema de rendimiento real, medir antes de optimizar cuando sea posible.

---

## Testing

Framework de testing:

Vitest

Añadir tests proporcionales al impacto de la funcionalidad cuando la infraestructura del proyecto lo permita.

Priorizar tests sobre comportamiento relevante:

- interacción del usuario;
- validación;
- estados de carga, vacío, éxito y error;
- navegación;
- formularios;
- integración con respuestas API;
- tratamiento de respuestas inesperadas;
- comportamiento accesible relevante;
- reglas de presentación derivadas del dominio cuando corresponda.

Evitar tests excesivamente acoplados a detalles internos de implementación.

Preferir comprobar el comportamiento observable del componente desde la perspectiva del usuario frente a comprobar su estructura interna.

No depender de nombres de funciones internas, estado interno o detalles de implementación cuando no formen parte del comportamiento observable.

Mockear únicamente las dependencias necesarias para aislar el comportamiento que se está verificando.

No eliminar, desactivar, omitir o debilitar tests únicamente para conseguir que una implementación pase.

Cuando un test existente falle como consecuencia de un cambio intencionado de comportamiento, actualizarlo únicamente si la spec confirma el nuevo comportamiento esperado.

Los tests deben verificar comportamiento relevante, no simplemente aumentar cobertura.

## Comandos

Herramienta principal:

Vite

Package manager:

npm

Comandos definidos para el proyecto:

Install: npm install
Run: npm run dev
Lint: npm run lint
Test: npm run test
Build: npm run build

Utilizar los comandos definidos por el proyecto.

No asumir un package manager o herramienta concreta si no está configurada.

Utilizar mecanismos reproducibles proporcionados por el proyecto antes que instalaciones globales.

Ejecutar las verificaciones aplicables antes de considerar una tarea completada.

---

## Skills

Utilizar las skills relevantes disponibles en `.agents/skills/frontend/`.

Skills frontend disponibles:

- `vercel-react-best-practices`;
- `vercel-composition-patterns`;
- `typescript-advanced-types`;
- `zod`;
- `accessibility`.

Utilizar cada skill únicamente cuando sea relevante para la tarea actual.

Las skills proporcionan conocimiento, patrones y criterios especializados, pero no constituyen fuentes de verdad del producto.

No pueden contradecir:

1. la spec activa;
2. este `frontend/AGENTS.md`;
3. el `AGENTS.md` raíz;
4. `DESIGN.md` cuando corresponda;
5. los Guardrails aplicables;
6. las decisiones de dominio vigentes.

No utilizar skills irrelevantes para la tarea actual.

No introducir tecnologías, dependencias o decisiones arquitectónicas únicamente porque una skill las recomiende.

## MCP y herramientas externas

MCPs configurados para el frontend:

```text

Design MCP: <design_mcp>

Repository MCP: <repository_mcp>

Additional MCP: <additional_mcp>

```

No asumir que un MCP está disponible si no ha sido configurado explícitamente.

### MCP de diseño

Cuando `<design_mcp>` esté configurado, utilizarlo cuando resulte relevante para:

- consultar referencias visuales;

- explorar layouts;

- analizar componentes;

- estudiar patrones de interfaz;

- obtener propuestas visuales;

- apoyar decisiones de composición e interacción.

Cuando exista una referencia visual configurada:

```text

<design_reference>

```

utilizarla como referencia mediante el MCP cuando la tarea lo requiera.

Las propuestas obtenidas mediante MCP deben adaptarse a:

1. la spec activa;

2. `DESIGN.md`;

3. el sistema visual existente;

4. la arquitectura frontend;

5. los requisitos de accesibilidad;

6. los Guardrails.

El MCP puede proponer o ayudar a explorar soluciones.

No sustituye a `DESIGN.md` como fuente de verdad visual.

No aplicar automáticamente una propuesta obtenida mediante MCP si contradice decisiones ya establecidas.

### MCP de repositorio

Cuando `<repository_mcp>` esté configurado, puede utilizarse para:

- consultar Issues;

- revisar requisitos;

- consultar Pull Requests;

- revisar ramas;

- comprobar estado remoto;

- verificar trabajo relacionado con una tarea.

No realizar acciones destructivas o irreversibles sin autorización cuando estén protegidas por los Guardrails.

### MCP adicionales

Utilizar `<additional_mcp>` únicamente dentro del ámbito para el que haya sido configurado.

Los MCPs y herramientas externas no sustituyen:

- la spec activa;

- `DESIGN.md`;

- los `AGENTS.md`;

- los Guardrails;

- las fuentes de verdad definidas por el proyecto.

---

## Backend

No modificar backend desde una tarea exclusivamente frontend salvo que la spec lo requiera explícitamente.

Si una funcionalidad frontend necesita un contrato backend inexistente:

1. identificar la dependencia;

2. comprobar la spec activa;

3. consultar las fuentes de verdad disponibles;

4. no inventar el contrato;

5. detener la implementación cuando falte una decisión necesaria.

Cuando una tarea requiera modificar backend, respetar también `backend/AGENTS.md`.

---

## Specs

La spec activa define el alcance de la implementación.

Puede definir, entre otros aspectos:

- qué pantalla construir;

- qué comportamiento implementar;

- qué API consumir;

- qué estados gestionar;

- qué requisitos visuales cumplir;

- qué está fuera de alcance.

No añadir funcionalidades simplemente porque parezcan convenientes.

No ampliar silenciosamente el alcance.

No implementar trabajo futuro no solicitado únicamente para facilitar posibles evoluciones posteriores.

Si falta una decisión funcional necesaria, detener la implementación y solicitar aclaración.

---

## Guardrails

El agente debe detenerse y solicitar autorización antes de:

- sustituir el framework principal del frontend;

- sustituir el sistema principal de estilos;

- introducir o sustituir una solución global de estado;

- cambiar decisiones arquitectónicas fundamentales;

- sustituir `DESIGN.md` como fuente de verdad visual;

- modificar de forma fundamental el sistema visual global;

- realizar cambios incompatibles en contratos públicos existentes;

- eliminar funcionalidades existentes;

- realizar cambios destructivos o difíciles de revertir;

- modificar otras capas fuera del alcance de la tarea;

- ampliar el alcance definido por la spec activa.

El agente nunca debe:

- inventar endpoints o contratos inexistentes;

- introducir secretos o credenciales reales en código frontend;

- desactivar mecanismos de seguridad para resolver una tarea;

- eliminar validaciones únicamente para evitar errores;

- eliminar o desactivar tests únicamente para conseguir que una implementación pase;

- ocultar errores de tipado, lint, testing o build;

- ignorar verificaciones fallidas;

- tratar automáticamente una propuesta del MCP como requisito;

- declarar una tarea completada cuando fallen verificaciones obligatorias.

Los cambios relacionados con backend deben respetar también `backend/AGENTS.md`.

Los cambios relacionados con persistencia deben respetar también `database/AGENTS.md`.

Los Guardrails globales definidos en el `AGENTS.md` raíz tienen prioridad.

---

## Verificación final

Antes de considerar una tarea frontend completada:

1. revisar los cambios realizados;

2. comprobar que respetan la arquitectura definida;

3. comprobar que respetan `DESIGN.md` cuando exista impacto visual;

4. ejecutar la comprobación de tipos cuando corresponda;

5. ejecutar lint cuando esté configurado;

6. ejecutar los tests relevantes;

7. ejecutar el build;

8. comprobar responsive cuando exista impacto visual;

9. comprobar accesibilidad básica cuando exista impacto en interfaz;

10. comprobar los estados de carga, error, vacío y éxito afectados;

11. verificar los contratos API utilizados;

12. comprobar que no existen secretos o credenciales versionados;

13. confirmar que no se ha ampliado el alcance de la spec;

14. comprobar que no se han violado los Guardrails;

15. reportar cualquier verificación que no haya podido completarse.

Una tarea no debe considerarse completada si una verificación obligatoria falla.
