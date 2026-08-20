import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Smartphone,
  Sparkles,
} from "lucide-react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Link } from "react-router-dom";
import { cartStore } from "../../stores/cartStore";
import { analyticsStore } from "../../services/analytics/analyticsStore";
import * as THREE from "three";

type PhoneColor = {
  name: string;
  value: string;
  frame: string;
};

const phoneColors: PhoneColor[] = [
  { name: "Obsidian", value: "#181818", frame: "#8a8a8a" },
  { name: "Silver", value: "#d7d7d7", frame: "#f2f2f2" },
  { name: "Graphite", value: "#4a4a4a", frame: "#b4b4b4" },
];

const storageOptions = [
  { name: "256GB", price: 999 },
  { name: "512GB", price: 1199 },
];

function PhoneLens({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
      <meshStandardMaterial color="#050505" metalness={0.75} roughness={0.12} />
    </mesh>
  );
}

type HotspotId = "display" | "camera" | "button" | "frame";

const hotspotDetails: Record<HotspotId, { label: string; title: string; body: string }> = {
  display: {
    label: "DISPLAY / 01",
    title: "Immersive display",
    body: "Deep blacks, precise contrast, and a calm visual rhythm make every interaction feel intentional.",
  },
  camera: {
    label: "CAMERA / 02",
    title: "See what matters",
    body: "A focused camera system designed to preserve texture, light, and the feeling inside the frame.",
  },
  button: {
    label: "CONTROL / 03",
    title: "Quiet control",
    body: "Thoughtful physical controls keep essential actions close without interrupting the experience.",
  },
  frame: {
    label: "BUILD / 04",
    title: "Precision metal",
    body: "A considered frame balances a reassuring hand feel with the visual clarity of the whole device.",
  },
};

function PhoneModel({ color, focusY }: { color: PhoneColor; focusY: number | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    const keyframes = [0, 0.78, Math.PI, 0.42, -0.22];
    const segment = Math.min(Math.floor(progress * (keyframes.length - 1)), keyframes.length - 2);
    const localProgress = progress * (keyframes.length - 1) - segment;
    const scrollRotation = THREE.MathUtils.lerp(keyframes[segment], keyframes[segment + 1], localProgress);
    const targetRotation = focusY ?? scrollRotation;
    const targetX = focusY === null ? 0.08 + Math.sin(progress * Math.PI) * 0.04 : 0.03;
    const targetScale = focusY === null ? 1 + Math.sin(progress * Math.PI) * 0.04 : 1.06;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotation, 3.5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.22, 0]}>
      <RoundedBox args={[2.42, 4.7, 0.34]} radius={0.28} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial color={color.frame} metalness={0.88} roughness={0.2} envMapIntensity={1.5} />
      </RoundedBox>
      <RoundedBox args={[2.22, 4.5, 0.07]} radius={0.22} smoothness={8} position={[0, 0, 0.22]} castShadow>
        <meshStandardMaterial color="#050505" metalness={0.25} roughness={0.12} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.2, 0.07]} radius={0.09} smoothness={5} position={[0, 1.88, 0.28]}>
        <meshStandardMaterial color="#000000" roughness={0.16} />
      </RoundedBox>
      <group position={[-0.62, 1.44, -0.23]} rotation={[Math.PI / 2, 0, 0]}>
        <RoundedBox args={[1.08, 1.04, 0.14]} radius={0.2} smoothness={6} castShadow>
          <meshStandardMaterial color="#101010" metalness={0.35} roughness={0.2} />
        </RoundedBox>
        <PhoneLens position={[-0.25, 0.25, -0.1]} />
        <PhoneLens position={[0.25, 0.25, -0.1]} />
        <PhoneLens position={[-0.25, -0.25, -0.1]} />
      </group>
      <RoundedBox args={[0.1, 0.58, 0.08]} radius={0.04} smoothness={4} position={[1.24, 0.66, 0]} castShadow>
        <meshStandardMaterial color={color.frame} metalness={0.85} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.38, 0.08]} radius={0.04} smoothness={4} position={[-1.24, 0.9, 0]} castShadow>
        <meshStandardMaterial color={color.frame} metalness={0.85} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.38, 0.08]} radius={0.04} smoothness={4} position={[-1.24, 0.42, 0]} castShadow>
        <meshStandardMaterial color={color.frame} metalness={0.85} roughness={0.2} />
      </RoundedBox>
    </group>
  );
}

function PhoneStage({
  color,
  storyChapter,
  activeHotspot,
  onHotspot,
  onCloseHotspot,
}: {
  color: PhoneColor;
  storyChapter: number;
  activeHotspot: HotspotId | null;
  onHotspot: (hotspot: HotspotId) => void;
  onCloseHotspot: () => void;
}) {
  return (
    <div className="phone-stage">
      <div className="phone-stage-grid" />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7.4], fov: 34 }} gl={{ antialias: true }}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[5, 6, 5]} intensity={3.2} castShadow />
        <directionalLight position={[-4, 2, 4]} intensity={1.8} />
        <pointLight position={[3, 1, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#a1a1a1" />
        <PhoneModel color={color} focusY={activeHotspot === "camera" ? Math.PI : activeHotspot === "button" ? 0.78 : activeHotspot === "display" ? 0.25 : activeHotspot === "frame" ? -0.35 : null} />
        <Environment preset="city" />
        <ContactShadows position={[0, -2.8, 0]} opacity={0.5} scale={7} blur={2.4} far={5} />
        <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.35} minDistance={4.8} maxDistance={10} enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="phone-stage-label"><Smartphone size={16} /> Interactive object</div>
      <div className={`phone-hotspot-layer phone-hotspot-layer--chapter-${storyChapter}`}>
        {(storyChapter === 0 || storyChapter === 3 || storyChapter === 4) && (
          <button className="phone-hotspot phone-hotspot--display" type="button" onClick={() => onHotspot("display")} aria-label="Show display information"><span /></button>
        )}
        {(storyChapter === 2 || storyChapter === 4) && (
          <button className="phone-hotspot phone-hotspot--camera" type="button" onClick={() => onHotspot("camera")} aria-label="Show camera information"><span /></button>
        )}
        {(storyChapter === 1 || storyChapter === 4) && (
          <button className="phone-hotspot phone-hotspot--button" type="button" onClick={() => onHotspot("button")} aria-label="Show button information"><span /></button>
        )}
        {(storyChapter === 0 || storyChapter === 1 || storyChapter === 2 || storyChapter === 3 || storyChapter === 4) && (
          <button className="phone-hotspot phone-hotspot--frame" type="button" onClick={() => onHotspot("frame")} aria-label="Show frame information"><span /></button>
        )}
      </div>
      {activeHotspot && (
        <aside className="phone-hotspot-panel" aria-live="polite">
          <button type="button" className="phone-hotspot-close" onClick={onCloseHotspot} aria-label="Close hotspot information">×</button>
          <p className="page-eyebrow">{hotspotDetails[activeHotspot].label}</p>
          <h3>{hotspotDetails[activeHotspot].title}</h3>
          <p>{hotspotDetails[activeHotspot].body}</p>
        </aside>
      )}
    </div>
  );
}

function PhoneSection({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`phone-detail-section ${className}`}>
      <p className="page-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function PhonePlaceholderPage() {
  const [selectedColor, setSelectedColor] = useState(phoneColors[0]);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [notificationVersion, setNotificationVersion] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [storyChapter, setStoryChapter] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);

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
      const progress = Math.min(window.scrollY / maxScroll, 1);
      const nextChapter = Math.min(4, Math.floor(progress * 5));

      setStoryChapter((currentChapter) =>
        currentChapter === nextChapter ? currentChapter : nextChapter
      );
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
    cartStore.addItem({
      id: `nexa-one-${selectedStorage.name}`,
      name: `NEXA One ${selectedStorage.name}`,
      price: selectedStorage.price,
      quantity,
      color: selectedColor.name,
    });
    setIsNotificationVisible(true);
    setNotificationVersion((version) => version + 1);
  };

  return (
    <main className="phone-experience-page">
      {isNotificationVisible && <div className="cart-notification" role="status" aria-live="polite"><Check size={18} strokeWidth={3} /><span>NEXA One added to your cart</span></div>}

      <section className="phone-hero">
        <div className="phone-hero-copy reveal">
          <Link to="/products" className="phone-back-link"><ArrowLeft size={16} /> Back to Universe</Link>
          <p className="page-eyebrow reveal-item">NEXA / SMARTPHONE</p>
          <h1 className="reveal-item">NEXA ONE</h1>
          <p className="phone-hero-tagline reveal-item">A clearer way forward.</p>
          <p className="phone-hero-description reveal-item">A considered smartphone experience built around clarity, precision, and the details that matter every day.</p>
        </div>
        <PhoneStage
          color={selectedColor}
          storyChapter={storyChapter}
          activeHotspot={activeHotspot}
          onHotspot={setActiveHotspot}
          onCloseHotspot={() => setActiveHotspot(null)}
        />
      </section>

      <section className="phone-configuration phone-reveal">
        <div className="phone-config-heading"><p className="page-eyebrow">ULTRA THIN / 02</p><h2>Made personal.</h2></div>
        <div className="phone-config-controls">
          <div className="phone-control-group">
            <div className="phone-control-label"><span>Finish</span><strong>{selectedColor.name}</strong></div>
            <div className="phone-color-options">
              {phoneColors.map((color) => <button key={color.name} type="button" className={selectedColor.name === color.name ? "phone-color-option selected" : "phone-color-option"} style={{ backgroundColor: color.value }} onClick={() => { analyticsStore.track("color_selected"); setSelectedColor(color); }} aria-label={`Select ${color.name}`}>{selectedColor.name === color.name && <Check size={16} />}</button>)}
            </div>
          </div>
          <div className="phone-control-group">
            <div className="phone-control-label"><span>Storage</span><strong>{selectedStorage.name}</strong></div>
            <div className="phone-storage-options">
              {storageOptions.map((storage) => <button key={storage.name} type="button" className={selectedStorage.name === storage.name ? "phone-storage-option selected" : "phone-storage-option"} onClick={() => setSelectedStorage(storage)}>{storage.name}</button>)}
            </div>
          </div>
        </div>
        <div className="phone-purchase-row">
          <div className="phone-quantity-control">
            <button type="button" onClick={() => { if (quantity > 1) { analyticsStore.track("quantity_changed"); setQuantity((current) => current - 1); } }} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={17} /></button>
            <span>{quantity}</span>
            <button type="button" onClick={() => { analyticsStore.track("quantity_changed"); setQuantity((current) => current + 1); }} aria-label="Increase quantity"><Plus size={17} /></button>
          </div>
          <button type="button" className="add-cart-button magnetic phone-add-button" onClick={handleAddToCart}>Add NEXA One to Cart — ${selectedStorage.price * quantity}</button>
        </div>
      </section>

      <PhoneSection eyebrow="IMMERSIVE DISPLAY / 03" title="Every detail, alive." className="phone-display-section phone-reveal"><div className="phone-detail-visual phone-display-visual"><div className="phone-display-glass" /><span>FRONT EXPERIENCE</span></div><p>Deep blacks, precise contrast, and a calm visual rhythm make every interaction feel intentional.</p></PhoneSection>
      <PhoneSection eyebrow="ADVANCED CAMERA / 04" title="See what matters" className="phone-camera-section phone-reveal"><div className="phone-camera-visual"><div className="phone-camera-lens lens-one" /><div className="phone-camera-lens lens-two" /><div className="phone-camera-lens lens-three" /></div><p>A focused camera system designed to preserve texture, light, and the feeling inside the frame.</p></PhoneSection>
      <PhoneSection eyebrow="FULL PRODUCT EXPERIENCE / 05" title="Quietly powerful" className="phone-performance-section phone-reveal"><div className="phone-spec-grid"><div><span>PROCESSOR</span><strong>N1 SILICON</strong></div><div><span>BATTERY</span><strong>ALL DAY / NIGHT</strong></div><div><span>CONNECTIVITY</span><strong>SEAMLESS</strong></div><div><span>BUILD</span><strong>PRECISION METAL</strong></div></div></PhoneSection>
      <section className="phone-closing phone-reveal"><Sparkles size={22} /><h2>Everything, made clearer.</h2><Link to="/products" className="secondary-button magnetic">Explore the universe</Link></section>
    </main>
  );
}

export default PhonePlaceholderPage;
