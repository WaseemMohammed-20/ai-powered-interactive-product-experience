export type ProductColor = {
  id: string;
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  colors: ProductColor[];
  features: string[];
};

export const pulseX1: Product = {
  id: "nexa-pulse-x1",
  name: "NEXA Pulse X1",
  tagline: "Designed for every second that matters.",
  description:
    "A conceptual next-generation smartwatch experience combining intelligent health insights, seamless connectivity, and an immersive digital interface.",

  price: 249,

  colors: [
    {
      id: "midnight",
      name: "Midnight",
      value: "#1c1c1e",
    },
    {
      id: "silver",
      name: "Silver",
      value: "#c7c7cc",
    },
    {
      id: "violet",
      name: "Electric Violet",
      value: "#7c5cff",
    },
  ],

  features: [
    "Adaptive AMOLED Display",
    "AI Health Insights",
    "Multi-Day Battery",
    "Precision Activity Tracking",
  ],
};