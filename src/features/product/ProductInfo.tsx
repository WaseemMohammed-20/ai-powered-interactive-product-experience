import type { ProductColor } from "../../data/product";
import { Check, Minus, Plus } from "lucide-react";

type ProductInfoProps = {
  name: string;
  tagline: string;
  description: string;
  price: number;
  colors: ProductColor[];
  selectedColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
};

function ProductInfo({
  name,
  tagline,
  description,
  price,
  colors,
  selectedColor,
  onColorChange,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}: ProductInfoProps) {
  return (
    <div className="product-info">
      <p className="product-label">NEXA / WEARABLES</p>

      <h1>{name}</h1>

      <h2>{tagline}</h2>

      <p className="product-description">{description}</p>

      <div className="product-price">
        ${price}
      </div>

      <div className="product-section">
        <div className="section-header">
          <span>Finish</span>
          <strong>{selectedColor.name}</strong>
        </div>

        <div className="color-options">
          {colors.map((color) => {
            const isSelected =
              color.id === selectedColor.id;

            return (
              <button
                key={color.id}
                type="button"
                className={`color-option ${
                  isSelected ? "selected" : ""
                }`}
                style={{
                  backgroundColor: color.value,
                }}
                onClick={() => onColorChange(color)}
                aria-label={`Select ${color.name}`}
              >
                {isSelected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="product-section">
        <div className="section-header">
          <span>Quantity</span>
        </div>

        <div className="quantity-control">
          <button
            type="button"
            onClick={onDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={onIncrease}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="add-cart-button"
        onClick={onAddToCart}
      >
        Add {quantity} to Cart — $
        {(price * quantity).toFixed(2)}
      </button>
    </div>
  );
}

export default ProductInfo;