# SPEAKER-NOTES

Notes par slide / bloc. **Punchlines en gras.** Voir `DEMO-SCRIPT.md` pour les
commandes exactes.

## Par bloc

### 1 — Hook + attribution (slide 1)
- Pas d'intro perso longue. Le titre EST l'accroche.
- **« 78 secondes à 7 secondes et demi. C'est vscode. C'est officiel. »**
- Une phrase sur l'attribution Claude Code, factuelle, et on avance.

### 2 — Pourquoi Go (slides 2-4)
- Chiffres : vscode 78→7.5, Sentry 133→16, Playwright 11→1.1. **~10x, mémoire ÷2.**
- Parité : **74 diagnostics différents sur ~20 000 cas**, soit 99.99 %.
- Go vs Rust : **« port ligne-à-ligne »** + graphes cycliques (GC) ; Rust =
  friction borrow-checker ; **l'auteur de SWC a abandonné son tsc-en-Rust.**
- Anti-bug rhétorique : **ce n'est pas un bootstrap**, tsgo est écrit en Go.

### 3 — Démo 1 (le wow)
- **« drop-in, même registry npm. »**
- Parler PENDANT le tsc cold. Silence 2s après le tsgo.
- **« le 10x c'est le titre ; la mémoire ÷2, c'est ce qui change ta CI. »**

### 4 — Démo 2 (le prix #1 : migration)
- Rassurer d'abord (le projet passe), casser ensuite.
- **« tsgo ne te sauve pas de ta dette de config — il la révèle 10x plus vite. »**
- `baseUrl` retiré = le piège le plus fréquent.

### 5 — Démo 3 (le prix #2 : double-binaire)
- **« type-check avec tsgo, émets les .d.ts avec tsc. »**
- Deux jobs, et c'est volontaire.

### 6 — AI / LSP (le prix #3 : tooling)
- LSP **natif** dans le binaire. Zed/Helix/Effect s'y branchent.
- **« le 10x est pour l'agent qui type-check 40 fois par minute, pas pour toi. »**
- Coût : API Strada cassée → 7.1 ; 9 outils/15 en side-by-side.

### 7 — Wrap
- 3 actions concrètes. **Pas** de roadmap, **pas** de « merci ».

---

## Anti-tunnel (si en retard)

Ordre de **sacrifice** (du premier au dernier à couper) :

1. **−1 min** : Démo 1, couper le volet `--extendedDiagnostics` mémoire. Dire la
   phrase mémoire à l'oral, ne pas lancer les 2 commandes. Transition :
   *« je vous passe les détails mémoire, ils sont dans les slides. »*
2. **−1 min** : Démo 2, ne montrer QUE `baseUrl` (sauter esModuleInterop +
   const enum). Transition : *« même histoire pour deux autres options. »*
3. **−1 min** : Bloc 6, sauter la démo `--lsp`, garder uniquement la slide +
   citation. Transition : *« le LSP devient natif — c'est là que ça compte pour
   les outils. »*
4. **dernier recours** : Démo 3 → 100 % depuis la slide YAML (ne rien lancer).

> Ne JAMAIS sacrifier la démo 1 (c'est le wow) ni le wrap (c'est l'action).
> Si tu es en AVANCE : développer la mention tldraw #7574 en démo 2.

---

## Q&A préparées

**Q1. C'est prod-ready ? On migre maintenant ?**
> Non pour publier des libs (emit/API encore mouvants). **Oui pour type-checker**
> en local/CI dès aujourd'hui, en side-by-side. Stable visé Q2 2026.

**Q2. Mes path aliases (`baseUrl`) sont morts ?**
> `baseUrl` est retiré, mais les `paths` **relatifs** marchent. C'est un
> chercher-remplacer, pas une réécriture. (Démo 2.)

**Q3. Et mes plugins tsserver / règles typed-lint (typescript-eslint) ?**
> C'est le vrai prix. L'API (Strada) est cassée dans Corsa ; remplacement stable
> annoncé en **7.1**. En attendant : **side-by-side** (tsc pour les outils, tsgo
> pour la gate). 9 outils sur 15 testés sont dans ce cas.

**Q4. Pourquoi Go et pas Rust, vraiment ?**
> Port ligne-à-ligne d'un codebase très cyclique ; Go (GC, value types,
> goroutines) colle mieux que le borrow-checker. L'auteur de SWC avait tenté
> Rust et abandonné. Choix assumé par Hejlsberg.

**Q5. Le type-check donne-t-il exactement les mêmes erreurs ?**
> À **99.99 %** : 74 diagnostics diffèrent sur ~20 000 cas. L'**emit** de
> déclarations est la zone la plus sensible (ex. JSDoc `@template`, corrigé
> récemment) — d'où le double-binaire.

**Q6. Et les `const enum` / namespaces ?**
> Sous le modèle type-stripping (`erasableSyntaxOnly`), `const enum` n'est pas
> effaçable → remplacer par un `enum` ou un objet `as const`.

**Q7. Ça remplace `tsc` ? Le package `typescript` disparaît ?**
> À terme, TS 7 stable sortira sous `typescript` avec l'entrée `tsc`. Pour
> l'instant : `@typescript/native-preview` + binaire `tsgo`, en parallèle.

**Q8. Gain réel sur un petit projet ?**
> Moins spectaculaire en absolu (déjà rapide), mais la **mémoire** et la boucle
> de feedback (watch, LSP, agents) gagnent quand même.
