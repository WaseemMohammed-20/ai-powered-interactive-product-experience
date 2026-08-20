import { useSyncExternalStore } from "react";
import { analyticsStore } from "../../services/analytics/analyticsStore";

function AnalyticsPage() {
  const metrics = useSyncExternalStore(
    (callback) => analyticsStore.subscribe(callback),
    () => analyticsStore.getMetrics(),
    () => analyticsStore.getMetrics()
  );

  const conversionRate = metrics.productViews === 0
    ? 0
    : (metrics.completedOrders / metrics.productViews) * 100;

  const dashboardMetrics = [
    ["Product Views", metrics.productViews],
    ["Color Selections", metrics.colorSelections],
    ["Quantity Changes", metrics.quantityChanges],
    ["Add to Cart Count", metrics.addToCartCount],
    ["Cart Visits", metrics.cartVisits],
    ["Completed Orders", metrics.completedOrders],
  ];

  return (
    <section className="page-container">
      <p className="page-eyebrow">REAL-TIME INSIGHTS</p>

      <h1>Experience Analytics</h1>

      <div className="feature-grid">
        {dashboardMetrics.map(([label, value]) => (
          <article className="feature-card" key={label}>
            <p>{label}</p>
            <h2>{value}</h2>
          </article>
        ))}

        <article className="feature-card">
          <p>Conversion Rate</p>
          <h2>{conversionRate.toFixed(1)}%</h2>
          <p>
            Completed Orders / Product Views * 100
          </p>
        </article>
      </div>
    </section>
  );
}

export default AnalyticsPage;