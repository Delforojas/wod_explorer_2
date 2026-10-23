# Tasks: Configuracion frontend por entorno

## Orden y dependencias

1. Auditar hardcodes y confirmar el estado inicial.
2. Implementar la configuracion Vite tipada y validada.
3. Actualizar LoginPage, ejemplo de entorno y documentacion.
4. Verificar referencias, lint, build y diff.
5. Revisar y commitear solo los cambios de la Issue.

## Tareas ejecutables

- [x] Auditar URLs, `localhost`, puertos y OAuth dentro de `frontend/`.
- [x] Añadir `VITE_API_URL` tipado en `src/vite-env.d.ts`.
- [x] Validar `VITE_API_URL` y derivar la URL OAuth en la configuracion API.
- [x] Sustituir la URL OAuth hardcodeada de `LoginPage`.
- [x] Añadir `frontend/.env.example` sin secretos.
- [x] Documentar la configuracion local en `frontend/README.md`.
- [x] Confirmar que los endpoints relativos siguen centralizados.
- [x] Confirmar que no se introduce `any` ni se modifica el backend.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` en un checkout limpio con solo los cambios de la Issue.
- [x] Ejecutar `git diff --check`.
- [x] Revisar el diff y excluir `frontend/src/App.tsx` del staging.

> El checkout de trabajo conserva un cambio ajeno en `frontend/src/App.tsx` que
> elimina un import todavía utilizado; por eso el build directo del checkout
> falla, mientras que el build del checkout limpio de la Issue pasa.
