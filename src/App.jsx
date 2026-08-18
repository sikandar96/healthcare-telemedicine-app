import { useState } from "react";
import "./App.css";
import Sidebar from "./features/layout/Sidebar/Sidebar";
import TopBar from "./features/layout/TopBar/TopBar";
import Footer from "./features/layout/Footer/Footer";
import HeroSection from "./features/dashboard/HeroSection/HeroSection";
import StatsSection from "./features/dashboard/StatsSection/StatsSection";
import ServicesSection from "./features/dashboard/ServicesSection/ServicesSection";
import SecuritySection from "./features/dashboard/SecuritySection/SecuritySection";
import RevenueSection from "./features/dashboard/RevenueSection/RevenueSection";
import AuthGate from "./features/auth/AuthGate";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => setIsAuthOpen(false);

  return (
    <div className="app-shell">
      <div className="main-panel">
        <Sidebar
          user={user}
          onLogin={() => openAuth("login")}
          onRegister={() => openAuth("register")}
          onLogout={() => setUser(null)}
        />
        <TopBar user={user} onOpenAuth={openAuth} />

        <main className="content-area">
          <HeroSection />
          <StatsSection />
          <ServicesSection />
          <SecuritySection />
          <RevenueSection />
        </main>

        <Footer />
      </div>

      <AuthGate
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={closeAuth}
        onAuthSuccess={setUser}
      />
    </div>
  );
}

export default App;
