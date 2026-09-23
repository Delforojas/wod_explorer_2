# Constitución — WOD Explorer 2.0

Principios innegociables que gobiernan el desarrollo del proyecto. Toda spec, plan, tarea e implementación debe respetarlos.

## 1. Simplicidad primero

Se elegirá la solución más simple que cumpla el requisito actual. No se añadirán capas, patrones, servicios o abstracciones sin una necesidad concreta.

## 2. La spec manda

La spec activa define el alcance de cada tarea. No se implementarán funcionalidades, integraciones, infraestructura ni cambios de arquitectura fuera de ese alcance.

## 3. Separación de responsabilidades

La presentación, la lógica de aplicación, el dominio, el acceso a datos, la infraestructura y las pruebas deben mantener responsabilidades claras. Las reglas de negocio no dependen de detalles de interfaz ni de persistencia.

## 4. Consistencia tecnológica

Las decisiones tecnológicas definidas por el proyecto se respetan. Los detalles de herramientas, entorno y ejecución se obtienen de `AGENTS.md`, de los archivos específicos de cada área y de la configuración real del proyecto.

## 5. Fuente de verdad única

`DOMAIN.md` es la fuente de verdad de las reglas de negocio, entidades, relaciones, propiedad, privacidad e invariantes. Cada dato debe tener una fuente autoritativa clara; no se deben duplicar datos derivados ni usar fuentes históricas como activas tras una migración.

## 6. Integridad y reproducibilidad

La implementación debe preservar las invariantes definidas en `DOMAIN.md`. La configuración y las verificaciones necesarias para ejecutar el proyecto deben ser reproducibles.

## 7. UI responsive y accesible

La interfaz debe permitir completar los flujos principales de forma clara en los tamaños de pantalla soportados. Debe usar semántica adecuada, navegación por teclado, foco visible, controles etiquetados, mensajes comprensibles y contraste legible.

## 8. Código mantenible

El código debe ser claro, cohesionado y fácil de modificar. Se permiten refactors pequeños cuando simplifican el código afectado, eliminan duplicación relevante, corrigen una inconsistencia o son necesarios para completar la tarea con seguridad. No se realizarán refactors amplios, cambios estéticos masivos ni reestructuraciones ajenas a la tarea sin una spec o autorización explícita.

## 9. Calidad como puerta de salida

Toda modificación debe ejecutar las verificaciones aplicables definidas por el proyecto. No se declarará una tarea terminada si una comprobación obligatoria falla o si no se informa de una verificación que no pudo realizarse.

## 10. Dependencias controladas

No se añadirán dependencias ni se cambiarán versiones principales sin una necesidad técnica concreta y relacionada con la tarea. La elección debe ser coherente con la arquitectura existente.

## 11. Seguridad por defecto

Los recursos privados se protegen mediante autorización basada en propiedad. Las entradas y contratos entre capas se validan en sus fronteras. No se exponen secretos ni datos innecesarios.

## 12. Convenciones e idioma

Se utiliza la terminología definida en `DOMAIN.md`. La interfaz y la documentación se redactan en español, salvo que una spec indique otra necesidad.

## 13. Trazabilidad del desarrollo

Las decisiones que afecten al dominio, modelo de datos, privacidad o historial se documentan. Al terminar una tarea se indican los archivos modificados, las verificaciones ejecutadas y las limitaciones pendientes.

## 14. No asumir decisiones de producto

Si una decisión funcional está pendiente en `DOMAIN.md` o no aparece en la spec activa, no debe resolverse por intuición durante la implementación. Debe acordarse y documentarse antes de aplicarla.
