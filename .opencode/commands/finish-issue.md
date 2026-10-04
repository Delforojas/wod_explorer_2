---
description: Finaliza, publica y cierra una GitHub Issue previamente implementada
---

# Finaliza la GitHub Issue #$1 del repositorio actual

Este comando se ejecuta únicamente después de que:

- la implementación de la Issue #$1 haya finalizado correctamente;

- exista una rama específica correspondiente a la Issue;

- las tasks de la Issue estén completadas;

- el usuario haya realizado y aprobado la validación manual.

Este comando NO implementa trabajo.

No vuelvas a implementar la Issue.
No vuelvas a generar ni modificar el SDD.
No repitas el análisis completo del proyecto.
No repitas tests, build o lint salvo que sea necesario para comprobar un problema detectado.
No crees nuevas ramas.

Este comando SÍ está autorizado para:

- crear el commit final correspondiente a la Issue si todavía no existe;

- añadir al staging únicamente archivos pertenecientes a la Issue;

- publicar la rama;

- documentar la finalización mediante GitHub MCP;

- cerrar la Issue.

La ejecución explícita de `/finish-issue $1` constituye autorización del usuario
para realizar el commit y push necesarios para finalizar exclusivamente esa Issue.

Nunca incluyas en el commit cambios locales ajenos a la Issue.

## 1. Comprobar la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP.

Comprueba que:

- la implementación está documentada;
- las tasks están completadas;
- no existen bloqueos pendientes;
- la validación manual ha sido indicada por el usuario como aprobada.

El estado remoto de la Issue no sustituye las comprobaciones Git.

Aunque la Issue #$1 aparezca ya como cerrada:

- comprueba igualmente la rama;
- comprueba los cambios;
- comprueba el commit;
- comprueba el working tree;
- comprueba si la rama está publicada.

Si existe trabajo de implementación pendiente:

DETENTE.

No implementes trabajo desde este comando.

## 2. Comprobar la rama y el working tree

Aplica las reglas definidas en `.opencode/commands/hooks/branch-check.md`

para obtener el estado Git necesario de la rama actual.

Utiliza el resultado del hook para comprobar que:

- la rama actual corresponde a la Issue #$1;

- el estado Git puede determinarse de forma segura;

- los cambios locales existentes están identificados.

Si la rama actual no corresponde a la Issue #$1 o el estado Git no puede

determinarse de forma segura:

**DETENTE.**

No crees una nueva rama.

No cambies automáticamente a otra rama.

No hagas commit.

No hagas push.

No cierres la Issue.

Conserva el resultado del hook para determinar la rama base en el siguiente paso.

## 3. Determinar la rama base

Identifica la rama base real desde la que se creó la rama actual.

No uses `main` automáticamente si la rama fue creada desde otra rama válida

de dependencia.

Utiliza historial Git, merge-base, reflog o referencias locales/remotas

cuando sea necesario para determinarla de forma segura.

Si no puede determinarse con seguridad la rama base:

DETENTE.

No inventes una rama base.

Conserva el nombre de la rama base para el resumen final.

## 4. Identificar los archivos pertenecientes a la Issue

Esta sección es OBLIGATORIA.

Inspecciona:

- cambios ya committeados respecto a la rama base;

- cambios staged;

- cambios unstaged;

- archivos nuevos sin seguimiento.

Determina qué archivos pertenecen realmente a la Issue #$1 usando:

- la Issue;

- la spec activa;

- el plan;

- las tasks;

- la rama actual.

No asumas que todos los cambios del working tree pertenecen a la Issue.

Clasifica los archivos como:

- `A` — añadido;

- `M` — modificado;

- `D` — eliminado;

- `R` — renombrado.

Si existen cambios locales ajenos a la Issue, identifícalos y consérvalos intactos.

Si no es posible determinar con seguridad qué cambios pertenecen a la Issue:

DETENTE.

Informa exactamente qué archivos generan la ambigüedad.

Conserva la clasificación de archivos para los pasos posteriores y para el resumen final.

## 5. Crear o localizar el commit final

Busca primero si ya existe un commit válido correspondiente a la Issue #$1.

Un commit se considera asociado a la Issue cuando:

- pertenece a la rama actual;

- contiene los cambios correspondientes a la Issue;

- su mensaje referencia claramente la Issue #$1 o su propósito.

### Si ya existe un commit válido

No crees otro commit innecesariamente.

Comprueba que no queden cambios de la Issue pendientes de commit.

### Si NO existe un commit válido

Y existen cambios correspondientes a la Issue pendientes:

1. aplica las reglas definidas en `.opencode/commands/hooks/pre-stage-check.md`;

2. si `pre-stage-check` falla, DETENTE;

3. añade al staging únicamente los archivos identificados como pertenecientes a la Issue;

4. aplica las reglas definidas en `.opencode/commands/hooks/pre-commit.md`;

5. si `pre-commit` falla, DETENTE;

6. crea el commit final correspondiente a la Issue;

7. aplica las reglas definidas en `.opencode/commands/hooks/post-commit.md`;

8. si `post-commit` falla, DETENTE.

No uses `git add .` ni equivalentes que puedan incluir cambios ajenos.

El mensaje del commit debe:

- describir brevemente el cambio realizado;

- seguir el estilo de commits existente en el repositorio cuando pueda determinarse;

- incluir obligatoriamente `(#$1)`.

Después del commit conserva:

- hash;

- mensaje;

- archivos contenidos.

### Si ya existía un commit pero quedan cambios de la Issue pendientes

Puedes crear un commit final adicional únicamente si esos cambios pertenecen

inequívocamente a la Issue.

Antes de crearlo aplica igualmente:

- `.opencode/commands/hooks/pre-stage-check.md`;

- `.opencode/commands/hooks/pre-commit.md`;

- `.opencode/commands/hooks/post-commit.md`.

No reescribas commits existentes.

No hagas amend salvo petición explícita del usuario.

No hagas rebase automáticamente.

## 6. Verificar el estado previo al push

Aplica las reglas definidas en `.opencode/commands/hooks/pre-push-check.md`.

Si `pre-push-check` falla:

DETENTE.

No hagas push.

No documentes la finalización.

No cierres la Issue.

Los cambios locales ajenos a la Issue no impiden continuar siempre que:

- hayan sido identificados claramente;

- no estén incluidos en los commits de la Issue;

- no hayan sido modificados por este comando.

Obtén la lista final de archivos pertenecientes a la Issue mediante una comparación equivalente a:

`git diff --name-status <rama-base>...HEAD`

No incluyas archivos que pertenezcan exclusivamente a trabajo ajeno a la Issue.

Conserva esta lista para:

1. documentarla posteriormente en la GitHub Issue;

2. mostrarla en el resumen final.

## 7. Publicar la rama

Únicamente después de que `.opencode/commands/hooks/pre-push-check.md` haya devuelto `PASS`,
publica la rama actual.

Si la rama todavía no tiene upstream:

- configura el upstream durante el push.

Ejemplo conceptual:

`git push -u <remote> <rama>`

Si la rama ya tiene un upstream válido:

- realiza un push normal.

Después del push comprueba que:

- el comando terminó correctamente;

- la rama remota existe;

- el commit correspondiente a la Issue está publicado en remoto.

Si el push falla o no puede verificarse correctamente:

**DETENTE.**

No intentes realizar force push.
No reescribas el historial.
No documentes la finalización.
No cierres la Issue.

Conserva para los pasos posteriores:

- rama remota publicada;

- remoto utilizado;

- commit publicado.

## 8. Integrar la rama mediante Pull Request

Después de publicar correctamente la rama, integra la Issue en su rama destino.

Esta sección es OBLIGATORIA antes de cerrar la Issue.

La rama destino será la `<rama-base>` determinada previamente

en el punto 3 de este workflow.

No asumas automáticamente que la rama destino es `main`.

### 8.1 Comprobar la rama destino

Antes de crear el Pull Request:

- comprueba que la rama base existe en remoto;

- comprueba que la rama actual está publicada;

- comprueba que el commit final de la Issue existe en remoto;

- comprueba que la rama actual y la rama destino son diferentes.

Si la rama destino no puede determinarse o no existe en remoto:

**DETENTE.**

No inventes una rama destino.

No crees el Pull Request.

No hagas merge directamente mediante `git merge` local.

La integración debe realizarse mediante Pull Request usando GitHub MCP.

### 8.2 Crear o localizar el Pull Request

Busca primero si ya existe un Pull Request abierto correspondiente a:

- la rama actual como `head`;

- la rama base como `base`;

- la Issue #$1.

Si ya existe:

- reutilízalo;

- no crees un Pull Request duplicado.

Si no existe:

- crea un Pull Request mediante GitHub MCP;

- usa como `base` la rama base determinada previamente;

- usa como `head` la rama actual;

- referencia la Issue #$1.

El título debe describir brevemente el cambio e incluir `#$1`

cuando resulte apropiado.

No cierres todavía la Issue.

### 8.3 Comprobar que el Pull Request puede integrarse

Comprueba mediante GitHub MCP que:

- el Pull Request tiene como `head` la rama actual;

- el Pull Request tiene como `base` la rama destino esperada;

- el commit final de la Issue forma parte del Pull Request;

- no existen conflictos de merge;

- las comprobaciones obligatorias del repositorio, si existen, permiten la integración.

Si existen conflictos o alguna comprobación obligatoria bloquea la integración:

**DETENTE.**

No intentes resolver conflictos automáticamente desde `/finish-issue`.

No fuerces la integración.

No cierres la Issue.

Informa de la condición que está bloqueando el merge.

### 8.4 Hacer merge del Pull Request

Si el Pull Request puede integrarse y no existen bloqueos:

- realiza el merge mediante GitHub MCP;

- respeta la estrategia de merge permitida o configurada en el repositorio;

- no uses force push;

- no reescribas el historial.

Después del merge comprueba que:

- el Pull Request aparece como `merged`;

- la rama destino contiene los cambios de la Issue;

- el resultado del merge está disponible en remoto.

Si el merge falla o no puede verificarse:

**DETENTE.**

No cierres la Issue.

Conserva:

- URL o número del Pull Request;

- estado del Pull Request;

- estrategia de merge utilizada;

- hash resultante del merge.

### 8.5 Sincronizar la rama destino local

Después de confirmar el merge remoto:

- cambia a la rama destino;

- actualízala desde su rama remota mediante fast-forward cuando sea posible.

Ejemplo conceptual:

`git switch <rama-base>`

`git pull --ff-only <remote> <rama-base>`

No realices merges locales adicionales durante este paso.

Si existen cambios locales ajenos que impidan cambiar de rama o actualizarla

de forma segura:

**DETENTE.**

No elimines los cambios.

No hagas stash automáticamente.

No fuerces el cambio de rama.

Después comprueba que:

- la rama destino local contiene los cambios de la Issue;

- la rama destino local está sincronizada con su correspondiente rama remota.

Conserva para el resumen final:

- rama destino;

- URL o número del Pull Request;

- estado del Pull Request;

- estrategia de merge utilizada;

- hash resultante en la rama destino.

## 9. Registrar la validación y finalización

Actualiza la GitHub Issue #$1 mediante GitHub MCP indicando que la implementación
ha sido completada y validada.

Documenta únicamente información que haya sido comprobada durante el workflow.

Incluye:

- validación manual aprobada por el usuario;
- verificaciones automáticas realizadas y su estado conocido;
- rama de trabajo publicada;
- rama destino;
- commit final asociado a la Issue;
- Pull Request utilizado para la integración;
- resultado del merge.

Incluye los siguientes datos cuando estén disponibles:

- nombre de la rama de trabajo;
- rama base;
- rama destino;
- hash del commit;
- mensaje del commit;
- número o URL del Pull Request;
- estado del Pull Request;
- estrategia de merge utilizada;
- hash resultante en la rama destino;
- archivos cambiados por la Issue.

### Archivos cambiados

Incluye todos los archivos de la Issue identificados anteriormente,
conservando su estado:

- `A` — añadido;
- `M` — modificado;
- `D` — eliminado;
- `R` — renombrado.

Ejemplo conceptual:

### Archivos cambiados por la Issue

- `M path/to/modified-file`
- `A path/to/new-file`
- `D path/to/deleted-file`
- `R path/to/renamed-file`

No inventes:

- pruebas manuales;
- verificaciones automáticas;
- resultados de CI;
- commits;
- archivos;
- información del Pull Request;
- resultados del merge.

No vuelvas a documentar detalles técnicos innecesarios si ya están registrados
en la Issue.

Si la actualización de la GitHub Issue falla:

**DETENTE.**

No cierres la Issue.

## 10. Cerrar la Issue

El cierre de la Issue debe ser siempre el último paso remoto del workflow.

Cierra la GitHub Issue #$1 únicamente si:

- todas las comprobaciones anteriores han finalizado correctamente;

- la validación manual ha sido aprobada por el usuario;

- la rama de trabajo ha sido publicada correctamente;

- el Pull Request ha sido integrado correctamente en la rama destino;

- la finalización ha sido documentada correctamente en la GitHub Issue;

- no existen bloqueos pendientes.

Si cualquiera de estas condiciones no se cumple:

**DETENTE.**

NO cierres la Issue.

### Si la Issue ya estaba cerrada

Si la Issue ya estaba cerrada antes de ejecutar este comando:

- no asumas que el workflow estaba correctamente finalizado;

- completa igualmente las comprobaciones y acciones necesarias del workflow;

- no vuelvas a cerrarla innecesariamente;

- conserva su estado cerrado una vez verificada correctamente la finalización.

## 11. Verificación final

Aplica las reglas definidas en `.opencode/commands/hooks/finish-workflow-check.md`.

El check debe verificar como mínimo que:

- la rama base o destino fue identificada correctamente;

- no quedan cambios pertenecientes a la Issue pendientes de commit;

- el commit correspondiente a la Issue es válido;

- la rama de trabajo fue publicada correctamente;

- el commit está disponible en remoto;

- el Pull Request fue integrado correctamente en la rama destino;

- los cambios de la Issue existen en la rama destino remota;

- la rama destino local está sincronizada con su correspondiente rama remota;

- la validación manual está registrada;

- la finalización está documentada en la GitHub Issue;

- la Issue está cerrada;

- no existen bloqueos pendientes.

Si `finish-workflow-check` devuelve `FAIL`:

**DETENTE.**

No consideres el workflow finalizado.

Informa exactamente de:

- qué comprobación ha fallado;

- la evidencia observada;

- qué estado impide considerar finalizada la Issue.

No intentes corregir automáticamente el problema desde este punto.

Si existen cambios locales ajenos a la Issue:

- indícalos claramente;

- no los modifiques;

- no los elimines;

- no hagas stash automáticamente.

El comando debe finalizar en la rama destino utilizada para integrar la Issue.

Si no es posible permanecer en la rama destino de forma segura:

**DETENTE.**

No fuerces el cambio de rama.

No modifiques cambios locales ajenos para conseguirlo.

## 12. Resumen final

Después de superar correctamente `.opencode/commands/hooks/finish-workflow-check.md`,
muestra el resumen final del workflow.

La salida final DEBE incluir obligatoriamente:

- Issue;

- rama de trabajo;

- rama base;

- rama destino;

- hash y mensaje del commit final;

- archivos cambiados por la Issue;

- estado del working tree;

- cambios locales ajenos, si existen;

- estado del push;

- Pull Request;

- estado del merge;

- estrategia de merge utilizada, si está disponible;

- hash resultante en la rama destino, si está disponible;

- validación manual;

- estado final de la Issue;

- rama actual al finalizar el workflow.

### Archivos cambiados finales

Muestra obligatoriamente todos los archivos pertenecientes a la Issue,
conservando su estado:

- `A` — añadido;

- `M` — modificado;

- `D` — eliminado;

- `R` — renombrado.

No incluyas archivos pertenecientes exclusivamente a cambios locales ajenos
a la Issue.

Si existen cambios locales ajenos a la Issue:

- indícalos claramente;

- informa de que permanecen sin modificar.

No inventes información que no haya sido comprobada durante el workflow.
No finalices el comando sin mostrar la lista de archivos cambiados por la Issue.
