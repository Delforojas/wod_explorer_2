# Planning Loop

## Propósito

Controlar de forma iterativa la corrección del SDD cuando el `Planning Guard` detecte problemas de planificación que puedan resolverse de forma segura sin modificar los requisitos ni ampliar el alcance de la GitHub Issue #$1.

## Condición de entrada

Activa este loop cuando:

- el `Planning Guard` no ha sido superado;

- el problema detectado pertenece al SDD;

- el problema puede corregirse utilizando la GitHub Issue y el contexto disponible;

- la corrección no requiere una nueva decisión funcional o arquitectónica.

## Ciclo

Mientras exista un problema de planificación corregible:

1. identifica exactamente la condición del `Planning Guard` que ha fallado;

2. identifica el archivo o parte del SDD afectada;

3. determina la corrección mínima necesaria;

4. modifica únicamente el SDD necesario para resolver el problema;

5. vuelve a aplicar el `Planning Guard`;

6. comprueba el resultado.

## Condición de repetición

Repite el ciclo únicamente mientras:

- exista un problema de planificación corregible;

- la corrección permanezca dentro del alcance de la Issue;

- la información necesaria esté disponible;

- no sea necesario inventar requisitos;

- no sea necesaria una nueva decisión funcional;

- no sea necesaria una nueva decisión arquitectónica;

- exista progreso razonable.

## Condiciones de salida

El loop finaliza cuando ocurre una de estas situaciones:

### Planificación válida

El `Planning Guard` ha sido superado.

Finaliza el loop y devuelve el control al workflow para continuar con la implementación.

### Bloqueo

La corrección requiere:

- modificar los requisitos;

- ampliar el alcance de la Issue;

- inventar comportamiento no definido;

- tomar una decisión funcional importante;

- tomar una decisión arquitectónica importante;

- resolver una contradicción que no puede determinarse mediante el contexto disponible.

En este caso:

DETENTE.

No continúes modificando el SDD.

No comiences la implementación.

Solicita únicamente la decisión o aclaración necesaria al usuario.

## Restricciones

Durante el loop:

- no modifiques la GitHub Issue;

- no amplíes su alcance;

- no inventes criterios de aceptación;

- no elimines criterios de aceptación para conseguir que la planificación sea válida;

- no tomes decisiones funcionales importantes por iniciativa propia;

- no tomes decisiones arquitectónicas importantes sin respaldo del contexto;

- no comiences la implementación;

- no repitas el ciclo indefinidamente si no existe progreso razonable.

## Trazabilidad

En cada iteración conserva:

- condición del `Planning Guard` que ha fallado;

- archivo del SDD afectado;

- problema detectado;

- corrección aplicada;

- resultado de volver a ejecutar el `Planning Guard`.

Debe poder reconstruirse la secuencia:

`Planning Guard → problema → corrección SDD → Planning Guard → resultado`
