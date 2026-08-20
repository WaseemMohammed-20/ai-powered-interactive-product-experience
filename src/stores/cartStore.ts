export type CartItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
};

type Listener = () => void;

class CartStore {
  private items: CartItem[] = [];

  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getItems() {
    return this.items;
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  addItem(item: CartItem) {
    const existingItem = this.items.find(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.color === item.color
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items = [...this.items, item];
    }

    this.notify();
  }

  increaseQuantity(id: string) {
    this.items = this.items.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    this.notify();
  }

  decreaseQuantity(id: string) {
    this.items = this.items
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.notify();
  }

  removeItem(id: string) {
    this.items = this.items.filter(
      (item) => item.id !== id
    );

    this.notify();
  }

  clearCart() {
    this.items = [];

    this.notify();
  }
}

export const cartStore = new CartStore();