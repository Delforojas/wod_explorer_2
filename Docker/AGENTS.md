# AGENTS.md — Base de datos

Estas instrucciones aplican al diseño, implementación y operación de la base de datos de WOD Explorer 2.0. Se basan en el dominio del producto y en las decisiones técnicas confirmadas; no presuponen que los archivos o datos de una base anterior sean válidos para la nueva.

## Fuentes de verdad

Antes de diseñar o modificar el modelo, consulta:

1. `DOMAIN.md` para las reglas e invariantes funcionales.
2. La spec activa en `specs/` para el alcance concreto de la tarea.
3. `PROJECT.md` para las decisiones de tecnología y configuración.
4. La constitución y el `AGENTS.md` raíz para los principios y guardrails generales.
5. El esquema, migraciones y configuración existentes, si ya existen en este proyecto.

El esquema de una base antigua sirve como referencia para entender datos o decisiones previas. No reemplaza a `DOMAIN.md` ni define por sí solo el modelo de la base nueva.

Si falta una fuente necesaria o existe una contradicción que afecta al modelo, indícalo y no inventes una regla de producto para resolverla.

## Tecnología confirmada

- Motor: MySQL 8.4.
- Entorno previsto: Docker Compose.
- Nombre de la base de datos: `wod_explorer_2`.
- MySQL Workbench está disponible para el usuario como herramienta de inspección y administración.
- Servicio, contenedor, puertos, volumen, rutas, versión exacta de la imagen y herramienta de migraciones: se decidirán para el proyecto nuevo y se registrarán en `PROJECT.md` cuando estén confirmados.

No reutilices automáticamente esos valores de una instalación o repositorio anterior. No añadas un ORM, gestor de migraciones ni otra dependencia hasta que el proyecto o una spec lo decida.

## Reglas de modelado del dominio

- Modela usuarios, catálogo de ejercicios, WOD, composición ordenada y resultados según `DOMAIN.md`.
- Los ejercicios y WOD genéricos los administra el sistema. Un WOD personal pertenece a un único usuario y es privado.
- Un WOD puede tener varios ejercicios ordenados; debe poder repetirse un mismo ejercicio en posiciones distintas. La posición debe permitir reconstruir el orden de forma determinista.
- Un WOD disponible debe tener al menos un ejercicio.
- No impongas unicidad al nombre del WOD.
- Cada resultado pertenece al usuario que lo registra y al WOD realizado. Se permiten varios intentos para el mismo WOD y todos son privados.
- Conserva la semántica de cada modalidad en los resultados. No reduzcas modalidades distintas a una cifra genérica.
- El historial personal y las mejores marcas se derivan de los resultados; evita mantenerlos como una segunda fuente de verdad.
- Un cambio o eliminación de un WOD no puede cambiar silenciosamente el significado histórico de sus resultados.
- Protege las operaciones privadas por propiedad del usuario, no solo por conocer el identificador.
- Mantén los datos personales en el mínimo necesario para identificar la cuenta.

`DOMAIN.md` deja decisiones pendientes sobre las modalidades admitidas, campos de resultado, prescripciones, conservación de la definición del WOD, eliminación o archivo de WOD con resultados, versionado del catálogo y notas. No fijes estructuras que resuelvan estas decisiones por intuición. Identifica las alternativas y pide que se concreten en una spec o decisión de producto antes de cerrar el diseño afectado.

## Esquema propuesto

El diagrama compartido para la nueva base propone estas tablas y relaciones:

- `users`: identidad y credenciales de la cuenta.
- `exercises`: catálogo de ejercicios.
- `wods`: identidad del WOD, propietario opcional para WOD personales, origen y fechas de ciclo de vida.
- `wod_versions`: versiones numeradas de la definición de un WOD, con modalidad, límites y rondas.
- `wod_version_items`: ejercicios ordenados de una versión y sus prescripciones de repeticiones, carga, distancia o duración.
- `wod_results`: intentos de un usuario sobre una versión concreta del WOD, con campos para finalización, tiempo, progreso y resultados AMRAP.
- `exercise_results`: marcas personales de un usuario para un ejercicio.

Relaciones representadas: un usuario puede poseer varios WOD y registrar varios resultados; un WOD tiene versiones; una versión contiene elementos ordenados que referencian ejercicios; los resultados pueden referenciar la versión ejecutada y, cuando aplique, el elemento de progreso; las marcas de ejercicio pertenecen al usuario y al ejercicio.

Este diagrama es el diseño de partida, no una especificación cerrada. Antes de fijar el esquema, comprueba que cada campo representa una regla aprobada de `DOMAIN.md` o una decisión de diseño acordada. En particular:

- `wod_versions` puede conservar la definición histórica que requiere el dominio; acuerda si se crea una nueva versión al cambiar un WOD y cómo se selecciona la versión al registrar un resultado.
- Los campos `progress_*`, `amrap_*`, `completed` y `type` deben validarse frente a las modalidades y resultados permitidos. No los conviertas en la estructura definitiva de resultados hasta concretar las decisiones pendientes del dominio.
- `exercise_results` no está definido como entidad en el `DOMAIN.md` compartido. Antes de incluirlo en el alcance del producto, debe existir una decisión o spec que lo respalde.
- El diagrama no muestra restricciones, claves únicas, `ON DELETE`, nulabilidad ni índices completos. Deben diseñarse y documentarse; no deducir su comportamiento solo por las líneas de relación del dibujo.

## Convenciones del esquema

- Usa nombres de tablas y columnas en inglés y `snake_case`, siguiendo el estilo de la plantilla recibida.
- Toda tabla debe tener una clave primaria explícita.
- Representa relaciones con claves foráneas y usa tablas de unión para relaciones muchos a muchos.
- Evita datos redundantes. Conserva instantáneas solo si se aprueba esa estrategia para proteger la historia.
- Define nulabilidad, unicidad, `CHECK` y otras restricciones según reglas confirmadas del dominio.
- Define conscientemente `ON DELETE` y `ON UPDATE`, en especial para usuarios, WOD y resultados históricos.
- Diseña índices a partir de consultas, filtros, orden y relaciones necesarios; justifica los índices importantes.
- Sigue la skill local de MySQL, si está disponible, para detalles del motor. Comprueba sus recomendaciones frente a MySQL 8.4, la spec y el estado real antes de aplicarlas.

## Fuente de verdad del esquema y cambios

Antes de implementar tablas, define dónde vive el esquema autoritativo y cómo se aplican los cambios. Registra esa decisión en `PROJECT.md`.

- Los cambios de esquema deben ser reproducibles y versionados.
- No dependas de modificaciones manuales no documentadas.
- Usa el sistema de migraciones que el proyecto confirme. Si aún no está definido, no instales ni elijas uno por intuición.
- Mantén la inicialización de una base vacía coherente con el esquema esperado.
- Antes de cambiar una base existente, inspecciona su esquema y los datos afectados; separa el estado observado del modelo deseado.
- No edites una migración aplicada si puede dejar entornos distintos; añade una migración posterior cuando corresponda.

## MySQL Workbench

Usa Workbench para inspección visual o consultas de solo lectura cuando la conexión esté disponible. No asumas que el agente tiene acceso directo a la sesión de Workbench.

Si hace falta revisar una base a la que el agente no puede conectarse, solicita una exportación del esquema sin datos sensibles o las salidas de inspección necesarias. No pidas ni guardes contraseñas, secretos o volcados de datos personales innecesarios.

## Seguridad y operación

- Gestiona credenciales con variables de entorno o el mecanismo de secretos decidido para el proyecto.
- Nunca guardes credenciales reales en archivos versionados. `.env` debe estar excluido de Git y `.env.example` debe usar valores ficticios.
- La aplicación no debe conectarse como `root`; utiliza una cuenta con privilegios mínimos.
- Evita mostrar o registrar datos privados innecesarios.
- Antes de operaciones de mantenimiento, identifica el entorno y los datos afectados. Usa respaldo y plan de recuperación cuando la operación pueda causar pérdida de datos.

## Guardrails destructivos

Detente y pide autorización explícita antes de eliminar tablas o columnas, borrar datos en bloque, ejecutar `DROP DATABASE` o `TRUNCATE`, eliminar volúmenes, aplicar una migración destructiva o realizar una operación irreversible.

Trata como destructiva cualquier operación con riesgo razonable de pérdida de datos o recuperación incierta. Las consultas de solo lectura y la inspección pueden realizarse libremente.

## MCP de base de datos

El proyecto dispone del MCP `database` para acceder al estado real de MySQL.

### Uso obligatorio

Cuando una tarea afecte al esquema, relaciones, restricciones, migraciones
o persistencia existente:

- Usa `database` para inspeccionar el estado actual antes de realizar cambios.
- Verifica tablas, columnas, claves, relaciones y restricciones relevantes.
- Contrasta el estado real con las migraciones y configuración del repositorio.
- Después de un cambio de esquema, verifica el resultado mediante `database`.

### Seguridad

- Prioriza operaciones de lectura para inspección y diagnóstico.
- No elimines tablas, columnas o datos existentes sin que la tarea lo requiera explícitamente.
- No uses el MCP para introducir cambios manuales que deban quedar representados mediante una migración.
- Los cambios estructurales deben seguir la estrategia de migraciones definida por el proyecto

## Verificación

Después de implementar cambios, realiza verificaciones proporcionales al alcance:

- confirmar que MySQL 8.4 está accesible en el entorno correspondiente;
- inspeccionar las tablas modificadas y sus claves, relaciones, índices y restricciones;
- ejecutar consultas funcionales relacionadas con la spec;
- verificar integridad y compatibilidad de los datos existentes;
- confirmar que scripts y migraciones están versionados y permiten reconstruir o evolucionar el esquema según el flujo elegido.

No inventes comandos ni afirmes que los cambios se aplicaron si solo se diseñaron. Informa qué verificaciones se ejecutaron y cuáles quedaron pendientes.
