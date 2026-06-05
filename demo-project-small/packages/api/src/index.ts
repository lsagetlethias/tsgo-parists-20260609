// @demo/api — importe @demo/core et compose ses types.
import {
  type Id,
  type Listeners,
  type Result,
  err,
  id,
  ok,
} from "@demo/core";

export interface User {
  readonly id: Id<"user">;
  readonly email: string;
  readonly createdAt: Date;
}

export interface Order {
  readonly id: Id<"order">;
  readonly userId: Id<"user">;
  readonly totalCents: number;
}

/** Map d'événements -> dérive automatiquement les signatures d'écouteurs. */
export interface ApiEvents {
  userCreated: User;
  orderPlaced: Order;
  error: { readonly code: number; readonly message: string };
}

export type ApiListeners = Listeners<ApiEvents>;

const users = new Map<Id<"user">, User>();

export function createUser(email: string): Result<User> {
  if (!email.includes("@")) {
    return err(new Error(`email invalide: ${email}`));
  }
  const user: User = {
    id: id("user", crypto.randomUUID()),
    email,
    createdAt: new Date(),
  };
  users.set(user.id, user);
  return ok(user);
}

export function placeOrder(userId: Id<"user">, totalCents: number): Result<Order> {
  if (!users.has(userId)) {
    return err(new Error("utilisateur inconnu"));
  }
  return ok({
    id: id("order", crypto.randomUUID()),
    userId,
    totalCents,
  });
}
