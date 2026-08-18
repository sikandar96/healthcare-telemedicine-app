import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, Stethoscope, UserRound, X } from "lucide-react";
import { login, register, requestPasswordReset, resetPassword } from "../../api";
import "./AuthGate.css";

const benefits = ["Private, encrypted care access", "Certified doctors and local partners", "One calm place for every care moment"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/;

function AuthGate({ isOpen = false, initialMode = "login", onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "", email: "", phone: "", role: "PATIENT", identifier: "", token: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setMessage("");
    setShowPassword(false);
  }, [initialMode, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setMessage("");
  };

  const validateRegistration = () => {
    const nextErrors = {};
    if (!formData.username.trim()) nextErrors.username = "Enter a username.";
    if (formData.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!emailPattern.test(formData.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!phonePattern.test(formData.phone.replace(/[\s-]/g, ""))) nextErrors.phone = "Enter a valid Indian mobile number.";
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    return nextErrors;
  };

  const validateLogin = () => {
    const nextErrors = {};
    if (!formData.username.trim()) nextErrors.username = "Enter your username.";
    if (!formData.password) nextErrors.password = "Enter your password.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage("");
    const validationErrors = mode === "register" ? validateRegistration() : validateLogin();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const auth = mode === "login"
        ? await login(formData.username.trim(), formData.password)
        : await register(formData.username.trim(), formData.password, formData.role, formData.email.trim(), formData.phone.trim());
      onAuthSuccess?.(auth);
      onClose?.();
    } catch (requestError) {
      setErrors({ form: requestError.message || "Unable to connect to the healthcare API." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (!formData.identifier.trim()) {
      setErrors({ identifier: "Enter your username or email." });
      return;
    }
    setLoading(true);
    setErrors({});
    setMessage("");
    try {
      const result = await requestPasswordReset(formData.identifier.trim());
      setFormData((current) => ({ ...current, token: result }));
      setMessage("Recovery request accepted. Enter the reset token returned by your care administrator, then choose a new password.");
    } catch (requestError) {
      setErrors({ form: requestError.message || "We could not find that account." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.token.trim()) nextErrors.token = "Enter your reset token.";
    if (formData.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await resetPassword(formData.token.trim(), formData.password);
      setMessage("Your password has been reset. You can now sign in.");
      setMode("login");
      setFormData((current) => ({ ...current, password: "", confirmPassword: "", token: "" }));
    } catch (requestError) {
      setErrors({ form: requestError.message || "This reset token is invalid or expired." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  const isRecovery = mode === "forgot" || mode === "reset";
  const title = mode === "login" ? "Sign in to your care space" : mode === "register" ? "Create your care account" : mode === "forgot" ? "Recover your care account" : "Choose a new password";
  const subtitle = mode === "login" ? "Pick up where your healthcare journey left off." : mode === "register" ? "A few details, then a clearer next step for your health." : mode === "forgot" ? "We will help you get back into your secure care space." : "Use the short-lived token from your recovery request.";

  return (
    <div className="auth-gate-shell" onClick={onClose} role="presentation">
      <div className="auth-gate-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close authentication dialog"><X size={19} /></button>
        <aside className="auth-side-panel">
          <div className="auth-side-brand"><span className="auth-logo"><Stethoscope size={21} /></span><span>healthcare<span>-telemedicine</span></span></div>
          <div className="auth-side-copy"><p className="auth-kicker">Your care, connected</p><h2>Feel supported<br /><em>at every step.</em></h2><p>Secure access to doctors, medicines, reminders, and the people helping you live well.</p></div>
          <div className="auth-benefits">{benefits.map((benefit) => <span key={benefit}><CheckCircle2 size={15} /> {benefit}</span>)}</div>
        </aside>
        <section className="auth-form-panel">
          <div className="auth-mobile-brand"><span className="auth-logo"><Stethoscope size={19} /></span><strong>healthcare<span>-telemedicine</span></strong></div>
          <div className="auth-form-header"><p className="auth-kicker">{mode === "login" ? "Welcome back" : mode === "register" ? "Start your care journey" : "Account recovery"}</p><h1 id="auth-title">{title}</h1><p>{subtitle}</p></div>
          {!isRecovery ? <div className="auth-toggle" role="tablist" aria-label="Authentication mode"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign in</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Create account</button></div> : null}
          {mode === "forgot" ? <form className="auth-form" onSubmit={handleForgotPassword}><label><span><Mail size={15} /> Username or email</span><input name="identifier" type="text" value={formData.identifier} onChange={handleChange} placeholder="you@example.com or username" autoComplete="username" required /></label><button type="submit" className="auth-submit" disabled={loading}>{loading ? "Checking…" : "Send recovery request"}<ArrowRight size={17} /></button></form> : null}
          {mode === "reset" ? <form className="auth-form" onSubmit={handleResetPassword}><label><span><ShieldCheck size={15} /> Reset token</span><input name="token" type="text" value={formData.token} onChange={handleChange} placeholder="Paste your recovery token" required /></label><PasswordField name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} label="New password" error={errors.password} /><PasswordField name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} label="Confirm new password" error={errors.confirmPassword} /><button type="submit" className="auth-submit" disabled={loading}>{loading ? "Updating…" : "Reset password"}<ArrowRight size={17} /></button></form> : null}
          {!isRecovery ? <form className="auth-form" onSubmit={handleSubmit}><Field name="username" label="Username" icon={<UserRound size={15} />} value={formData.username} onChange={handleChange} error={errors.username} placeholder="Enter your username" /><PasswordField name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} label="Password" error={errors.password} />{mode === "register" ? <><Field name="email" label="Email address" icon={<Mail size={15} />} value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" type="email" /><Field name="phone" label="Indian mobile number" icon={<Phone size={15} />} value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" type="tel" /><PasswordField name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} label="Confirm password" error={errors.confirmPassword} /><label><span><Stethoscope size={15} /> I am joining as</span><select name="role" value={formData.role} onChange={handleChange}><option value="PATIENT">Patient</option><option value="DOCTOR">Doctor</option></select></label></> : <div className="auth-helper"><ShieldCheck size={14} /> Your session is protected by secure token access.</div>}<button type="submit" className="auth-submit" disabled={loading}>{loading ? "Connecting…" : mode === "login" ? "Enter my care space" : "Create my account"}<ArrowRight size={17} /></button></form> : null}
          {errors.form ? <p className="auth-error" role="alert">{errors.form}</p> : null}{message ? <p className="auth-success" role="status">{message}</p> : null}
          {mode === "login" ? <button className="auth-forgot" type="button" onClick={() => switchMode("forgot")}>Forgot your password?</button> : null}
          {isRecovery ? <p className="auth-switch-copy"><button type="button" onClick={() => switchMode("login")}><ArrowLeft size={13} /> Back to sign in</button></p> : <p className="auth-switch-copy">{mode === "login" ? "New to healthcare-telemedicine?" : "Already have an account?"} <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create one" : "Sign in"}</button></p>}
        </section>
      </div>
    </div>
  );
}

function Field({ name, label, icon, value, onChange, error, placeholder, type = "text" }) { return <label><span>{icon} {label}</span><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required aria-invalid={Boolean(error)} />{error ? <small className="field-error">{error}</small> : null}</label>; }
function PasswordField({ name, value, onChange, showPassword, setShowPassword, label, error }) { return <label><span><LockKeyhole size={15} /> {label}</span><div className="password-field"><input name={name} type={showPassword ? "text" : "password"} value={value} onChange={onChange} autoComplete="new-password" placeholder="At least 8 characters" required aria-invalid={Boolean(error)} /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{error ? <small className="field-error">{error}</small> : null}</label>; }

export default AuthGate;
