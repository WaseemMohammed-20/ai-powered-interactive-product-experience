import { useEffect, useRef, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartCountPopping, setIsCartCountPopping] = useState(false);
  const previousTotalItems = useRef(totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (previousTotalItems.current === totalItems) {
      return;
    }

    previousTotalItems.current = totalItems;
    setIsCartCountPopping(true);

    const timeoutId = window.setTimeout(() => {
      setIsCartCountPopping(false);
    }, 360);

    return () => window.clearTimeout(timeoutId);
  }, [totalItems]);

  return (
    <header className={isScrolled ? "navbar is-scrolled" : "navbar"}>
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
          <span
            className={
              isCartCountPopping
                ? "cart-count cart-count--pop"
                : "cart-count"
            }
          >
            {totalItems}
          </span>
        )}
      </NavLink>
    </header>
  );
}

export default Navbar;