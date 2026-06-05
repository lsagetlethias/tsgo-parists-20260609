# Direction de design — A. « L'éditeur de code comme slide »

> Dossier `styles/` (pluriel, convention Slidev) — l'énoncé disait `style/`.
> Le CSS y est auto-importé via `styles/index.ts`.

Choix : **direction A**. Cohérente avec le sujet (un compilateur), lisible sur
vidéoprojecteur en **salle claire**, et techniquement simple en Slidev.

## Palette (light mode obligatoire)

| Rôle | Hex | Usage |
|---|---|---|
| Fond | `#FAFAF7` | blanc cassé, **jamais** blanc pur |
| Texte | `#1A1A1A` | encre |
| Atténué | `#77756E` | légendes, métadonnées |
| **Accent (unique)** | `#C44A28` | terracotta — titres `//`, chiffres-vedette, `strong` |
| Gouttière | `#C2BFB5` | numéros de ligne |
| Filet | `#E6E3DA` | séparateurs, bordures de blocs |
| ✓ sémantique | `#3C7A57` | glyphe succès uniquement |
| ✗ sémantique | `#B23A2E` | glyphe échec uniquement |

> **Une seule** couleur d'accent (`#C44A28`). Le vert/rouge ne servent QUE pour
> les glyphes sémantiques ✓ / ✗, jamais en décoration. **Pas** le bleu TypeScript.

## Fonts

- **JetBrains Mono** (OFL), poids 400 / 500 / 700, partout (titres + corps + code).
- Auto-hébergée via `@fontsource/jetbrains-mono` → aucun appel CDN à l'exécution
  (robuste si le réseau de la salle est mauvais).
- Berkeley Mono volontairement écartée : licence payante, non distribuable.

## Signature visuelle

- Titres = commentaires : `h1`/`h2` préfixés `// ` (en accent). Opt-out : `.no-comment`.
- Gouttière de numéros de ligne + barre d'onglet (nom de fichier) via le layout `code`.
- Grands chiffres-vedette via `<BigStat from="78s" to="7.5s" />`.
- Diagrammes : **mermaid** thème `neutral`, sobre.

## 3 anti-patterns INTERDITS (look « slide IA générique »)

1. **Gradients & glassmorphism** — aucun dégradé, aucun fond translucide flou.
2. **Ombres portées** — `box-shadow`/`text-shadow` neutralisés globalement dans le CSS.
3. **Emoji décoratif & fond dark/néon** — seuls ✓ / ✗ sémantiques sont tolérés ;
   fond clair only, pas de bleu nuit, pas d'accent fluo.

(Également bannis : stock photos, illustrations 3D isométriques, illustrations
générées par IA.)
