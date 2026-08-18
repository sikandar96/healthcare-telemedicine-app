import { useMemo, useState } from "react";
import Home from "./Home";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState("patient");
  const [authOpen, setAuthOpen] = useState(false);
  const availableModes = useMemo(() => ["patient", "doctor", "pharmacy", "manager"], []);

  return (
    <Home
      mode={mode}
      availableModes={availableModes}
      onModeChange={setMode}
      authOpen={authOpen}
      onAuthOpenChange={setAuthOpen}
    />
  );
}
