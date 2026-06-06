# DEMO-SCRIPT · « tsgo : 10x plus rapide, mais à quel prix ? »

Talk de **20 min**, Paris TypeScript, 09/06/2026. Exécutable par quelqu'un
d'autre que le speaker : chaque bloc donne le **cwd**, les **commandes
exactes**, la **sortie attendue**, une **note scénique** et un **Plan B**.

Cible de contenu : **~17:30** sur le slot de 20:00 (coussin ~2:30 pour les
imprévus et la Q&A). Le récap timing est en bas.

## Pré-vol (avant de monter sur scène)

```bash
# Petit projet (démos 2 & 3) · frozen pour tourner sur le build tsgo pinné
cd demo-project-small && pnpm install --frozen-lockfile && pnpm typecheck:tsgo
npx tsgo --version        # vérifie la résolution du binaire depuis ce cwd

# Gros projet (démo 1) · À FAIRE BIEN AVANT (npm ci de vscode = 10-20 min)
cd demo-project-big && ./setup.sh
```

- Faire un **dry-run COMPLET** de la démo 1 la veille (setup.sh + les commandes),
  puis **ne plus y toucher** (ne pas relancer setup.sh ni mettre à jour les versions).
- Ouvrir **3 terminaux** déjà `cd` dans les bons cwd ; pré-charger les commandes
  longues dans l'historique shell (zéro frappe en direct).
- Terminal en **gros** (≥ 18pt), thème **clair** (salle lumineuse).
- Slides ouvertes en parallèle (`cd slides && pnpm dev`), prêtes sur le Plan B.
- Couper notifications, Wi-Fi vérifié + partage 4G/5G testé en secours réseau.

Conventions ci-dessous : `▶` commande, `≈` sortie attendue, `🎬` note scénique,
`🅱` Plan B.

---

## Bloc 1 : Hook + chiffres · 1 min 30 · *slides*

Slides 1-2 (hero + « Les chiffres »). Annoncer : **« TypeScript 7, port natif en
Go. Beta le 21 avril. vscode : 78 secondes à 7 secondes et demi. »** Pointer la
ligne d'attribution Claude Code (factuel, une phrase). Chiffres : vscode 78→7.5,
Sentry 133→16, Playwright 11.1→1.1, **~10x, mémoire ÷2**. Parité : **74 diagnostics
divergents sur ~20 000 cas** (chiffre brut, pas de pourcentage).

⏱ **cumul : 1:30**

---

## Démo 1 : la vitesse, le wow (4 min) · *terminal*

> cwd : `demo-project-big/vscode/`

### Commande

```bash
# 1) Le drop-in : même registry npm (déjà installé par setup.sh, sert l'effet)
npm install -D @typescript/native-preview      # ≈ instantané depuis le cache

# 2) Référence tsc · PRÉ-MESURÉE (ne pas la faire tourner 78s en silence)
#    Montrer le scrollback du run fait en coulisse, OU la lancer en narrant.
rm -f src/*.tsbuildinfo
time npx tsc  -p src/tsconfig.json --noEmit

# 3) tsgo, même cible · EN LIVE, c'est le wow
time npx tsgo -p src/tsconfig.json --noEmit
```

### Output attendu (approximatif)

```text
added 1 package in 2s

real    1m18s        # tsc, ~78s  (pré-mesuré)
real    0m7.6s       # tsgo, ~7.5s -> ~10x  (live)
```
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

### Note scénique

🎬 Sur `install` : laisser respirer 2s, **« drop-in, même registry npm, binaire
`tsgo` »**. **Ne fais PAS fixer la salle sur la barre tsc de 78s** : montre le run
déjà mesuré (scrollback/capture) ou lance-le en parlant. Le live à garder, c'est
**tsgo** : quand il rend en ~7s, **silence 2s**, laisse la salle réagir. La mémoire
÷2 se dit à l'oral : **« le 10x, c'est le titre ; la mémoire ÷2, c'est ce qui
change ta CI et ton laptop. »** (Détail `--extendedDiagnostics` : slide Plan B.)

### Plan B

🅱 Install/build qui rate → slide **« Plan B · Démo 1 »** (chiffres figés). Idéal :
avoir une **capture vidéo/asciinema du run réussi** à jouer (c'est le seul moment
irrejouable en 30s). Annoncer les chiffres comme TES mesures, enchaîner.

⏱ **cumul : 5:30**

---

## Bloc 3 : Pourquoi Go, pas Rust · 2 min · *slides + mermaid*

Slides « Pourquoi Go » et « Strada → Corsa ». Arrive APRÈS le wow (la curiosité
est gagnée). Phrase d'ancrage : **« un compilateur, c'est un gros graphe d'objets
qui se pointent dans tous les sens. »** Puis : port **ligne-à-ligne**, Go (GC)
colle aux graphes cycliques, le **borrow-checker** de Rust frictionne, **l'auteur
de SWC a exploré Rust puis l'a écarté**. **Ce n'est pas un bootstrap** : tsgo est
en Go. Toujours accoler « tsgo » à « Corsa ».

⏱ **cumul : 7:30**

---

## Démo 2 : prix n°1, migration + gotchas (4 min) · *slides + terminal*

> cwd : `demo-project-small/`

Slide pivot « à quel prix ? » (5s) : **« ça, c'était la vitesse ; maintenant, les
trois additions. »** Puis slide « Prix n°1 · La migration ».

### Commande

```bash
# Le projet contrôlé passe, sur les DEUX binaires
pnpm typecheck         # tsc  -> vert
pnpm typecheck:tsgo    # tsgo -> vert, quasi instantané

# Les pièges de migration (dossier gotchas/, hors build) · npx pour le PATH
npx tsgo -p gotchas/esModuleInterop-removed.tsconfig.json   # TS5108 : option SUPPRIMÉE
npx tsgo -p gotchas/baseUrl-removed.tsconfig.json           # TS5102 : baseUrl SUPPRIMÉ
npx tsgo -p gotchas/tsconfig.json                           # TS1294 : const enum vs type-stripping
```

### Output attendu (approximatif)

```text
error TS5108: Option 'esModuleInterop=false' has been removed. Please remove it...
error TS5102: Option 'baseUrl' has been removed. Use '"paths": {"*": ["./*"]}'...
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

### Note scénique

🎬 Montrer d'abord que le projet **passe** sur tsgo (rassurer). Puis les
gotchas : **« tsgo ne vous sauve pas de votre dette de config, il la révèle,
juste 10x plus vite. »** Insister : `baseUrl` retiré = **beaucoup** de configs
réelles cassées, **mais les `paths` relatifs au tsconfig survivent** (chercher-
remplacer mécanique). Codes : tsc et tsgo pointent le **même problème** avec des
codes voisins (tsc TS5107/TS5101). Mention orale tldraw (issue #7574).

### Plan B

🅱 Slide **« Plan B · Démo 2 »**. Si le temps manque, ne montrer que `baseUrl`.

⏱ **cumul : 11:30**

---

## Démo 3 : prix n°2, CI (3 min) · *YAML + terminal*

> cwd : racine du repo · fichier `.github/workflows/typecheck.yml`

### Commande

```bash
# Montrer le workflow : deux jobs
bat .github/workflows/typecheck.yml   # ou: code .github/workflows/typecheck.yml

# Reproduire les deux jobs en local
cd demo-project-small
pnpm typecheck:tsgo        # job 1 : la gate rapide
pnpm build:declarations    # job 2 : tsc émet les .d.ts
ls packages/*/dist/*.d.ts
```

### Output attendu (approximatif)

```text
# typecheck:tsgo -> exit 0 (rapide)
# build:declarations -> packages/{core,api,cli}/dist/index.d.ts
```

### Note scénique

🎬 Pointer les **deux jobs** et le commentaire inline. **« On type-checke avec
tsgo pour la vitesse, on ÉMET les déclarations avec tsc. Double-binaire pour deux
raisons : l'emit .d.ts de tsgo est en preview, ET l'API outils a changé. C'est le
prix, et il est raisonnable. »**

### Plan B

🅱 Slide « Prix n°2 · CI » (le YAML y est déjà). Commenter les deux jobs depuis la
slide, sans rien lancer (récupère ~1 min si besoin).

⏱ **cumul : 14:30**

---

## Bloc 6 : prix n°3, AI tooling / LSP (2 min) · *slide + démo courte*

> cwd : `demo-project-small/`

### Commande

```bash
# Le LSP est NATIF, dans le binaire (plus de tsserver Node séparé)
npx tsgo --lsp --help          # montre l'usage du serveur LSP natif
```

### Output attendu (approximatif)

```text
Usage of lsp:
  -pipe string   use named pipe for communication
  ...
```

### Note scénique

🎬 Slide « Prix n°3 ». Contraste à dire : **« aujourd'hui ton éditeur parle à
tsserver, un process Node à part ; là le serveur LSP est dans le binaire natif. »**
Zed/Helix/Effect s'y branchent, **et les outils IA**. Lire le twist à l'écran :
**« le 10x n'est pas pour toi qui type-checkes une fois ; il est pour l'outil,
agent IA inclus, qui type-checke 40 fois par minute. »** Lire la citation MS.
Coût : API Strada cassée, remplacement visé 7.x ; 9 outils sur 15 en side-by-side.

### Plan B

🅱 Slide « Prix n°3 · AI tooling & LSP » (auto-portante, twist + citation inclus).

⏱ **cumul : 16:30**

---

## Bloc 7 : Wrap (1 min) · *slide*

Slide « Lundi, 3 actions ». Boucler le titre : **« trois prix, tous payables
aujourd'hui en side-by-side. »** Puis : mesurer son chiffre, ajouter la gate CI
tsgo, auditer sa dette (`baseUrl`, `esModuleInterop: false`, `const enum`,
`node10`). **Pas** de slide « Merci » ni « Questions ».

⏱ **cumul : 17:30**

---

## Récap timing

| Bloc | Durée | Cumul |
|---|---|---|
| 1 Hook + chiffres | 1:30 | 1:30 |
| Démo 1 (vitesse, vscode) | 4:00 | 5:30 |
| 3 Pourquoi Go | 2:00 | 7:30 |
| Démo 2 (prix n°1, migration) | 4:00 | 11:30 |
| Démo 3 (prix n°2, CI) | 3:00 | 14:30 |
| 6 AI / LSP (prix n°3) | 2:00 | 16:30 |
| 7 Wrap | 1:00 | 17:30 |

→ ~2:30 de coussin sur le slot de 20:00. Stratégie de coupe si retard malgré
tout : voir `SPEAKER-NOTES.md` § anti-tunnel.
