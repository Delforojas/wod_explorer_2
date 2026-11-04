# Plan técnico

## Enfoque

Extraer base CSS compartida para los campos de resultados WOD identificados en
la auditoría #157 (F3) y consolidados parcialmente en hojas por formulario
(`amrap-result-fields`, `emom-result-fields`, `for-time-result-fields`,
`exercise-result-fields`).

## Estrategia

1. Inventariar estilos de campos de resultados por formulario (AMRAP, EMOM,
   For Time, exercise) y overrides en `preferences.css`.
2. Identificar declaraciones comunes y diferencias legítimas.
3. Consolidar el mínimo CSS necesario, manteniendo selectores específicos.
4. Verificar pruebas, lint, build y revisión visual.

## Verificación

- Desde `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
- `git diff --check`.
- Revisión visual móvil/escritorio.
