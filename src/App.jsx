import { useEffect, useMemo, useState } from "react";
import Home from "./Home";
import AuthGate from "./features/auth/AuthGate";
import { clearSession, getStoredUser } from "./api";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState("patient");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(getStoredUser);
  const availableModes = useMemo(() => ["patient", "doctor", "pharmacy", "manager"], []);

  useEffect(() => {
    const roles = user?.roles || [];
    if (roles.includes("ROLE_DOCTOR")) setMode("doctor");
    else if (roles.includes("ROLE_PHARMACY_PARTNER")) setMode("pharmacy");
    else if (roles.includes("ROLE_HEALTH_MANAGER") || roles.includes("ROLE_ADMIN")) setMode("manager");
  }, [user]);

  const openAuth = (nextMode = "login") => {
    setAuthMode(nextMode);
    setAuthOpen(true);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setMode("patient");
  };

  return (
    <>
      <Home
        mode={mode}
        availableModes={availableModes}
        onModeChange={setMode}
        authOpen={authOpen}
        onAuthOpenChange={setAuthOpen}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={openAuth}
      />
      <AuthGate
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={setUser}
      />
    </>
  );
}
