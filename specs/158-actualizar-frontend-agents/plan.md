# Plan técnico

## Enfoque

Cambio documental acotado a `frontend/AGENTS.md`. Se sustituye la sección 3
por un mapa basado en el árbol real, agrupado por capa y con reglas explícitas
derivadas de la implementación existente. No se modifica código ni otros
documentos.

## Mapa a documentar

| Ruta | Responsabilidad verificada |
|---|---|
| `src/pages/` | Contenedores de ruta: estado, efectos, llamadas a `api/` y composición de views |
| `src/views/` | Presentación por dominio, módulos puros y subcomponentes locales |
| `src/components/` | UI compartida: layout/navegación, guard de auth, detalle y listas reutilizables |
| `src/api/` | Clientes por dominio; `api/client/` centraliza fetch, endpoints y errores |
| `src/auth/` | Contexto de sesión, persistencia y expiración |
| `src/schemas/` | Esquemas Zod, fuente de verdad de contratos |
| `src/types/` | Tipos TypeScript y reexportaciones derivadas de schemas |
| `src/utils/` | Utilidades puras (peticiones, guards, scroll, validación) |
| `src/styles/` | Hojas CSS por responsabilidad; entrada única en `src/index.css` |

## Pasos

1. Verificar el árbol y las responsabilidades reales (hecho en contexto).
2. Reescribir la sección 3 con el mapa anterior y reglas obligatorias breves.
3. Corregir el carácter aislado `ç` de la tabla de skills.
4. Comprobar que todas las rutas citadas existen.
5. Ejecutar `git diff --check` y revisar que solo cambia `frontend/AGENTS.md`.
6. Registrar antes/después en la Issue.

## Verificación

- Comprobación de existencia de cada ruta citada.
- `git diff --check`.
- Revisión del diff completo para confirmar ausencia de cambios funcionales.
- No se ejecutan lint/test/build del frontend porque no cambia código,
  configuración ni pruebas; se documenta esta decisión en el handoff.
