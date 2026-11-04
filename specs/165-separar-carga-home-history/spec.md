# SDD: Separar carga de datos de Home e History preservando UX

## Contexto

La auditoría #157 propone extraer la carga de datos actualmente mezclada con la composición en Home e History. Debe comprobarse primero qué páginas/componentes y llamadas presentan ese problema.

## Objetivo

Separar el fetching y los estados asíncronos de la presentación en Home e History mediante hooks o funciones reutilizables solo cuando la evidencia lo justifique.

## Alcance

- Identificar el recorrido real de datos de Home (anónima y autenticada) e History y las diferencias legítimas.
- Preservar caché actual si existe, lifecycle, auth, filtros y parámetros URL, carga, error, vacío y paginación.
- Extraer lógica de datos sin rediseñar UI, cambiar API ni introducir un gestor global de estado sin necesidad.
- Evitar crear un hook genérico artificial para dos flujos distintos.

## Fuera de alcance

- Rediseño de UI.
- Cambios en API.
- Gestor global de estado.
- Hook genérico artificial para dos flujos distintos.

## Comportamiento esperado

- Hooks o funciones reutilizables por flujo.
- Sin cambios funcionales.

## Criterios de aceptación

- [ ] Responsabilidades más claras y flujo de datos documentado.
- [ ] Sin peticiones duplicadas, cambios de navegación, filtros o permisos.
- [ ] Tests existentes y nuevos tests relevantes pasan; lint/build/diff-check correctos.
- [ ] Revisión visual desktop y móvil.

## Restricciones

- Detenerse para aprobación del usuario antes de commit, push, PR, merge o cierre.
