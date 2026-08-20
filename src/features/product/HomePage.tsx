import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function HomePage() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          AI-Powered Product Experiences
        </div>

        <h1>
          Products should be
          <span> experienced.</span>
        </h1>

        <p>
          NEXA transforms ordinary product pages into immersive,
          interactive experiences powered by 3D, AI, and real-time
          user interactions.
        </p>

        <div className="hero-actions">
          <Link to="/experience" className="primary-button">
            Explore Experience
            <ArrowRight size={18} />
          </Link>

          <Link to="/about" className="secondary-button">
            Learn More
          </Link>
        </div>
      </div>

      <div className="hero-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="hero-card">
          <span>INTERACTIVE</span>
          <strong>NEXA PULSE X1</strong>
          <p>Immersive product intelligence.</p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;