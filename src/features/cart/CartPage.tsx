import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";

function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={48} />

          <h1>Your cart is empty</h1>

          <p>
            Explore the NEXA experience and add a product
            to your cart.
          </p>

          <Link to="/experience" className="continue-shopping">
            <ArrowLeft size={18} />
            Explore Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <p className="cart-label">YOUR BAG</p>

            <h1>
              Cart ({totalItems})
            </h1>
          </div>

          <Link
            to="/experience"
            className="continue-shopping-link"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article
                className="cart-item"
                key={item.id}
              >
                <div
                  className="cart-item-color"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <div className="cart-item-info">
                  <h2>{item.name}</h2>

                  <p className="cart-item-finish">
                    Finish: {item.color}
                  </p>

                  <p className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    className="remove-cart-item"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <p className="summary-label">
              ORDER SUMMARY
            </p>

            <div className="summary-row">
              <span>Items</span>

              <strong>
                {totalItems}
              </strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                ${totalPrice.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <strong>Free</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ${totalPrice.toFixed(2)}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CartPage;