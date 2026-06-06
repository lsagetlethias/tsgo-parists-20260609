# tsgo : 10x plus rapide, mais à quel prix ?

Matériel du talk (20 min) — **Paris TypeScript, 9 juin 2026**.
Speaker : **Lilian Saget-Lethias** · LinkedIn `lsagetlethias`.

> Présentation préparée en collaboration avec **Claude Code (Opus 4.8)**.

Sujet : **TypeScript 7** / le port natif en Go (`tsgo`, codename *Corsa*) —
le gain de vitesse (~10x, mémoire ÷2) **et son coût** (migration, double-binaire,
écosystème d'outils).

## Structure du repo

```
.
├── slides/                 # deck Slidev (light mode, "éditeur de code") + notes par slide (presenter mode)
├── demo-project-small/     # monorepo pnpm contrôlé (core/api/cli) + gotchas/
├── demo-project-big/       # setup.sh : microsoft/vscode pinné (démo vitesse)
├── .github/workflows/      # typecheck.yml : pattern double-binaire (tsgo + tsc)
└── DEMO-SCRIPT.md          # script de démo exécutable, timing cumulé
```

## Prérequis

- **Node ≥ 24**, **pnpm 11** (corepack : `corepack enable`).
- Réseau pour le premier `pnpm install` (fonts auto-hébergées ensuite → la
  présentation tourne hors-ligne).

## Lancer les slides

```bash
cd slides
pnpm install
pnpm dev          # http://localhost:3030  (mode présentateur : /presenter/)
# pnpm build      # build statique dans slides/dist/
```

## Projets de démo

```bash
# Petit projet (démos 2 & 3) — doit être vert sur les DEUX binaires
cd demo-project-small
pnpm install
pnpm typecheck            # tsc  -> vert
pnpm typecheck:tsgo       # tsgo -> vert
pnpm build                # émet JS + .d.ts
pnpm build:declarations   # tsc --emitDeclarationOnly

# Gros projet (démo 1) — À PRÉPARER BIEN AVANT (npm ci de vscode = 10-20 min)
cd demo-project-big
./setup.sh
```

> `gotchas/` (pièges de migration) est **hors build** par défaut : il ne casse
> jamais `typecheck`. On le lance à la main pendant la démo (cf. son README).

## Présenter

1. `cd slides && pnpm dev`, ouvrir `/presenter/` sur l'écran de contrôle.
2. Les **notes par slide** (à dire, timing, à faire, transitions, pièges, anti-tunnel,
   Q&A) s'affichent directement dans le **mode présentateur**.
3. Suivre **`DEMO-SCRIPT.md`** pour les commandes exactes, sorties attendues et timing.
4. Terminal en gros, thème clair (salle lumineuse).

## Fallback (Plan B)

Pas d'enregistrements asciinema (choix assumé). Le filet de sécurité = des
**slides de secours** en fin de deck (section « Plan B ») : sorties attendues des
démos 1 et 2, à projeter si une démo live échoue. Chaque bloc de `DEMO-SCRIPT.md`
indique sa slide Plan B.

## Notes de fiabilité / vérifications

- Chiffres vérifiés le **2026-06-05** ; au 9 juin, tsgo est en **Beta** (builds
  `dev` quotidiens), stable visé Q2. À re-vérifier le jour J.
- Breaking changes TS 7 vérifiés localement : `baseUrl` retiré (`TS5102`),
  `esModuleInterop: false` retiré (`TS5108`), `const enum` + `erasableSyntaxOnly`
  (`TS1294`). Bug d'emit JSDoc `@template` : **corrigé** dans le build du 05/06.
- `pnpm 11` impose une policy supply-chain (`minimumReleaseAge`) qui refuse les
  builds tsgo publiés le jour même ; elle est neutralisée par projet dans
  `pnpm-workspace.yaml`. Reproductibilité assurée par les lockfiles.
- Workflow validé `actionlint` clean.

## Attribution

Contenu, code et design réalisés avec **Claude Code (Opus 4.8)**, sur la base du
brief et des arbitrages de l'auteur. Chiffres sourcés en commentaires dans
`slides/slides.md`.
