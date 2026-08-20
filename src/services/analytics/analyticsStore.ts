export type AnalyticsMetrics = {
  productViews: number;
  colorSelections: number;
  quantityChanges: number;
  addToCartCount: number;
  cartVisits: number;
  completedOrders: number;
};

export type AnalyticsEvent =
  | "product_viewed"
  | "color_selected"
  | "quantity_changed"
  | "product_added_to_cart"
  | "cart_opened"
  | "checkout_completed";

type Listener = () => void;

const initialMetrics: AnalyticsMetrics = {
  productViews: 0,
  colorSelections: 0,
  quantityChanges: 0,
  addToCartCount: 0,
  cartVisits: 0,
  completedOrders: 0,
};

class AnalyticsStore {
  private metrics = initialMetrics;

  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getMetrics() {
    return this.metrics;
  }

  track(event: AnalyticsEvent) {
    const metricByEvent: Record<AnalyticsEvent, keyof AnalyticsMetrics> = {
      product_viewed: "productViews",
      color_selected: "colorSelections",
      quantity_changed: "quantityChanges",
      product_added_to_cart: "addToCartCount",
      cart_opened: "cartVisits",
      checkout_completed: "completedOrders",
    };

    const metric = metricByEvent[event];
    this.metrics = {
      ...this.metrics,
      [metric]: this.metrics[metric] + 1,
    };

    this.listeners.forEach((listener) => listener());
  }
}

export const analyticsStore = new AnalyticsStore();