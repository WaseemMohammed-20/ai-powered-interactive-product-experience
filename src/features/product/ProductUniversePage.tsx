import { useState } from "react";
import type { MouseEvent } from "react";
import { ArrowUpRight, Smartphone, Watch, Headphones, Laptop } from "lucide-react";
import { Link } from "react-router-dom";

type ProductCard = {
  name: string;
  category: string;
  description: string;
  path: string;
  icon: typeof Watch;
  visualClass: string;
};

const products: ProductCard[] = [
  {
    name: "NEXA Pulse X1",
    category: "Smartwatch",
    description: "Intelligence for every second that matters.",
    path: "/experience",
    icon: Watch,
    visualClass: "product-universe-visual--watch",
  },
  {
    name: "NEXA One",
    category: "Smartphone",
    description: "A more considered way to stay connected.",
    path: "/products/phone",
    icon: Smartphone,
    visualClass: "product-universe-visual--phone",
  },
  {
    name: "NEXA Air",
    category: "Wireless Audio",
    description: "Clarity, carried with you.",
    path: "/products/headphones",
    icon: Headphones,
    visualClass: "product-universe-visual--audio",
  },
  {
    name: "NEXA Book",
    category: "Laptop",
    description: "A focused machine for expansive thinking.",
    path: "/products/book",
    icon: Laptop,
    visualClass: "product-universe-visual--laptop",
  },
];

function ProductUniversePage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardMove = (
    event: MouseEvent<HTMLElement>,
    index: number
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;

    event.currentTarget.style.setProperty("--card-rotate-x", `${y}deg`);
    event.currentTarget.style.setProperty("--card-rotate-y", `${x}deg`);
    setActiveCard(index);
  };

  const resetCard = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--card-rotate-x");
    event.currentTarget.style.removeProperty("--card-rotate-y");
    setActiveCard(null);
  };

  return (
    <main className="product-universe-page">
      <header className="product-universe-header">
        <p className="page-eyebrow">THE NEXA UNIVERSE</p>
        <h1>Technology, considered.</h1>
        <p>
          Explore the products that make up the NEXA ecosystem. Each one is
          designed to feel clear, capable, and quietly exceptional.
        </p>
      </header>

      <section className="product-universe-grid" aria-label="NEXA products">
        {products.map((product, index) => {
          const Icon = product.icon;

          return (
            <article
              className={
                activeCard === index
                  ? "product-universe-card is-active"
                  : "product-universe-card"
              }
              key={product.name}
              onMouseMove={(event) => handleCardMove(event, index)}
              onMouseLeave={resetCard}
            >
              <div className={`product-universe-visual ${product.visualClass}`}>
                <div className="product-universe-silhouette" />
                <Icon size={22} strokeWidth={1.4} />
              </div>

              <div className="product-universe-card-content">
                <div>
                  <p>{product.category}</p>
                  <h2>{product.name}</h2>
                  <span>{product.description}</span>
                </div>
                <Link
                  className="product-universe-explore magnetic"
                  to={product.path}
                  aria-label={`Explore ${product.name}`}
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default ProductUniversePage;
