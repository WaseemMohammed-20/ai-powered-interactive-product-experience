# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
# AI-Powered Interactive Product Experience

NEXA is an interactive e-commerce product experience for the Pulse X1 wearable. It combines a responsive product presentation, a procedural 3D watch viewer, cart and checkout flows, and real-time interaction analytics in a focused React application.

## Overview

The application is built with React and TypeScript and runs on Vite. The product experience uses React Three Fiber, Three.js, and Drei to render a procedural watch model directly from Three.js geometries. React Router provides page navigation, while a lightweight in-memory analytics store tracks interactions during the current application session.

## Key Features

- Interactive NEXA Pulse X1 product experience
- Procedural 3D watch viewer with orbit rotation and zoom controls
- Product color selection with strap color updates in the viewer and cart
- Quantity increase and decrease controls
- Add to Cart with success notification and automatic dismissal
- Cart management for quantities, selected finishes, subtotals, and totals
- Checkout flow with customer information validation
- Order success screen with cart clearing and continue-shopping navigation
- Runtime interaction analytics for product views, color selections, quantity changes, add-to-cart actions, cart visits, and completed orders
- Conversion rate calculated from completed orders and product views
- Responsive layouts for mobile, tablet, and desktop screens

## Technology Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- React Three Fiber
- Three.js
- `@react-three/drei`
- Lucide React icons
- CSS with responsive media queries and shared component styles
- ESLint and TypeScript build checks

The project also includes Framer Motion and Zustand as installed dependencies, although the current application flow uses CSS transitions and a small custom runtime store for its implemented interactions.

## Project Structure

```text
nexa/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── analytics/
│   │   ├── cart/
│   │   ├── experience/
│   │   └── product/
│   ├── hooks/
│   ├── services/
│   │   └── analytics/
│   ├── stores/
│   └── index.css
├── index.html
├── package.json
└── vite.config.ts
```

## Installation

```bash
git clone <repository-url>
cd nexa
npm install
npm run dev
```

The development server will print the local URL when it starts.

## Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Screenshots

Add screenshots here when available:

![Product experience screenshot](./docs/screenshots/product-experience.png)

![Checkout screenshot](./docs/screenshots/checkout.png)

![Analytics screenshot](./docs/screenshots/analytics.png)

## Future Improvements

- Replace the procedural watch with a production-ready realistic GLB watch model
- Persist cart and analytics data across browser sessions
- Connect checkout to a payment and order API
- Add product catalog and inventory management
- Add automated component and end-to-end tests
