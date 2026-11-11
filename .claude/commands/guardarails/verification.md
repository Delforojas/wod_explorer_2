# Verification Guard

## Propósito

Garantizar que la implementación solo pueda superar la fase de verificación cuando todas las verificaciones aplicables hayan sido ejecutadas y hayan finalizado correctamente.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- se han identificado las verificaciones aplicables a la Issue;
- se han ejecutado todas las verificaciones aplicables;
- se conoce el resultado de cada verificación ejecutada;
- todas las verificaciones aplicables han finalizado correctamente;
- no existen errores relevantes pendientes;
- no existen warnings relevantes que invaliden la implementación;
- no existen verificaciones necesarias pendientes o incompletas.

No consideres una verificación superada si:

- su ejecución ha fallado;
- no ha podido completarse;
- su resultado es desconocido;
- presenta errores;
- presenta warnings relevantes que requieren intervención.

## Condiciones de fallo

El guardrail detecta un fallo si:

- alguna verificación aplicable falla;
- alguna verificación necesaria no puede completarse;
- existe una verificación aplicable pendiente;
- existe un error relacionado con la implementación;
- existe un warning relevante que impide considerar válida la implementación;
- el resultado de una verificación no puede determinarse de forma segura.

## Acciones prohibidas

Mientras exista alguna verificación aplicable fallida o incompleta:

- no continúes hacia el commit;
- no marques el trabajo como completado;
- no documentes la Issue como terminada;
- no cierres la Issue;
- no ignores errores;
- no ignores warnings relevantes;
- no desactives verificaciones para conseguir que el workflow continúe;
- no consideres una verificación superada si realmente no lo está.

## Acción ante fallo

Si alguna verificación aplicable falla:

NO continúes hacia el commit.

Identifica claramente:

- qué verificación ha fallado;
- qué resultado se ha obtenido;
- qué error o warning relevante se ha detectado.

Continúa únicamente mediante el proceso de resolución de fallos definido en el workflow.

El `Verification Guard` solo queda superado cuando todas las verificaciones aplicables han finalizado correctamente.
