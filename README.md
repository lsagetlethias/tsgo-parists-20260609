# tsgo : 10x plus rapide, mais à quel prix ?

Matériel du talk (20 min), **Paris TypeScript, 9 juin 2026**.
Speaker : **Lilian Saget-Lethias** · LinkedIn `lsagetlethias`.

> Présentation préparée en collaboration avec **Claude Code (Opus 4.8)**.

Sujet : **TypeScript 7**, le port natif en Go (`tsgo`, codename *Corsa*). Le gain
de vitesse (~10x, mémoire ÷2) **et son coût** : migration tsconfig, API des
outils, parité du LSP, double-binaire, JSDoc au type-check. Talk **sans démo
live**, tout est porté par les slides.

## Structure du repo

```
.
├── slides/             # deck Slidev (light mode, "éditeur de code") + notes par slide
└── demo-project-big/   # setup.sh : microsoft/vscode pinné, pour régénérer le bench de la slide
```

## Prérequis

- **Node ≥ 24**, **pnpm 11** (corepack : `corepack enable`).
- Réseau pour le premier `pnpm install` (fonts auto-hébergées ensuite, la
  présentation tourne hors-ligne).

## Lancer les slides

```bash
cd slides
pnpm install
pnpm dev          # http://localhost:3030  (mode présentateur : /presenter/)
# pnpm build      # build statique dans slides/dist/
```

Les **notes par slide** (rappels de mots-clés, acronymes, définitions) s'affichent
dans le mode présentateur.

## Régénérer le bench de vitesse

Le screenshot `slides/images/demo1-benchmark.png` (slide « Le 10x n'est pas
universel ») vient de ce comparo. Pour le refaire sur sa propre machine :

```bash
cd demo-project-big
./setup.sh        # clone + npm ci de vscode : 10-20 min, à faire bien avant
# puis voir demo-project-big/README.md pour les commandes hyperfine
```

## Notes de fiabilité

- Chiffres vérifiés début juin 2026 ; tsgo est en **Beta** (builds `dev`
  quotidiens), stable visé Q2 2026. À re-vérifier le jour J (numéro d'API 7.1,
  nom du flag `useTsgo`, milestone RC).
- Sources des chiffres en commentaires dans `slides/slides.md` et visibles en
  sous-titre des slides.

## Attribution

Contenu, code et design réalisés avec **Claude Code (Opus 4.8)**, sur la base du
brief et des arbitrages de l'auteur.
