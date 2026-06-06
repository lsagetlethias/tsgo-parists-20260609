# gotchas/

Pièges de migration TS 6 → TS 7 (tsgo), **volontairement cassés** et **vérifiés
le 2026-06-05** sur `@typescript/native-preview 7.0.0-dev.20260605.1`.

Ce dossier n'est référencé par **aucun** projet de la solution : il ne casse
donc jamais `pnpm typecheck` ni `pnpm typecheck:tsgo` à la racine (le build par
défaut reste vert). On le lance **à la main** pendant la démo.

> Ci-dessous, tsc et tsgo pointent le **même problème** ; les codes peuvent
> différer (cf. tableau, ce sont des cas de bord). tsgo répond simplement quasi
> instantanément.

| Config / fichier | Catégorie | Diagnostic vérifié |
|---|---|---|
| `esModuleInterop-removed.tsconfig.json` | Breaking change | `TS5108` (tsgo) / `TS5107` (tsc) · option **supprimée** |
| `baseUrl-removed.tsconfig.json` | Breaking change | `TS5102`+`TS5090` (tsgo) / `TS5101` (tsc) · `baseUrl` **retiré** |
| `const-enum.ts` (via `tsconfig.json`) | Type-stripping | `TS1294` `const enum` interdit en `erasableSyntaxOnly` |
| `jsdoc-template.ts` | Parity watch | bug d'emit **corrigé** dans ce build · voir repro plus bas |

## Commandes de démo

```bash
# 1) Deux options supprimées en TS 7 (erreurs de config -> chacune à part)
npx tsc  -p gotchas/esModuleInterop-removed.tsconfig.json   # TS5107 (déprécié)
npx tsgo -p gotchas/esModuleInterop-removed.tsconfig.json   # TS5108 (supprimé)
npx tsgo -p gotchas/baseUrl-removed.tsconfig.json           # TS5102 + TS5090

# 2) const enum vs type-stripping
npx tsc  -p gotchas/tsconfig.json   # TS1294
npx tsgo -p gotchas/tsconfig.json   # TS1294, en ~0s
```

## Repro du bug JSDoc `@template` (parity watch)

⚠️ **Tranché le 2026-06-05** : ce bug est **corrigé**. Vérifié sur une matrice de
7 cas (simple, multi-params, `@template {string}` contraint, `[T=number]` par
défaut, `@typedef` générique, classe générique, méthode générique) · `tsc` ET
`tsgo` conservent le générique partout. Seuls écarts restants : **cosmétiques**
(`tsgo` ajoute `declare`, ordonne les membres autrement). Ce n'est donc **plus un
gotcha live** : démo 2 s'appuie sur `esModuleInterop` / `baseUrl` / `const enum`.
La repro ci-dessous sert à (a) re-vérifier le jour J, (b) justifier qu'on diffe
les `.d.ts` en CI (l'emit reste une surface à part).

En `.ts`, `@template` est ignoré (TS utilise le vrai générique). La divergence
ne se voyait que sur un **`.js` avec `checkJs`** :

1. `repro.js` :

   ```js
   /**
    * @template T
    * @param {T} value
    * @returns {T}
    */
   export function identity(value) {
     return value;
   }
   ```

2. `repro.tsconfig.json` :

   ```json
   {
     "compilerOptions": {
       "allowJs": true,
       "checkJs": true,
       "declaration": true,
       "emitDeclarationOnly": true,
       "module": "nodenext",
       "outDir": "dist-repro"
     },
     "include": ["repro.js"]
   }
   ```

3. Compare les `.d.ts` :

   ```bash
   npx tsc  -p repro.tsconfig.json && cat dist-repro/repro.d.ts
   npx tsgo -p repro.tsconfig.json && cat dist-repro/repro.d.ts
   ```

   - Aujourd'hui : les deux sortent `export declare function identity<T>(value: T): T;`
   - Anciens previews : `tsgo` pouvait sortir `value: any` (générique perdu).

**Leçon, valable même corrigé** : l'emit de déclarations est la surface la plus
risquée de la migration. D'où le **double-binaire** : `tsgo` type-checke (gate
rapide), `tsc --emitDeclarationOnly` produit les `.d.ts` publiés. Et on diffe
les `.d.ts` en CI quand on adopte tsgo.
