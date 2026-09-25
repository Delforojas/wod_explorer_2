# WOD Explorer 2.0 — Modelo de dominio

## 1. Propósito del producto

WOD Explorer es una aplicación para consultar entrenamientos de CrossFit, crear WOD personalizados y registrar resultados personales.

El núcleo del producto debe permitir dos formas de uso:

- Sin autenticación: explorar el catálogo público de ejercicios y los WOD genéricos proporcionados por la aplicación.
- Con autenticación: además de consultar el contenido público, crear WOD propios, registrar resultados y consultar el historial y las mejores marcas personales.

Este documento define el dominio funcional. No prescribe una tecnología, una base de datos ni una interfaz concreta.

## 2. Límites del dominio actual

El dominio actual incluye:

- usuarios;
- catálogo de ejercicios;
- WOD genéricos;
- WOD creados por usuarios;
- composición ordenada de un WOD;
- resultados personales de WOD;
- historial personal;
- mejores marcas personales.

Quedan fuera de esta primera versión del dominio:

- comunidades o boxes;
- ligas y clasificaciones;
- seguimiento entre usuarios;
- comentarios, reacciones o valoraciones;
- publicación y descubrimiento de WOD creados por otros usuarios;
- edición del catálogo por usuarios;
- resultados públicos;
- planes de entrenamiento o programación de sesiones.

Estas capacidades podrán añadirse más adelante como módulos separados sin alterar las reglas fundamentales definidas aquí.

## 3. Actores

### Visitante

Persona que utiliza la aplicación sin iniciar sesión.

Puede:

- consultar, buscar y filtrar ejercicios del catálogo;
- consultar, buscar y filtrar WOD genéricos;
- ver el detalle y la composición de un WOD genérico.

No puede:

- crear WOD;
- registrar resultados;
- acceder a historial o mejores marcas;
- consultar datos privados de ningún usuario.

### Usuario registrado

Persona autenticada y propietaria de sus datos personales.

Puede realizar todas las acciones de un visitante y, además:

- crear tantos WOD personales como quiera;
- modificar y eliminar únicamente sus propios WOD;
- registrar resultados para WOD genéricos o propios;
- consultar su historial personal;
- consultar sus mejores marcas.

## 4. Contextos funcionales

### 4.1. Identidad y acceso

Se ocupa del registro, autenticación e identificación del usuario propietario de cada recurso privado.

La información personal solicitada debe limitarse a la estrictamente necesaria para registrar e identificar la cuenta. Los datos de perfil ampliados no forman parte del dominio actual.

### 4.2. Catálogo de ejercicios

Contiene los ejercicios disponibles para consultar y para componer WOD.

Los ejercicios pertenecen a un catálogo común gestionado por el sistema. Los usuarios no pueden crear ejercicios libres al construir un WOD.

### 4.3. Catálogo de WOD genéricos

Contiene entrenamientos públicos definidos por el sistema.

Los WOD genéricos pueden consultarse sin iniciar sesión, pero ningún usuario puede crearlos, modificarlos ni eliminarlos.

### 4.4. WOD personales

Permite a cada usuario crear y gestionar sus propios entrenamientos utilizando exclusivamente ejercicios existentes en el catálogo.

Los WOD personales son privados. En esta versión no se comparten ni aparecen en búsquedas de otros usuarios.

### 4.5. Seguimiento de resultados

Permite registrar la ejecución de un WOD y consultar la evolución personal mediante historial y mejores marcas.

Cada resultado pertenece exclusivamente al usuario que lo registró y es privado.

## 5. Entidades y conceptos principales

### 5.1. Usuario

Representa una cuenta registrada.

Responsabilidades de dominio:

- ser propietario de sus WOD personales;
- ser propietario de sus resultados;
- acceder únicamente a su información privada.

La identidad técnica, las credenciales y los mecanismos de sesión pertenecen al sistema de autenticación, no al modelo deportivo.

### 5.2. Ejercicio

Representa un movimiento o actividad que puede formar parte de un WOD.

Atributos conceptuales mínimos:

- identificador;
- nombre;
- categoría;
- tipo de medición.

La categoría permite organizar y filtrar el catálogo, por ejemplo:

- halterofilia;
- gimnasia;
- strongman;
- cardio;
- otros.

El tipo de medición expresa cómo se describe o evalúa normalmente el ejercicio, por ejemplo:

- peso;
- repeticiones;
- tiempo;
- distancia;
- peso y distancia;
- otro.

Reglas:

- el ejercicio debe pertenecer al catálogo para poder añadirse a un WOD;
- su nombre debe permitir identificarlo sin ambigüedad dentro del catálogo;
- un usuario no puede modificar el ejercicio desde la creación de un WOD.

### 5.3. WOD

Representa un entrenamiento compuesto por uno o más ejercicios ordenados.

Existen dos clases según su origen:

- **Genérico:** creado y mantenido por el sistema, público e inmutable para los usuarios.
- **Personal:** creado por un usuario, privado y gestionable únicamente por su propietario.

Atributos conceptuales mínimos:

- identificador;
- nombre;
- modalidad o tipo de WOD;
- nivel, cuando proceda;
- límite de tiempo, cuando proceda;
- número de rondas, cuando proceda;
- origen: genérico o personal;
- propietario, obligatorio solo si es personal;
- fecha de creación;
- composición ordenada.

El nombre de un WOD no tiene que ser único. Distintos WOD pueden compartir el mismo nombre, incluso dentro de la colección de un usuario.

### 5.4. Ejercicio de WOD

Representa la participación de un ejercicio concreto dentro de un WOD. No es un ejercicio nuevo: referencia uno que ya existe en el catálogo.

Atributos conceptuales mínimos:

- ejercicio referenciado;
- posición;
- prescripción aplicable, como repeticiones, distancia, carga o duración cuando corresponda.

Reglas:

- un WOD debe contener al menos un ejercicio;
- el orden forma parte de la definición del WOD y debe conservarse;
- un mismo ejercicio puede aparecer más de una vez en un WOD si ocupa posiciones diferentes;
- cada elemento debe referenciar un ejercicio existente en el catálogo;
- eliminar un elemento de la composición no elimina el ejercicio del catálogo.

### 5.5. Resultado de WOD

Representa una ejecución realizada por un usuario sobre un WOD genérico o uno de sus propios WOD.

Atributos conceptuales mínimos:

- identificador;
- usuario propietario;
- WOD realizado;
- fecha y hora de realización;
- resultado según la modalidad del WOD;
- estado de finalización, cuando sea necesario distinguir un WOD completado de uno no completado;
- las notas no forman parte de la primera versión.

El resultado puede adoptar distintas formas según el tipo de WOD, por ejemplo:

- tiempo total en un WOD `FOR_TIME`;
- rondas y repeticiones en un `AMRAP`;

- repeticiones o carga alcanzada en un `EMOM`, si la definición concreta del entrenamiento lo requiere.

No debe forzarse una única cifra genérica que pierda el significado deportivo del resultado.

Las modalidades iniciales admitidas son `FOR_TIME`, `AMRAP` y `EMOM`. No se admiten modalidades adicionales hasta que exista una decisión explícita que defina su resultado y comparación.

- En `FOR_TIME`, un resultado completado contiene un tiempo positivo. Un resultado no completado puede conservar el progreso alcanzado mediante los campos de progreso definidos para la versión ejecutada. Solo los resultados completados y compatibles participan en la mejor marca.
- En `AMRAP`, un resultado contiene rondas completas y repeticiones adicionales no negativas. La comparación se realiza primero por rondas y después por repeticiones adicionales.
- En `EMOM`, un resultado conserva la ronda alcanzada y, cuando proceda, el elemento y la métrica de progreso alcanzados. Solo se comparan resultados compatibles de la misma versión y regla de progreso.

Los campos de resultado deben ser compatibles con la modalidad del WOD.

Reglas:

- solo un usuario autenticado puede registrar un resultado;
- el usuario solo puede registrar un resultado a su propio nombre;
- se pueden registrar varios intentos para el mismo WOD;
- registrar un nuevo intento no sustituye los anteriores;
- el resultado debe ser compatible con la modalidad del WOD;
- todos los resultados son personales y privados;
- un resultado es inmutable después de registrarse y no puede modificarse ni corregirse;
- un usuario solo puede consultar y eliminar sus propios resultados;
- eliminar un resultado no elimina ni modifica los demás intentos.

### 5.6. Historial personal

Es una vista derivada de los resultados del usuario, no una entidad que deba mantenerse duplicada.

Debe permitir consultar cronológicamente los intentos registrados y, como mínimo:

- identificar el WOD;
- conocer la fecha del intento;
- ver el resultado obtenido;
- distinguir entre WOD genérico y personal.

Puede ofrecer búsqueda, filtrado y ordenación sin cambiar la propiedad ni la privacidad de los datos.

### 5.7. Mejor marca personal

Es un valor derivado de los resultados válidos de un usuario para un WOD determinado.

No constituye un resultado adicional ni debe introducir una segunda fuente de verdad. Si se crea o elimina un resultado, la mejor marca se deriva de nuevo a partir de los resultados existentes.

La comparación depende de la modalidad:

- en `FOR_TIME`, normalmente gana el menor tiempo entre intentos completados equivalentes;
- en `AMRAP`, gana la mayor cantidad de trabajo, comparando primero rondas completas y después repeticiones adicionales;
- no se calculan mejores marcas para modalidades no admitidas explícitamente.

Solo deben compararse resultados compatibles del mismo WOD. No se agregan resultados de WOD distintos aunque compartan nombre.

## 6. Agregados y propiedad

### Agregado WOD

El WOD es la raíz del agregado formado por:

- WOD;
- composición ordenada de ejercicios.

La composición se crea, modifica y valida a través del WOD. No debe quedar un elemento de composición sin su WOD.

### Agregado Resultado

El resultado es una raíz independiente que referencia:

- al usuario propietario;
- al WOD realizado y a la versión concreta ejecutada.

El histórico de resultados debe conservar su significado aunque el WOD personal cambie posteriormente. Cada modificación de un WOD personal con resultados crea una nueva versión; los resultados existentes mantienen la referencia a la versión ejecutada y no se alteran retroactivamente. Un WOD personal con resultados se archiva en lugar de eliminarse físicamente y no admite nuevos resultados mientras esté archivado.

### Propiedad de los recursos

| Recurso               | Propietario             | Visibilidad | Quién puede modificarlo  |
| --------------------- | ----------------------- | ----------- | ------------------------ |
| Ejercicio de catálogo | Sistema                 | Pública     | Sistema                  |
| WOD genérico          | Sistema                 | Pública     | Sistema                  |
| WOD personal          | Usuario creador         | Privada     | Su propietario           |
| Resultado             | Usuario que lo registra | Privada     | Nadie; su propietario puede eliminarlo |
| Historial             | Derivado del usuario    | Privada     | No se edita directamente |
| Mejor marca           | Derivada del usuario    | Privada     | No se edita directamente |

## 7. Reglas de negocio consolidadas

1. Cualquier persona puede consultar ejercicios y WOD genéricos sin autenticarse.
2. Los WOD genéricos los proporciona el sistema y los usuarios no pueden crearlos ni modificarlos.
3. Un usuario autenticado puede crear tantos WOD personales como quiera.
4. Los WOD personales solo pueden componerse con ejercicios existentes en el catálogo.
5. El orden de los ejercicios de un WOD es significativo y debe conservarse.
6. El nombre de un WOD no tiene que ser único.
7. Cada WOD personal pertenece a un único usuario.
8. Un usuario solo puede modificar o eliminar sus propios WOD.
9. Un usuario puede registrar varios resultados para el mismo WOD.
10. Cada resultado pertenece a un único usuario y nunca es público.
11. Un resultado es inmutable después de registrarse; solo su propietario puede eliminarlo.
12. El usuario solo puede acceder a su historial y a sus mejores marcas.
13. El historial y las mejores marcas se derivan de los resultados; no se editan ni almacenan como segunda fuente de verdad.
14. Los datos personales del usuario se limitan a los necesarios para el registro y la identificación.
15. El acceso a un recurso privado debe validarse por propiedad, no solo por conocer su identificador.
16. La eliminación o modificación de un WOD no puede falsear el significado de resultados históricos ya registrados.

## 8. Invariantes

Las siguientes condiciones deben cumplirse siempre:

- un WOD personal tiene propietario y un WOD genérico no depende de un usuario propietario;
- un WOD nunca existe con una composición vacía una vez publicado o disponible para registrar resultados;
- todas las posiciones de la composición permiten reconstruir un orden determinista;
- cada ejercicio referenciado existe en el catálogo;
- cada resultado tiene un usuario, un WOD y una fecha de realización;
- un resultado no puede modificarse después de registrarse;
- la representación del resultado coincide con la modalidad del WOD;
- ningún usuario puede leer o alterar recursos privados de otro usuario;
- una mejor marca siempre puede justificarse mediante un resultado existente y válido.

## 9. Búsqueda y filtros

La búsqueda y los filtros son capacidades de consulta, no entidades del dominio.

El catálogo de ejercicios debe poder consultarse al menos por:

- texto o nombre;
- categoría;
- tipo de medición.

Los WOD genéricos y la colección personal del usuario deben poder consultarse al menos por:

- texto o nombre;
- modalidad;
- nivel, cuando exista;
- origen, cuando se muestren conjuntamente.

El historial personal debe poder consultarse al menos por:

- WOD;
- intervalo de fechas;
- modalidad u origen cuando resulte útil.

Los filtros no deben permitir que aparezca información privada de otros usuarios.

## 10. Casos de uso esenciales

### Públicos

- listar ejercicios;
- buscar y filtrar ejercicios;
- ver el detalle de un ejercicio;
- listar WOD genéricos;
- buscar y filtrar WOD genéricos;
- ver el detalle ordenado de un WOD genérico.

### Privados

- crear un WOD personal;
- listar los WOD personales propios;
- ver un WOD personal propio;
- modificar un WOD personal propio;
- eliminar un WOD personal propio;
- registrar un resultado en un WOD genérico;
- registrar un resultado en un WOD personal propio;
- consultar y eliminar un resultado propio;
- consultar el historial propio;
- consultar las mejores marcas propias.

## 11. Decisiones pendientes que no deben asumirse

Antes de implementar funcionalidades que dependan de ellas, habrá que decidir explícitamente:

- cómo se gestionan las versiones del catálogo de ejercicios;

La única decisión pendiente de esta sección es cómo se gestionan las versiones del catálogo de ejercicios. No debe resolverse por intuición durante la implementación.

## 12. Evolución futura

Una futura capa social podrá incorporar WOD compartidos, comunidades o boxes, ligas y clasificaciones. Para mantener el dominio limpio:

- la privacidad actual seguirá siendo la opción base;
- publicar un WOD será una acción explícita diferente de crearlo;
- una liga referenciará resultados válidos, pero no se convertirá en propietaria de ellos;
- la clasificación se derivará de reglas de competición específicas;
- pertenecer a una comunidad no concederá acceso automático a todo el historial privado de sus miembros.

Estas extensiones no forman parte del alcance actual de WOD Explorer 2.0.

## 13. Glosario

- **Ejercicio:** movimiento o actividad disponible en el catálogo.
- **WOD:** entrenamiento del día, definido como una composición ordenada de ejercicios y reglas de ejecución.
- **WOD genérico:** WOD público creado y mantenido por el sistema.
- **WOD personal:** WOD privado creado por un usuario.
- **Resultado:** registro de una ejecución concreta de un WOD por un usuario.
- **Historial:** consulta cronológica de los resultados personales.
- **Mejor marca:** mejor resultado derivado para un usuario y un WOD según una regla de comparación válida.
- **Propietario:** usuario con autorización para consultar y gestionar un recurso privado.
