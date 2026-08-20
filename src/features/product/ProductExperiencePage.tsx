import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Sparkles,
  Check,
} from "lucide-react";

import ProductViewer3D from "./ProductViewer3D";
import { cartStore } from "../../stores/cartStore";
import { analyticsStore } from "../../services/analytics/analyticsStore";

type ProductColor = {
  name: string;
  value: string;
};

const product = {
  id: "nexa-watch",
  name: "NEXA",
  tagline: "Intelligence on your wrist.",
  description:
    "A next-generation wearable designed for intelligent everyday performance. Experience seamless connectivity, advanced health tracking, and a premium interactive design built for the future.",
  price: 249,

  colors: [
    {
      name: "Midnight",
      value: "#1c1c1e",
    },
    {
      name: "Silver",
      value: "#d1d1d6",
    },
    {
      name: "Aurora",
      value: "#6d5dfc",
    },
  ] as ProductColor[],
};

function ProductExperiencePage() {
  const [selectedColor, setSelectedColor] =
    useState<ProductColor>(product.colors[0]);

  const [quantity, setQuantity] = useState(1);
  const [notificationVersion, setNotificationVersion] =
    useState(0);
  const [isNotificationVisible, setIsNotificationVisible] =
    useState(false);

  useEffect(() => {
    analyticsStore.track("product_viewed");
  }, []);

  useEffect(() => {
    if (notificationVersion === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsNotificationVisible(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notificationVersion]);

  const handleIncrease = () => {
    analyticsStore.track("quantity_changed");
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      return;
    }

    analyticsStore.track("quantity_changed");
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  const handleAddToCart = () => {
    analyticsStore.track("product_added_to_cart");
    cartStore.addItem({
      id: `${product.id}-${selectedColor.value}`,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor.value,
    });
    setIsNotificationVisible(true);
    setNotificationVersion((currentVersion) => currentVersion + 1);
  };

  return (
    <main className="experience-page">
      {isNotificationVisible && (
        <div
          className="cart-notification"
          role="status"
          aria-live="polite"
        >
          <Check size={18} strokeWidth={3} />
          <span>NEXA Pulse X1 added to your cart</span>
        </div>
      )}

      <section className="experience-grid">

        {/* LEFT SIDE - PRODUCT VIEWER */}

        <div className="product-stage">
          <div className="stage-background" />

          <ProductViewer3D
            color={selectedColor.value}
          />

          <div className="stage-badge">
            <Sparkles size={16} />
            Interactive Preview
          </div>

          <div className="stage-hint">
            <Sparkles size={16} />
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* RIGHT SIDE - PRODUCT INFORMATION */}

        <div className="product-info">
          <p className="product-label">
            NEXA SERIES 01
          </p>

          <h1>{product.name}</h1>

          <h2>{product.tagline}</h2>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-price">
            ${product.price}
          </div>

          {/* COLOR SELECTION */}

          <div className="product-section">
            <div className="section-header">
              <span>Finish</span>

              <strong>
                {selectedColor.name}
              </strong>
            </div>

            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={
                    selectedColor.value === color.value
                      ? "color-option selected"
                      : "color-option"
                  }
                  style={{
                    backgroundColor: color.value,
                  }}
                  onClick={() =>
                    (() => {
                      analyticsStore.track("color_selected");
                      setSelectedColor(color);
                    })()
                  }
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColor.value ===
                    color.value && (
                    <Check
                      size={18}
                      strokeWidth={3}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}

          <div className="product-section">
            <div className="section-header">
              <span>Quantity</span>
            </div>

            <div className="quantity-control">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* ADD TO CART */}

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            Add {quantity} to Cart — $
            {(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </section>

      {/* FEATURES */}

      <section className="feature-section">
        <div className="section-heading">
          <p>DESIGNED FOR THE FUTURE</p>

          <h2>
            More than a watch.
            <br />
            An intelligent experience.
          </h2>
        </div>

        <div className="feature-grid">

          <article className="feature-card">
            <Sparkles size={28} />

            <h3>Smart Interaction</h3>

            <p>
              Intuitive controls and intelligent
              features designed to make everyday
              interactions effortless.
            </p>
          </article>

          <article className="feature-card">
            <Sparkles size={28} />

            <h3>Premium Design</h3>

            <p>
              A refined wearable crafted with
              precision, comfort, and a modern
              futuristic aesthetic.
            </p>
          </article>

          <article className="feature-card">
            <Sparkles size={28} />

            <h3>Adaptive Performance</h3>

            <p>
              Intelligent technology that adapts
              to your lifestyle and delivers a
              seamless experience.
            </p>
          </article>

          <article className="feature-card">
            <Sparkles size={28} />

            <h3>Always Connected</h3>

            <p>
              Stay connected to what matters
              with powerful features built for
              your everyday routine.
            </p>
          </article>

        </div>
      </section>
    </main>
  );
}

export default ProductExperiencePage;