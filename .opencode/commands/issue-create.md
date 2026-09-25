
# /issue-create

Crea una nueva GitHub Issue en el repositorio actual a partir de la descripción
del usuario. El texto recibido después del command está disponible como

---

description: Propone y crea una GitHub Issue mediante GitHub CLI

---

`$ARGUMENTS`.

## Responsabilidad

Este command únicamente recopila la información, clasifica la Issue utilizando
únicamente labels existentes en el repositorio, presenta una propuesta y crea la
GitHub Issue después de una confirmación explícita del usuario.

No ejecutes `/issue` al terminar. La responsabilidad de este command termina
cuando la Issue se ha creado correctamente.

## Restricciones obligatorias

Durante este command:

- no implementes código;

- no crees ni modifiques `spec.md`, `plan.md` o `tasks.md`;

- no crees ni cambies de rama;

- no hagas commits ni push;

- no ejecutes `/issue` ni `/finish-issue`;

- no cierres ni modifiques una Issue existente;

- no uses el GitHub MCP para crear la Issue: la creación debe hacerse con `gh`;

- no inventes ni crees labels que no existan en el repositorio;

- no continúes con la creación si el directorio actual no pertenece a un
  repositorio Git válido;

- no continúes con la creación si `gh` no puede determinar de forma inequívoca
  el repositorio GitHub de destino.

Puedes consultar de forma puntual:

- el repositorio Git actual;

- el repositorio remoto asociado;

- las labels existentes;

- el estado y autenticación de `gh`;

cuando sea necesario para validar el contexto.

Estas comprobaciones no deben ampliar el alcance del command ni convertirse en
un análisis de implementación.

Antes de la confirmación explícita no ejecutes ninguna operación remota que cree,
edite, cierre o elimine Issues.

## 1. Recopilar la propuesta

Usa `$ARGUMENTS` como descripción inicial de la Issue.

A partir de esa descripción, extrae o determina únicamente la información
necesaria para definir correctamente el trabajo:

- título;

- objetivo;

- contexto;

- requisitos;

- criterios de aceptación;

- referencias externas, si el usuario las ha proporcionado o son necesarias
  para comprender la propuesta.

Infiere únicamente los campos que se desprendan claramente de `$ARGUMENTS` o del
contexto disponible del repositorio.

No inventes:

- decisiones funcionales;

- requisitos no solicitados;

- comportamiento esperado no definido;

- restricciones técnicas;

- referencias externas;

- criterios de aceptación que introduzcan nuevo alcance.

Los criterios de aceptación deben representar resultados observables y
verificables, no decisiones sobre cómo implementar la solución.

Si falta información imprescindible para definir la Issue o existe una
ambigüedad que pueda cambiar significativamente su alcance, pregunta únicamente
por esa información antes de preparar la propuesta.

No solicites información adicional cuando pueda inferirse de forma segura sin
alterar el alcance solicitado.

Si `$ARGUMENTS` está vacío o no contiene información suficiente para identificar
el trabajo solicitado, pide al usuario una descripción antes de continuar. No
intentes crear una Issue vacía o basada únicamente en suposiciones.

Si puede inferirse un título claro, utilízalo directamente en la propuesta.

Si existen varias interpretaciones razonables del título o del alcance, presenta
la interpretación propuesta y solicita al usuario que la confirme o corrija
antes de continuar.

## 2. Preparar el contenido

Construye el cuerpo de la Issue utilizando únicamente la información recopilada
en el paso anterior.

Usa esta estructura Markdown:

```markdown

## Objetivo

<qué problema se quiere resolver o qué resultado se busca>

## Contexto

<información necesaria para comprender la necesidad>

## Requisitos

- <comportamiento, capacidad o restricción requerida>

## Criterios de aceptación

- [ ] <resultado observable y verificable>

## Referencias

- <URL o referencia proporcionada>

## 3. Clasificar la Issue

Antes de mostrar la propuesta, determina las labels aplicables según el alcance
real de la Issue.

Consulta las labels disponibles en el repositorio mediante:

`gh label list`

Las labels existentes en el repositorio son la única fuente de verdad para la

clasificación.

No presupongas que el proyecto utiliza un conjunto concreto de labels ni que

existen categorías como `frontend`, `backend`, `database`, `bug`, `feature`,

`documentation` u otras.

Analiza el nombre y, cuando esté disponible, la descripción de cada label para
determinar cuáles representan correctamente el trabajo descrito en la Issue.
Una Issue puede tener varias labels cuando su alcance afecte realmente a varias
categorías existentes en el repositorio.

### Reglas de clasificación

- utiliza únicamente labels que existan actualmente en el repositorio;

- selecciona únicamente labels justificadas por el alcance real de la Issue;

- interpreta las labels según su nombre y descripción disponibles;

- no añadas una label simplemente porque una tecnología, área o concepto exista
  en el proyecto;

- no inventes labels;

- no crees labels nuevas;

- no modifiques labels existentes;

- no sustituyas una label inexistente por otra diferente únicamente para
  clasificar la Issue;

- evita labels redundantes o que describan indirectamente el mismo alcance;

- utiliza varias labels únicamente cuando cada una represente una dimensión
  real del trabajo;

- no añadas una label cuando su relación con la Issue sea dudosa;

- las labels propuestas forman parte de la confirmación explícita del usuario.

### Labels no disponibles

Si una categoría parece adecuada para la Issue pero no existe una label
equivalente en el repositorio, no la crees ni selecciones otra label como
sustitución automática.

Indica en la propuesta que no existe una label adecuada para esa categoría.

Si ninguna label existente representa correctamente la Issue, continúa con la
propuesta sin labels.

La ausencia de una label adecuada no debe impedir la creación de la Issue.

### Ambigüedad

Si una label existente puede interpretarse de varias formas y su aplicación no
puede determinarse de forma segura mediante su nombre, descripción y alcance de
la Issue, no la apliques automáticamente.

Indica la ambigüedad al usuario como parte de la propuesta para que pueda
decidir durante la confirmación.

## 4. Mostrar y confirmar

Antes de ejecutar cualquier operación que cree la Issue, muestra al usuario la
propuesta completa que se enviaría a GitHub.
La propuesta debe incluir:

- título exacto;

- cuerpo Markdown exacto;

- labels que se aplicarán;

- repositorio de destino.

Si el repositorio de destino no puede determinarse de forma inequívoca, no
continúes con la confirmación y solicita la información necesaria.
Indica claramente que la Issue todavía no ha sido creada.

### Confirmation gate

Después de mostrar la propuesta completa, solicita una confirmación explícita
mediante una pregunta interactiva con estas opciones o equivalentes:

- `Crear Issue`;

- `Revisar propuesta`;

- `Cancelar`.

No ejecutes `gh issue create` hasta que el usuario seleccione explícitamente
`Crear Issue`.

No interpretes como confirmación:

- comentarios sobre la propuesta;

- respuestas ambiguas;

- aprobación parcial;

- ausencia de respuesta;

- expresiones que no correspondan claramente a la acción de crear la Issue.

### Revisar propuesta

Si el usuario selecciona `Revisar propuesta`, solicita únicamente los cambios
que quiera realizar.

Actualiza la propuesta manteniendo sin cambios las partes que el usuario no haya
pedido modificar.

Después de cualquier modificación, vuelve a mostrar la propuesta completa:

- título;

- cuerpo Markdown;

- labels;

- repositorio de destino.

Toda propuesta modificada invalida cualquier confirmación anterior y requiere
una nueva confirmación explícita antes de crear la Issue.

### Cancelar

Si el usuario selecciona `Cancelar`, termina el command sin ejecutar
`gh issue create`.

Indica claramente que no se ha creado ninguna Issue.
No ejecutes ninguna acción posterior del workflow.

## 5. Crear la Issue

Solo después de que el usuario haya superado el `Confirmation gate`
seleccionando explícitamente `Crear Issue`, procede con la creación.

### 5.1 Verificar GitHub CLI

Comprueba que `gh` está disponible y que existe una sesión autenticada válida.
Si `gh` no está disponible o la autenticación falla:

- informa del error;

- no intentes crear la Issue mediante otro mecanismo;

- no utilices GitHub MCP como alternativa;

- no afirmes que la Issue fue creada;

- detén el command.

### 5.2 Verificar el repositorio destino

Determina el repositorio actual mediante `gh repo view` si no se había
determinado previamente.

El repositorio debe coincidir con el repositorio mostrado al usuario durante el

`Confirmation gate`.

Si el repositorio no puede determinarse de forma inequívoca o ha cambiado desde
la confirmación:

- no ejecutes `gh issue create`;

- informa al usuario;

- vuelve al paso de confirmación si es necesario confirmar un repositorio
  diferente.

### 5.3 Crear la Issue

Ejecuta `gh issue create` utilizando exactamente la propuesta confirmada por el
usuario:

- el título confirmado;

- el cuerpo Markdown confirmado;

- únicamente las labels confirmadas.

Utiliza:

- `--title` para el título;

- `--body` para el cuerpo;

- `--label` para cada label confirmada.

Ejemplo conceptual:

`gh issue create --title "..." --body "..." --label "..." --label "..."`

Si la propuesta confirmada no contiene labels, crea la Issue sin argumentos
`--label`.

No:

- modifiques el título confirmado;

- modifiques el cuerpo confirmado;

- añadas labels diferentes;

- añadas assignees;

- añadas proyectos;

- añadas milestones;

- añadas otros metadatos no incluidos explícitamente en la propuesta confirmada.

La creación debe corresponder exactamente con lo que el usuario autorizó.

### 5.4 Capturar el resultado

Conserva la URL devuelta por `gh issue create`.
No deduzcas ni construyas manualmente:

- el número de Issue;

- la URL;

- ningún otro identificador de la Issue.

Utiliza únicamente información devuelta o verificada mediante GitHub CLI.

### 5.5 Verificar la Issue creada

Después de una creación correcta, utiliza `gh issue view` sobre la Issue recién
creada para verificar:

- número;

- título;

- URL;

- labels finales.

La verificación debe confirmar que la Issue creada corresponde con la propuesta
autorizada.

Si se detecta una discrepancia, informa al usuario de la diferencia.

No modifiques automáticamente la Issue para corregirla, ya que este command no
debe editar Issues existentes sin una nueva autorización explícita.

### Errores de creación

Si `gh issue create` devuelve un error:

- muestra el error recibido;

- no inventes número, URL ni estado;

- no afirmes que la Issue fue creada;

- no reintentes utilizando otro mecanismo de creación;

- no ejecutes `/issue`;

- no ejecutes `/finish-issue`;

- no continúes con ningún workflow posterior.

Si el resultado de `gh issue create` es ambiguo y no permite determinar con
seguridad si la Issue fue creada, verifica el estado mediante GitHub CLI antes
de informar del resultado.

No crees una segunda Issue mientras exista incertidumbre sobre el resultado de
la primera operación.

## 6. Salida final

Cuando la Issue haya sido creada y verificada correctamente, muestra únicamente
un resumen final de la operación.

El resumen debe utilizar los datos obtenidos o verificados mediante GitHub CLI e
incluir:

- número de Issue;

- título;

- labels aplicadas;

- URL.

Si la Issue no tiene labels, indícalo explícitamente como `ninguna`.

No inventes, reconstruyas ni deduzcas información que no haya sido devuelta o
verificada mediante GitHub CLI.

Indica claramente que la Issue fue creada correctamente.

No muestres nuevamente el cuerpo completo de la Issue salvo que el usuario lo
solicite.

No continúes automáticamente con ninguna otra fase del workflow.

En particular:

- no ejecutes `/issue`;

- no crees una rama;

- no generes `spec.md`, `plan.md` o `tasks.md`;

- no implementes código;

- no hagas commits ni push.

La responsabilidad de `/issue-create` termina después de informar de la creación
correcta de la Issue.
El usuario decidirá cuándo iniciar el siguiente paso del workflow.

## Separación de responsabilidades

- `/issue-create` → propone, clasifica, confirma y crea una GitHub Issue;

- `/issue` → analiza una Issue existente e inicia el workflow SDD;

- `/finish-issue` → verifica, documenta, publica y finaliza una Issue

  implementada.
  