import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function ProductPlaceholderPage() {
  const location = useLocation();
  const productName = location.pathname.includes("air")
    ? "NEXA AIR"
    : "NEXA BOOK";
  const category = location.pathname.includes("air")
    ? "WIRELESS AUDIO"
    : "LAPTOP";

  return (
    <main className="product-placeholder-page">
      <p className="page-eyebrow">{productName} / {category}</p>
      <h1>{productName} EXPERIENCE</h1>
      <p>COMING NEXT</p>
      <Link to="/products" className="secondary-button magnetic">
        <ArrowLeft size={18} />
        Back to Universe
      </Link>
    </main>
  );
}

export default ProductPlaceholderPage;
