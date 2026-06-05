// @demo/cli — point d'entrée, importe core ET api (imports croisés).
import { type Result } from "@demo/core";
import { type ApiListeners, createUser, placeOrder } from "@demo/api";

const listeners: ApiListeners = {
  onUserCreated: (user) => console.log(`+ user ${user.email}`),
  onOrderPlaced: (order) => console.log(`+ order ${order.totalCents}c`),
  onError: (e) => console.error(`! ${e.code}: ${e.message}`),
};

function unwrap<T>(result: Result<T>): T {
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}

function main(): void {
  const user = unwrap(createUser("ada@example.com"));
  listeners.onUserCreated(user);

  const order = unwrap(placeOrder(user.id, 4200));
  listeners.onOrderPlaced(order);
}

main();
