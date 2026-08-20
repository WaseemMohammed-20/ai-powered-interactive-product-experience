import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowLeft,
  Check,
  Headphones,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { cartStore } from "../../stores/cartStore";
import { analyticsStore } from "../../services/analytics/analyticsStore";

type AirColor = { name: string; value: string; frame: string };
type AirHotspot = "cushions" | "headband" | "controls" | "cup";

const airColors: AirColor[] = [
  { name: "Black", value: "#141414", frame: "#777777" },
  { name: "Silver", value: "#d2d2d2", frame: "#eeeeee" },
  { name: "White", value: "#f0f0f0", frame: "#ffffff" },
];

const airHotspotDetails: Record<AirHotspot, { label: string; title: string; body: string }> = {
  cushions: { label: "COMFORT / 01", title: "Soft isolation", body: "Cushioned ear cups shape the listening space around you with a calm, considered fit." },
  headband: { label: "DESIGN / 02", title: "Engineered for comfort", body: "A continuous curved headband keeps the silhouette light, balanced, and easy to wear." },
  controls: { label: "CONTROL / 03", title: "Quiet control", body: "Essential controls stay close at hand, keeping the listening experience uninterrupted." },
  cup: { label: "SOUND / 04", title: "Hear everything", body: "A focused over-ear design gives your music room to breathe and your attention room to settle." },
};

function AirModel({ color, focusY }: { color: AirColor; focusY: number | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    const keyframes = [-0.25, 0.95, Math.PI, 0.45, -0.25];
    const scaled = progress * (keyframes.length - 1);
    const segment = Math.min(Math.floor(scaled), keyframes.length - 2);
    const local = scaled - segment;
    const scrollRotation = THREE.MathUtils.lerp(keyframes[segment], keyframes[segment + 1], local);
    const targetRotation = focusY ?? scrollRotation;
    const targetX = focusY === null ? 0.08 + Math.sin(progress * Math.PI) * 0.04 : 0.03;
    const targetScale = focusY === null ? 1 + Math.sin(progress * Math.PI) * 0.05 : 1.06;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotation, 3.4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 3.4, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.4, delta));
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.42, 0.13, 18, 64, Math.PI]} />
        <meshStandardMaterial color={color.frame} metalness={0.88} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[-1.42, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.55, 24]} />
        <meshStandardMaterial color={color.frame} metalness={0.82} roughness={0.22} />
      </mesh>
      <mesh position={[1.42, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.55, 24]} />
        <meshStandardMaterial color={color.frame} metalness={0.82} roughness={0.22} />
      </mesh>
      <EarCup position={[-1.5, -0.35, 0]} color={color} side="left" />
      <EarCup position={[1.5, -0.35, 0]} color={color} side="right" />
    </group>
  );
}

function EarCup({ position, color, side }: { position: [number, number, number]; color: AirColor; side: "left" | "right" }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.84, 0.84, 0.38, 48]} />
        <meshStandardMaterial color={color.value} metalness={0.7} roughness={0.24} envMapIntensity={1.35} />
      </mesh>
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.62, 0.18, 18, 48]} />
        <meshStandardMaterial color="#0b0b0b" metalness={0.15} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 40]} />
        <meshStandardMaterial color="#171717" metalness={0.4} roughness={0.3} />
      </mesh>
      {side === "right" && (
        <mesh position={[0.64, 0.08, 0.08]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.2, 20]} />
          <meshStandardMaterial color={color.frame} metalness={0.85} roughness={0.2} />
        </mesh>
      )}
    </group>
  );
}

function AirStage({ color, chapter, activeHotspot, onHotspot, onClose }: { color: AirColor; chapter: number; activeHotspot: AirHotspot | null; onHotspot: (hotspot: AirHotspot) => void; onClose: () => void }) {
  const focusY = activeHotspot === "cushions" || activeHotspot === "cup" ? 0.15 : activeHotspot === "headband" ? -0.2 : activeHotspot === "controls" ? 0.8 : null;

  return (
    <div className="air-stage">
      <div className="air-stage-grid" />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7.2], fov: 38 }} gl={{ antialias: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 6, 5]} intensity={3.2} castShadow />
        <directionalLight position={[-4, 2, 4]} intensity={1.8} />
        <pointLight position={[3, 2, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#a1a1a1" />
        <AirModel color={color} focusY={focusY} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.9, 0]} opacity={0.48} scale={7} blur={2.5} far={4} />
        <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.32} minDistance={4.5} maxDistance={10} enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="air-stage-label"><Headphones size={16} /> 360° exploration</div>
      <div className={`air-hotspot-layer air-hotspot-layer--chapter-${chapter}`}>
        {(chapter === 0 || chapter === 1 || chapter === 4) && <button className="air-hotspot air-hotspot--cushions" type="button" onClick={() => onHotspot("cushions")} aria-label="Show ear cushion information"><span /></button>}
        {(chapter === 0 || chapter === 1 || chapter === 4) && <button className="air-hotspot air-hotspot--headband" type="button" onClick={() => onHotspot("headband")} aria-label="Show headband information"><span /></button>}
        {(chapter === 2 || chapter === 4) && <button className="air-hotspot air-hotspot--controls" type="button" onClick={() => onHotspot("controls")} aria-label="Show control information"><span /></button>}
        {(chapter === 0 || chapter === 2 || chapter === 3 || chapter === 4) && <button className="air-hotspot air-hotspot--cup" type="button" onClick={() => onHotspot("cup")} aria-label="Show ear cup information"><span /></button>}
      </div>
      {activeHotspot && (
        <aside className="air-hotspot-panel" aria-live="polite">
          <button type="button" className="air-hotspot-close" onClick={onClose} aria-label="Close hotspot information">×</button>
          <p className="page-eyebrow">{airHotspotDetails[activeHotspot].label}</p>
          <h3>{airHotspotDetails[activeHotspot].title}</h3>
          <p>{airHotspotDetails[activeHotspot].body}</p>
        </aside>
      )}
    </div>
  );
}

function AirSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="air-detail-section air-reveal"><p className="page-eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</section>;
}

function HeadphonesPage() {
  const [selectedColor, setSelectedColor] = useState(airColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [chapter, setChapter] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<AirHotspot | null>(null);
  const [notificationVersion, setNotificationVersion] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    analyticsStore.track("product_viewed");
  }, []);

  useEffect(() => {
    if (notificationVersion === 0) return;
    const timeoutId = window.setTimeout(() => setIsNotificationVisible(false), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notificationVersion]);

  useEffect(() => {
    let animationFrame = 0;
    let ticking = false;
    const updateChapter = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextChapter = Math.min(4, Math.floor((window.scrollY / maxScroll) * 5));
      setChapter((current) => current === nextChapter ? current : nextChapter);
      ticking = false;
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      animationFrame = window.requestAnimationFrame(updateChapter);
    };
    updateChapter();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleAddToCart = () => {
    analyticsStore.track("product_added_to_cart");
    cartStore.addItem({ id: "nexa-air", name: "NEXA AIR", price: 449, quantity, color: selectedColor.name });
    setIsNotificationVisible(true);
    setNotificationVersion((version) => version + 1);
  };

  return (
    <main className="air-experience-page">
      {isNotificationVisible && <div className="cart-notification" role="status" aria-live="polite"><Check size={18} strokeWidth={3} /><span>NEXA AIR added to your cart</span></div>}
      <section className="air-hero">
        <div className="air-hero-copy reveal">
          <Link to="/products" className="phone-back-link"><ArrowLeft size={16} /> Back to Universe</Link>
          <p className="page-eyebrow reveal-item">NEXA / PREMIUM WIRELESS AUDIO</p>
          <h1 className="reveal-item">NEXA AIR</h1>
          <p className="air-hero-tagline reveal-item">Hear everything.</p>
          <p className="air-hero-description reveal-item">A calm, immersive listening experience shaped around comfort, clarity, and the space between sounds.</p>
        </div>
        <AirStage color={selectedColor} chapter={chapter} activeHotspot={activeHotspot} onHotspot={setActiveHotspot} onClose={() => setActiveHotspot(null)} />
      </section>

      <section className="air-configuration air-reveal">
        <div><p className="page-eyebrow">CONFIGURE YOUR AIR</p><h2>Your sound, considered.</h2></div>
        <div className="air-config-controls">
          <div className="air-control-label"><span>Finish</span><strong>{selectedColor.name}</strong></div>
          <div className="air-color-options">{airColors.map((color) => <button key={color.name} type="button" className={selectedColor.name === color.name ? "air-color-option selected" : "air-color-option"} style={{ backgroundColor: color.value }} onClick={() => { analyticsStore.track("color_selected"); setSelectedColor(color); }} aria-label={`Select ${color.name}`}>{selectedColor.name === color.name && <Check size={16} />}</button>)}</div>
          <div className="air-purchase-row">
            <div className="air-quantity-control"><button type="button" onClick={() => { if (quantity > 1) { analyticsStore.track("quantity_changed"); setQuantity((current) => current - 1); } }} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={17} /></button><span>{quantity}</span><button type="button" onClick={() => { analyticsStore.track("quantity_changed"); setQuantity((current) => current + 1); }} aria-label="Increase quantity"><Plus size={17} /></button></div>
            <button type="button" className="add-cart-button magnetic air-add-button" onClick={handleAddToCart}>Add NEXA AIR to Cart — ${449 * quantity}</button>
          </div>
        </div>
      </section>

      <AirSection eyebrow="SOUND / 01" title="Hear everything."><p>A full, focused listening space that lets detail arrive naturally, without asking for attention.</p></AirSection>
      <AirSection eyebrow="DESIGN / 02" title="Engineered for comfort."><p>A soft, balanced silhouette designed to disappear into the rhythm of your day.</p></AirSection>
      <AirSection eyebrow="NOISE CONTROL / 03" title="Silence, refined."><p>Put distance between you and distraction with a quiet, considered listening environment.</p></AirSection>
      <AirSection eyebrow="SPATIAL AUDIO / 04" title="Sound all around."><p>Move through your music with a sense of space, depth, and presence.</p></AirSection>
      <section className="air-closing air-reveal"><Sparkles size={22} /><h2>Find your quiet.</h2><Link to="/products" className="secondary-button magnetic">Explore the universe</Link></section>
    </main>
  );
}

export default HeadphonesPage;
