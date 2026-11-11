# Verification Runner — fases 7 y 8

Operaciones: `discover` (auxiliar, solo lectura) y `run` (ejecución controlada).
El workflow determina la aplicabilidad y completa las tasks antes de ejecutar.
El runner no decide alcance, no repara código ni aplica el Verification Guard.

## Catálogo

```sh
python3 scripts/harness/verification_runner.py discover
python3 scripts/harness/verification_runner.py discover --registry-json <registro-validado.json>
```

Devuelve `verification_catalog` con comandos, directorios, fuentes de definición,
hashes del catálogo y huella del estado fuente. No ejecuta los comandos ni
instala herramientas/dependencias.

Catálogo integrado, únicamente cuando existen sus fuentes reales:

- `frontend.test`, `.lint`, `.build`, `.typecheck`, `.type-check`, `.integration`:
  los scripts respectivos de `frontend/package.json`; no se inventa un check de
  tipos separado si solo existe dentro de `build`. Se conservan el cuerpo del
  script y sus hooks npm `pre`/`post`, junto con los hashes de configuración.
- `backend.validate`, `.test`, `.build`: los comandos `./mvnw` documentados
  literalmente en `PROJECT.md`, con su `pom.xml`, wrapper y configuración.
  `backend.validate` usa el comando existente `-q -DskipTests validate`: valida
  configuración, no certifica que los tests hayan pasado. `backend.test` no
  omite tests y `backend.build` ejecuta `package` sin relajar verificaciones.

El catálogo no prueba que Java, npm, Docker, MySQL ni los servicios externos
estén disponibles. El workflow evalúa prerrequisitos/perfiles antes de aprobar
la selección. No se añaden perfiles, infraestructura ni comandos por suposición.

El registro opcional contiene `checks`, una lista de objetos:

```json
{
  "checks": [{
    "id": "project.configuration",
    "command": ["./scripts/check-configuration.sh"],
    "cwd": ".",
    "sources": ["scripts/check-configuration.sh"],
    "timeout_seconds": 60
  }]
}
```

Se admiten scripts existentes dentro del repositorio, scripts Python mediante
un intérprete Python o `git diff --check`. Las fuentes deben ser archivos reales.
No se admiten cadenas de shell ni comandos Git arbitrarios. Los IDs son únicos
con letras minúsculas, números, puntos, guiones y guiones bajos. Los timeouts
son positivos, hasta 3600 segundos; el valor predeterminado es 900.

Los programas del proyecto se ejecutan como han sido aprobados. Esto **no es un
sandbox**: el workflow debe revisar los scripts y sus efectos, no aprobar
comandos que reparen código, desactiven checks, escriban Git o publiquen trabajo.
El runner tampoco interpreta instrucciones contenidas en logs.

## Productor de selección

`build_selection` es la única operación autorizada para construir el objeto
`--selection-json`/`selection_path`. Solo está disponible vía MCP
(`harness_call`, fases 7 y 8), no como subcomando CLI:

```text
build_selection(catalog_evidence, issue, workflow_id, phase, selected,
                applicable_checks, tasks_completed, applicability_complete,
                rerun_reason=None)
```

`catalog_evidence` es el resultado completo de `discover` observado en la
misma sesión. `build_selection` extrae `catalog_sha256` y
`source_fingerprint.sha256` directamente de ahí; nunca se construyen a mano.
En fase 7 exige que `selected` cubra exactamente `applicable_checks` (por
conjunto) y fija la lista aprobada a `selected`. En fase 8 exige
`rerun_reason` no vacío. `tasks_completed`/`applicability_complete` deben
llegar como `true` explícito: la función nunca infiere aplicabilidad ni
completitud de tareas. Un catálogo no `PASS`, un check desconocido o
duplicado, o una selección parcial en fase 7 producen un error explícito; no
se ejecuta ningún check.

Devuelve `{"selection_approval": {"status": "PASS", ..., "selection": {...}}}`.
El campo `selection` es exactamente el objeto que debe pasarse, inline, como
`selection_path` a `run`.

Para un check puramente documental (`git diff --check`) en una Issue sin
cambios de código, `--registry-json`/`registry_path` usa como `sources` los
archivos reales de la SDD activa de esa Issue (`spec.md`, `plan.md`,
`tasks.md`); nunca una fuente inventada.

## Selección explícita

```sh
python3 scripts/harness/verification_runner.py run \
  --issue 75 --workflow-id <sesion> --phase 7 \
  --selection-json <seleccion-de-sesion.json> \
  --checks frontend.lint frontend.test frontend.build \
  --log-dir <directorio-fuera-del-repositorio>
```

`--repo-root` y `--registry-json` están disponibles en ambas operaciones.
El registro usado en `run` debe corresponder al catálogo descubierto/aprobado.
La selección JSON tiene:

```text
status: APPROVED
source: <decisión del workflow>
issue: 75
workflow_id: <sesión>
repository: <ruta absoluta canónica>
phase: 7 | 8
checks: <lista ordenada exacta de --checks>
applicable_checks: <inventario completo aprobado>
catalog_sha256: <verification_catalog.catalog_sha256>
source_fingerprint: <verification_catalog.source_fingerprint.sha256>
tasks_completed: true
applicability_complete: true
rerun_reason: <obligatorio en fase 8>
```

El workflow conserva la procedencia de estas decisiones: los hashes no son
firmas ni sustituyen la aprobación de aplicabilidad o terminación real de tasks.
Guarda recibos/registros temporales fuera del árbol fuente para no invalidar la
huella que acaba de aprobar. Una selección vacía, duplicada, desconocida,
incompleta, de otra sesión o desactualizada nunca ejecuta comandos.

En fase 7 se exige la lista completa. En fase 8 puede seleccionarse un subconjunto
aprobado para repetir checks afectados. Los checks omitidos aparecen en
`coverage.not_run_in_this_invocation`: el resultado agregado permanece
`INCOMPLETE`, aunque los checks ejecutados pasen. El workflow debe completar o
reutilizar evidencia válida para los demás; el runner nunca fabrica sus resultados.

## Resultado y diagnósticos

Salida: `verification_evidence`, código 0 para `PASS`, 1 para `FAIL`/`INCOMPLETE`.
Cada informe conserva ID, argv, cwd, definición, horas, duración, código de
salida, estado de ejecución y resultado. Se ejecuta sin shell, con stdin cerrado,
`CI=true`, sin prompts Git ni bytecode Python, y con un grupo de procesos propio.
Un timeout/interrupción termina ese grupo y conserva los logs parciales. Un hijo
que sigue activo tras salir el proceso principal impide declarar ejecución completa.
Los fallos normales no ocultan los resultados de los demás checks seleccionados.

Los logs completos de stdout/stderr y los diagnósticos normalizados JSONL se
guardan sin truncar en una carpeta única fuera del repositorio. Si se omite
`--log-dir`, se usa un directorio temporal persistente hasta que el workflow lo
retire. El reporte contiene rutas, tamaños y SHA-256, además de extractos
acotados. No se vuelcan variables de entorno ni se reescriben fuentes.

La detección de errores/warnings por texto es heurística: no demuestra ausencia
de errores relevantes. El Verification Guard revisa los logs y su relevancia.
Un código distinto de cero es `FAIL`. Un comando que no termina, no arranca o
presenta diagnósticos sin clasificar queda `INCOMPLETE`, nunca `PASS` por defecto.

Para reutilizar una revisión explícita de diagnósticos, `run` acepta
`--diagnostics-review-json`:

```text
source: verification-guard
issue, workflow_id
source_fingerprint: <SHA de la misma fuente verificada>
reviews:
  - check_id
    definition_sha256
    diagnostics_sha256
    blocking: true | false
    reason: <justificación explícita>
```

La revisión debe coincidir con los diagnósticos efectivamente capturados en la
nueva ejecución. `diagnostics_sha256` referencia los bytes del archivo JSONL
normalizado (incluye stream, número de línea, tipo y texto completo). Una revisión
no bloqueante puede resolver warnings benignos, pero jamás convierte en `PASS`
un timeout o un código de salida distinto de cero. La revisión y sus fuentes se
conservan en el reporte; los diagnósticos originales no se borran.

## Validez y preservación

La huella incluye HEAD, rama, índice lógico y archivos trackeados/no ignorados,
con contenido, modo, identidad y mtime. `source-manifest.json` guarda ese
inventario fuera del repositorio. Los artefactos generados ya ignorados, como
`dist/` y `target/`, no invalidan la fuente; no se añaden excepciones de código.
Si un check cambia fuente, índice, HEAD, rama o definición, se invalida la
evidencia y no se ejecutan más checks contra ese estado sin una nueva selección.
No se restaura, descarta ni repara automáticamente lo que modificó el comando.

Los cambios de dependencias instaladas, servicios o entorno también invalidan
las verificaciones y deben registrarse por el workflow; una huella de fuentes
no certifica esos recursos externos. `content_sha256` permite comparar contenido
sin atribuir los resultados a un commit futuro que todavía no existe.
El adaptador hacia `final-check` debe demostrar que el contenido verificado
corresponde al árbol candidato; no basta con copiar un nuevo `tree_sha` a un
informe antiguo. Se preserva el contexto de cambios locales ajenos.

## Pruebas

`tests/test_verification_runner.py` usa repositorios temporales y comandos
controlados. El caso npm emplea un ejecutable simulado: no instala ni ejecuta
checks reales de frontend/backend. Se verifican logs binarios completos,
revisiones, fallos, timeouts, procesos hijos, detección de cambios y cobertura
parcial. Los casos sin efectos esperados comparan todos los bytes del repositorio.
