# SDD: Unificar contrato de prescripciones WOD

## Objetivo

Exponer de forma consistente las prescripciones de un WOD desde MySQL hasta la
UI: ítems ordenados, repeticiones, carga, distancia, duración, calorías,
variantes de carga, progresiones y extensiones de tiempo. El contrato debe
preservar el comportamiento de los WODs existentes y admitir nuevas
prescripciones sin condicionar la lógica por nombre o identificador.

## Alcance

- Versionar el esquema que ya existe en la base de datos live para calorías,
  variantes de carga, progresiones y extensiones de tiempo.
- Incluir esos datos en la respuesta agregada de WOD que consumen las vistas
  públicas y personales.
- Mantener el orden de los ítems por su posición de composición.
- Mostrar en el detalle compartido todos los valores presentes, variantes,
  progresión y extensión sin ocultar campos existentes.
- Validar el contrato backend y frontend con fixtures que cubran prescripciones
  simples, compuestas y avanzadas.

## Fuera de alcance

- Crear o editar prescripciones avanzadas desde el formulario de creación de
  WODs. La Issue extiende el contrato de lectura y conserva la escritura actual.
- Cambiar los tipos de resultado, ownership, autorización o versionado de WODs.
- Generalizar las variantes a dimensiones distintas de la carga: la tabla
  actual y la evidencia disponible solo definen variante y `weight_kg`.
- Convertir progresiones en reglas por ítem: el modelo actual define una única
  progresión por versión y no existe evidencia de una semántica distinta.

## Contrato canónico

Cada `WodAggregateResponse` contiene una versión y sus ítems ordenados. Un
ítem puede contener los siguientes campos opcionales:

- `reps`: entero no negativo, repeticiones por aparición del ítem.
- `weightKg`: decimal no negativo, carga base en kilogramos.
- `distanceM`: decimal no negativo, distancia en metros.
- `durationSeconds`: entero no negativo, duración en segundos.
- `calories`: entero no negativo, objetivo en calorías.
- `prescriptions`: variantes ordenadas de carga, con `variant` (`MEN` o
  `WOMEN`) y `weightKg` positivo.

Un valor nulo significa que esa dimensión no está prescrita. Un ítem debe tener
al menos una dimensión de prescripción. La carga base sigue siendo la carga
general; una variante es una alternativa específica de carga y no sustituye ni
duplica otros campos del ítem. Cuando existe una variante aplicable, su
`weightKg` es la carga que debe mostrarse para esa variante; la carga base se
mantiene como valor general del contrato.

La versión puede incluir:

- `progressionRule`: `startReps`, `incrementReps` y `everyRounds`, todos
  positivos. Describe una progresión global de la versión.
- `timeExtension`: `initialSeconds`, `extensionSeconds` y
  `roundsPerExtension`, todos positivos. Describe la extensión temporal global
  de la versión.

La ausencia de cualquiera de esas relaciones significa que la versión no usa
esa regla.

## Comportamiento esperado

1. El endpoint de agregado devuelve ítems en el mismo orden de la composición
   con todas sus dimensiones presentes, incluidas calorías.
2. Las variantes se asocian al ítem correcto sin consultas N+1 ni reglas por
   WOD concreto.
3. La progresión y la extensión se asocian a la versión correcta y no aparecen
   cuando no existen.
4. La UI muestra unidades explícitas: `kg`, `m`, `s` y `cal`.
5. La UI conserva los valores base y comunica las alternativas de variante sin
   inventar una selección de atleta.
6. Fran y HYROX conservan sus prescripciones existentes; fixtures avanzados
   cubren Open 13.4, Open 13.5 y Regionals 11.6 aunque este último no está en la
   base local inspeccionada.
7. El detalle usa una sola prioridad visual para la columna principal:
   repeticiones, distancia, calorías y duración. La magnitud elegida no se
   repite en el texto secundario; carga y variantes continúan como contexto.

## Criterios de aceptación

- [x] El esquema versionado es reproducible en una base nueva y no modifica el
      baseline aplicado históricamente.
- [x] Entidades, repositorios y DTOs contienen calorías, variantes,
      progresiones y extensiones con nulabilidad coherente.
- [x] La respuesta agregada no pierde orden ni valores de prescripción.
- [x] La UI renderiza campos simples, combinados y avanzados con sus unidades.
- [x] Tests de backend cubren el mapeo relacional y regresiones de contrato.
- [x] Tests de frontend cubren el render de calorías, variantes, progresión y
      extensión.
- [x] Lint, tests, build y `git diff --check` pasan.
- [x] Se entrega una guía de validación manual para desktop y móvil.

## Validación manual

La revisión manual del detalle de WOD debe realizarse en escritorio y móvil,
comprobando que:

- las magnitudes principales muestran repeticiones, metros, calorías o segundos
  con su unidad correcta, sin guiones ni etiquetas de repeticiones falsas;
- las cargas base y las variantes MEN/WOMEN aparecen como contexto sin duplicar
  movimientos ni sustituir otros valores prescritos;
- las reglas de progresión y extensión temporal aparecen solo cuando existen;
- se conserva el orden de movimientos, la pizarra existente y la acción
  `Registrar resultado`.

El usuario aprobó previamente esta revisión visual para escritorio y móvil.

## Fuentes

- GitHub Issue #155.
- Base MySQL live inspeccionada el 2026-11-03.
- `Docker/mysql/init/001_baseline.sql`.
- `backend/src/main/java/com/wodexplorer2/backend/service/WodAggregateService.java`.
- `frontend/src/schemas/wodSchemas.ts`.
- `DOMAIN.md`, `PROJECT.md`, `AGENTS.md`, `backend/AGENTS.md`,
  `frontend/AGENTS.md` y `Docker/AGENTS.md`.
