import { useSyncExternalStore } from "react";
import { cartStore } from "../stores/cartStore";

export function useCart() {
  const items = useSyncExternalStore(
    (callback) => cartStore.subscribe(callback),
    () => cartStore.getItems(),
    () => cartStore.getItems()
  );

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice,

    addItem: (item: {
      id: string;
      name: string;
      price: number;
      color: string;
      quantity: number;
    }) => cartStore.addItem(item),

    increaseQuantity: (id: string) =>
      cartStore.increaseQuantity(id),

    decreaseQuantity: (id: string) =>
      cartStore.decreaseQuantity(id),

    removeItem: (id: string) =>
      cartStore.removeItem(id),

    clearCart: () => cartStore.clearCart(),
  };
}