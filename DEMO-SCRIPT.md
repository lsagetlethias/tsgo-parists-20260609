# DEMO-SCRIPT — « tsgo : 10x plus rapide, mais à quel prix ? »

Talk de **20 min**, Paris TypeScript, 09/06/2026. Exécutable par quelqu'un
d'autre que le speaker : chaque bloc donne le **cwd**, les **commandes
exactes**, la **sortie attendue**, une **note scénique** et un **Plan B**.

## Pré-vol (avant de monter sur scène)

```bash
# Petit projet
cd demo-project-small && pnpm install && pnpm typecheck:tsgo   # doit être vert

# Gros projet (À FAIRE BIEN AVANT — npm ci de vscode = 10-20 min)
cd demo-project-big && ./setup.sh
```

- Terminal en **gros** (≥ 18pt), thème **clair** (salle lumineuse).
- Slides ouvertes en parallèle (`cd slides && pnpm dev`), prêtes sur le Plan B.
- Couper notifications, Wi-Fi vérifié (sinon basculer sur les slides Plan B).

Conventions ci-dessous : `▶` commande, `≈` sortie attendue, `🎬` note scénique,
`🅱` Plan B.

---

## Bloc 1 : Hook + attribution — 1 min — *slide*

Slide 1 (hero). Annoncer : **« TypeScript 7, port natif en Go. Beta le
21 avril. vscode : 78 secondes à 7 secondes et demi. »** Pointer la ligne
d'attribution Claude Code (factuel, une phrase).

⏱ **cumul : 1:00**

---

## Bloc 2 : Pourquoi Go, pas Rust — 2 min — *slides + mermaid*

Slides « Les chiffres », « Pourquoi Go », « Strada → Corsa ».

Points : port **ligne-à-ligne**, Go fit les **graphes cycliques** (GC/value
types), Rust frictionne (borrow-checker), l'auteur de **SWC** a abandonné son
tsc-en-Rust. **Ce n'est pas un bootstrap** : tsgo est écrit en Go.

⏱ **cumul : 3:00**

---

## Démo 1 : install + comparaison (6 min) — *terminal*

> cwd : `demo-project-big/vscode/`

### Commande

```bash
# 1) Le drop-in : même registry npm
npm install -D @typescript/native-preview

# 2) Référence tsc, à froid
rm -f src/*.tsbuildinfo
time npx tsc  -p src/tsconfig.json --noEmit

# 3) tsgo, même cible
time npx tsgo -p src/tsconfig.json --noEmit

# 4) Le "à quel prix" inversé : la mémoire
npx tsc  -p src/tsconfig.json --noEmit --extendedDiagnostics | grep -i memory
npx tsgo -p src/tsconfig.json --noEmit --extendedDiagnostics | grep -i memory
```

### Output attendu (approximatif)

```text
added 1 package in 2s

real    1m18s        # tsc, ~78s
real    0m7.6s       # tsgo, ~7.5s  -> ~10x

Memory used:  ~ tsc nettement plus haut que tsgo (~ ÷2)
```
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

### Note scénique

🎬 Sur `install` : laisser respirer 2s — **« drop-in, même registry npm, binaire
`tsgo` »**. Lancer le `tsc` cold, **parler pendant qu'il tourne** (ne pas
regarder la barre en silence). Quand `tsgo` rend en ~7s : **silence 2s**, laisser
la salle réagir. Sur la mémoire : **« le 10x, c'est le titre ; la mémoire ÷2,
c'est ce qui change ta CI et ton laptop. »**

### Plan B

🅱 Install ou build qui rate → slide **« Plan B — Démo 1 (sorties attendues) »**
(appendice du deck). Annoncer les chiffres benchmark, enchaîner.

⏱ **cumul : 9:00**

---

## Démo 2 : migration + gotchas (4 min) — *code + terminal*

> cwd : `demo-project-small/`

### Commande

```bash
# Le projet contrôlé passe, sur les DEUX binaires
pnpm typecheck         # tsc  -> vert
pnpm typecheck:tsgo    # tsgo -> vert, quasi instantané

# Les pièges de migration (dossier gotchas/, hors build)
tsgo -p gotchas/esModuleInterop-removed.tsconfig.json   # TS5108 : option SUPPRIMÉE
tsgo -p gotchas/baseUrl-removed.tsconfig.json           # TS5102 : baseUrl SUPPRIMÉ
tsgo -p gotchas/tsconfig.json                           # TS1294 : const enum vs type-stripping
```

### Output attendu (approximatif)

```text
error TS5108: Option 'esModuleInterop=false' has been removed. Please remove it...
error TS5102: Option 'baseUrl' has been removed. Use '"paths": {"*": ["./*"]}'...
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

### Note scénique

🎬 Montrer d'abord que le projet **passe** sur tsgo (rassurer). Puis les
gotchas : **« tsgo ne vous sauve pas de votre dette de config — il la révèle,
juste 10x plus vite. »** Insister : `baseUrl` retiré = **beaucoup** de configs
réelles cassées. Mention orale tldraw (issue #7574, migration tsgo réelle et
ouverte).

### Plan B

🅱 Slide **« Plan B — Démo 2 (gotchas) »**. Si le temps manque, ne montrer que
`baseUrl` (le plus courant).

⏱ **cumul : 13:00**

---

## Démo 3 : CI (3 min) — *YAML + terminal*

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
tsgo pour la vitesse, on ÉMET les déclarations avec tsc, parce que l'emit a pu
diverger. Double-binaire : c'est le prix, et il est raisonnable. »**

### Plan B

🅱 Slide « Démo 3 — CI » (le YAML y est déjà). Commenter les deux jobs depuis la
slide.

⏱ **cumul : 16:00**

---

## Bloc 6 : AI tooling / LSP (3 min) — *démo compilation + explication*

> cwd : `demo-project-small/`

### Commande

```bash
# Le LSP est NATIF, dans le binaire (plus de tsserver Node séparé)
tsgo --lsp --help          # montre l'usage du serveur LSP natif

# Boucle de feedback serrée : la recompile incrémentale
tsgo -p tsconfig.check.json --extendedDiagnostics | tail -n 6
```

### Output attendu (approximatif)

```text
Usage of lsp:
  -pipe string   use named pipe for communication
  ...

Check time:  ~0.0s
Total time:  ~0.1s
```

### Note scénique

🎬 **Démo = compilation/feedback, pas une démo IA.** Montrer `--lsp` (natif) et
la recompile quasi nulle. Puis **expliquer** : ce LSP natif est ce sur quoi se
branchent Zed (extension officielle), Helix (issue), Effect (`effect-tsgo`) —
**et les outils IA**. Lire la citation Microsoft à l'écran : *« …enable the next
generation of AI tools… »*. Punchline : **« le 10x n'est pas pour toi qui
type-checkes une fois ; il est pour l'outil — agent IA inclus — qui type-checke
40 fois par minute. »** Coût : l'API Strada est cassée, remplacement en 7.1 ;
9 outils sur 15 en side-by-side.

### Plan B

🅱 Slide « AI tooling & LSP » (auto-portante, citation incluse).

⏱ **cumul : 19:00**

---

## Bloc 7 : Wrap (1 min) — *slide*

Slide « Lundi, 3 actions » : mesurer son chiffre, ajouter la gate CI tsgo,
auditer sa dette (`baseUrl`, `esModuleInterop: false`, `const enum`, `node10`).
**Pas** de slide « Merci » ni « Questions ».

⏱ **cumul : 20:00**

---

## Récap timing

| Bloc | Durée | Cumul |
|---|---|---|
| 1 Hook + attribution | 1:00 | 1:00 |
| 2 Pourquoi Go | 2:00 | 3:00 |
| 3 Démo 1 (vscode) | 6:00 | 9:00 |
| 4 Démo 2 (gotchas) | 4:00 | 13:00 |
| 5 Démo 3 (CI) | 3:00 | 16:00 |
| 6 AI / LSP | 3:00 | 19:00 |
| 7 Wrap | 1:00 | 20:00 |

→ Stratégie de coupe si retard : voir `SPEAKER-NOTES.md` § anti-tunnel.
