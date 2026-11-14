# Comprobar espacios en cambios preparados

Antes de crear un commit, comprueba los errores de espacios introducidos en los
cambios que ya están preparados:

```bash
git diff --cached --check
```

El comando revisa el diff del índice y muestra los errores de espacios que Git
detecta. De forma predeterminada, incluye espacios al final de una línea y un
espacio seguido inmediatamente de una tabulación dentro de la sangría inicial.
La configuración `core.whitespace` puede cambiar qué errores se consideran.

Si el comando no muestra mensajes y termina con código de salida `0`, Git no ha
detectado esos errores en los cambios preparados. Si encuentra alguno, muestra
su ubicación y termina con un código de salida distinto de cero.

Esta comprobación solo revisa el formato de espacios de los cambios preparados.
No ejecuta ni sustituye las pruebas funcionales, de integración o de calidad
del proyecto.
