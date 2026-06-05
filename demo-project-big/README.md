# demo-project-big — microsoft/vscode

Le "gros projet" de la **démo 1** (install + comparaison de vitesse).

## Quel repo, quel commit, pourquoi

| | |
|---|---|
| **Repo** | [`microsoft/vscode`](https://github.com/microsoft/vscode) |
| **Pin** | tag `1.123.0` (variable `TAG` dans `setup.sh`) |
| **Cible tsc** | `src/tsconfig.json` (`--noEmit`) |

**Pourquoi vscode plutôt qu'un autre ?**

- C'est **le** benchmark officiel de l'équipe TypeScript : **78s → 7.5s**
  (~10.5x) sur leur matériel.
  <!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->
- Il est **reconnaissable en une fraction de seconde** dans une salle claire :
  les gens lèvent les yeux, voient « vscode », et comprennent l'enjeu sans
  explication. (Sentry/Playwright n'ont pas cet effet.)
- ~1.5M lignes : on dépasse **très** largement le seuil des 30s de `tsc` cold
  exigé pour que le speedup soit spectaculaire.

> tldraw (issue [#7574](https://github.com/tldraw/tldraw/issues/7574), migration
> tsgo réelle et ouverte) est gardé comme **mention orale** dans la démo 2
> (migration), pas comme projet de build.

## Temps de setup attendu

| Étape | Durée approx. (réseau correct, M-series) |
|---|---|
| `git clone --depth 1` | 30 s – 2 min |
| `npm ci` (Electron + natifs) | **10 – 20 min** |
| install tsgo | < 10 s |

> ⚠️ À faire **bien avant** le talk, pas en live. Prévoir ~5 Go de disque.

## Lancer

```bash
./setup.sh
# puis, depuis demo-project-big/vscode/ :
rm -f src/*.tsbuildinfo
time npx tsc  -p src/tsconfig.json --noEmit     # référence (≥ 30s cold)
time npx tsgo -p src/tsconfig.json --noEmit     # ~10x plus rapide
```

## Chiffres de référence (à citer, source en commentaire)

- vscode : **78s → 7.5s** (~10.5x).
  <!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->
- Tes chiffres réels dépendront de ta machine — annonce-les comme **les tiens**,
  mesurés sur scène, pas comme le benchmark Microsoft.

> Note honnêteté : ce `setup.sh` n'est **pas** exécuté en CI (clone + `npm ci`
> de vscode = trop lourd). Il est conçu pour tourner sur le laptop du speaker.
