# Verification / Repair Loop

## Propósito

Controlar de forma iterativa la resolución de verificaciones fallidas relacionadas con la GitHub Issue #$1.

El loop permite aplicar correcciones mínimas y volver a ejecutar las verificaciones afectadas hasta alcanzar un estado válido o encontrar un bloqueo.

## Condición de entrada

Activa este loop cuando:

- una verificación aplicable ha fallado;

- el `Verification Guard` no ha sido superado;

- el fallo requiere entrar en el proceso de resolución definido por el workflow.

## Ciclo

Mientras exista alguna verificación aplicable fallida relacionada con la Issue:

1. identifica y analiza el fallo;

2. aplica el `Repair Guard` definido en:

   `.agents/guardrails/repair.md`

3. si el `Repair Guard` permite continuar, aplica únicamente la corrección mínima necesaria;

4. vuelve a ejecutar las verificaciones afectadas mediante el `Verification Gate Hook` definido en:

   `.agents/hooks/verification-gate.md`

5. aplica nuevamente el `Verification Guard` definido en:

   `.agents/guardrails/verification.md`

6. comprueba el resultado.

## Condición de repetición

Repite el ciclo únicamente mientras:

- exista alguna verificación aplicable fallida relacionada con la Issue;

- el `Repair Guard` permita continuar;

- exista progreso razonable;

- la reparación permanezca dentro del alcance de la Issue.

## Condiciones de salida

El loop finaliza cuando ocurre una de estas situaciones:

### Verificaciones superadas

Todas las verificaciones aplicables han finalizado correctamente.

Finaliza el loop y devuelve el control al workflow para continuar con el siguiente punto.

### Bloqueo

El `Repair Guard` activa una condición de bloqueo.

Finaliza inmediatamente el loop.

DETENTE.

No continúes con la reparación.

No continúes hacia el commit.

Solicita únicamente la intervención necesaria para resolver el bloqueo.

## Restricciones

Durante el loop:

- no amplíes el alcance de la Issue;

- no realices refactorizaciones innecesarias;

- no corrijas problemas ajenos a la Issue;

- no modifiques requisitos por iniciativa propia;

- no elimines verificaciones válidas;

- no desactives verificaciones válidas;

- no relajes verificaciones únicamente para conseguir que pasen;

- no continúes indefinidamente si no existe progreso razonable.

## Trazabilidad

En cada iteración conserva:

- verificación fallida;

- causa identificada, cuando sea conocida;

- resultado del `Repair Guard`;

- corrección aplicada;

- verificaciones repetidas;

- resultado obtenido.

Debe poder reconstruirse la secuencia:

`fallo → análisis → Repair Guard → corrección → Verification Gate → Verification Guard → resultado`
