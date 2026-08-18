import { ArrowUpRight, CalendarDays, ShieldCheck } from "lucide-react";

export default function HeroSection({ greeting, sectionTitle, onNavigate, heroImage }) {
  return (
    <section className="hero-section" id="overview">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> Your care, in one rhythm</div>
        <p className="hero-greeting">{greeting} <span className="greeting-dot">•</span></p>
        <h1>{sectionTitle} <em>without the noise.</em></h1>
        <p className="hero-intro">Talk to a certified doctor, get essentials delivered, and keep the small health promises that add up.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => onNavigate("consultations")}>Find a doctor <ArrowUpRight size={17} /></button>
          <button className="button button-quiet" onClick={() => onNavigate("preventive")}><CalendarDays size={17} /> View reminders</button>
        </div>
        <div className="trust-row"><div className="trust-avatars"><span>MC</span><span>RO</span><span>LS</span></div><span><strong>24/7</strong> care navigation</span><span className="trust-divider" /><ShieldCheck size={16} /><span>Encrypted by design</span></div>
      </div>
      <div className="hero-visual"><img src={heroImage} alt="Patient preparing for a telemedicine visit" /><div className="hero-note"><span className="live-pulse" /> <strong>Care team online</strong><small>Next available in 12 min</small></div><div className="hero-stamp">care<br /><span>well</span></div></div>
    </section>
  );
}
