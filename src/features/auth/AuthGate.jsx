import { useEffect, useMemo, useState } from "react";
import "./AuthGate.css";

const initialUsers = [
  {
    id: 1,
    name: "Dr. Maya Chen",
    email: "doctor@carelink.com",
    password: "care123",
  },
  {
    id: 2,
    name: "Patient User",
    email: "patient@carelink.com",
    password: "care123",
  },
];

function AuthGate({
  isOpen = false,
  initialMode = "login",
  onClose,
  onAuthSuccess,
}) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const users = useMemo(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return initialUsers;
    }

    const stored = window.localStorage.getItem("carelink-users");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const existingUsers = users;
    const match = existingUsers.find(
      (item) =>
        item.email === formData.email && item.password === formData.password,
    );

    if (mode === "login") {
      if (match) {
        setUser(match);
        onAuthSuccess?.(match);
        onClose?.();
        return;
      }
      setError("Invalid email or password.");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      setError("Please fill in all fields to register.");
      return;
    }

    const nextUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    };
    const nextUsers = [...existingUsers, nextUser];
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("carelink-users", JSON.stringify(nextUsers));
    }
    setUser(nextUser);
    onAuthSuccess?.(nextUser);
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-gate-shell" onClick={onClose}>
      <div
        className="auth-gate-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-gate-header">
          <p className="eyebrow">Protected access</p>
          <h1>Secure access to Healthcare & Telemedicine</h1>
          <p>Register or login to continue to the dashboard.</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <label>
                Full name
                <input
                  name="name"
                  type="text"
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Mobile number
                <input
                  name="mobile"
                  type="tel"
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          ) : null}

          <label>
            Email
            <input name="email" type="email" onChange={handleChange} required />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="primary-btn">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthGate;
