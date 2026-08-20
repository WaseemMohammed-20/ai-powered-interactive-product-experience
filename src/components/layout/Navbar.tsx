import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";

const navigationLinks = [
  { name: "Experience", path: "/experience" },
  { name: "Analytics", path: "/analytics" },
  { name: "About", path: "/about" },
];

function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-logo">
        NEXA
      </NavLink>

      <nav className="navbar-links">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <NavLink to="/cart" className="cart-button">
        <ShoppingBag size={20} />

        <span>Cart</span>

        {totalItems > 0 && (
          <span className="cart-count">
            {totalItems}
          </span>
        )}
      </NavLink>
    </header>
  );
}

export default Navbar;