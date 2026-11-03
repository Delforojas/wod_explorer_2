# SDD: Auditar y retirar GSAP si está realmente sin uso (#160)

## Objetivo

Determinar con evidencia verificable si `gsap` tiene consumidores reales en el
frontend y, solo si se confirma que no los tiene, retirarlo usando el gestor de
paquetes y el lockfile existentes.

## Contexto

- La auditoría #157 (F5) detectó `gsap ^3.15.0` declarado en
  `frontend/package.json` sin importaciones en `src/`.
- La ausencia de imports no demuestra por sí sola que sea seguro retirarlo:
  hay que revisar imports estáticos y dinámicos, referencias globales,
  integraciones, tooling y assets.
- Estado de partida: `main` @ `a715065`, con #157 (`d8f4a2d`), #158 (`d4823c0`)
  y #159 (`a715065`) integradas; árbol limpio.

## Alcance

- Auditar el repositorio completo (excluyendo `node_modules/` y `dist/`) en
  busca de consumidores de `gsap`.
- Verificar el lockfile y el árbol de dependencias instalado.
- Si no hay consumidores: retirar `gsap` con `npm uninstall gsap` en
  `frontend/`, manteniendo `package.json` y `package-lock.json` coherentes.
- Si hay consumidores: conservar la dependencia y documentar la evidencia.
- Documentar el diagnóstico con referencias concretas al repositorio.

## Fuera de alcance

- Cambiar animaciones, componentes, estilos, CSS o configuración del bundler.
- Sustituir GSAP por otra librería.
- Refactorizar `PulsarGridBackground` u otros componentes.
- Actualizar dependencias no relacionadas.
- Tocar backend, Docker o documentación ajena a la Issue.

## Comportamiento esperado

- Si no existen consumidores, `gsap` deja de estar en `dependencies`, el
  lockfile no contiene la entrada de `gsap` y `npm ls gsap` no lo resuelve como
  dependencia directa.
- El resto de dependencias, scripts y configuración permanecen sin cambios.
- Lint, tests y build siguen pasando; no hay regresiones visuales ni
  funcionales atribuibles a la retirada.

## Criterios de aceptación

- [ ] Diagnóstico de uso real con referencias al repositorio.
- [ ] Dependencia y lockfile coherentes, o decisión fundada de mantenerla.
- [ ] `npm run lint`, `npm run test`, `npm run build` y `git diff --check`
      superados.
- [ ] Sin regresiones visuales ni funcionales.
- [ ] Sin cambios en animaciones, componentes, estilos ni bundler.

## Restricciones

- Usar el gestor de paquetes y el lockfile existentes; nada de edición manual
  inconsistente del lockfile.
- Cambios incrementales y limitados a la Issue.
- No ampliar alcance ni mezclar otras issues.
- Detenerse para aprobación del usuario antes de commit, push, PR, merge o
  cierre.
