# SDD Manager — contrato de fase 4

Operaciones de módulo implementadas: `inspect`, `prepare`. `validate` es
exclusivamente una sub-orden del CLI (`sdd_manager.py validate`); internamente
llama a `inspect(issue, repo_root, validate=True, require_completed=...)`. No
existe una función de módulo `validate` ni una operación MCP
`sdd_manager.validate`: la vía MCP (`harness_call`) siempre usa
`sdd_manager.inspect` con `arguments.validate`/`arguments.require_completed`.
La estructura es técnica; el SDD Guard y el Planning Guard conservan todas las
responsabilidades semánticas. Ninguna operación escribe Git, modifica staging,
crea commits, consulta GitHub ni marca tareas como completadas.

## Inspección de solo lectura

```sh
python3 scripts/harness/sdd_manager.py inspect --issue 75
```

Devuelve `sdd_inspection_evidence` por stdout: repositorio, Issue, momento,
estado de colección, candidatos SDD, inventario completo, huellas SHA-256,
identidad y metadatos de archivos, contenido real de los tres documentos,
secciones y estado bruto de las tareas.

`PASS` de inspección significa que la observación es utilizable. La ausencia de
SDD se registra como `sdd_state: missing`; no crea carpetas. Duplicados, nombres
inválidos, enlaces simbólicos, archivos no legibles o errores de enumeración
producen `BLOCK`. Se incluyen candidatos mal nombrados cuyo prefijo numérico
corresponde a la Issue; `75-...`, `0075-...` y `075_...` no se ignoran.

El número debe estar entre 1 y 999: estos contratos exigen exactamente tres
dígitos. No se truncan ni normalizan silenciosamente números mayores.

## Preparación conservadora

```sh
python3 scripts/harness/sdd_manager.py prepare --issue 75 \
  --evidence-json <inspeccion-de-sesion.json> --slug approved-feature
```

El workflow debe haber superado previamente el Branch Guard. El comando exige
una inspección `PASS` del mismo repositorio/Issue y compara nuevamente su
snapshot antes de escribir. La rama debe ser específica para la Issue y
conservar la misma identidad y HEAD observados; no prepara desde `main`,
`master` ni un HEAD separado. Para una nueva carpeta exige un slug explícito en
minúsculas y kebab-case; no lo inventa a partir del título. Para reutilizar la
carpeta existente puede omitirse `--slug`; si se proporciona, debe coincidir.

Crea únicamente `specs/075-approved-feature/` y los archivos obligatorios que
falten. Los nuevos archivos están vacíos: sus requisitos y decisiones deben
redactarse después con el contexto de la Issue. `PASS` de preparación no es
`PASS` de validación.

Las escrituras son exclusivas, no sobrescriben contenido y no siguen symlinks.
Un bloqueo temporal fuera del repositorio coordina preparaciones concurrentes.
Nunca elimina un bloqueo ajeno. Si hay un error después de crear una parte de
la estructura, informa `BLOCK` y `created_paths`; no borra trabajo ni oculta el
estado parcial con un rollback automático.

No elimina duplicados ni renombra carpetas inválidas automáticamente. Esos
casos requieren una decisión explícita de destino y conservación, seguida de
una nueva inspección; no se asume que un nombre parecido autoriza mover trabajo.

Salida: `sdd_preparation_evidence` con rutas creadas y preservadas, carpeta,
huella final y necesidad de validación posterior.

## Validación de solo lectura

```sh
python3 scripts/harness/sdd_manager.py validate --issue 75
python3 scripts/harness/sdd_manager.py validate --issue 75 --require-completed
```

Equivalente MCP (no existe una operación `sdd_manager.validate`):
`sdd_manager.inspect` con `issue`, `validate: true` y, cuando aplique,
`require_completed: true`.

Devuelve `sdd_validation_evidence`, `PASS` o `BLOCK` y errores concretos.
Comprueba una única carpeta `specs/075-<slug>/`, los tres archivos regulares
UTF-8, contenido no vacío y elementos estructurales observables.

En `spec.md` reconoce secciones Markdown ATX (`## ...`, también numeradas):

| Elemento | Encabezados admitidos |
|---|---|
| Objetivo | Objetivo, Objective, Goal |
| Alcance | Alcance, Scope |
| Comportamiento esperado | Comportamiento esperado, Expected behavior/behaviour, Decisiones funcionales, Requisitos funcionales |
| Aceptación | Criterios de aceptación, Acceptance criteria |

Cada sección debe contener texto o listas con contenido, directamente o en
subsecciones. La compatibilidad con `Decisiones funcionales` mantiene el formato
de los SDD existentes. Un formato diferente se reporta para revisión; nunca se
reescribe automáticamente.

`plan.md` debe contener texto sustantivo. Python no deduce que ese texto sea
viable o compatible con la arquitectura: eso pertenece al Planning Guard.

`tasks.md` debe contener checkboxes con texto no vacío, usando listas
`-`, `*`, `+` o numeradas. Se admiten `[ ]`, `[x]`, `[X]`. Se registran línea,
texto, marcador y estado. Los comentarios HTML y bloques de código no cuentan
como contenido ni tareas. Se detectan archivos vacíos, encabezados sin cuerpo
y marcadores de plantilla aislados como `TODO`/`TBD`.

En fase 4 las tareas pendientes son válidas y no se modifican. Para las fases
que exigen completitud se usa `--require-completed`; una marca `[x]` no demuestra
por sí misma que la tarea esté implementada: esa justificación sigue en el
workflow y sus guardrails.

Todas las operaciones aceptan `--repo-root` y pueden ejecutarse desde un
subdirectorio. Salida JSON por stdout, código 0 para `PASS`, 1 para `BLOCK`, 2
para argumentos CLI inválidos. La evidencia no se guarda automáticamente; el
workflow conserva su fuente y la invalida ante cambios de contenido, rutas,
metadatos o contexto.

## Pruebas

`tests/test_sdd_manager.py` usa repositorios temporales y compara los bytes
antes/después de lecturas. Las pruebas de preparación verifican que todos los
archivos preexistentes, incluidos `.git` y `opencode.json`, permanecen intactos.
