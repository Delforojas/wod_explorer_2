# Tareas

- [ ] Definir el formato versionado, la serialización canónica y la validación de integridad del snapshot de evidencia.
- [ ] Implementar exportación y restauración validada del estado completo de `WorkflowController`, preservando historial, guards, bloqueadores y evidencias superseded.
- [ ] Implementar almacenamiento local privado, atómico y con retención acotada para snapshots autorizados.
- [ ] Añadir Runtime Version Guard, fingerprints en `harness_status` y bloqueo de operaciones mutables con runtime divergente.
- [ ] Añadir operaciones MCP explícitas de snapshot y restauración que no sustituyan una sesión activa y revaliden identidad, runtime y Git.
- [ ] Documentar ubicación, permisos, retención y protocolo de parada, reinicio y reanudación.
- [ ] Añadir pruebas unitarias e integración para restauración, corrupción, incompatibilidad, cambios de versión, invalidación y preservación de historial.
- [ ] Ejecutar el conjunto de pruebas del harness y registrar los resultados de la verificación. [phase:7]
