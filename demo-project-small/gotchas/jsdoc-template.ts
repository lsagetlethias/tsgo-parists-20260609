// GOTCHA — JSDoc @template en declaration emit (PARITY WATCH)
// ===========================================================
// Historiquement, tsgo (Corsa) avait un bug d'emit : à partir d'une fonction JS
// documentée `@template T`, il PERDAIT le générique dans le .d.ts généré
// (`identity(value: any)` au lieu de `identity<T>(value: T): T`). tsc, lui,
// le conservait.
//
// ⚠️ VÉRIFIÉ le 2026-06-05 sur @typescript/native-preview 7.0.0-dev.20260605.1,
//    sur une MATRICE de 7 cas (simple, multi-params, @template {string} contraint,
//    [T=number] par défaut, @typedef générique, classe générique, méthode
//    générique) : le bug est CORRIGÉ partout. tsc ET tsgo conservent le
//    générique. Seules différences restantes = cosmétiques (tsgo ajoute le
//    mot-clé `declare`, ordonne les membres autrement). À re-vérifier le jour J —
//    bon exemple de la vitesse à laquelle le preview bouge.
//
// La leçon tient même une fois le bug corrigé : l'**emit de déclarations** est
// la surface la plus risquée de la migration (parité ~99.99 % sur le type-check,
// mais l'emit est un autre code path). D'où la recommandation du double-binaire :
//   - tsgo  pour type-checker (la gate rapide)
//   - tsc   --emitDeclarationOnly pour produire les .d.ts publiés
// Et : diffez vos .d.ts en CI quand vous adoptez tsgo. (Repro dans README.md.)

/**
 * Équivalent TypeScript de la fonction JS qui déclenchait le bug.
 * En .ts, @template est ignoré (TS utilise le vrai générique), donc l'emit est
 * correct partout — la divergence ne se voyait que sur un .js + checkJs.
 *
 * @template T
 */
export function identity<T>(value: T): T {
  return value;
}

// Sanity : l'usage reste correct au type-check.
const n: number = identity(42);
const s: string = identity("corsa");
void n;
void s;
