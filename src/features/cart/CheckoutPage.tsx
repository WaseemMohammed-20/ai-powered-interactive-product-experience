import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, CheckCircle, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { analyticsStore } from "../../services/analytics/analyticsStore";

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [orderTotal, setOrderTotal] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setOrderTotal(totalPrice);
    analyticsStore.track("checkout_completed");
    clearCart();
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <section className="page-container empty-cart checkout-page order-success">
        <CheckCircle size={48} />
        <p className="page-eyebrow">ORDER CONFIRMED</p>
        <h1>Order Successful</h1>
        <p>Your NEXA order has been placed successfully.</p>
        <p className="product-price">${orderTotal.toFixed(2)}</p>
        <button
          type="button"
          className="primary-button magnetic"
          onClick={() => navigate("/experience")}
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="page-container empty-cart checkout-page">
        <ShoppingBag size={48} />
        <p className="page-eyebrow">CHECKOUT</p>
        <h1>Your cart is empty</h1>
        <p>Add a product before continuing to checkout.</p>
        <Link to="/experience" className="secondary-button magnetic">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="page-container checkout-page">
      <p className="page-eyebrow">CHECKOUT</p>
      <h1>Complete Your Experience</h1>

      <div className="cart-layout">
        <div className="cart-items checkout-summary">
          <div className="feature-card checkout-summary-card">
            <p className="summary-label">ORDER SUMMARY</p>
            {items.map((item) => (
              <article className="cart-item cart-item--premium" key={item.id}>
                <div
                  className="cart-item-color"
                  style={{ backgroundColor: item.color }}
                />
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p className="cart-item-finish">Finish: {item.color}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="cart-item-price">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </article>
            ))}
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <form
          className="feature-card checkout-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <p className="summary-label">CUSTOMER INFORMATION</p>
          <label>
            Full Name
            <input name="fullName" type="text" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Shipping Address
            <textarea name="shippingAddress" required rows={4} />
          </label>
          {formError && <p role="alert">{formError}</p>}
          <button type="submit" className="add-cart-button magnetic">
            Place Order
          </button>
        </form>
      </div>
    </section>
  );
}

export default CheckoutPage;