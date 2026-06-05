// @demo/core — types un peu velus pour donner du grain à type-checker.
// L'idée : ni trivial (sinon tsc finit en 0.2s et la démo perd son sens),
// ni grotesque. Conditional types + mapped types + template literal types.

/** Branded type : un Id<"user"> n'est pas assignable à un Id<"order">. */
export type Id<TBrand extends string> = string & { readonly __brand: TBrand };

export function id<TBrand extends string>(brand: TBrand, value: string): Id<TBrand> {
  // Le brand n'existe qu'au niveau type ; à l'exécution c'est une string.
  void brand;
  return value as Id<TBrand>;
}

/** Mapped type récursif : fige une structure en profondeur. */
export type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/** Conditional type : déballe un Promise / un Array imbriqué. */
export type Unwrap<T> = T extends Promise<infer U>
  ? Unwrap<U>
  : T extends ReadonlyArray<infer U>
    ? Unwrap<U>
    : T;

/** Discriminated union pour un résultat faillible. */
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Template literal + mapped type : dérive un type d'écouteurs `on<Event>`
 * à partir d'une map d'événements. C'est exactement le genre de type qui
 * fait travailler le checker (instanciation par clé).
 */
export type Listeners<TEvents> = {
  readonly [K in keyof TEvents as `on${Capitalize<string & K>}`]: (
    payload: TEvents[K],
  ) => void;
};

/** Petit utilitaire conditionnel : clés dont la valeur est une fonction. */
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown ? K : never;
}[keyof T];
