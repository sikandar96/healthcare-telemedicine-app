import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "./api";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SignalStrip from "./components/SignalStrip";
import ConsultationsSection from "./components/ConsultationsSection";
import CareShelfSection from "./components/CareShelfSection";
import ProgramsSection from "./components/ProgramsSection";
import CareLedgerSection from "./components/CareLedgerSection";
import AppFooter from "./components/AppFooter";
import ProductFeaturesSection from "./components/ProductFeaturesSection";
import RevenueModelSection from "./components/RevenueModelSection";

const heroImage = "/assets/clinical-atelier-hero.png";
const consultationImage = "/assets/clinical-atelier-consultation.png";
const pharmacyImage = "/assets/clinical-atelier-pharmacy.png";
const preventiveImage = "/assets/clinical-atelier-preventive.png";
const logoImage = "/healthcare-telemedicine-logo-transparent.png";

const fallbackDoctors = [
  { name: "Dr. Maya Chen", specialty: "Family medicine", wait: "12 min", fee: "$42", initials: "MC", color: "#dbeafe" },
  { name: "Dr. Rafael Ortiz", specialty: "Dermatology", wait: "24 min", fee: "$58", initials: "RO", color: "#d9f99d" },
  { name: "Dr. Leena Shah", specialty: "Women’s health", wait: "8 min", fee: "$46", initials: "LS", color: "#fed7aa" },
];

const fallbackPrograms = [
  { tag: "Preventive care", title: "The 10-minute vaccine check", detail: "Know what is due before the season changes.", accent: "green" },
  { tag: "Sponsored program", title: "Move gently, live steadily", detail: "A four-week mobility series by Northstar Health.", accent: "blue" },
];

export default function Home({ mode, availableModes, onModeChange, authOpen, onAuthOpenChange, user, onLogout, onOpenAuth }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [reminderDone, setReminderDone] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [doctorDirectory, setDoctorDirectory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [campaignsFromApi, setCampaignsFromApi] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const announce = (message) => toast(message);

  useEffect(() => {
    let active = true;
    api.campaigns().then((items) => active && setCampaignsFromApi(items || [])).catch(() => {});
    if (user) {
      setDataLoading(true);
      Promise.allSettled([api.doctors(), api.reminders()]).then(([doctorResult, reminderResult]) => {
        if (!active) return;
        if (doctorResult.status === "fulfilled") setDoctorDirectory(doctorResult.value || []);
        if (reminderResult.status === "fulfilled") setReminders(reminderResult.value || []);
      }).finally(() => active && setDataLoading(false));
    } else {
      setDoctorDirectory([]);
      setReminders([]);
    }
    return () => { active = false; };
  }, [user]);

  const liveDoctors = doctorDirectory.length ? doctorDirectory : fallbackDoctors;
  const livePrograms = campaignsFromApi.length
    ? campaignsFromApi.map((item) => ({ tag: "Health program", title: item.title, detail: item.description || "A practical program from your care network.", accent: "blue" }))
    : fallbackPrograms;

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

  const bookDoctor = async (doctor) => {
    setSelectedDoctor(doctor.id || doctor.name);
    if (!user) return onOpenAuth?.("login");
    if (!doctor.id) return announce("Sign in with a live care network to book a doctor");
    try {
      await api.bookConsultation({ doctorId: doctor.id, type: "VIDEO", scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
      announce(`Consultation requested with ${doctor.name}`);
    } catch (error) {
      announce(error.message || "Unable to book this consultation");
    }
  };

  const completeReminder = async (reminder) => {
    if (!user) return onOpenAuth?.("login");
    try {
      await api.completeReminder(reminder.id);
      setReminders((current) => current.map((item) => item.id === reminder.id ? { ...item, completed: true } : item));
      announce("Reminder marked complete");
    } catch (error) {
      announce(error.message || "Unable to update reminder");
    }
  };

  const handleNotify = async () => {
    if (!user) return onOpenAuth?.("login");
    try {
      const items = await api.notifications();
      announce(`${items?.length || 0} care updates`);
    } catch (error) {
      announce(error.message || "Unable to load notifications");
    }
  };

  return (
    <div className="app-shell">
      <Header
        mode={mode}
        availableModes={availableModes}
        onModeChange={{ open: modeMenuOpen, toggle: () => setModeMenuOpen((value) => !value), select: (value) => { onModeChange(value); setModeMenuOpen(false); } }}
        activeSection={activeSection}
        onNavigate={scrollTo}
        mobileNavOpen={mobileNavOpen}
        onMobileNavToggle={() => setMobileNavOpen((value) => !value)}
        searchOpen={searchOpen}
        onSearchToggle={() => setSearchOpen((value) => !value)}
        onSearch={(event) => event.key === "Enter" && announce("Search is ready to connect to the care API")}
        onNotify={handleNotify}
        user={user}
        logoImage={logoImage}
      />
      <main>
        <HeroSection greeting={mode === "patient" ? `Good morning, ${user?.username || "there"}` : `${mode[0].toUpperCase()}${mode.slice(1)} view`} sectionTitle={sectionTitle} onNavigate={scrollTo} heroImage={heroImage} />
        <SignalStrip />
        <ProductFeaturesSection onNavigate={scrollTo} onRequireAuth={onOpenAuth} user={user} />
        <ConsultationsSection doctors={liveDoctors} selectedDoctor={selectedDoctor} onSelectDoctor={bookDoctor} onOpenDirectory={() => scrollTo("consultations")} consultationImage={consultationImage} loading={dataLoading} />
        <CareShelfSection pharmacyImage={pharmacyImage} preventiveImage={preventiveImage} reminders={reminders} reminderDone={reminderDone} onCompleteReminder={completeReminder} onToggleDemoReminder={() => { setReminderDone((value) => !value); announce(reminderDone ? "Reminder reopened" : "Reminder marked complete"); }} onOpenPharmacy={() => scrollTo("pharmacy")} />
        <ProgramsSection programs={livePrograms} onOpenProgram={(title) => announce(`${title} opened`)} />
        <RevenueModelSection onExplore={() => announce("Revenue model details opened")} />
        <CareLedgerSection />
      </main>
      <AppFooter logoImage={logoImage} user={user} onLogout={onLogout} onOpenAuth={onOpenAuth} onAnnounce={announce} />
    </div>
  );
}
