# SPEAKER-NOTES

Notes par slide / bloc. **Punchlines en gras.** Voir `DEMO-SCRIPT.md` pour les
commandes exactes. Ordre des slides : hook, démo 1 (le wow), pourquoi Go,
pivot « à quel prix », puis les trois prix numérotés, puis le wrap.

## Par bloc

### 1 · Hook + chiffres (slides 1-2)
- Pas d'intro perso longue. Le titre EST l'accroche.
- **« 78 secondes à 7 secondes et demi. C'est vscode. C'est officiel. »**
- Une phrase sur l'attribution Claude Code, factuelle, et on avance.
- Chiffres : vscode 78→7.5, Sentry 133→16, Playwright 11.1→1.1. **~10x, mémoire ÷2.**
- Reassurance correction : **74 diagnostics divergents sur ~20 000 cas** (chiffre
  brut, pas de pourcentage : ça impressionne sans se faire piéger à la calculette).

### 2 · Démo 1 : le wow (slide « Le mur de la compilation »)
- **« drop-in, même registry npm. »**
- Cible vscode. **Ne fais PAS fixer la salle sur un tsc cold de 78s en silence** :
  soit tu montres le tsc déjà mesuré (scrollback / capture), soit tu l'annonces et
  tu lances **tsgo en live** (~7s). Silence 2s après le tsgo, laisse la salle réagir.
- **« le 10x c'est le titre ; la mémoire ÷2, c'est ce qui change ta CI. »** (à l'oral,
  le détail `--extendedDiagnostics` est en Plan B, pas dans le flux nominal.)

### 3 · Pourquoi Go + Strada→Corsa (slides 4-5)
- Vient APRÈS le wow : la curiosité « mais comment ils ont fait ? » est gagnée.
- Phrase d'ancrage AVANT les buzzwords : **« un compilateur, c'est un gros graphe
  d'objets qui se pointent dans tous les sens. »** Puis : port **ligne-à-ligne**,
  Go (GC) colle aux graphes cycliques, le **borrow-checker** de Rust frictionne,
  **l'auteur de SWC a exploré Rust et l'a écarté** (formulation prudente, pas
  « abandonné » catégorique).
- Anti-bug rhétorique : **ce n'est pas un bootstrap** (compilo écrit dans son propre
  langage) ; tsgo est en Go. Si le temps presse, garde ce point pour la Q&A.
- Strada/Corsa : **toujours accoler « tsgo » à « Corsa »** les 2 premières fois.

### 4 · Pivot + Démo 2 : le prix n°1, migration (slides 6-7)
- Slide pivot « à quel prix ? » = 5s : **« ça, c'était la vitesse. Maintenant, les
  trois additions. »** Ça rend l'arc visible.
- Rassurer d'abord (le projet passe sur les deux binaires), casser ensuite.
- **« tsgo ne te sauve pas de ta dette de config, il la révèle 10x plus vite. »**
- `baseUrl` retiré = le piège le plus fréquent. **« baseUrl disparaît, mais tes
  alias survivent : tu réécris tes paths en relatif au tsconfig. »**
- `const enum` : **« tsgo veut effacer les types par simple suppression de texte
  (type-stripping) ; const enum et namespace génèrent du JS, donc pas effaçables. »**
- Codes : tsc et tsgo pointent le **même problème** mais avec des codes voisins
  (tsc TS5107/TS5101, tsgo TS5108/TS5102). Ne dis pas « identiques ».

### 5 · Démo 3 : le prix n°2, double-binaire (slide « CI »)
- **« type-check avec tsgo, émets les .d.ts avec tsc. »**
- Deux jobs, et c'est volontaire, pour DEUX raisons distinctes : (1) l'emit `.d.ts`
  de tsgo est encore en preview, (2) l'API que consomment les outils a changé.

### 6 · AI / LSP : le prix n°3, tooling (slide « Prix n°3 »)
- LSP **natif** dans le binaire. Contraste à dire : **« aujourd'hui ton éditeur
  parle à tsserver, un process Node à part ; là le serveur LSP est dans le binaire
  natif. »** Zed/Helix/Effect s'y branchent.
- Le twist est sur la slide, lis-le fort : **« le 10x n'est pas pour toi qui
  type-checkes une fois ; il est pour l'outil, agent IA inclus, qui type-checke
  40 fois par minute. »** C'est le vrai retournement du talk.
- Coût : API Strada cassée, remplacement visé **7.x** (annoncé 7.1, à vérifier le
  jour J). « 9 outils sur 15 » vient d'un billet public (avoir le nom sous la main).

### 7 · Wrap (slide « Lundi, 3 actions »)
- Boucle le titre : **« trois prix, tous payables aujourd'hui en side-by-side. »**
- 3 actions concrètes. **Pas** de roadmap, **pas** de « merci ».

---

## Anti-tunnel (si en retard)

Budget visé : ~17:30 de contenu sur un slot de 20:00 (coussin ~2:30). Si ça
déborde quand même, ordre de **sacrifice** (du premier au dernier à couper) :

1. **−1 min** : Bloc 3, compresser « Pourquoi Go » à UNE punchline et sauter la
   slide Strada→Corsa. Transition : *« le détail du choix Go est dans les slides /
   en Q&A. »*
2. **−1 min** : Démo 2, ne montrer QUE `baseUrl` (sauter esModuleInterop +
   const enum). Transition : *« même histoire pour deux autres options. »*
3. **−1 min** : Démo 3 → 100 % depuis la slide YAML (ne rien lancer), commenter
   les deux jobs. Transition : *« je vous montre le pattern, pas la mécanique. »*
4. **dernier recours** : Bloc 6, sauter la démo `--lsp`, garder la slide + le
   twist + la citation.

> Ne JAMAIS sacrifier la démo 1 (c'est le wow) ni le wrap (c'est l'action).
> Si tu es en AVANCE : développer la mention tldraw #7574 en démo 2.

---

## Q&A préparées

**Q1. C'est prod-ready ? On migre maintenant ?**
> Non pour publier des libs (emit/API encore mouvants). **Oui pour type-checker**
> en local/CI dès aujourd'hui, en side-by-side. Stable visé Q2 2026.

**Q2. Mes path aliases (`baseUrl`) sont morts ?**
> `baseUrl` est retiré, mais les `paths` **relatifs au tsconfig** marchent
> (`@app/x` devient `./src/x` dans `paths`). C'est un chercher-remplacer
> mécanique, pas une réécriture d'imports. (Démo 2.)

**Q3. Et mes plugins tsserver / règles typed-lint (typescript-eslint) ?**
> C'est le vrai prix. L'API (Strada) est cassée dans Corsa ; remplacement stable
> annoncé pour une **7.x** (visé 7.1). En attendant : **side-by-side** (tsc pour
> les outils, tsgo pour la gate). 9 outils sur 15 testés sont dans ce cas,
> typiquement tout ce qui touche l'API tsserver / le typed-lint.

**Q4. Pourquoi Go et pas Rust, vraiment ?**
> Port ligne-à-ligne d'un codebase très cyclique ; Go (GC, value types,
> goroutines) colle mieux que le borrow-checker. Des tentatives Rust sérieuses,
> dont dans la sphère SWC, n'ont pas abouti à cause de ces structures cycliques.
> Choix assumé par Hejlsberg.

**Q5. Le type-check donne-t-il exactement les mêmes erreurs ?**
> En pratique, oui : **74 diagnostics divergent sur ~20 000 cas** (moins de 0,4 %).
> L'**emit** de déclarations est une surface à part (le bug JSDoc `@template` est
> **vérifié corrigé**, matrice de 7 cas le 05/06) ; il reste en preview côté tsgo,
> d'où le double-binaire, pas un bug précis.

**Q6. Et les `const enum` / namespaces ?**
> Sous le modèle type-stripping (`erasableSyntaxOnly`), `const enum` et `namespace`
> émettent du JS, donc ne sont pas effaçables par simple suppression de texte.
> Remplacer par un `enum` ou un objet `as const`.

**Q7. Ça remplace `tsc` ? Le package `typescript` disparaît ?**
> À terme, TS 7 stable sortira sous `typescript` avec l'entrée `tsc`. Pour
> l'instant : `@typescript/native-preview` + binaire `tsgo`, en parallèle.

**Q8. Gain réel sur un petit projet ?**
> Moins spectaculaire en absolu (déjà rapide), mais la **mémoire** et la boucle
> de feedback (watch, LSP, agents) gagnent quand même.
