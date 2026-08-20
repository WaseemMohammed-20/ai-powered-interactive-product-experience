import { useState } from "react";
import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Headphones, Laptop, Smartphone, Sparkles, Watch } from "lucide-react";
import { Link } from "react-router-dom";

type HomeProduct = {
  name: string;
  category: string;
  tagline: string;
  path: string;
  icon: typeof Watch;
  visualClass: string;
};

const homeProducts: HomeProduct[] = [
  { name: "NEXA ONE", category: "SMARTPHONE", tagline: "Beyond the screen.", path: "/products/phone", icon: Smartphone, visualClass: "home-product-visual--phone" },
  { name: "NEXA PULSE X1", category: "SMARTWATCH", tagline: "Time, reimagined.", path: "/experience", icon: Watch, visualClass: "home-product-visual--watch" },
  { name: "NEXA AIR", category: "PREMIUM AUDIO", tagline: "Hear everything.", path: "/products/headphones", icon: Headphones, visualClass: "home-product-visual--air" },
  { name: "NEXA BOOK", category: "COMPUTING", tagline: "Power without limits.", path: "/products/book", icon: Laptop, visualClass: "home-product-visual--book" },
];

function HomePage() {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const handleProductMove = (event: MouseEvent<HTMLElement>, index: number) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    event.currentTarget.style.setProperty("--home-rotate-x", `${rotateX}deg`);
    event.currentTarget.style.setProperty("--home-rotate-y", `${rotateY}deg`);
    setActiveProduct(index);
  };

  const resetProduct = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--home-rotate-x");
    event.currentTarget.style.removeProperty("--home-rotate-y");
    setActiveProduct(null);
  };

  return (
    <main className="nexa-home">
      <section className="nexa-home-hero">
        <div className="nexa-home-hero-copy">
          <p className="page-eyebrow">NEXA / TECHNOLOGY IN MOTION</p>
          <h1>NEXA<br /><span>in motion.</span></h1>
          <p>Considered electronics for the way you move through the world.</p>
          <Link to="#home-products" className="primary-button magnetic">Explore products <ArrowRight size={18} /></Link>
        </div>
        <div className="nexa-home-hero-visual" aria-hidden="true">
          <div className="home-hero-ring home-hero-ring--one" />
          <div className="home-hero-ring home-hero-ring--two" />
          <div className="home-hero-device"><div className="home-hero-device-screen" /></div>
          <span>01 / 04</span>
        </div>
      </section>

      <section className="home-products-section" id="home-products">
        <header className="home-section-header">
          <div><p className="page-eyebrow">THE ECOSYSTEM</p><h2>Our<br />products.</h2></div>
          <p>Four expressions of the same idea: technology should feel tactile, responsive, and personal.</p>
        </header>
        <div className="home-product-grid">
          {homeProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <article key={product.name} className={activeProduct === index ? "home-product-card is-active" : "home-product-card"} onMouseMove={(event) => handleProductMove(event, index)} onMouseLeave={resetProduct}>
                <div className={`home-product-visual ${product.visualClass}`}><div className="home-product-silhouette" /><Icon size={22} strokeWidth={1.4} /></div>
                <div className="home-product-content"><div><p>{product.category}</p><h3>{product.name}</h3><span>{product.tagline}</span></div><Link to={product.path} className="home-product-link magnetic" aria-label={`Explore ${product.name}`}><ArrowUpRight size={20} /></Link></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-featured-section">
        <div className="home-featured-visual"><div className="home-featured-phone"><div /></div><span>FEATURED / NEXA ONE</span></div>
        <div className="home-featured-copy"><p className="page-eyebrow">NEXA ONE</p><h2>Designed<br />to disappear.</h2><p>A considered smartphone experience built around clarity, precision, and the details that matter every day.</p><Link to="/products/phone" className="secondary-button magnetic">Explore NEXA One <ArrowUpRight size={17} /></Link></div>
      </section>

      <section className="home-brand-section"><Sparkles size={22} /><p className="page-eyebrow">THE NEXA PHILOSOPHY</p><h2>Designed<br />for interaction.</h2><p>Technology should feel tactile, responsive, and personal.</p></section>

      <section className="home-final-cta"><p className="page-eyebrow">THE NEXT ITERATION</p><h2>Explore<br />what's next.</h2><Link to="#home-products" className="primary-button magnetic">Explore products <ArrowRight size={18} /></Link></section>
    </main>
  );
}

export default HomePage;