# SDD: Decisiones de dominio para versiones y resultados WOD

## Objetivo

Fijar las reglas funcionales de las modalidades iniciales, la composición histórica de los WOD, los resultados personales y las mejores marcas derivadas antes de implementar persistencia o API para estos flujos.

## Alcance

- Admitir inicialmente las modalidades `FOR_TIME`, `AMRAP` y `EMOM`.
- Definir la representación y validación del resultado de cada modalidad.
- Mantener los resultados inmutables después de su creación.
- Permitir múltiples intentos y eliminar únicamente resultados propios.
- Preservar la versión exacta del WOD ejecutado.
- Archivar un WOD personal con resultados en lugar de eliminarlo físicamente.
- Derivar historial y mejores marcas desde los resultados existentes.
- Definir prescripciones y la política inicial de notas.

## Decisiones funcionales

### Modalidades y resultados

- `FOR_TIME`: un resultado completado contiene `time_seconds` positivo. Un resultado no completado puede conservar el progreso alcanzado mediante los campos de progreso definidos para la versión ejecutada. Solo los resultados completados y compatibles participan en la mejor marca; gana el menor tiempo.
- `AMRAP`: un resultado contiene `amrap_rounds` y `amrap_extra_reps`, ambos no negativos. La comparación es lexicográfica por rondas completas y después repeticiones adicionales; gana el mayor trabajo.
- `EMOM`: un resultado conserva la ronda alcanzada y, cuando proceda, el elemento y la métrica de progreso alcanzados. La comparación solo se realiza entre resultados compatibles de la misma versión y regla de progreso; gana el mayor progreso válido.
- No se admiten modalidades adicionales hasta que exista una decisión explícita que defina su resultado y comparación.
- Los campos de resultado deben ser compatibles con la modalidad y no deben reducir modalidades distintas a una cifra genérica.

### Prescripciones

Cada elemento de la composición debe referenciar un ejercicio existente y contener al menos una prescripción aplicable entre repeticiones, carga, distancia o duración. La posición es obligatoria y determina el orden; el mismo ejercicio puede repetirse en posiciones diferentes.

### Inmutabilidad, propiedad e historial

- Registrar un resultado crea un intento independiente y append-only.
- Un resultado no puede modificarse ni corregirse después de registrarse.
- Solo el usuario propietario puede consultar o eliminar sus resultados.
- La eliminación de un resultado no elimina ni modifica los demás intentos.
- El resultado referencia la versión concreta del WOD ejecutado. Las modificaciones posteriores de un WOD personal crean una nueva versión y no alteran el significado de resultados anteriores.
- Un WOD personal con resultados no se elimina físicamente; se archiva conservando sus versiones y resultados. Un WOD archivado no admite nuevos resultados.

### Historial y mejores marcas

- El historial es una consulta derivada y muestra los intentos existentes del usuario, ordenados cronológicamente, con WOD, fecha, resultado y origen.
- La mejor marca es una consulta derivada de resultados válidos y compatibles del mismo WOD/versionado aplicable.
- No existe una entidad ni columna de mejor marca que actúe como segunda fuente de verdad.
- Crear un resultado puede cambiar la mejor marca derivada.
- Eliminar un resultado obliga a derivar de nuevo la mejor marca a partir de los intentos restantes.

### Notas

Las notas de resultado quedan fuera de la primera versión para no ampliar el modelo hasta que exista una decisión específica que las respalde.

## Criterios de aceptación

- [ ] `DOMAIN.md` refleja las modalidades iniciales y las reglas de resultado de `FOR_TIME`, `AMRAP` y `EMOM`.
- [ ] `DOMAIN.md` establece que los resultados son inmutables y solo pueden eliminarse por su propietario.
- [ ] `DOMAIN.md` conserva los múltiples intentos, la privacidad y la autorización por ownership.
- [ ] `DOMAIN.md` exige conservar la versión concreta ejecutada y evita alterar silenciosamente el historial.
- [ ] `DOMAIN.md` define el archivo de WOD personales con resultados.
- [ ] `DOMAIN.md` define historial y mejores marcas como vistas derivadas, incluyendo el efecto de crear o eliminar resultados.
- [ ] `DOMAIN.md` documenta las prescripciones iniciales y deja las notas fuera de alcance.

## Restricciones

- No se implementan entidades, migraciones, endpoints, autenticación ni cálculos en esta Issue.
- No se añade `exercise_results` al dominio; sigue fuera de alcance.
- No se resuelve el versionado del catálogo de ejercicios, que permanece como decisión posterior.
- La documentación debe mantenerse en español y usar la terminología de `DOMAIN.md`.
