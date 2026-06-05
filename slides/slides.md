---
theme: default
title: "tsgo : 10x plus rapide, mais à quel prix ?"
colorSchema: light
lineNumbers: false
transition: none
mdc: true
drawings:
  enabled: false
fonts:
  # Fonts auto-hébergées via styles/index.ts -> on désactive le fetch Google.
  provider: none
  mono: "JetBrains Mono"
  sans: "JetBrains Mono"
  serif: "JetBrains Mono"
---

# tsgo : 10x plus rapide, mais à quel prix ?

<div class="muted">TypeScript 7 — le port natif en Go (« Corsa »)</div>

<div class="stat-row">
  <BigStat from="78s" to="7.5s" label="vscode · type-check (benchmark officiel)" />
</div>
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

<div class="rule"></div>

Beta : **21 avril 2026** · stable visé Q2 2026
<!-- source: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/ -->

Lilian Saget-Lethias · LinkedIn `lsagetlethias`

<div class="ai-credit">Présentation préparée en collaboration avec Claude Code (Opus 4.8).</div>

---
layout: code
file: benchmarks.md
---

## Les chiffres qui font le buzz

- **vscode** (1.5M lignes) : `78s → 7.5s` <span class="muted">(~10.5x)</span>
- **Sentry** : `133s → 16s` <span class="muted">(~8x)</span>
- **Playwright** : `11.1s → 1.1s` <span class="muted">(~10x)</span>
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

<div class="rule"></div>

- Type-check **~10x**, mémoire **~÷2** <!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->
- Parité : **74 diagnostics différents** sur ~20 000 cas (≈ 99.99 %)
<!-- source: https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/ -->

<div class="muted small">Codenames : Strada (l'actuel, TS/JS) · Corsa (le natif, Go).</div>

---
layout: code
file: why-go.go
---

## Pourquoi Go, et pas Rust ?

- Port quasi **ligne-à-ligne** du tsc existant — le codebase s'y prête
- Go : **GC + value types + goroutines** → fit naturel pour des graphes d'AST cycliques
- Rust : le **borrow-checker** frictionne sur ces structures fortement cycliques
- L'auteur de **SWC** a tenté un tsc en Rust → abandonné
- Décision assumée par **Anders Hejlsberg** (TypeScript, C#, Turbo Pascal)
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

<div class="muted small">Ce n'est pas un « bootstrap » : tsgo est écrit en Go, il ne se compile pas lui-même.</div>

---
layout: code
file: corsa.mmd
---

## Strada → Corsa

```mermaid {theme: 'neutral', scale: 0.95}
flowchart LR
  S["Strada<br/>tsc en TS, depuis 2012"] -->|"port ligne-à-ligne"| C["Corsa<br/>tsgo, natif Go"]
  C --> T["tsc 5.x / 6.x<br/>(maintenu, transition)"]
  C --> N["TS 7.0<br/>tsgo par défaut"]
  S -.->|"API publique"| API["linters / outils"]
  API -.->|"cassée, remplacée en 7.1"| C
```

---
layout: center
---

<div class="divider-kicker">DÉMO 1 · 6 min</div>

# <span class="no-comment">Le mur de la compilation</span>

<div class="muted"><code>time tsc --noEmit</code> &nbsp;vs&nbsp; <code>time tsgo --noEmit</code> &nbsp;·&nbsp; microsoft/vscode</div>

---
layout: center
---

<div class="divider-kicker">DÉMO 2 · 4 min</div>

# <span class="no-comment">Migrer un vrai projet</span>

<div class="muted">monorepo pnpm · <code>esModuleInterop</code> · <code>baseUrl</code> · <code>const enum</code></div>

---
layout: code
file: typecheck.yml
---

## Démo 3 — CI : le pattern double-binaire

```yaml
jobs:
  typecheck-fast:           # gate de PR : tsgo, ~10x plus rapide
    steps:
      - run: pnpm typecheck:tsgo      # tsgo --noEmit

  emit-declarations:        # artifact fiable : tsc produit les .d.ts
    steps:
      - run: pnpm build:declarations  # tsc --emitDeclarationOnly
```

<div class="rule"></div>

**Pourquoi deux jobs ?** L'emit de déclarations a pu diverger côté tsgo
(JSDoc `@template`). On type-checke vite avec tsgo, on **émet** avec tsc.

---
layout: code
file: tooling.ts
---

## AI tooling & LSP : ce qui devient natif

- `tsgo --lsp` : un **serveur LSP natif**, standard, dans le binaire
- Zed a une extension officielle · Helix a une issue ouverte
- Effect-TS a sorti son propre fork `effect-tsgo`
- **Coût** : l'API Strada (linters, outils) est cassée dans Corsa → remplacement stable en **7.1**
- Sur 15 outils TS testés publiquement, **9 demandent un setup side-by-side**
<!-- source: https://thinkingthroughcode.medium.com/i-tested-15-popular-libaries-with-typescript-7-toolchain-heres-how-to-fix-broken-migration-7ea719018e6d -->

<div class="ai-credit">« This new foundation goes beyond today's developer experience and will
enable the next generation of AI tools to enhance development. » — Microsoft</div>
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

---
layout: code
file: lundi.sh
---

## Lundi, 3 actions

1. **Mesure ton chiffre.** Sur ton plus gros repo :
   `pnpm add -D @typescript/native-preview` puis `tsgo --noEmit`.
2. **Ajoute la gate CI.** Job `typecheck-fast` avec tsgo ;
   garde `tsc --emitDeclarationOnly` pour les `.d.ts`.
3. **Audite ta dette.** `grep` tes tsconfig : `baseUrl`,
   `esModuleInterop: false`, `const enum`, `node10`.

<div class="rule"></div>

<div class="muted">tsgo ne te sauve pas de ta dette de config — il la révèle, juste 10x plus vite.</div>

---
layout: center
---

<div class="divider-kicker">APPENDICE</div>

# <span class="no-comment">Plan B</span>

<div class="muted">Slides de secours si une démo se plante. Sauter en temps normal.</div>

---
layout: code
file: backup-demo1.txt
---

## Plan B — Démo 1 (sorties attendues)

```text
$ time tsc  -p src/tsconfig.json --noEmit
real    1m18.4s          # ~78s, cold

$ time tsgo -p src/tsconfig.json --noEmit
real    0m7.6s           # ~7.5s, ~10x
```
<!-- source: https://devblogs.microsoft.com/typescript/typescript-native-port/ -->

<div class="muted small">Annonce les chiffres comme TES mesures sur scène, pas comme le benchmark MS.</div>

---
layout: code
file: backup-demo2.txt
---

## Plan B — Démo 2 (gotchas, sorties attendues)

```text
$ tsgo -p gotchas/esModuleInterop-removed.tsconfig.json
error TS5108: Option 'esModuleInterop=false' has been removed.

$ tsgo -p gotchas/baseUrl-removed.tsconfig.json
error TS5102: Option 'baseUrl' has been removed.

$ tsgo -p gotchas/tsconfig.json
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

<div class="muted small">Diagnostics identiques tsc/tsgo (parité ~99.99 %), réponse quasi instantanée.</div>
