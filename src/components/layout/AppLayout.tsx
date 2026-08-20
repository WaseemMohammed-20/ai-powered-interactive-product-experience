import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PremiumInteractions from "../common/PremiumInteractions";
import Navbar from "./Navbar";

function AppLayout() {
  const location = useLocation();
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  return (
    <div className="app-layout">
      <PremiumInteractions />
      <Navbar />

      {isLoaderVisible && (
        <div
          className="app-loader"
          aria-hidden="true"
          onAnimationEnd={() => setIsLoaderVisible(false)}
        >
          <span className="app-loader-wordmark">NEXA</span>
          <span className="app-loader-line" />
        </div>
      )}

      <main className="app-content" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;