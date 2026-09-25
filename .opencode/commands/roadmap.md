---
description: Analiza el estado actual del proyecto y propone las siguientes GitHub Issues necesarias
---

# /roadmap

## Objetivo

Analizar el estado real del proyecto, revisar el trabajo completado, identificar
el trabajo pendiente y proponer las siguientes GitHub Issues necesarias para
continuar su desarrollo de forma ordenada.

El roadmap debe basarse en el estado actual y verificable del repositorio, no en
suposiciones sobre el producto o sobre trabajo futuro.

Debe evitar:

- duplicar funcionalidades ya implementadas;

- proponer trabajo cubierto por Issues existentes;

- ignorar dependencias entre funcionalidades;

- proponer funcionalidades fuera del alcance definido del producto;

- asumir tecnologías, arquitectura o convenciones que no estén definidas en el

  proyecto.

El objetivo de `/roadmap` es determinar **qué trabajo debería registrarse a
continuación**, no diseñar ni implementar la solución.

## Instrucciones

### 1. Leer las reglas y contexto del proyecto

Antes de proponer cualquier Issue, identifica y comprende las reglas, el alcance
y el contexto actual del proyecto.

Lee, cuando existan:

- `AGENTS.md` en la raíz;

- los `AGENTS.md` específicos aplicables;

- la constitución del proyecto o documento equivalente;

- `PRODUCT.md`;

- documentación técnica relevante;

- documentación de arquitectura relevante;

- documentación del workflow que pueda afectar a la planificación.

Respeta la jerarquía y el alcance definidos por estos documentos.
No presupongas que todos ellos existen. La ausencia de un documento opcional no
debe impedir continuar si existe suficiente contexto para analizar el proyecto.

Si existen instrucciones contradictorias, aplica las reglas de precedencia
definidas por el propio proyecto. Si no existe una precedencia clara y la
contradicción afecta al roadmap, informa de la ambigüedad antes de continuar.

Durante esta fase:

- no modifiques código;

- no modifiques documentación;

- no crees archivos;

- no crees ni cambies de rama;

- no hagas commits ni push;

- no implementes funcionalidades;

- no crees todavía GitHub Issues.

Esta fase es únicamente de lectura y análisis.

### 2. Analizar el estado de GitHub

Consulta el estado de GitHub del repositorio actual para comprender el trabajo
registrado y evitar duplicidades.

Utiliza preferentemente las herramientas de GitHub disponibles en el entorno,
como GitHub MCP cuando esté configurado y accesible.

Si GitHub MCP no está disponible, utiliza GitHub CLI (`gh`) cuando permita
obtener la información necesaria de forma fiable.

No asumas que una integración concreta estará disponible en todos los proyectos
que utilicen esta plantilla.

Revisa, cuando la información esté disponible:

- Issues abiertas;

- Issues cerradas;

- Issues completadas recientemente;

- títulos y descripciones;

- criterios de aceptación;

- comentarios relevantes;

- comentarios o documentación de cierre;

- referencias entre Issues;

- dependencias explícitas entre Issues;

- Pull Requests relacionados cuando sean necesarios para determinar el estado
  real de una Issue.

Clasifica mentalmente el trabajo encontrado como:

- completado;

- en progreso;

- registrado pero pendiente;

- bloqueado o dependiente de otro trabajo;

- potencialmente obsoleto o sustituido.

No consideres una funcionalidad implementada únicamente porque exista una Issue
cerrada.

Cuando sea relevante, contrasta el estado de la Issue con el repositorio para
determinar si el trabajo está realmente presente.

Del mismo modo, no consideres pendiente una funcionalidad únicamente porque no
exista una Issue abierta si el repositorio demuestra que ya está implementada.

Antes de proponer nuevas Issues:

- identifica funcionalidades ya implementadas;

- identifica trabajo ya registrado pero todavía pendiente;

- identifica dependencias entre Issues existentes;

- detecta posibles solapamientos con nuevas propuestas.

No propongas una nueva Issue cuando el mismo objetivo ya esté cubierto de forma

suficiente por una Issue existente.

Si existe una posible duplicidad pero no puede determinarse con seguridad,
señálala en el análisis en lugar de asumir que se trata de trabajo nuevo.

Durante esta fase no crees, edites, cierres ni elimines Issues o Pull Requests.

## 3. Analizar el estado real del repositorio

Inspecciona la implementación actual del proyecto para determinar qué existe
realmente y cuál es su estado.

No presupongas:

- lenguaje de programación;

- framework;

- arquitectura;

- estructura de directorios;

- sistema de persistencia;

- infraestructura;

- estrategia de testing;

- herramientas de desarrollo.

Determina estos elementos a partir del propio repositorio y de la documentación
del proyecto.

Revisa, cuando existan y sean relevantes:

- estructura general del repositorio;

- código fuente;

- módulos, aplicaciones o servicios;

- componentes principales de la arquitectura;

- modelos, entidades o estructuras de datos;

- acceso y persistencia de datos;

- APIs o interfaces;

- lógica de negocio;

- autenticación y autorización;

- configuración;

- infraestructura;

- contenedores;

- base de datos o mecanismos de persistencia;

- tests;

- scripts de automatización;

- dependencias y archivos de configuración del proyecto;

- documentación técnica;

- documentación de arquitectura;

- specs existentes;

- archivos relacionados con el workflow de desarrollo.

No es necesario inspeccionar exhaustivamente todos los archivos del repositorio.

Prioriza las áreas relacionadas con:

- el estado actual del producto;

- las Issues existentes;

- las funcionalidades recientemente implementadas;

- las posibles siguientes funcionalidades;

- las dependencias necesarias para continuar el desarrollo.

Contrasta el estado del repositorio con la información obtenida de GitHub.

No asumas que una funcionalidad está implementada únicamente porque exista una
Issue cerrada, una spec o documentación que la describa.

Comprueba que exista evidencia real de su implementación cuando sea necesario
para decidir el roadmap.

Del mismo modo, no propongas como trabajo pendiente una funcionalidad que ya
esté implementada aunque no exista una Issue que la documente.

Distingue entre:

- funcionalidad implementada;

- funcionalidad parcialmente implementada;

- infraestructura o base técnica existente;

- trabajo definido pero todavía no implementado;

- trabajo obsoleto o sustituido;

- trabajo realmente pendiente.

Si la documentación, las Issues y la implementación presentan estados
contradictorios, utiliza el estado verificable del repositorio como referencia
principal y señala la discrepancia cuando afecte a las propuestas del roadmap.

Durante este análisis:

- no modifiques archivos;

- no implementes código;

- no generes specs;

- no crees ramas;

- no hagas commits ni push.

### 4. Analizar la persistencia de datos

Si el proyecto utiliza una base de datos u otro mecanismo de persistencia y su
estado es relevante para determinar el roadmap, analiza su estructura actual.

Identifica primero qué mecanismo de persistencia utiliza el proyecto a partir
del repositorio, su configuración y su documentación.

No presupongas:

- motor de base de datos;

- modelo relacional o no relacional;

- ORM;

- sistema de migraciones;

- estructura del esquema;

- disponibilidad de un MCP específico.

Si existe una herramienta o MCP de base de datos configurado y accesible, puedes
utilizarlo para consultar el estado real de la persistencia.

Si no existe, utiliza únicamente la información disponible en el repositorio y
la documentación del proyecto.

Cuando sea aplicable, revisa:

- estructuras de datos existentes;

- tablas, colecciones o equivalentes;

- relaciones entre datos;

- identificadores y claves;

- restricciones relevantes;

- migraciones o mecanismos de evolución del esquema;

- datos necesarios para comprender el estado funcional;

- modelos de persistencia definidos en el código;

- correspondencia entre la persistencia y las capas de la aplicación que la

  utilizan.

Utiliza esta información únicamente cuando ayude a:

- verificar funcionalidades existentes;

- detectar funcionalidades parcialmente implementadas;

- identificar dependencias para trabajo futuro;

- detectar inconsistencias relevantes;

- evitar proponer trabajo que ya está soportado por la persistencia existente.

No realices una auditoría completa de la persistencia si no es necesaria para
determinar las siguientes Issues.

Si detectas diferencias entre el modelo definido en el código, las migraciones,
la documentación y el estado real de la persistencia, señala la discrepancia
cuando pueda afectar al roadmap.

Durante este análisis:

- no modifiques esquemas;

- no ejecutes migraciones;

- no insertes, actualices ni elimines datos;

- no realices operaciones destructivas;

- no generes datos de prueba;

- no modifiques configuración de persistencia.

Todas las consultas realizadas durante esta fase deben ser de solo lectura.

Si el proyecto no utiliza persistencia o esta no es relevante para determinar
el siguiente trabajo, omite este análisis.

### 5. Revisar las Specs existentes

Si existe el directorio:

```text

specs/

```

revisa las Specs existentes para determinar qué trabajo ya ha sido definido,
está en curso o ha sido completado.

No presupongas que `specs/` existe. Su ausencia no debe impedir continuar con
el roadmap.

Determina, cuando sea posible:

- qué Specs están completadas;

- qué Specs están activas o en progreso;

- qué Specs están pendientes;

- qué Specs están asociadas a Issues existentes;

- qué funcionalidades o cambios cubre cada Spec;

- qué trabajo definido ya está implementado;

- qué trabajo definido todavía está pendiente;

- qué dependencias entre Specs pueden afectar al roadmap.

No determines el estado de una Spec únicamente por la existencia de sus
archivos.

Cuando sea necesario, contrasta:

- `spec.md`;

- `plan.md`;

- `tasks.md`;

- la Issue asociada;

- la implementación real del repositorio;

- el estado de GitHub.

Antes de proponer una nueva Issue, comprueba que su objetivo no esté ya:

- definido por una Spec activa;

- cubierto por una Issue existente;

- implementado en el repositorio;

- sustituido por trabajo posterior.

Si existe un solapamiento parcial entre una propuesta y una Spec existente,
identifica qué parte ya está cubierta y qué parte representa realmente trabajo
nuevo.

No generes una nueva Issue para trabajo que ya esté suficientemente cubierto
por una Spec activa, una Issue existente o la implementación actual.

Durante esta fase:

- no crees nuevas Specs;

- no modifiques Specs existentes;

- no actualices `spec.md`, `plan.md` o `tasks.md`;

- no marques tareas como completadas;

- no implementes el trabajo descrito en las Specs.

Esta fase es únicamente de lectura y análisis.

### 6. Determinar el estado actual del producto

Resume el estado funcional actual del producto basándote en la información
obtenida del repositorio, GitHub, las Specs y la documentación disponible.

Clasifica, cuando corresponda:

- ✅ completado;

- 🟡 parcialmente implementado;

- ❌ pendiente.

La clasificación debe basarse en evidencia verificable y no únicamente en el
estado de las Issues o de las Specs.

Identifica también:

- funcionalidades disponibles;

- funcionalidades incompletas;

- trabajo pendiente ya registrado;

- dependencias entre funcionalidades;

- bloqueos relevantes para continuar el desarrollo.

Utiliza este estado como base para determinar el siguiente trabajo necesario.

---

### 7. Detectar el siguiente trabajo necesario

Determina qué trabajo falta para avanzar de forma coherente hacia los objetivos
actuales del producto.

Basa las propuestas en:

- el alcance definido del producto;

- el estado real del repositorio;

- las Issues existentes;

- las Specs existentes;

- las dependencias detectadas;

- la arquitectura y convenciones actuales del proyecto.

Prioriza trabajo que:

1. desbloquee otras funcionalidades;

2. complete flujos existentes;

3. resuelva dependencias necesarias;

4. sea coherente con la arquitectura actual;

5. aporte valor funcional al producto;

6. acerque el proyecto a los objetivos definidos en su documentación.

Evita proponer:

- refactors sin una necesidad identificada;

- funcionalidades especulativas;

- optimizaciones prematuras;

- infraestructura innecesaria;

- cambios tecnológicos sin justificación;

- funcionalidades fuera del alcance actual del producto;

- trabajo ya cubierto por Issues, Specs o implementación existente.

No diseñes todavía la implementación detallada de las propuestas.

El objetivo de esta fase es determinar **qué trabajo debería realizarse**, no

**cómo debe implementarse**.

---

### 8. Proponer las siguientes Issues

A partir del análisis anterior, prepara una propuesta ordenada de las siguientes
Issues que deberían formar parte del roadmap.

Para cada Issue propuesta indica:

- título;

- objetivo;

- motivo por el que es necesaria;

- dependencias conocidas;

- prioridad relativa;

- alcance aproximado.

La prioridad debe justificarse mediante dependencias, bloqueos, continuidad de
flujos existentes y valor funcional.

Ordena las Issues según la secuencia recomendada de implementación.

No propongas una Issue si su objetivo ya está suficientemente cubierto por:

- una Issue existente;

- una Spec activa;

- trabajo ya implementado;

- otra Issue propuesta en el mismo roadmap.

Mantén las Issues suficientemente independientes para que puedan desarrollarse
y verificarse de forma separada.

No generes todavía `spec.md`, `plan.md` ni `tasks.md`.

---

### 9. Confirmar y crear las GitHub Issues

Después de presentar el roadmap, no crees ninguna Issue automáticamente.
Muestra claramente al usuario:

- las Issues propuestas;

- el orden recomendado;

- sus dependencias;

- su prioridad;

- qué Issues se crearán en GitHub.

Solicita una confirmación explícita antes de realizar cualquier operación remota
de creación.

La confirmación debe permitir opciones equivalentes a:

- `Crear Issues`;

- `Revisar roadmap`;

- `Cancelar`.

No interpretes comentarios, respuestas ambiguas o ausencia de respuesta como
autorización para crear las Issues.

Si el usuario solicita cambios, actualiza el roadmap y vuelve a solicitar una
confirmación explícita.

Toda modificación del roadmap invalida cualquier confirmación anterior.

Si el usuario cancela, termina el command sin crear ninguna Issue.

### Crear las Issues

Solo después de que el usuario confirme explícitamente `Crear Issues`, procede
con la creación.

Utiliza una herramienta de GitHub disponible y autorizada en el entorno.

Utiliza preferentemente GitHub MCP cuando esté configurado y permita crear
Issues. Si no está disponible o no proporciona esa capacidad, utiliza GitHub
CLI (`gh`).

No cambies de mecanismo después de una creación cuyo resultado sea incierto sin
comprobar antes si la Issue fue creada, para evitar duplicados.

Cada Issue debe utilizar esta estructura:

```markdown
## Contexto

<por qué existe la Issue>

## Objetivo

<qué resultado debe conseguir>

## Alcance

<qué debe quedar cubierto por la Issue>

## Criterios de aceptación

- [ ] <condición observable y verificable>

## Fuera de alcance

<qué no forma parte de esta Issue>

## Dependencias

<Issues, funcionalidades o trabajo previo necesario>

## Notas técnicas

<información técnica relevante descubierta durante el análisis>
```

Incluye únicamente información respaldada por el análisis realizado.

Los criterios de aceptación deben describir resultados verificables y no tareas
de implementación.

No conviertas las Issues en Specs detalladas.

No generes durante este command:

- `spec.md`;

- `plan.md`;

- `tasks.md`;

- ramas;

- código;

- commits;

- push.

Después de crear las Issues, verifica cuando sea posible:

- número;

- título;

- URL;

- estado de creación.

Si una creación falla, informa del error y no afirmes que la Issue fue creada.

No ejecutes `/issue` automáticamente después de crear el roadmap.

### 10. Mantener Issues manejables

Cada Issue debe representar una unidad de trabajo razonable, independiente y
verificable.

Evita Issues demasiado grandes que agrupen varias responsabilidades sin una
dependencia necesaria entre ellas.

Si una funcionalidad contiene varias responsabilidades que pueden desarrollarse
o verificarse de forma independiente, divídela en varias Issues.

Cada Issue debe poder convertirse posteriormente en un SDD independiente:

```text
GitHub Issue
    ↓
spec.md
    ↓
plan.md
    ↓
tasks.md
```

No dividas artificialmente una funcionalidad cuando hacerlo genere Issues sin
valor independiente o dependencias innecesarias.

El objetivo es encontrar unidades de trabajo suficientemente pequeñas para ser
manejables, pero suficientemente completas para aportar un resultado
verificable.

---

### 11. Mantener el roadmap iterativo

El roadmap debe centrarse en el siguiente trabajo necesario, no intentar
planificar todo el proyecto hasta su estado final.

Propón como máximo **3–5 Issues por ejecución**, salvo que exista una razón
explícita para necesitar una cantidad diferente.

Prioriza las Issues que tenga sentido abordar próximamente según:

- dependencias;
- bloqueos;
- continuidad de funcionalidades existentes;
- objetivos actuales del producto;
- valor funcional.

No recorras todo el historial del proyecto ni audites todo el repositorio salvo
que sea necesario para resolver una dependencia o determinar correctamente el
siguiente trabajo.

El roadmap debe avanzar mediante iteraciones sucesivas.

Una futura ejecución de `/roadmap` podrá volver a analizar el estado actualizado
del proyecto después de completar nuevas Issues.

---

### 12. Prioridad

Asigna prioridad únicamente cuando ayude a expresar el orden o urgencia real del
trabajo.

Cuando el proyecto no defina otro sistema de prioridades, puedes utilizar:

- `P0` — trabajo bloqueante o necesario inmediatamente;
- `P1` — siguiente trabajo importante;
- `P2` — trabajo posterior que aporta valor pero no bloquea el avance actual.

La prioridad debe justificarse mediante el estado real del proyecto, sus
dependencias y sus objetivos.

No asignes una prioridad únicamente para completar la clasificación.

No utilices la prioridad como sustituto de las dependencias entre Issues.

Si el proyecto ya define su propio sistema de prioridades, utiliza ese sistema
en lugar de introducir uno nuevo.

---

### 13. No implementar

Este command es exclusivamente de análisis, planificación y, después de la
confirmación explícita del usuario, creación de GitHub Issues.

Durante `/roadmap`:

- no escribas ni modifiques código;
- no modifiques datos ni esquemas de persistencia;
- no crees ni modifiques Specs;
- no generes `spec.md`, `plan.md` o `tasks.md`;
- no cambies configuración;
- no crees ni cambies de rama;
- no hagas commits;
- no hagas push;
- no cierres Issues;
- no implementes ninguna Issue propuesta;
- no ejecutes `/issue`;
- no ejecutes `/finish-issue`;
- no ejecutes suites completas de tests salvo que sean imprescindibles para
  determinar el estado necesario para el roadmap;
- no realices una auditoría completa del proyecto cuando no sea necesaria.

La responsabilidad de `/roadmap` termina después de analizar el estado del
proyecto, proponer el siguiente trabajo y, cuando exista confirmación explícita,
crear y verificar las Issues autorizadas.

---

## Resultado esperado

Al finalizar, muestra un resumen breve basado únicamente en información
verificada durante la ejecución.

Utiliza una estructura equivalente a:

```text
Roadmap — <nombre del proyecto>

Estado actual:
- <resumen funcional relevante>
- <trabajo en progreso relevante>
- <bloqueos o dependencias relevantes>

Issues revisadas:
- Abiertas: <cantidad>
- Cerradas relevantes: <cantidad>

Issues creadas:
#<numero> — <título> — <prioridad>
#<numero> — <título> — <prioridad>

Orden recomendado:
#<numero> → #<numero> → #<numero>

Siguiente paso:
 /issue <numero>
```

Si el usuario no confirmó la creación de Issues, sustituye `Issues creadas` por:

```text
Issues propuestas:
- <título> — <prioridad>
- <título> — <prioridad>
```

No muestres números o URLs de Issues que no hayan sido realmente creadas y
verificadas.

Si no se creó ninguna Issue, indícalo claramente.

El `Siguiente paso` debe indicar la primera Issue del orden recomendado cuando
exista una.

No ejecutes `/issue` automáticamente.

La responsabilidad del command termina al mostrar este resumen.
