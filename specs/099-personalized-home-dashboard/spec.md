# SDD: Dashboard de inicio personalizado para atletas autenticados

## Objetivo

Convertir la Home en una experiencia consciente de la autenticación: conservar
la landing pública para visitantes y ofrecer a los atletas autenticados un
punto de entrada compacto para continuar su entrenamiento con datos privados
reales.

## Alcance

- Mantener para invitados la composición actual, sus textos y las acciones
  `Explorar WODs`, `Catálogo de ejercicios` e `Iniciar sesión`.
- Mostrar para usuarios autenticados un saludo personalizado con el username
  disponible y un fallback seguro cuando no exista.
- Añadir accesos claros a registrar un resultado, consultar `Mis WODs`, crear un
  WOD personal y explorar WODs.
- Mostrar hasta tres resultados recientes del usuario mediante el endpoint
  autenticado existente `/wod-results`, respetando el orden de actividad que ya
  entrega la API.
- Ofrecer estados de carga, error con reintento y vacío para la actividad.
- Mantener la UI en español, el diseño oscuro/naranja, el patrón de fondo, la
  navegación existente y el comportamiento mobile-first.
- Evitar métricas nuevas, endpoints nuevos, cambios backend y datos de otros
  usuarios.

## Fuera de alcance

- Nuevos endpoints de dashboard o cálculos analíticos.
- Cambios en autenticación, persistencia JWT o contratos REST.
- Una sección de `Training snapshot`: la Issue la define como opcional y los
  datos existentes no justifican otra carga de API para esta entrega.
- Cambios en el CRUD de WODs o en la navegación global fuera de los enlaces
  necesarios para la Home.

## Comportamiento esperado

1. Un visitante ve la Home pública actual sin controles privados.
2. Un usuario autenticado no ve `Iniciar sesión` como CTA de la Home; ve el
   saludo y el CTA primario `Registrar resultado de WOD`.
3. Los accesos secundarios navegan a `/my-wod-results/new`, `/my-wods`,
   `/create-wod` y `/wods`.
4. La actividad autenticada se solicita solo mientras exista una sesión válida,
   muestra los resultados propios más recientes y permite ir al historial
   completo.
5. Mientras se carga la actividad no se muestran controles de invitado ni
   resultados antiguos de otra sesión.
6. Si no hay resultados, se muestra `No hay resultados aún` y una acción para
   explorar o registrar el primer WOD.
7. Si falla la API, se muestra un mensaje accesible y un botón `Reintentar`.
8. Logout devuelve al usuario a la Home pública y limpia el estado de actividad.
9. La composición funciona en móvil y escritorio, conserva foco visible,
   encabezados semánticos, contraste suficiente y respeta movimiento reducido.

## Criterios de aceptación

- [x] Los invitados conservan la Home pública y su CTA de inicio de sesión.
- [x] Los autenticados no ven `Iniciar sesión` como acción principal.
- [x] Existen accesos a registrar resultado, Mis WODs, crear WOD personal y
      explorar WODs.
- [x] La actividad muestra solo resultados del usuario actual y contempla carga,
      vacío, error y reintento.
- [x] La Home no fabrica métricas ni llama endpoints nuevos.
- [x] Cambios de sesión no dejan información obsoleta visible.
- [x] Móvil y escritorio conservan el lenguaje visual oscuro/naranja y la
      accesibilidad básica.
- [x] Hay pruebas para representación pública/autenticada, cambio de sesión,
      vacío, error/reintento y navegación de logout en la lógica verificable.

## Restricciones y fuentes

- `frontend/AGENTS.md`: arquitectura, contratos API, estados y accesibilidad.
- `DESIGN.md`: sistema visual y responsive.
- `frontend/src/auth/AuthContext.tsx`: fuente de estado de sesión y username.
- `frontend/src/api/wodsResultsApi.ts`: cliente autenticado de resultados.
- `backend/.../WodResultService.java`: ownership y consulta privada ordenada.
- GitHub Issue #99: objetivo, UX propuesta, alcance y criterios de aceptación.
