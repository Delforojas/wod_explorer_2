# Pre-Push Check

Valida que la rama pueda publicarse de forma segura en el repositorio remoto.

Este check NO realiza el push.

## 1. Comprobar el remoto

Comprueba que:

- existe un remoto válido;

- puede determinarse de forma inequívoca el remoto correspondiente;

- la rama actual puede publicarse en ese remoto.

Si no puede determinarse con seguridad el remoto:

**FAIL.**

## 2. Comprobar el upstream

Comprueba si la rama actual tiene upstream configurado.

Si existe upstream:

- verifica que corresponde a la rama remota esperada;

- verifica que el push puede realizarse sin sobrescribir trabajo remoto de forma insegura.

Si la rama todavía no tiene upstream:

- NO lo consideres un error;

- permite que el workflow posterior lo configure durante el primer push.

## 3. Comprobar que el push es seguro

El push debe poder realizarse sin:

- `--force`;

- `--force-with-lease`;

- rebase;

- amend;

- reescritura del historial;

- sobrescritura de trabajo remoto.

Si alguna de estas operaciones fuese necesaria:

**FAIL.**

## 4. Guardrails

Durante este check:

- NO hagas push;

- NO cambies de rama;

- NO hagas commit;

- NO hagas amend;

- NO hagas rebase;

- NO modifiques el historial Git;

- NO configures automáticamente el upstream.

## 5. Resultado

### PASS

Devuelve `PASS` si:

- existe un remoto válido;

- el upstream existente es correcto o todavía no existe;

- la rama puede publicarse mediante un push normal y seguro.

Conserva para el workflow:

- remoto;

- rama actual;

- upstream actual, si existe;

- si será necesario configurar upstream durante el push.

### FAIL

Devuelve `FAIL` si el push no puede realizarse de forma segura.

Indica:

- qué comprobación ha fallado;

- la evidencia observada;

- qué condición impide realizar el push.

No intentes resolver el problema automáticamente.
