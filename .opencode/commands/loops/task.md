# Task Loop

## Propósito

Controlar la ejecución secuencial de las tasks definidas en `tasks.md` para la GitHub Issue #$1.

El loop garantiza que cada task se implemente respetando sus dependencias y que únicamente se marque como completada cuando su trabajo esté realmente terminado.

## Condición de entrada

Activa este loop cuando:

- el `Planning Guard` ha sido superado;
- existe `tasks.md`;
- existen tasks pendientes de implementación;
- puede identificarse una task pendiente cuyas dependencias estén satisfechas.

## Ciclo

Mientras existan tasks pendientes:

1. selecciona la siguiente task pendiente cuyas dependencias estén satisfechas;
2. comprende su objetivo y sus dependencias;
3. identifica los archivos o componentes afectados;
4. aplica el `Implementation Guard` definido en:

   `.agents/guardrails/implementation.md`

5. si el guardrail permite continuar, implementa únicamente el trabajo correspondiente a la task;
6. realiza las comprobaciones razonables necesarias para determinar que la task está terminada;
7. marca la task como completada únicamente cuando su trabajo esté realmente implementado;
8. selecciona la siguiente task pendiente cuyas dependencias estén satisfechas;
9. repite el ciclo.

## Condición de repetición

Repite el ciclo únicamente mientras:

- existan tasks pendientes;
- exista una task pendiente cuyas dependencias estén satisfechas;
- el `Implementation Guard` permita continuar;
- la implementación permanezca dentro del alcance de la GitHub Issue #$1.

## Condiciones de finalización de una task

Una task puede marcarse como completada únicamente si:

- el trabajo definido por la task está implementado;
- sus dependencias necesarias están satisfechas;
- no existe implementación parcial pendiente;
- no existe un error conocido relacionado con la task que impida considerarla terminada.

No consideres una task completada únicamente porque se hayan creado los archivos asociados.

## Condiciones de salida

El loop finaliza cuando ocurre una de estas situaciones:

### Todas las tasks completadas

Todas las tasks definidas en `tasks.md` están completadas.

Finaliza el loop y devuelve el control al workflow para continuar con la fase de verificaciones.

### Bloqueo

El `Implementation Guard` activa una condición de bloqueo.

En este caso:

DETENTE.

No continúes con la task afectada.

No marques la task afectada como completada.

No continúes con las tasks restantes.

### Dependencias bloqueadas

Existen tasks pendientes, pero ninguna puede ejecutarse porque sus dependencias no están satisfechas.

En este caso:

DETENTE.

No alteres automáticamente el orden o las dependencias para conseguir que el loop continúe.

Identifica las tasks y dependencias que provocan el bloqueo.

## Restricciones

Durante el loop:

- no amplíes el alcance de la Issue;
- no implementes trabajo no definido por las tasks;
- no realices refactorizaciones innecesarias;
- no cambies decisiones funcionales o arquitectónicas definidas;
- no añadas dependencias o infraestructura innecesarias;
- no marques tasks parcialmente implementadas como completadas;
- no ignores dependencias entre tasks;
- no modifiques el orden cuando exista una dependencia que lo impida.

## Trazabilidad

En cada iteración conserva:

- task seleccionada;
- dependencias relevantes;
- archivos o componentes afectados;
- cambios realizados;
- comprobaciones realizadas;
- resultado de la task;
- estado final de la task.

Debe poder reconstruirse la secuencia:

`task pendiente → dependencias → Implementation Guard → implementación → comprobación → task completada → siguiente task`
