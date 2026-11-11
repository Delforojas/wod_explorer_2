# SDD Guard

## Propósito

Garantizar que existe un SDD válido, completo y correctamente estructurado para la GitHub Issue antes de comenzar la validación de la planificación.

## Condiciones para continuar

El guardrail se considera superado únicamente si:

- existe una única carpeta SDD correspondiente a la GitHub Issue #$1;
- la carpeta sigue `specs/<numero>-<slug>/`;
- el número utiliza 3 dígitos;
- el slug no está vacío;
- el slug utiliza minúsculas y kebab-case;
- el slug corresponde razonablemente al título de la Issue;
- existe `spec.md`;
- existe `plan.md`;
- existe `tasks.md`;
- ninguno de los tres archivos está vacío;
- `spec.md` contiene objetivo, alcance, comportamiento esperado y criterios de aceptación;
- `plan.md` contiene un enfoque concreto de implementación;
- `tasks.md` contiene trabajo concreto y ejecutable.

Comprueba el contenido real de los archivos.

No basta con comprobar únicamente su existencia.

## Condiciones de bloqueo

Activa este guardrail si:

- no existe una carpeta SDD para la Issue;
- existen varias carpetas SDD para la misma Issue y no puede determinarse de forma segura cuál es válida;
- el nombre de la carpeta no cumple la convención requerida;
- el slug está vacío;
- existe una carpeta inválida como `specs/<numero>-/`;
- falta `spec.md`;
- falta `plan.md`;
- falta `tasks.md`;
- alguno de los archivos obligatorios está vacío;
- `spec.md` no define suficientemente el trabajo solicitado;
- `plan.md` no describe cómo abordar la implementación;
- `tasks.md` no contiene tareas concretas y ejecutables;
- el SDD contiene requisitos funcionales importantes inventados o no respaldados por la Issue y el contexto del proyecto.

## Acciones prohibidas

Mientras el SDD no supere este guardrail:

- no implementes cambios;
- no marques tasks como completadas;
- no hagas commit;
- no documentes la Issue como completada;
- no cierres la Issue;
- no continúes con las siguientes fases del workflow.

## Acción ante bloqueo

Si se activa cualquiera de las condiciones anteriores:

DETENTE.

Identifica exactamente qué condición del SDD ha fallado.

Indica el archivo, carpeta o contenido problemático cuando corresponda.

Solicita únicamente la información o intervención necesaria cuando el problema no pueda resolverse de forma segura a partir de la GitHub Issue y del contexto disponible.
