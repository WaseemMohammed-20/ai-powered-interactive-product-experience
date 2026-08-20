import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import HomePage from "../features/product/HomePage";
import ProductExperiencePage from "../features/product/ProductExperiencePage";
import CartPage from "../features/cart/CartPage";
import CheckoutPage from "../features/cart/CheckoutPage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import AboutPage from "../features/product/AboutPage";
import ProductUniversePage from "../features/product/ProductUniversePage";
import PhonePlaceholderPage from "../features/product/PhonePlaceholderPage";
import ProductPlaceholderPage from "../features/product/ProductPlaceholderPage";
import HeadphonesPage from "../features/product/HeadphonesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "experience",
        element: <ProductExperiencePage />,
      },
      {
        path: "products",
        element: <ProductUniversePage />,
      },
      {
        path: "products/phone",
        element: <PhonePlaceholderPage />,
      },
      {
        path: "products/headphones",
        element: <HeadphonesPage />,
      },
      {
        path: "products/air",
        element: <ProductPlaceholderPage />,
      },
      {
        path: "products/book",
        element: <ProductPlaceholderPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
]);