import { useEffect, useState } from "react";
import { login, register } from "../../api";
import "./AuthGate.css";

function AuthGate({ isOpen = false, initialMode = "login", onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: "", password: "", role: "PATIENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = mode === "login"
        ? await login(formData.username, formData.password)
        : await register(formData.username, formData.password, formData.role);
      onAuthSuccess?.(auth);
      onClose?.();
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the healthcare API.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-gate-shell" onClick={onClose}>
      <div className="auth-gate-card" onClick={(event) => event.stopPropagation()}>
        <div className="auth-gate-header">
          <p className="eyebrow">Protected access</p>
          <h1>Secure access to healthcare-telemedicine</h1>
          <p>Use your backend account to continue to the care dashboard.</p>
        </div>
        <div className="auth-toggle">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Username<input name="username" type="text" value={formData.username} onChange={handleChange} autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
          {mode === "register" ? <label>Account type<select name="role" value={formData.role} onChange={handleChange}><option value="PATIENT">Patient</option><option value="DOCTOR">Doctor</option></select></label> : null}
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Connecting…" : mode === "login" ? "Login" : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}

export default AuthGate;
