# Auditoría de uso de GSAP (#160)

## Estado de partida

- `main` @ `a715065e42b28eb70e6c2ee539b8c94f49524e5a`, árbol limpio.
- Integradas en `main`: #157 (`d8f4a2d`), #158 (`d4823c0`), #159 (`a715065`).
- `frontend/package.json`: `gsap ^3.15.0` en `dependencies`.

## Búsquedas ejecutadas

Sobre el repositorio, excluyendo `node_modules/`, `dist/` y el lockfile:

```text
grep -rniI --exclude-dir=node_modules --exclude-dir=dist --exclude=package-lock.json 'gsap' .
```

Resultado: solo `frontend/package.json:14` y el informe histórico de #157.
Ninguna referencia en `frontend/src`, `index.html`, CSS, configuración ni assets.

Comprobaciones adicionales:

```text
git ls-files | grep -i gsap        → sin archivos
grep -rnI 'import(' frontend/src   → sin imports dinámicos
grep -rniI 'window.(gsap|TweenMax)|globalThis.gsap|TweenLite|TimelineLite' frontend
                                    → sin referencias globales
```

Árbol de dependencias antes de la retirada:

```text
npm ls gsap --all
frontend@0.0.0
└── gsap@3.15.0
```

El lockfile contenía únicamente la entrada raíz y `node_modules/gsap`; no había
dependencias inversas que lo requirieran.

## Decisión

Sin consumidores estáticos, dinámicos, globales, en assets ni en tooling, y sin
dependencias inversas: se retira la dependencia.

## Retirada

Ejecutado dentro de `frontend/`:

```text
npm uninstall gsap
```

Estado posterior:

```text
dependencies: react, react-dom, react-router-dom, zod
grep '"gsap"' package-lock.json → sin referencias
npm ls gsap --all               → (empty)
```

## Conclusión

`gsap` era una dependencia directa sin uso real. La retirada deja
`package.json` y `package-lock.json` coherentes mediante npm, sin cambios en
animaciones, componentes, estilos ni bundler.
