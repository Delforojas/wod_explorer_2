# Verification Gate Hook

## Propósito

Ejecutar de forma controlada las verificaciones aplicables previamente determinadas para la GitHub Issue #$1 y devolver sus resultados al workflow.

Este hook actúa como punto central de ejecución de las verificaciones automáticas.

No determina por sí mismo qué verificaciones son necesarias y no corrige los fallos detectados.

## Momento de ejecución

Ejecuta este hook después de:

- completar todas las tasks de implementación;

- determinar qué verificaciones son aplicables.

Debe ejecutarse antes de aplicar el `Verification Guard`.

## Entrada

Recibe del workflow las verificaciones aplicables que deben ejecutarse.

Estas pueden incluir, cuando correspondan:

- tests;

- build;

- lint;

- type checking;

- comprobaciones de integración;

- validaciones de configuración;

- verificaciones específicas definidas por el proyecto.

## Ejecución

Para cada verificación aplicable:

1. ejecuta el comando o mecanismo definido por el proyecto;

2. espera a conocer su resultado;

3. registra si ha finalizado correctamente;

4. captura los errores relevantes;

5. captura los warnings relevantes;

6. conserva la información necesaria para que el workflow pueda evaluar el resultado.

No ocultes fallos.

No consideres una verificación ejecutada si no ha podido completarse.

## Resultado

Devuelve para cada verificación:

- nombre o tipo de verificación;

- comando o mecanismo utilizado;

- estado de ejecución;

- resultado;

- errores detectados;

- warnings relevantes detectados.

El resultado debe permitir distinguir claramente entre:

- verificación superada;

- verificación fallida;

- verificación incompleta o no ejecutable.

## Restricciones

Este hook NO debe:

- decidir qué verificaciones son funcionalmente necesarias;

- modificar código para conseguir que una verificación pase;

- modificar tests para ocultar un fallo;

- desactivar tests;

- desactivar reglas de lint;

- relajar configuraciones de build;

- modificar requisitos;

- ampliar el alcance de la Issue;

- aplicar reparaciones;

- crear commits;

- hacer push;

- declarar por sí mismo que la implementación completa es válida.

Su responsabilidad termina después de ejecutar las verificaciones proporcionadas y devolver sus resultados.
