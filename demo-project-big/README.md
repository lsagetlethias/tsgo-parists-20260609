# demo-project-big — microsoft/vscode

Le gros projet qui sert à régénérer le bench de vitesse des slides (install + comparaison `tsc` vs `tsgo` sur vscode).

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
> tsgo réelle et ouverte) est une **mention orale** pour la partie migration, pas
> un projet de build.

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
# puis, depuis demo-project-big/vscode/ (hyperfine requis : brew install hyperfine)

# comparo complet tsc vs tsgo, en coulisse (sort le ratio ~7,8x pour la slide)
# tsc OOM sans heap gonflé : NODE_OPTIONS=8GB, comme le gulp de vscode.
hyperfine -i --warmup 0 --runs 3 \
  --prepare 'find src -name "*.tsbuildinfo" -delete' \
  -n tsc  'NODE_OPTIONS=--max-old-space-size=8192 npx tsc -p src/tsconfig.json --noEmit' \
  -n tsgo 'npx tsgo -p src/tsconfig.json --noEmit'

# tsgo seul, en live (le wow)
hyperfine --warmup 1 --runs 5 -n tsgo 'npx tsgo -p src/tsconfig.json --noEmit'
```

> ⚠️ Deux pièges zsh/Node sur cette démo :
> - le mot-clé `time` n'affiche **rien** sur un process node (`npx`/`tsc`/`tsgo`),
>   d'où **hyperfine** ;
> - `tsc` **OOM** sur vscode au heap Node par défaut (~4.2GB) : il faut
>   `NODE_OPTIONS=--max-old-space-size=8192` (8GB, comme le gulp de vscode) pour
>   qu'il termine. `tsgo` (natif) n'a aucun réglage à faire. C'est un point à
>   noter dans le talk : le coût mémoire de `tsc` est concret, pas théorique.

## Chiffres de référence (à citer, source en commentaire)

- Benchmark Microsoft (moyenne, à citer comme tel) : vscode **78s → 7.5s** (~10.5x).
  <!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->
- Mesuré maison sur ce M2 : tsc **~38s**, tsgo **~4,8s** (**~7,8x**). Plus rapide en
  absolu que la box MS, mais comme `tsc` (mono-thread) profite à fond du single-core,
  le ratio se tasse (~7,8x au lieu de ~10x). Sur une CI plus lente, on retrouve le ~10x.
- Mémoire (self-report `--extendedDiagnostics`) : tsc **~5,3 Go**, tsgo **~4,2 Go**,
  soit **~20% de moins** (PAS ÷2 comme l'annonce MS ; le 5,3 Go de tsc est même
  gonflé par le heap 8 Go). Le vrai argument : tsc **OOM** sous 4,2 Go, tsgo non.
- Tes chiffres réels dépendront de ta machine — annonce le 38/5,5 comme **les tiens**,
  le ~10x comme la **moyenne Microsoft**, sans mélanger les deux.

> Note honnêteté : ce `setup.sh` n'est **pas** exécuté en CI (clone + `npm ci`
> de vscode = trop lourd). Il est conçu pour tourner sur le laptop du speaker.
