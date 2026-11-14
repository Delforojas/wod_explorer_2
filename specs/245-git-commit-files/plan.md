# Plan: revisar archivos de un commit

## Enfoque técnico

Crear una única guía Markdown en `docs/`, siguiendo el estilo de las guías Git
existentes: título breve, explicación de solo lectura, bloque de comandos y una
descripción clara de la salida.

## Componentes afectados

- `docs/git-commit-files.md`: nueva guía para inspeccionar el commit en `HEAD`.
- `specs/245-git-commit-files/`: trazabilidad y estado de la ejecución.

## Estrategia de implementación

1. Documentar el comando que muestra resumen y estadísticas por archivo.
2. Documentar el comando que enumera solamente las rutas modificadas.
3. Contrastar los resultados y dar un ejemplo posterior a `/commit-issue`.
4. Revisar el contenido y ejecutar ambos comandos contra el repositorio local
   para confirmar que son válidos como consultas de solo lectura.

## Dependencias

- Ninguna dependencia de aplicación, infraestructura o configuración.
- La guía depende únicamente de comandos Git ya disponibles en el repositorio.

## Verificación

- Confirmar que existe la guía y contiene ambos comandos exactos.
- Ejecutar ambos comandos contra `HEAD` y verificar que finalizan correctamente.
- Revisar el diff para confirmar que solo se añadieron la guía y los archivos
  SDD requeridos.
