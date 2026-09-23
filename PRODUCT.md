# WOD Explorer 2.0

<!-- impeccable:product-schema 1 -->

## Plataforma

Aplicación web para consultar entrenamientos de CrossFit, crear WOD personales y registrar resultados.

## Usuarios

### Visitante

Puede consultar, buscar y filtrar el catálogo público de ejercicios y los WOD genéricos proporcionados por la aplicación. No puede crear WOD, registrar resultados ni consultar información privada.

### Usuario registrado

Además de las capacidades de un visitante, puede crear y gestionar sus propios WOD privados, registrar resultados de WOD genéricos o propios y consultar su historial y mejores marcas personales.

Cada usuario solo puede acceder y gestionar sus propios recursos privados.

## Propósito del producto

WOD Explorer ayuda a deportistas de CrossFit a descubrir ejercicios y entrenamientos, crear WOD personalizados con ejercicios del catálogo y registrar sus ejecuciones para conocer su evolución.

El producto tiene éxito cuando una persona puede encontrar un WOD o crear uno propio, registrar su resultado y consultar de forma clara sus intentos y su mejor marca personal.

## Posicionamiento

WOD Explorer es una herramienta personal de exploración y seguimiento de entrenamientos de CrossFit. Combina un catálogo público mantenido por el sistema con una zona privada para los WOD y resultados de cada usuario.

No es una red social, una plataforma de boxes ni un sistema de competición en esta versión.

## Contexto operativo

El frontend se desarrolla con React y TypeScript. El backend se implementará con Java y Spring Boot cuando la especificación correspondiente lo solicite. La persistencia principal utiliza MySQL 8.4 y se ejecuta mediante Docker Compose.

Los detalles de arquitectura, configuración y ejecución se definen en los archivos `AGENTS.md` específicos de cada área y en la configuración real del proyecto. No se deben presentar como existentes componentes que todavía no estén implementados.

## Capacidades y restricciones

### Capacidades actuales de dominio

- Consultar, buscar y filtrar ejercicios del catálogo público.
- Consultar, buscar y filtrar WOD genéricos públicos.
- Crear, modificar y eliminar WOD personales usando solo ejercicios existentes en el catálogo.
- Registrar varios resultados personales para un mismo WOD.
- Consultar el historial personal y las mejores marcas derivadas de los resultados.

### Restricciones

- Los WOD genéricos son públicos y los mantiene el sistema; los usuarios no pueden modificarlos.
- Los WOD personales y los resultados son privados y pertenecen a un único usuario.
- El orden de los ejercicios forma parte de la definición de un WOD y un ejercicio puede repetirse en posiciones distintas.
- El historial y las mejores marcas se derivan de los resultados; no deben convertirse en una segunda fuente de verdad.
- Los resultados deben conservar el significado de la modalidad del WOD; no se deben reducir a una única cifra genérica.
- Modificar o eliminar un WOD no puede alterar silenciosamente el significado de resultados históricos.
- Las decisiones aún pendientes en `DOMAIN.md` no deben resolverse por intuición durante la implementación.

### Fuera de alcance en esta versión

- Comunidades o boxes.
- Ligas, clasificaciones o competiciones.
- Seguimiento entre usuarios.
- Comentarios, reacciones o valoraciones.
- Publicación o descubrimiento de WOD creados por otros usuarios.
- Edición del catálogo por usuarios.
- Resultados públicos.
- Planes de entrenamiento o programación de sesiones.

## Compromisos de marca

- Nombre oficial: WOD Explorer 2.0.
- Terminología de dominio: WOD, ejercicio, WOD genérico, WOD personal, resultado, historial y mejor marca.
- La interfaz y la documentación del proyecto se redactan en español, salvo que una especificación establezca otra necesidad.

No hay otros compromisos de marca definidos todavía.

## Fuente de verdad y evidencia

- `DOMAIN.md` define el dominio funcional, sus reglas e invariantes.
- MySQL 8.4 será la fuente de verdad persistente de los datos una vez que cada funcionalidad se migre a la base de datos.
- Los archivos JSON existentes pertenecen a la versión inicial y no deben usarse como fuente de verdad después de esa migración.
- Los recursos privados se autorizan por propiedad del usuario, no solo por conocer su identificador.
- Las especificaciones activas dentro de `specs/` definen el alcance de cada implementación concreta.

## Principios del producto

- Priorizar recorridos simples para explorar, crear WOD y registrar resultados.
- Mantener la privacidad de los WOD personales y los resultados como comportamiento base.
- Preservar una única fuente de verdad para los datos del dominio.
- Conservar la trazabilidad histórica de los resultados.
- No introducir funcionalidades sociales, infraestructura o dependencias fuera del alcance de la especificación activa.
- No presentar como existente una funcionalidad que todavía no se haya implementado.

## Accesibilidad e inclusión

La interfaz debe usar HTML semántico cuando corresponda, permitir navegación mediante teclado, mantener el foco visible y proporcionar labels, mensajes de error, contraste y legibilidad adecuados. Debe funcionar correctamente en los tamaños de pantalla que el proyecto declare como soportados.

No se ha definido todavía una versión ni nivel objetivo de WCAG.
