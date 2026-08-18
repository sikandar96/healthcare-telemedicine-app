import { ArrowUpRight, CalendarCheck, Mic, Pill, ShieldCheck, Video } from "lucide-react";

const features = [
  {
    icon: Video,
    tone: "blue",
    eyebrow: "DOCTOR CONSULTATIONS",
    title: "Talk to a certified doctor",
    detail: "Choose a secure video or audio visit that fits your day, with care notes kept in one place.",
    action: "Find a doctor",
    target: "consultations",
  },
  {
    icon: Pill,
    tone: "coral",
    eyebrow: "MEDICINE DELIVERY",
    title: "Essentials from local pharmacies",
    detail: "Order prescriptions and everyday medicines through trusted pharmacy partners near you.",
    action: "Browse pharmacy",
    target: "pharmacy",
  },
  {
    icon: CalendarCheck,
    tone: "green",
    eyebrow: "HEALTH AWARENESS",
    title: "Preventive care that stays on track",
    detail: "Get vaccination reminders, health prompts, and practical programs before care becomes urgent.",
    action: "View reminders",
    target: "preventive",
  },
];

export default function ProductFeaturesSection({ onNavigate, onRequireAuth, user }) {
  return (
    <section className="product-features-section" id="features">
      <div className="section-heading feature-heading">
        <div><div className="eyebrow"><span className="eyebrow-line" /> One app, more care moments</div><h2>Everything you need to<br /><em>care forward.</em></h2></div>
        <p>From a quick doctor call to a timely vaccine reminder, healthcare-telemedicine keeps the next step simple.</p>
      </div>
      <div className="product-feature-grid">
        {features.map(({ icon: Icon, tone, eyebrow, title, detail, action, target }) => (
          <article className="product-feature-card" key={eyebrow}>
            <div className={`product-feature-icon ${tone}`}><Icon size={22} /></div>
            <div className="product-feature-eyebrow">{eyebrow}</div>
            <h3>{title}</h3>
            <p>{detail}</p>
            <button className="feature-link" onClick={() => { if (!user && target !== "features") return onRequireAuth?.("login"); onNavigate(target); }}>{action} <ArrowUpRight size={15} /></button>
          </article>
        ))}
      </div>
      <div className="secure-care-note"><ShieldCheck size={17} /><span><strong>Private by design.</strong> Audio and video visits, reminders, and care activity stay protected across your care journey.</span><span className="care-modes"><Mic size={15} /> Audio <Video size={15} /> Video</span></div>
    </section>
  );
}
