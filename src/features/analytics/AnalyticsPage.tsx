import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  BarChart3,
  CheckCircle2,
  Eye,
  Palette,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { analyticsStore } from "../../services/analytics/analyticsStore";
import { useSyncExternalStore } from "react";

type CountUpProps = {
  value: number;
  decimals?: number;
  suffix?: string;
};

function CountUp({ value, decimals = 0, suffix = "" }: CountUpProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = valueRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!element || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let animationFrame = 0;
    let observer: IntersectionObserver | undefined;

    const animate = () => {
      const startTime = performance.now();

      const render = (timestamp: number) => {
        const progress = Math.min((timestamp - startTime) / 720, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(value * easedProgress);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(render);
        }
      };

      animationFrame = window.requestAnimationFrame(render);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer?.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [value]);

  return (
    <span ref={valueRef}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

type MetricCardProps = {
  label: string;
  value: number;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  featured?: boolean;
  decimals?: number;
  suffix?: string;
};

function MetricCard({
  label,
  value,
  icon: Icon,
  featured = false,
  decimals = 0,
  suffix = "",
}: MetricCardProps) {
  return (
    <article className={featured ? "analytics-card featured" : "analytics-card"}>
      <div className="analytics-card-topline">
        <span className="analytics-card-icon">
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <span className="analytics-card-index">/ 0{featured ? 7 : 1}</span>
      </div>
      <p>{label}</p>
      <h2>
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </h2>
    </article>
  );
}

function AnalyticsPage() {
  const metrics = useSyncExternalStore(
    (callback) => analyticsStore.subscribe(callback),
    () => analyticsStore.getMetrics(),
    () => analyticsStore.getMetrics()
  );

  const conversionRate = metrics.productViews === 0
    ? 0
    : (metrics.completedOrders / metrics.productViews) * 100;

  const hasActivity = Object.values(metrics).some((value) => value > 0);

  return (
    <section className="page-container analytics-page">
      <header className="analytics-header">
        <div>
          <p className="page-eyebrow">PRODUCT INTELLIGENCE</p>
          <h1>Interaction insights.</h1>
        </div>
        <p className="analytics-description">
          Session metrics from product discovery through checkout, updated as
          users interact with the experience.
        </p>
      </header>

      {!hasActivity ? (
        <div className="analytics-empty-state">
          <BarChart3 size={38} strokeWidth={1.3} />
          <h2>No interaction data yet</h2>
          <p>
            Product and checkout insights will appear after you interact with
            the NEXA experience.
          </p>
        </div>
      ) : (
        <>
          <div className="analytics-grid">
            <MetricCard
              label="Product Views"
              value={metrics.productViews}
              icon={Eye}
            />
            <MetricCard
              label="Color Selections"
              value={metrics.colorSelections}
              icon={Palette}
            />
            <MetricCard
              label="Quantity Changes"
              value={metrics.quantityChanges}
              icon={SlidersHorizontal}
            />
            <MetricCard
              label="Add to Cart Events"
              value={metrics.addToCartCount}
              icon={ShoppingCart}
            />
            <MetricCard
              label="Cart Visits"
              value={metrics.cartVisits}
              icon={ShoppingCart}
            />
            <MetricCard
              label="Completed Orders"
              value={metrics.completedOrders}
              icon={CheckCircle2}
            />
            <MetricCard
              label="Conversion Rate"
              value={conversionRate}
              icon={BarChart3}
              featured
              decimals={1}
              suffix="%"
            />
          </div>

          <section className="analytics-insight-panel">
            <div>
              <p className="page-eyebrow">ENGAGEMENT SIGNALS</p>
              <h2>From interest to intent.</h2>
            </div>
            <div className="analytics-signal-list">
              <div>
                <span>Product discovery</span>
                <strong>{metrics.productViews} views</strong>
              </div>
              <div>
                <span>Cart activity</span>
                <strong>{metrics.addToCartCount} additions</strong>
              </div>
              <div>
                <span>Checkout activity</span>
                <strong>{metrics.completedOrders} completed</strong>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default AnalyticsPage;