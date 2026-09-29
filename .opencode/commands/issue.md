# Issue Development Workflow

## 1. Obtener la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP configurado para el repositorio actual.
Extrae y comprende:

- título;
- descripción;
- criterios de aceptación;
- alcance;
- restricciones;
- dependencias;
- referencias técnicas relevantes.

Considera la GitHub Issue como la fuente principal de requisitos para este workflow.
Aplica el `Issue Guard` definido en:

`.agents/guardrails/issue.md`

Solo continúa al punto 2 si el guardrail ha sido superado.

## 2. Analizar el proyecto

Antes de realizar cambios, analiza el contexto disponible y relevante para la Issue.

Revisa, cuando existan:

- `AGENTS.md` aplicables;

- Constitución, reglas o documentación equivalente del proyecto;

- arquitectura existente;

- código relacionado con la Issue;

- specs anteriores relacionadas;

- skills relevantes;

- MCPs disponibles que aporten contexto útil.

Respeta las instrucciones y convenciones existentes del proyecto.

No inventes archivos, reglas, arquitectura, dependencias o convenciones que no existan.

No asumas comportamientos que contradigan:

- la GitHub Issue;

- los `AGENTS.md` aplicables;

- las reglas del proyecto;

- la arquitectura existente.

Aplica el `Context Guard` definido en:

`.agents/guardrails/context.md`

Solo continúa al punto 3 si el guardrail ha sido superado.

## 3. Preparar obligatoriamente la rama de trabajo

Este paso es obligatorio y debe completarse antes de modificar cualquier archivo.

### Inspeccionar el estado Git

Ejecuta el `Branch Check Hook` definido en:

`.agents/hooks/branch-check.md`

Utiliza el estado obtenido por el hook para determinar de forma segura la rama de trabajo.

### Determinar la base

La nueva rama debe partir del estado de desarrollo válido más reciente que contenga las dependencias necesarias para la Issue.

Si la Issue depende de trabajo de una Issue anterior todavía no integrado en `main`, utiliza como base la rama que contiene ese trabajo.

Si `main` contiene todas las dependencias necesarias, utiliza `main` como base.

No cambies de base, hagas rebase, elimines ramas, descartes commits ni alteres historial existente automáticamente.

### Determinar el nombre de la rama

Genera el nombre utilizando:

`<tipo>/<numero-issue>-<slug>`

El número de Issue debe utilizar 3 dígitos.

El slug debe ser corto, descriptivo y derivado del título real de la GitHub Issue.

Prefijos permitidos:

- `feat/` → nueva funcionalidad;

- `fix/` → corrección;

- `docs/` → documentación o diseño;

- `refactor/` → refactorización;

- `test/` → testing;

- `chore/` → mantenimiento.

Ejemplos:

Issue #16: `Definir contratos de resultados`

→ `docs/016-result-contracts`

Issue #17: `Implementar registro de resultados WOD`

→ `feat/017-wod-results`

### Crear o reutilizar la rama

Si ya existe una rama local correspondiente a la Issue #$1:

- reutilízala;

- cambia físicamente a ella con Git si no es la rama actual;

- no crees una segunda rama para la misma Issue.

Si no existe:

- créala desde la base determinada anteriormente;

- cambia físicamente a ella antes de modificar cualquier archivo.

No basta con calcular, proponer o mostrar el nombre de la rama.

La rama debe existir realmente en el repositorio local y ser la rama activa.

Aplica el `Branch Guard` definido en:

`.agents/guardrails/branch.md`

Solo continúa al punto 4 si el guardrail ha sido superado.

## 4. Crear o completar el SDD

Este paso es obligatorio.

Crea o completa el SDD correspondiente a la GitHub Issue #$1.

La carpeta debe seguir exactamente:

`specs/<numero>-<slug>/`

### Estructura del SDD

Reglas obligatorias:

- usa el número de Issue con 3 dígitos;

- genera el slug a partir del título real de la Issue;

- usa minúsculas;

- usa kebab-case;

- el slug debe ser corto y descriptivo;

- el slug no puede estar vacío;

- no crees carpetas como `specs/<numero>-/`.

Si ya existe una carpeta `specs/<numero>-*`:

- reutilízala;

- si el slug está vacío o es incorrecto, renómbrala antes de continuar;

- no crees una segunda carpeta para la misma Issue;

- conserva y completa el contenido válido existente;

- no sobrescribas decisiones previas válidas sin una razón derivada de la Issue o del estado actual del proyecto.

Dentro deben existir obligatoriamente:

- `spec.md`;

- `plan.md`;

- `tasks.md`.

### Contenido del SDD

`spec.md` debe definir como mínimo:

- objetivo;

- alcance;

- comportamiento esperado;

- criterios de aceptación;

- restricciones relevantes.

`plan.md` debe definir como mínimo:

- enfoque de implementación;

- componentes o capas afectadas;

- cambios técnicos previstos;

- estrategia de verificación.

`tasks.md` debe contener:

- tareas concretas;

- tareas ejecutables;

- orden o dependencias cuando sean relevantes;

- verificaciones necesarias para demostrar los criterios de aceptación.

El SDD debe derivarse de:

- la GitHub Issue;

- el análisis realizado en el punto 2;

- la arquitectura existente;

- las reglas aplicables del proyecto.

No inventes requisitos funcionales que no estén respaldados por estas fuentes.

Aplica el `SDD Guard` definido en:

`.agents/guardrails/sdd.md`

Solo continúa al punto 5 si el guardrail ha sido superado.

## 5. Validar la planificación

Este paso es obligatorio.

Antes de implementar cualquier cambio, valida que el SDD sea coherente, completo y viable respecto a la GitHub Issue #$1 y al estado actual del proyecto.

Comprueba:

- que `spec.md` cubre los criterios de aceptación definidos en la Issue;

- que el alcance definido en `spec.md` corresponde al alcance de la Issue;

- que `plan.md` permite implementar lo definido en `spec.md`;

- que `plan.md` es compatible con la arquitectura, tecnologías y convenciones existentes;

- que `tasks.md` representa todo el trabajo necesario definido en `spec.md` y `plan.md`;

- que todas las tasks son concretas, ejecutables y verificables;

- que las dependencias entre tasks están identificadas cuando sean relevantes;

- que las verificaciones previstas permiten demostrar los criterios de aceptación;

- que no existen decisiones funcionales o arquitectónicas importantes sin resolver;

- que no existen contradicciones con los `AGENTS.md` aplicables ni con las reglas del proyecto;

- que no existe trabajo fuera del alcance de la Issue;

- que no se requieren cambios innecesarios para completar la Issue.

Debe existir una cadena coherente y trazable:

`GitHub Issue → spec.md → plan.md → tasks.md → verificaciones`

Cada criterio de aceptación debe estar representado por trabajo planificado y debe poder verificarse después de la implementación.

Aplica el `Planning Guard` definido en:

`.agents/guardrails/planning.md`

Si el `Planning Guard` ha sido superado:

continúa al punto 6.

Si el `Planning Guard` detecta un problema de planificación que puede corregirse de forma segura sin modificar los requisitos ni ampliar el alcance de la Issue:

ejecuta el `Planning Loop` definido en:

`.agents/loops/planning.md`

Si el loop finaliza superando el `Planning Guard`:

continúa al punto 6.

Si el `Planning Guard` o el `Planning Loop` detectan una condición que requiere una decisión funcional o arquitectónica, una ampliación de alcance o información no disponible:

DETENTE.

No comiences la implementación.

Solicita únicamente la aclaración o decisión necesaria para continuar.

## 6. Implementar

Este paso solo puede comenzar si el `Planning Guard` del punto anterior ha sido superado.

Implementa las tasks definidas en `tasks.md` siguiendo el orden y las dependencias establecidas.

Durante la implementación:

- respeta los `AGENTS.md` aplicables;

- utiliza las skills relevantes cuando correspondan;

- sigue la arquitectura, tecnologías y convenciones existentes del proyecto;

- mantén el trabajo limitado al alcance de la GitHub Issue #$1;

- implementa únicamente los cambios necesarios para satisfacer la spec;

- evita refactorizaciones, mejoras o cambios no requeridos por la Issue;

- no modifiques archivos ajenos al trabajo salvo que sea técnicamente necesario;

- no cambies decisiones funcionales o arquitectónicas definidas en el SDD;

- no añadas dependencias, infraestructura o complejidad innecesarias;

- preserva el comportamiento existente que esté fuera del alcance de la Issue.

Aplica durante toda la implementación el `Implementation Guard` definido en:

`.agents/guardrails/implementation.md`

### Ejecutar las tasks

Ejecuta el `Task Loop` definido en:

`.agents/loops/task.md`

El loop debe procesar las tasks pendientes de `tasks.md` respetando:

- su orden;

- sus dependencias;

- el alcance de la GitHub Issue #$1;

- el `Implementation Guard`.

Solo marca una task como completada cuando el trabajo correspondiente esté realmente implementado.

Si el `Task Loop` finaliza porque todas las tasks están completadas:

continúa con el punto 7.

Si el loop finaliza por una condición de bloqueo:

DETENTE.

No continúes con las tasks restantes.

No continúes al punto 7 hasta que el bloqueo haya sido resuelto.

## 7. Ejecutar verificaciones

Este paso solo puede comenzar cuando todas las tasks de implementación estén completadas.

Determina las verificaciones aplicables necesarias para validar la implementación y demostrar los criterios de aceptación de la GitHub Issue #$1.

Determina las verificaciones necesarias a partir de:

- los criterios de aceptación de la Issue;

- `spec.md`;

- `plan.md`;

- `tasks.md`;

- los `AGENTS.md` aplicables;

- las herramientas, scripts y convenciones existentes del proyecto;

- las capas, componentes o archivos modificados.

Considera, cuando correspondan:

- tests;

- build;

- lint;

- type checking;

- comprobaciones de integración;

- validaciones de configuración;

- verificaciones definidas en los `AGENTS.md`;

- cualquier otra comprobación necesaria para demostrar los criterios de aceptación.

No selecciones verificaciones que claramente no sean aplicables al tipo de cambio.

No inventes comandos de verificación si el proyecto ya define los mecanismos que deben utilizarse.

### Ejecutar las verificaciones

Ejecuta el `Verification Gate Hook` definido en:

`.agents/hooks/verification-gate.md`

Proporciona al hook las verificaciones aplicables determinadas anteriormente.

Para cada verificación ejecutada, conserva:

- la verificación ejecutada;

- el comando o mecanismo utilizado;

- su resultado;

- cualquier error o warning relevante detectado.

Aplica el `Verification Guard` definido en:

`.agents/guardrails/verification.md`

Si el guardrail ha sido superado:

continúa con el punto 9.

Si el guardrail detecta una verificación fallida:

continúa con el proceso de resolución de fallos definido en el punto 8.

## 8. Resolver fallos

Este paso se activa cuando alguna verificación aplicable del punto anterior falla.

Si alguna verificación falla:

- NO continúes hacia el commit;

- NO marques el trabajo como completado;

- NO documentes la Issue como terminada;

- NO cierres la Issue;

- NO ignores ni desactives la verificación para conseguir que el workflow continúe.

### Analizar el fallo

Para cada fallo:

1. identifica la verificación que ha fallado;

2. analiza la causa raíz;

3. determina si el fallo está relacionado con los cambios de la GitHub Issue #$1.

Antes de aplicar cualquier corrección, aplica el `Repair Guard` definido en:

`.agents/guardrails/repair.md`

El `Repair Guard` determina si el fallo puede resolverse de forma segura dentro del alcance de la GitHub Issue #$1.

Si el `Repair Guard` activa una condición de bloqueo:

DETENTE.

No apliques la corrección.

No amplíes el alcance de la Issue.

No continúes hacia el commit.

Informa al usuario del bloqueo concreto y solicita únicamente la intervención necesaria para continuar.

### Resolver mediante el loop

Si el `Repair Guard` permite continuar, ejecuta el `Verification / Repair Loop` definido en:

`.agents/loops/verification-repair.md`

Proporciona al loop:

- la verificación o verificaciones fallidas;

- los resultados obtenidos;

- los errores o warnings relevantes;

- la causa identificada, cuando sea conocida;

- el contexto necesario de la GitHub Issue #$1.

El loop es responsable de controlar las iteraciones de:

`fallo → análisis → Repair Guard → corrección → Verification Gate Hook → Verification Guard → resultado`

No dupliques fuera del loop su lógica de repetición.

### Resultado del loop

Si el loop finaliza porque todas las verificaciones aplicables han finalizado correctamente:

continúa con el punto 9.

Si el loop finaliza porque el `Repair Guard` activa una condición de bloqueo:

DETENTE.

No continúes hacia el commit.

Informa al usuario del bloqueo concreto y solicita únicamente la intervención necesaria para continuar.

## 9. Revisar los cambios

Este paso solo puede comenzar cuando todas las verificaciones aplicables hayan finalizado correctamente.

Antes de preparar el commit, revisa el estado real del repositorio y determina exactamente qué cambios pertenecen a la GitHub Issue #$1.

### Inspeccionar los cambios Git

Ejecuta el `Pre-Stage Check Hook` definido en:

`.agents/hooks/pre-stage-check.md`

Utiliza el estado obtenido por el hook para identificar los cambios existentes antes de preparar el staging.

Revisa:

- archivos modificados;

- archivos nuevos;

- archivos eliminados;

- cambios ya presentes en staging, si existen;

- cambios locales que existían antes de comenzar el workflow;

- cambios generados accidentalmente;

- archivos que no pertenecen al alcance de la Issue.

Compara los cambios realizados con:

`GitHub Issue → spec.md → plan.md → tasks.md → implementación → cambios Git`

Cada cambio que vaya a formar parte del commit debe poder justificarse por el trabajo necesario para completar la Issue.

Aplica el `Change Review Guard` definido en:

`.agents/guardrails/change-review.md`

Solo continúa hacia la preparación del commit si el guardrail ha sido superado.

Si el `Change Review Guard` activa una condición de bloqueo:

DETENTE.

No prepares el commit.

## 10. Crear obligatoriamente el commit

Este paso es obligatorio.

Solo puede comenzar cuando el `Change Review Guard` del punto anterior haya sido superado.

No continúes al punto 11 hasta que exista un commit creado durante este workflow para la GitHub Issue #$1.

### Preparar el staging

Añade al staging únicamente los archivos y cambios pertenecientes a la Issue #$1.

No utilices un `git add` indiscriminado cuando existan cambios ajenos en el working tree.

No añadas al staging:

- cambios ajenos a la Issue;

- cambios locales preexistentes que no pertenezcan a la Issue;

- archivos generados accidentalmente;

- archivos que no puedan justificarse mediante la Issue o el SDD.

Si ya existen cambios ajenos en staging, no los incluyas automáticamente en el commit de la Issue.

No descartes, sobrescribas, elimines ni modifiques trabajo ajeno para preparar el commit.

### Verificar el estado previo al commit

Ejecuta el `Pre-Commit Hook` definido en:

`.agents/hooks/pre-commit.md`

Utiliza el resultado del hook para confirmar que el estado Git permite crear de forma segura el commit de la GitHub Issue #$1.

Si el hook detecta un estado que impide crear el commit de forma segura:

DETENTE.

No ejecutes `git commit`.

### Crear el commit

Crea el commit siguiendo las convenciones Git definidas por el proyecto.

El commit debe representar únicamente el trabajo correspondiente a la GitHub Issue #$1.

No crees un commit vacío únicamente para satisfacer este paso.

Después de crear el commit:

- comprueba que el commit se ha creado correctamente;

- obtén el hash y el mensaje del commit;

- conserva ambos para las fases posteriores del workflow.

Aplica el `Commit Guard` definido en:

`.agents/guardrails/commit.md`

Solo continúa al punto 11 si el guardrail ha sido superado.

Si el `Commit Guard` activa una condición de bloqueo:

DETENTE.

No continúes al punto 11.

No documentes la Issue como completada.

No cierres la Issue.

## 11. Verificar el estado post-commit

Este paso solo puede comenzar cuando el `Commit Guard` del punto anterior haya sido superado.

Después de crear el commit, ejecuta el `Post-Commit Hook` definido en:

`.agents/hooks/post-commit.md`

Utiliza el estado obtenido por el hook para verificar que:

- el commit creado durante este workflow sigue siendo el último commit esperado;

- el commit puede identificarse mediante el hash obtenido en el punto anterior;

- estás en la rama correspondiente a la GitHub Issue #$1;

- no quedan cambios pertenecientes a la Issue #$1 sin commit;

- no quedan archivos nuevos, modificados o eliminados de la Issue pendientes de incluir.

Pueden existir cambios locales ajenos a la Issue que estuvieran presentes anteriormente.

Si existen:

- no los modifiques;

- no los elimines;

- no los descartes;

- no hagas `stash` automáticamente;

- no los añadas al staging;

- no los incluyas en commits adicionales.

Aplica el `Post-Commit Guard` definido en:

`.agents/guardrails/post-commit.md`

Solo continúa al punto 12 si el guardrail ha sido superado.

Si el `Post-Commit Guard` activa una condición de bloqueo:

DETENTE.

No documentes todavía la Issue como completada.

No cierres la Issue.

## 12. Documentar la GitHub Issue

Este paso solo puede comenzar cuando el `Post-Commit Guard` del punto anterior haya sido superado.

Actualiza la GitHub Issue #$1 mediante el GitHub MCP configurado para el repositorio actual.

Documenta únicamente información comprobada durante este workflow.

### Contenido de la documentación

Incluye:

- qué se ha implementado;

- decisiones técnicas relevantes;

- archivos, componentes o capas principales modificados;

- tests ejecutados y su resultado;

- build ejecutado y su resultado, cuando corresponda;

- lint ejecutado y su resultado, cuando corresponda;

- type checking ejecutado y su resultado, cuando corresponda;

- comprobaciones de integración realizadas y su resultado;

- cualquier otra verificación relevante ejecutada;

- resultado general de las verificaciones;

- hash del commit;

- mensaje del commit;

- nombre de la rama de trabajo.

No documentes como ejecutada una verificación que no se haya realizado.

No documentes como satisfactoria una verificación que haya fallado, haya sido omitida o no haya podido completarse.

### Estado del workflow

Indica claramente que:

- la implementación está completada;

- las verificaciones aplicables han finalizado correctamente;

- los cambios están commiteados en la rama de trabajo;

- la Issue permanece abierta;

- queda pendiente la validación manual;

- después de la validación manual deberá ejecutarse `/finish-issue $1`.

Aplica el `GitHub Documentation Guard` definido en:

`.agents/guardrails/github-documentation.md`

Solo continúa al punto 13 si el guardrail ha sido superado.

Si el `GitHub Documentation Guard` activa una condición de bloqueo:

DETENTE.

No continúes al punto 13.

### Restricciones

NO cierres la Issue.

NO hagas push.

El cierre de la Issue y la publicación de la rama pertenecen al workflow de `/finish-issue $1`.

## 13. Verificación final obligatoria

Este paso es obligatorio.

Antes de avanzar a la fase de validación manual, ejecuta el `Final Workflow Check Hook` definido en:

`.agents/hooks/final-workflow-check.md`

Utiliza el estado obtenido por el hook para realizar la verificación final del workflow.

Comprueba además que:

- la carpeta SDD corresponde correctamente a la GitHub Issue #$1;

- el contenido de `spec.md`, `plan.md` y `tasks.md` es válido;

- los criterios de aceptación están cubiertos por la implementación;

- todas las verificaciones aplicables han finalizado correctamente;

- el commit corresponde al trabajo realizado para la Issue;

- no quedan cambios pertenecientes a la Issue sin commit;

- la GitHub Issue ha sido documentada correctamente con el resultado del workflow;

- la GitHub Issue permanece abierta;

- no se ha realizado push.

Aplica el `Final Workflow Guard` definido en:

`.agents/guardrails/final-workflow.md`

Solo continúa al punto 14 si el guardrail ha sido superado.

Si el `Final Workflow Guard` activa una condición de bloqueo:

DETENTE.

No declares la implementación lista para validación manual.

No cierres la Issue.

No hagas push.

No ejecutes `/finish-issue $1`.

## 14. Indicar validaciones manuales pendientes

Este paso solo puede comenzar cuando el `Final Workflow Guard` del punto anterior haya sido superado.

Después de completar la implementación, las verificaciones automáticas y el commit, determina qué validaciones manuales debe realizar el usuario antes de ejecutar:

`/finish-issue $1`

Esta sección es obligatoria.

### Determinar las validaciones manuales

Las validaciones deben derivarse específicamente de:

- los criterios de aceptación de la GitHub Issue #$1;

- el comportamiento implementado;

- las capas o componentes modificados;

- endpoints modificados;

- cambios visuales o de navegación;

- autenticación o autorización;

- persistencia;

- infraestructura;

- integraciones;

- configuración;

- cualquier riesgo funcional relevante.

No generes una checklist genérica idéntica para todas las Issues.

No repitas verificaciones automáticas que ya hayan finalizado correctamente salvo que sea necesario comprobar manualmente un comportamiento que las verificaciones automáticas no puedan demostrar completamente.

### Adaptar las validaciones al tipo de cambio

Si la Issue afecta al frontend:

- indica las comprobaciones visuales necesarias;

- indica las interacciones relevantes;

- incluye navegación, responsive o accesibilidad cuando correspondan.

Si afecta al backend o API:

- indica los endpoints o comportamientos que deben probarse;

- especifica los casos relevantes de respuesta o error cuando corresponda.

Si afecta a autenticación o autorización:

- diferencia los roles, permisos o estados de autenticación relevantes.

Si afecta a persistencia:

- indica las operaciones o comportamientos de almacenamiento que deban comprobarse manualmente.

Si afecta a Docker, infraestructura o configuración:

- indica las comprobaciones necesarias de arranque, healthcheck, persistencia, conectividad o configuración.

Si la Issue es únicamente documental o de diseño técnico:

- indica qué documentación, decisiones o diseño debe revisar el usuario.

Si no existe ninguna validación manual razonable:

- indícalo explícitamente;

- no inventes validaciones únicamente para generar una checklist.

Aplica el `Manual Validation Guard` definido en:

`.agents/guardrails/manual-validation.md`

Solo continúa al punto 15 si el guardrail ha sido superado.

Si el `Manual Validation Guard` activa una condición de bloqueo:

DETENTE.

No continúes al punto 15.

No ejecutes `/finish-issue $1`.

No cierres la GitHub Issue.

No hagas push.

### Formato obligatorio

Muestra al final de la respuesta:

## Validaciones manuales pendientes

Incluye una checklist concreta y breve.

Ejemplo:

- [ ] `GET /api/health` sin autenticación devuelve `200`.

- [ ] `GET /api/users/me` sin JWT devuelve `401`.

- [ ] La navegación móvil funciona correctamente a 390px.

- [ ] Los botones Anterior/Siguiente cambian correctamente de página.

- [ ] No existe scroll horizontal inesperado.

Las casillas representan validaciones pendientes del usuario.

NO las marques como completadas automáticamente.

NO registres todavía la validación manual como aprobada.

NO ejecutes `/finish-issue $1`.

## 15. Finalizar el workflow de desarrollo

Este paso solo puede comenzar cuando:

- el `Final Workflow Guard` ha sido superado;
- el `Manual Validation Guard` ha sido superado;
- las validaciones manuales pendientes han sido definidas.

Este comando finaliza únicamente la fase de desarrollo de la GitHub Issue #$1.

La GitHub Issue debe permanecer abierta después de completar `/issue $1`.

Aplica el `Workflow Handoff Guard` definido en:

`.agents/guardrails/workflow-handoff.md`

Solo considera `/issue $1` completado si el guardrail ha sido superado.

Si el `Workflow Handoff Guard` activa una condición de bloqueo:

DETENTE.

No consideres `/issue $1` completado.
No declares la implementación preparada para validación manual.
No cierres la Issue.
No hagas push.
No ejecutes `/finish-issue $1`.

### Estado de entrega

Cuando el `Workflow Handoff Guard` haya sido superado, la implementación queda preparada para ser entregada al usuario para validación manual.

La aprobación de las validaciones manuales corresponde exclusivamente al usuario.

El siguiente paso del workflow es:

`validación manual → /finish-issue $1`

Después de la aprobación manual, `/finish-issue $1` será responsable de continuar el workflow de publicación y cierre según las reglas definidas por ese comando.

### Resumen final obligatorio

Finaliza mostrando:

- GitHub Issue;
- rama de trabajo;
- ruta del SDD;
- estado de las tasks;
- verificaciones automáticas realizadas y resultado;
- hash del commit;
- mensaje del commit;
- estado de `git status`;
- estado de la GitHub Issue;
- estado de la validación manual;
- checklist de validaciones manuales pendientes;
- siguiente paso.

Cuando el proyecto defina comandos específicos para preparar el entorno de validación manual, indica únicamente los comandos aplicables.

No inventes comandos de desarrollo que no existan en el proyecto.

- archivos modificados por la Issue, indicando su estado:
  - `M` → modificado;
  - `A` → añadido;
  - `D` → eliminado;
  - `R` → renombrado;

El siguiente paso después de aprobar todas las validaciones manuales es:

`/finish-issue $1`
