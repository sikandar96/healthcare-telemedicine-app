// Clinical Atelier reminder: this page uses an asymmetric editorial frame, semantic status color, and clear care next-actions instead of a generic centered dashboard.
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  HeartPulse,
  LayoutGrid,
  Menu,
  MessageCircle,
  PackageCheck,
  Pill,
  Search,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Video,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const heroImage = "/assets/clinical-atelier-hero.png";
const consultationImage = "/assets/clinical-atelier-consultation.png";
const pharmacyImage = "/assets/clinical-atelier-pharmacy.png";
const preventiveImage = "/assets/clinical-atelier-preventive.png";
const logoImage = "/assets/caremark-symbol.png";

const modeLabels = {
  patient: "Patient view",
  doctor: "Doctor view",
  pharmacy: "Pharmacy view",
  manager: "Program view",
};

const doctors = [
  { name: "Dr. Maya Chen", specialty: "Family medicine", wait: "12 min", fee: "$42", initials: "MC", color: "#dbeafe" },
  { name: "Dr. Rafael Ortiz", specialty: "Dermatology", wait: "24 min", fee: "$58", initials: "RO", color: "#d9f99d" },
  { name: "Dr. Leena Shah", specialty: "Women’s health", wait: "8 min", fee: "$46", initials: "LS", color: "#fed7aa" },
];

const programs = [
  { tag: "Preventive care", title: "The 10-minute vaccine check", detail: "Know what is due before the season changes.", accent: "green" },
  { tag: "Sponsored program", title: "Move gently, live steadily", detail: "A four-week mobility series by Northstar Health.", accent: "blue" },
];

export default function Home({ mode, availableModes, onModeChange, authOpen, onAuthOpenChange }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [reminderDone, setReminderDone] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedModeOpen, setSelectedModeOpen] = useState(false);

  const greeting = mode === "patient" ? "Good morning, Alex" : modeLabels[mode];
  const sectionTitle = useMemo(() => {
    if (activeSection === "consultations") return "Your care team, on call";
    if (activeSection === "pharmacy") return "Medicine, without the detour";
    if (activeSection === "preventive") return "Small reminders, better rhythm";
    return "A clearer next step for every care moment.";
  }, [activeSection]);

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const announce = (message) => toast(message);

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo("overview")} aria-label="Caremark home">
          <span className="brand-mark-frame"><img src={logoImage} alt="" className="brand-mark" /></span>
          <span className="brand-wordmark">caremark<span>.</span></span>
        </button>
        <button className="mobile-menu-button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation">
          {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={mobileNavOpen ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
          {["overview", "consultations", "pharmacy", "preventive"].map((item) => (
            <button key={item} className={activeSection === item ? "nav-item active" : "nav-item"} onClick={() => scrollTo(item)}>
              {item === "overview" ? "Overview" : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search size={18} /></button>
          <button className="notification-button" aria-label="Notifications" onClick={() => announce("You have 2 care updates") }><Bell size={18} /><span /></button>
          <div className="mode-switcher">
            <button className="mode-button" onClick={() => setSelectedModeOpen(!selectedModeOpen)}>
              <span className="avatar">{mode === "patient" ? "AM" : mode.slice(0, 2).toUpperCase()}</span>
              <span className="mode-name">{modeLabels[mode]}</span><ChevronDown size={15} />
            </button>
            {selectedModeOpen && <div className="mode-menu">{availableModes.map((item) => <button key={item} onClick={() => { onModeChange(item); setSelectedModeOpen(false); }}>{modeLabels[item]}</button>)}</div>}
          </div>
        </div>
      </header>

      {searchOpen && <div className="search-strip"><Search size={18} /><input autoFocus placeholder="Search doctors, programs, or orders" onKeyDown={(event) => event.key === "Enter" && announce("Search is ready to connect to the care API") } /><button onClick={() => setSearchOpen(false)}><X size={16} /></button></div>}

      <main>
        <section className="hero-section" id="overview">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Your care, in one rhythm</div>
            <p className="hero-greeting">{greeting} <span className="greeting-dot">•</span></p>
            <h1>{sectionTitle} <em>without the noise.</em></h1>
            <p className="hero-intro">Talk to a certified doctor, get essentials delivered, and keep the small health promises that add up.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo("consultations")}>Find a doctor <ArrowUpRight size={17} /></button><button className="button button-quiet" onClick={() => scrollTo("preventive")}><CalendarDays size={17} /> View reminders</button></div>
            <div className="trust-row"><div className="trust-avatars"><span>MC</span><span>RO</span><span>LS</span></div><span><strong>24/7</strong> care navigation</span><span className="trust-divider" /><ShieldCheck size={16} /><span>Encrypted by design</span></div>
          </div>
          <div className="hero-visual"><img src={heroImage} alt="Patient preparing for a telemedicine visit" /><div className="hero-note"><span className="live-pulse" /> <strong>Care team online</strong><small>Next available in 12 min</small></div><div className="hero-stamp">care<br /><span>well</span></div></div>
        </section>

        <section className="signal-strip" aria-label="Care signals">
          <div className="signal-item"><span className="signal-icon green"><HeartPulse size={18} /></span><span><small>Health rhythm</small><strong>On track this week</strong></span></div>
          <div className="signal-item"><span className="signal-icon blue"><Video size={18} /></span><span><small>Next consultation</small><strong>Today · 4:30 PM</strong></span></div>
          <div className="signal-item"><span className="signal-icon coral"><PackageCheck size={18} /></span><span><small>Pharmacy order</small><strong>Arriving tomorrow</strong></span></div>
          <div className="signal-action"><span>3 minutes to a calmer dashboard</span><ArrowUpRight size={16} /></div>
        </section>

        <section className="section-block consultation-section" id="consultations">
          <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Consultations</div><h2>Expert help, <em>when you need it.</em></h2></div><button className="text-link" onClick={() => announce("Opening the full doctor directory")}>See all doctors <ArrowUpRight size={16} /></button></div>
          <div className="consultation-layout"><div className="consultation-feature"><img src={consultationImage} alt="Doctor ready for a video consultation" /><div className="feature-overlay"><span className="live-tag"><span className="live-pulse" /> LIVE CARE</span><h3>Find a doctor who<br /><em>gets your context.</em></h3><button className="circle-button" onClick={() => announce("The live doctor directory is ready")}><ArrowUpRight size={20} /></button></div></div><div className="doctor-list">{doctors.map((doctor) => <button className={selectedDoctor === doctor.name ? "doctor-row selected" : "doctor-row"} key={doctor.name} onClick={() => { setSelectedDoctor(doctor.name); announce(`${doctor.name} selected`); }}><span className="doctor-avatar" style={{ background: doctor.color }}>{doctor.initials}</span><span className="doctor-info"><strong>{doctor.name}</strong><small>{doctor.specialty}</small></span><span className="doctor-meta"><b>{doctor.fee}</b><small><span className="online-dot" /> {doctor.wait}</small></span><ArrowUpRight size={17} className="row-arrow" /></button>)}<div className="consult-note"><Activity size={17} /><span><strong>Audio or video, your choice.</strong><br />All visits are private, encrypted, and documented.</span></div></div></div>
        </section>

        <section className="section-block care-grid-section" id="pharmacy">
          <div className="section-heading compact"><div><div className="eyebrow"><span className="eyebrow-line" /> The care shelf</div><h2>Good care is <em>also practical.</em></h2></div><p>From local pharmacy partners to simple health prompts, keep the everyday close.</p></div>
          <div className="care-grid"><article className="care-card pharmacy-card"><img src={pharmacyImage} alt="Pharmacy delivery parcel" /><div className="card-body"><div className="card-kicker"><Pill size={15} /> PHARMACY DELIVERY</div><h3>Your essentials,<br /><em>at your door.</em></h3><p>Local partners. Clear pricing. One less errand on your list.</p><button className="button button-dark" onClick={() => announce("Opening pharmacy delivery")}>Browse pharmacy <ArrowUpRight size={16} /></button></div></article><article className="care-card preventive-card" id="preventive"><img src={preventiveImage} alt="Preventive care reminder materials" /><div className="card-body"><div className="card-kicker green-text"><CalendarDays size={15} /> PREVENTIVE CARE</div><h3>Small prompts.<br /><em>Better rhythm.</em></h3><p>Vaccination reminders and care moments that fit your life.</p><div className="reminder-line"><span className={reminderDone ? "check-circle done" : "check-circle"}>{reminderDone ? <Check size={13} /> : null}</span><span><strong>{reminderDone ? "Reminder complete" : "Flu vaccine check"}</strong><small>Due in 6 days</small></span><button onClick={() => { setReminderDone(!reminderDone); announce(reminderDone ? "Reminder reopened" : "Reminder marked complete"); }} aria-label="Complete reminder"><ArrowUpRight size={16} /></button></div></div></article></div>
        </section>

        <section className="program-section" id="programs"><span className="program-folio" aria-hidden="true" /><div className="program-lead"><div className="eyebrow light"><span className="eyebrow-line" /> A little more good</div><h2>Health awareness<br /><em>that feels human.</em></h2><p>Find focused programs from care teams and mission-led sponsors who want to make prevention easier to start.</p><button className="button button-light" onClick={() => announce("Opening health awareness programs")}>Explore programs <ArrowUpRight size={17} /></button></div><div className="program-list">{programs.map((program) => <button className="program-row" key={program.title} onClick={() => announce(`${program.title} opened`)}><span className={`program-number ${program.accent}`}>0{programs.indexOf(program) + 1}</span><span><small>{program.tag}</small><strong>{program.title}</strong><em>{program.detail}</em></span><ArrowUpRight size={18} /></button>)}<div className="sponsor-note"><Zap size={17} /> <span>For health organizations: sponsor a program that moves people forward.</span><ArrowUpRight size={15} /></div></div></section>

        <section className="bottom-section"><div><div className="eyebrow"><span className="eyebrow-line" /> Your care ledger</div><h2>Clarity feels <em>like care.</em></h2><p>Every consultation, order, reminder, and payment stays in one calm place.</p></div><div className="ledger-card"><div className="ledger-top"><span>APRIL CARE SPEND</span><CreditCard size={18} /></div><strong>$42.00</strong><div className="ledger-bar"><span /></div><div className="ledger-foot"><span>Consultation</span><b>Covered by you</b></div></div><div className="ledger-card pale"><div className="ledger-top"><span>ORDERS IN MOTION</span><ShoppingBag size={18} /></div><strong>02</strong><div className="order-status"><span className="status-dot green-dot" /> One arrives tomorrow</div><div className="order-status"><span className="status-dot blue-dot" /> One being prepared</div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark-frame"><img src={logoImage} alt="" className="brand-mark" /></span><span className="brand-wordmark">caremark<span>.</span></span></div><span>Care navigation, thoughtfully connected.</span><div className="footer-links"><button onClick={() => announce("Privacy information")}>Privacy</button><button onClick={() => announce("Support is opening")}>Support</button><button onClick={() => onAuthOpenChange(!authOpen)}>{authOpen ? "Close account" : "Sign in"}</button></div></footer>
    </div>
  );
}
