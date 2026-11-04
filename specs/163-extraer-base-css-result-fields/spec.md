# SDD: Extraer base CSS compartida para campos de resultados WOD

## Objetivo

Crear o reutilizar una base CSS compartida para los campos de resultados WOD
donde exista una necesidad comprobada, sin introducir una abstracción genérica
difícil de mantener.

## Alcance

- Localizar componentes y estilos concretos de formularios de resultados y
  comparar estados normal, focus, disabled, error, responsive.
- Identificar declaraciones comunes y diferencias legítimas por formulario.
- Consolidar el mínimo CSS necesario, manteniendo selectores específicos donde
  proceda.
- No modificar validación, API, datos, workflow de resultados ni componentes
  ajenos.

## Fuera de alcance

- Cambios funcionales, contratos, API, datos o workflow de resultados.
- Nuevas abstracciones genéricas mantenibles.

## Comportamiento esperado

- Base CSS compartida para campos de resultados sin duplicación real.
- Selectores específicos donde proceda.

## Criterios de aceptación

- [ ] Se reduce duplicación real y la nueva responsabilidad de estilos es clara.
- [ ] Apariencia y comportamiento de formularios de registro sin regresiones.
- [ ] Pruebas de formularios, lint, build, `git diff --check` y revisión visual móvil/escritorio correctos.

## Restricciones

- No modificar validación, API, datos, workflow de resultados ni componentes ajenos.
