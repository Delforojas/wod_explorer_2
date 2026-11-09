# Plan de implementación

## Enfoque

1. Extender `git_policy.py` con primitivas deterministas para calcular el manifiesto completo de una ruta y sus hashes de contenido/diff, usando la evidencia de fase 9 como ancla.
2. Definir un recibo de autorización externa con una interfaz de verificador inyectable por configuración. El recibo debe incluir emisor, identidad autenticada, emisión, expiración, manifiesto canónico y firma o prueba verificable; el harness solo valida la prueba, nunca la crea.
3. Implementar propuesta y validación de adopción como operaciones de fase 9 que no escriben Git, registran `preexisting_adoption_evidence` y se invalidan junto con pre-stage ante cambios de archivos, índice, rama, HEAD o contexto de alcance.
4. Ajustar el controlador para permitir las dos operaciones de adopción en fase 9 y requerir la evidencia validada cuando la revisión autorice rutas preexistentes.
5. Hacer que la preparación de staging acepte evidencia de adopción en memoria, revalide los bytes y limite las excepciones a las rutas aprobadas de forma exacta.
6. Actualizar el Change Review Guard y `hyssue.md` para preservar el bloqueo por defecto y describir la autorización humana obligatoria.
7. Añadir pruebas de unidad e integración con repositorios temporales para los casos de aceptación y regresiones del flujo actual.

## Decisiones

- El manifiesto usa rutas relativas exactas y archivos completos; no acepta glob, directorios ni fragmentos.
- Los hashes se calculan sobre bytes de contenido y sobre el diff binario completo con índice completo; el modo forma parte de la identidad aprobada.
- La clasificación técnica y los datos Git son observaciones, no prueba de pertenencia funcional. El recibo humano y el Change Review Guard siguen siendo obligatorios.
- La ausencia de un verificador externo configurado bloquea la adopción en lugar de aceptar un campo declarativo.
- Los archivos excluidos nunca son candidatos de adopción en esta issue.

## Verificación

- Ejecutar las suites del harness afectadas y la suite completa de `scripts/harness/tests`.
- Verificar que una autorización válida permite staging selectivo solo de las rutas exactas y que el resto del worktree queda sin tocar.
- Verificar los rechazos por procedencia, sesión, caducidad, hash, ruta, contenido, diff, modo y mezcla de alcance.
