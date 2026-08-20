import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import HomePage from "../features/product/HomePage";
import ProductExperiencePage from "../features/product/ProductExperiencePage";
import CartPage from "../features/cart/CartPage";
import CheckoutPage from "../features/cart/CheckoutPage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import AboutPage from "../features/product/AboutPage";

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