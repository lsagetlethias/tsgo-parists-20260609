// GOTCHA 3 — const enum & type-stripping (piège STRUCTUREL)
// =========================================================
// `const enum` est inlined par le compilateur : il n'a pas de représentation
// runtime autonome. Or l'écosystème va vers le "type-stripping" (Node
// --experimental-strip-types, et la philosophie erasable-only de tsgo) qui
// se contente d'EFFACER les types sans transformer le code.
//
// Avec `erasableSyntaxOnly: true` (activé dans gotchas/tsconfig.json) ->
//   ERREUR attendue :
//   TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
// ...parce qu'un `const enum` n'est PAS du pur type effaçable : il demande une
// transformation (inlining). Idem pour les `namespace` avec du code runtime.

export const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// À l'usage, en mode inlining classique, `Direction.Up` devient `0`.
// Mais sous type-stripping, il n'y a personne pour faire l'inlining.
export function step(d: Direction): number {
  return d;
}

// Fix migration : remplacer `const enum` par un `enum` normal, ou mieux par un
// objet `as const` :
//   export const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
//   export type Direction = (typeof Direction)[keyof typeof Direction];
