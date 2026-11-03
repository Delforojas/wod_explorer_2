# SDD: Auditoría de arquitectura frontend y propuesta de refactorización incremental

## Objetivo

Producir una auditoría técnica de la arquitectura actual del frontend (React,
TypeScript, Vite y CSS existentes) basada en evidencia verificable del
repositorio, junto con un plan de mejora incremental priorizado. Esta Issue es
de análisis y documentación: no modifica código de producción, estilos,
dependencias, configuraciones ni pruebas.

## Alcance

Se auditan las siguientes áreas del frontend real:

1. Estructura de `src/` y límites de responsabilidad.
2. Componentes React: composición, reutilización, estado local/compartido/remoto.
3. Datos y contratos: API, DTOs, tipos TypeScript, esquemas Zod, estados de
   carga/error/vacío, permisos y autenticación.
4. CSS y diseño: hojas, tokens, alcance de selectores, especificidad,
   duplicaciones y diferencias no intencionadas, responsividad y accesibilidad.
5. Calidad, rendimiento y mantenibilidad: tests, lint, build, configuración
   TypeScript, imports, renderizados y facilidad de extensión.
6. Workflow y coste de contexto: contraste con `AGENTS.md`, skills y
   convenciones, señalando documentación redundante sin editarla.

La auditoría parte del estado integrado de `main` en el commit
`e5cd8d805b0e3f5bc58fb41ff4a9c9e4cdeb27b2`, que ya incluye #155.

## Fuera de alcance

- Aplicar refactorizaciones, cambios visuales o funcionales.
- Crear las issues derivadas del roadmap.
- Editar `AGENTS.md`, skills, workflow o documentación de proceso.
- Introducir dependencias, frameworks CSS, librerías de estado o tooling nuevos.
- Migrar a otro sistema de estilos.
- Especular sobre cuotas de tokens o métricas no observadas.

## Comportamiento esperado

El entregable es un informe en
`specs/157-auditoria-arquitectura-frontend/audit.md` que contiene:

1. Mapa actual del frontend: módulos, responsabilidades y recorrido de datos y
   navegación.
2. Diagnóstico sustentado: fortalezas y problemas, cada hallazgo con archivo(s)
   y ubicación, situación actual, impacto real y clasificación
   (error/regresión, deuda técnica, preferencia de estilo, mejora opcional).
3. Tabla priorizada de recomendaciones con impacto, esfuerzo aproximado, riesgo,
   dependencias y prioridad (alta/media/baja).
4. Plan de refactorización incremental en issues pequeñas e independientes, con
   orden sugerido y criterios de aceptación, sin crearlas.
5. Propuesta de arquitectura objetivo mínima, solo donde la evidencia indique
   mejoras.
6. Resumen ejecutivo: refactorizar ahora, dejar para después y no tocar.

Cada hallazgo debe citar rutas concretas del repositorio. No se aceptan
recomendaciones genéricas sin evidencia local.

## Criterios de aceptación

- [ ] El análisis cita archivos concretos del frontend real.
- [ ] Se identifican fortalezas junto con oportunidades de mejora.
- [ ] Se distingue entre arreglos imprescindibles y mejoras opcionales.
- [ ] Existe un roadmap accionable para abrir futuras issues separadas.
- [ ] Se documenta el estado Git de referencia y no se interfiere con trabajo no
      integrado.
- [ ] No se aplican refactorizaciones ni cambios funcionales.
- [ ] El informe queda listo para revisión y decisión del usuario.

## Restricciones

- No modificar código de producción, estilos, dependencias, configuraciones ni
  pruebas.
- No crear, editar ni cerrar issues derivadas.
- No hacer push, PR, merge ni cerrar la Issue en este workflow.
- Mantener la identidad visual actual como referencia; las discrepancias se
  documentan, no se corrigen.
- Las preferencias de estilo deben etiquetarse como tales, no como defectos.
- Evitar soluciones dependientes de nombres o IDs concretos de WODs.
