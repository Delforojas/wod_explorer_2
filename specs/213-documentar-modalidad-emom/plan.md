# Plan: Referencia de la modalidad EMOM

## Enfoque

Consultar la sección 5.3 de `DOMAIN.md` y condensar sus reglas vigentes en una
referencia Markdown breve, sin interpretar ni extender el contrato de dominio.

## Archivos afectados

- `docs/emom-reference.md`: nueva referencia de la modalidad EMOM.
- `specs/213-documentar-modalidad-emom/`: trazabilidad de la Issue.

No se modifican código, configuración, dependencias ni base de datos.

## Estrategia de verificación

- Confirmar que el documento contiene de 8 a 15 líneas.
- Revisar su correspondencia con `DOMAIN.md` sección 5.3.
- Ejecutar `git diff --check` y confirmar que el cambio queda limitado al alcance.
