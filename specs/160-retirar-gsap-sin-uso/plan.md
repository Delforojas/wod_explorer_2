# Plan técnico

## Enfoque

Auditoría read-only primero; mutación mínima después (solo si procede).

## 1. Auditoría de consumidores

Búsquedas sobre el repositorio, excluyendo `node_modules/` y `dist/`:

- Referencias textuales `gsap` en `frontend/src`, `frontend/index.html`,
  configuración, estilos, assets y documentación del proyecto.
- Imports estáticos (`from "gsap"`, `require("gsap")`).
- Imports dinámicos (`import(...)`) y referencias construidas por cadena.
- Referencias globales (`window.gsap`, `globalThis.gsap`, `TweenMax`,
  `TimelineLite`).
- Archivos trackeados con nombre relacionado (`git ls-files`).
- Dependencias inversas en el lockfile y árbol instalado (`npm ls gsap`).

Criterio de decisión:

- Sin consumidores → retirar.
- Con cualquier consumidor real → conservar y documentar.

## 2. Retirada (solo si no hay consumidores)

- Ejecutar `npm uninstall gsap` dentro de `frontend/`.
- Verificar que `package.json` ya no declara `gsap` y que
  `package-lock.json` no contiene la entrada de `node_modules/gsap` ni la
  dependencia raíz.
- Verificar `npm ls gsap` (debe fallar por ausencia de dependencia directa) y
  que no quedan referencias en el código.

## 3. Verificación

- `npm run lint`.
- `npm run test` (32 archivos, 142 tests como referencia previa).
- `npm run build` (tsc + vite).
- `git diff --check`.
- Revisión del diff completo: solo `frontend/package.json`,
  `frontend/package-lock.json` y el SDD/documentación de la Issue.
- Comprobar que no se modifican componentes, estilos, animaciones ni bundler.

## 4. Evidencia y documentación

Registrar en `specs/160-retirar-gsap-sin-uso/audit.md`:

- comandos de búsqueda ejecutados y resultados;
- árbol de dependencias observado;
- decisión tomada y su justificación;
- verificaciones ejecutadas con sus resultados reales.

## Riesgos y mitigación

- **Consumidor oculto (dinámico/global):** mitigado con búsquedas de imports
  dinámicos, cadenas y globales, además de `git ls-files`.
- **Lockfile incoherente:** mitigado usando `npm uninstall` y verificando el
  diff del lockfile.
- **Regresión visual:** GSAP no participa en el render actual (la animación usa
  canvas + `requestAnimationFrame`); build y tests deben pasar. La revisión
  visual manual queda como validación del usuario.
- **Dependencia transitiva:** si otra dependencia requiriera `gsap`, el
  lockfile lo mantendría como transitiva; se documentaría y no se tocaría.
