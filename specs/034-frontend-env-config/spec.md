# Spec: Configuracion frontend por entorno

## Objetivo

Eliminar las URLs de infraestructura hardcodeadas del frontend y obtener la
configuracion publica variable mediante variables de entorno compatibles con
Vite.

## Alcance

- Externalizar la URL base de la API mediante `VITE_API_URL`.
- Derivar la URL publica de OAuth de la URL base configurada.
- Tipar `VITE_API_URL` en `src/vite-env.d.ts`.
- Validar que la configuracion obligatoria exista y sea una URL absoluta.
- Añadir `frontend/.env.example` con valores seguros de desarrollo.
- Documentar la preparacion local minima del frontend.
- Revisar los hardcodes de infraestructura y conservar el puerto `5174` como
  configuracion local propia de Vite.

## Comportamiento esperado

- Las peticiones API se construyen usando `VITE_API_URL`.
- El login OAuth usa una URL derivada del origen de `VITE_API_URL`, sin conocer
  `localhost` ni el puerto del backend en `LoginPage`.
- La ausencia o invalidez de `VITE_API_URL` produce un error claro al cargar la
  configuracion, evitando URLs con `undefined`.
- Los endpoints relativos permanecen centralizados en `apiEndpoints.ts`.
- El cambio de entorno no requiere modificar codigo TypeScript.

## Criterios de aceptacion

- La URL base de la API no esta hardcodeada en el codigo frontend.
- La URL OAuth dependiente del entorno no esta hardcodeada.
- Los usos de `localhost`, puertos y URLs en `frontend/` han sido revisados.
- Las variables publicas usan el prefijo `VITE_`.
- Existe `.env.example` sin secretos.
- La configuracion ausente o invalida falla con un mensaje comprensible.
- `import.meta.env` esta tipado sin introducir `any`.
- Los endpoints relativos siguen centralizados.
- No se añaden dependencias ni se modifica el backend.
- El comportamiento funcional, login y llamadas API se conservan.
- `npm run lint` y `npm run build` finalizan correctamente en un checkout sin
  cambios ajenos.

## Restricciones

- No modificar Pages, Views, formularios, autenticacion ni contratos API.
- No externalizar endpoints relativos ni valores que no sean configuracion de
  entorno.
- No guardar secretos en variables `VITE_*`.
- No introducir dependencias nuevas.
- El cambio local preexistente en `frontend/src/App.tsx` no pertenece a esta
  Issue y no debe incluirse.
