import { useEffect, useMemo, useState } from "react";
import Home from "./Home";
import AuthGate from "./features/auth/AuthGate";
import { api, clearSession, getStoredUser, getToken } from "./api";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState("patient");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(getStoredUser);
  const availableModes = useMemo(() => {
    const rawRoles = user?.roles || user?.authorities || user?.role || [];
    const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles]).map((role) => (typeof role === "string" ? role : role?.name || role?.authority || "").toUpperCase());
    const modes = [];
    if (roles.some((role) => role === "ROLE_PATIENT" || role === "PATIENT")) modes.push("patient");
    if (roles.some((role) => role === "ROLE_DOCTOR" || role === "DOCTOR")) modes.push("doctor");
    if (roles.some((role) => role === "ROLE_PHARMACY_PARTNER" || role === "PHARMACY_PARTNER" || role === "ROLE_PHARMACY" || role === "PHARMACY")) modes.push("pharmacy");
    if (roles.some((role) => role === "ROLE_HEALTH_MANAGER" || role === "HEALTH_MANAGER" || role === "ROLE_ADMIN" || role === "MANAGER")) modes.push("manager");
    return modes.length ? modes : ["patient"];
  }, [user]);

  useEffect(() => {
    if (!getToken()) return;
    let active = true;
    api.me().then((me) => {
      if (!active || !me) return;
      const username = typeof me === "string" ? me : me.username || me.name;
      setUser((current) => ({ ...current, ...(typeof me === "object" ? me : {}), username: username || current?.username, roles: (typeof me === "object" && (me.roles || me.authorities)) || current?.roles || [] }));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const rawRoles = user?.roles || user?.authorities || user?.role || [];
    const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles]).map((role) => (typeof role === "string" ? role : role?.name || role?.authority || "").toUpperCase());
    if (roles.some((role) => role === "DOCTOR" || role === "ROLE_DOCTOR")) setMode("doctor");
    else if (roles.some((role) => role === "PHARMACY" || role === "PHARMACY_PARTNER" || role === "ROLE_PHARMACY_PARTNER")) setMode("pharmacy");
    else if (roles.some((role) => role === "MANAGER" || role === "HEALTH_MANAGER" || role === "ROLE_HEALTH_MANAGER" || role === "ROLE_ADMIN")) setMode("manager");
    else setMode("patient");
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
