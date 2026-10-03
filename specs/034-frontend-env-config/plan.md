# Plan: Configuracion frontend por entorno

## Enfoque

1. Auditar las apariciones de URLs, `localhost`, puertos y configuracion de
   infraestructura dentro de `frontend/`.
2. Convertir `VITE_API_URL` en la unica entrada publica obligatoria para la
   API y derivar desde ella la URL de OAuth de Google.
3. Añadir la ampliacion TypeScript de `ImportMetaEnv`, el ejemplo de entorno y
   la documentacion local minima.
4. Mantener `vite.config.ts` sin externalizar el puerto `5174`, documentando
   que es una preferencia local de desarrollo y no una URL de infraestructura.
5. Verificar que no queden hardcodes de infraestructura funcionales y ejecutar
   lint/build.

## Archivos afectados

- `frontend/src/api/client/apiEndpoints.ts`: lectura y validacion de
  `VITE_API_URL`, URL OAuth derivada y endpoints relativos existentes.
- `frontend/src/pages/LoginPage.tsx`: consumo de la URL OAuth centralizada.
- `frontend/src/vite-env.d.ts`: tipos de variables Vite usadas por el cliente.
- `frontend/.env.example`: configuracion publica de desarrollo.
- `frontend/README.md`: instrucciones locales breves.
- `specs/034-frontend-env-config/`: SDD de la Issue.

## Decisiones

- No se crea una segunda variable para OAuth porque el host debe coincidir con
  el backend indicado por `VITE_API_URL`.
- No se mueve la configuracion de endpoints relativos a variables de entorno.
- No se externaliza el puerto `5174` porque solo afecta al servidor local de
  Vite y la Issue no requiere configurar el puerto del frontend.

## Verificacion

- Buscar de nuevo hardcodes de infraestructura bajo `frontend/`.
- Confirmar que no se introdujo `any`.
- Ejecutar `npm run lint` desde `frontend/`.
- Ejecutar `npm run build` desde `frontend/`.
- Comprobar `git diff --check` y excluir `frontend/src/App.tsx` del staging.
