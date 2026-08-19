import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity, ArrowRight, Bell, CalendarDays, Check, ChevronDown, Clock3, HeartPulse,
  LayoutDashboard, Menu, MessageCircle, Package, Pill, Search, ShieldCheck, Sparkles,
  Stethoscope, X, Video, WalletCards,   ClipboardList, LogOut, UserRound, Settings2
} from "lucide-react";
import { api } from "./api";

const heroImage = "/assets/clinical-atelier-hero.png";
const consultationImage = "/assets/clinical-atelier-consultation.png";
const pharmacyImage = "/assets/clinical-atelier-pharmacy.png";
const preventiveImage = "/assets/clinical-atelier-preventive.png";

const fallbackDoctors = [
  { name: "Dr. Maya Chen", specialty: "Family medicine", wait: "12 min", fee: 3500, rating: 4.9, languages: ["English", "Mandarin"], availabilityDays: ["Monday", "Wednesday", "Thursday"], available: true, initials: "MC", color: "lavender" },
  { name: "Dr. Rafael Ortiz", specialty: "Dermatology", wait: "24 min", fee: 4800, rating: 4.8, languages: ["English", "Spanish"], availabilityDays: ["Tuesday", "Thursday", "Saturday"], available: true, initials: "RO", color: "mint" },
  { name: "Dr. Leena Shah", specialty: "Women's health", wait: "8 min", fee: 3800, rating: 4.7, languages: ["English", "Hindi"], availabilityDays: ["Monday", "Friday"], available: true, initials: "LS", color: "peach" },
];

const fallbackReminders = [
  { id: "demo-1", title: "Vitamin D supplement", dueDate: "Today, 8:00 AM", completed: false },
  { id: "demo-2", title: "Annual health check", dueDate: "Due in 12 days", completed: false },
];

const fallbackAppointments = [
  { title: "General wellness consultation", doctorName: "Dr. Maya Chen", scheduledAt: "Thursday, 10:30 AM", status: "Confirmed" },
  { title: "Follow-up review", doctorName: "Dr. Rafael Ortiz", scheduledAt: "18 September, 4:00 PM", status: "Upcoming" },
];
const fallbackClinicalRecords = [
  { condition: "Seasonal allergy review", date: "12 August 2026", clinician: "Dr. Maya Chen" },
  { condition: "Annual wellness assessment", date: "20 June 2026", clinician: "Dr. Leena Shah" },
];
const fallbackPrescriptions = [
  { medicineName: "Vitamin D3 60K", dosage: "Once weekly", prescribedBy: "Dr. Maya Chen", status: "Active" },
  { medicineName: "Cetirizine 10 mg", dosage: "As needed", prescribedBy: "Dr. Rafael Ortiz", status: "Refill available" },
];

const modeLabels = { patient: "Patient portal", doctor: "Clinician workspace", pharmacy: "Pharmacy workspace", manager: "Health manager" };

export default function Home({ mode, availableModes, onModeChange, user, onLogout, onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [doctorDirectoryOpen, setDoctorDirectoryOpen] = useState(false);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [filterRating, setFilterRating] = useState("any");
  const [filterLanguage, setFilterLanguage] = useState("any");
  const [filterDay, setFilterDay] = useState("any");
  const [filterAvailability, setFilterAvailability] = useState("any");
  const [activeSection, setActiveSection] = useState("overview");
  const [doctors, setDoctors] = useState([]);
  const [doctorError, setDoctorError] = useState("");
  const [reminders, setReminders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordComposerOpen, setRecordComposerOpen] = useState(false);
  const [prescriptionComposerOpen, setPrescriptionComposerOpen] = useState(false);
  const [submittingRecord, setSubmittingRecord] = useState(false);
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  const [recordForm, setRecordForm] = useState({ patientUsername: "", diagnosis: "", notes: "", patientConsent: false });
  const [prescriptionForm, setPrescriptionForm] = useState({ patientUsername: "", medicineName: "", dosage: "", frequency: "", durationDays: 7, instructions: "" });
  const [doctorComposerOpen, setDoctorComposerOpen] = useState(false);
  const [submittingDoctor, setSubmittingDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ username: "", name: "", specialization: "", licenseNumber: "", consultationFee: "", bio: "" });
  const [bookingComposerOpen, setBookingComposerOpen] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ type: "VIDEO", scheduledAt: "" });

  useEffect(() => {
    let active = true;
    api.campaigns().then((items) => active && setCampaigns(items || [])).catch(() => {});
    if (!user) {
      setDoctors([]);
      setDoctorError("");
      setReminders([]);
      return () => { active = false; };
    }
    setLoading(true);
    const appointmentRequest = api.myConsultations();
    Promise.allSettled([api.doctors(), api.reminders(), appointmentRequest, api.clinicalRecords(), api.prescriptions()]).then(([doctorResult, reminderResult, appointmentResult, recordsResult, prescriptionResult]) => {
      if (!active) return;
      if (doctorResult.status === "fulfilled") {
        const items = Array.isArray(doctorResult.value)
          ? doctorResult.value
          : doctorResult.value?.items || doctorResult.value?.content || [];
        setDoctors(items);
        setDoctorError("");
      } else {
        setDoctors([]);
        setDoctorError(doctorResult.reason?.message || "Unable to load available doctors");
      }
        if (reminderResult.status === "fulfilled") setReminders(reminderResult.value || []);
        if (appointmentResult.status === "fulfilled") setAppointments(appointmentResult.value || []);
        if (recordsResult.status === "fulfilled") setClinicalRecords(recordsResult.value || []);
        if (prescriptionResult.status === "fulfilled") setPrescriptions(prescriptionResult.value || []);
      }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user, mode]);

  const liveDoctors = user ? doctors : fallbackDoctors;
  const filteredDoctors = liveDoctors.filter((doctor) => {
    const haystack = `${doctor.name || doctor.fullName || doctor.username || ""} ${doctor.specialty || doctor.specialization || ""}`.toLowerCase();
    const languages = doctor.languages || doctor.language || ["English"];
    const languageList = (Array.isArray(languages) ? languages : [languages]).map(String);
    const days = doctor.availabilityDays || doctor.availableDays || doctor.availability || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const dayList = (Array.isArray(days) ? days : [days]).map(String);
    const rating = Number(doctor.rating || doctor.averageRating || 4.8);
    const available = doctor.available ?? doctor.isAvailable ?? true;
    return haystack.includes(doctorQuery.trim().toLowerCase())
      && (filterRating === "any" || rating >= Number(filterRating))
      && (filterLanguage === "any" || languageList.includes(filterLanguage))
      && (filterDay === "any" || dayList.includes(filterDay))
      && (filterAvailability === "any" || (filterAvailability === "now" ? available : !available));
  });
  const liveReminders = reminders.length ? reminders : fallbackReminders;
  const liveCampaigns = campaigns.length ? campaigns : [
    { title: "The 10-minute vaccine check", description: "Know what is due before the season changes." },
    { title: "Move gently, live steadily", description: "A four-week mobility series for everyday strength." },
  ];
  const firstName = user?.username?.split(" ")[0] || "there";
  const initials = (user?.username || "You").slice(0, 2).toUpperCase();
  const isClinician = mode === "doctor";
  const profileLabel = isClinician ? "View clinician profile" : "View patient profile";
  const canManageDoctors = availableModes.includes("manager");

  const openDoctorDirectory = () => {
    setDoctorDirectoryOpen(true);
    setDoctorQuery("");
    setMobileOpen(false);
  };

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const notify = async () => {
    if (!user) return onOpenAuth("login");
    try {
      const items = await api.notifications();
      toast.success(items?.length ? `${items.length} care updates waiting` : "You're all caught up");
    } catch (error) { toast.error(error.message || "Unable to load notifications"); }
  };

  const bookDoctor = (doctor) => {
    if (!user) return onOpenAuth("login");
    setSelectedDoctor(doctor);
    if (!doctor?.id) return toast("This doctor does not have a bookable profile yet");
    const defaultStart = new Date(Date.now() + 3600000);
    defaultStart.setSeconds(0, 0);
    const localDateTime = new Date(defaultStart.getTime() - defaultStart.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setBookingForm({ type: "VIDEO", scheduledAt: localDateTime });
    setBookingComposerOpen(true);
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!selectedDoctor?.id) return toast("Select a valid doctor before booking");
    setSubmittingBooking(true);
    try {
      await api.bookConsultation({
        doctorId: selectedDoctor.id,
        type: bookingForm.type,
        scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
      });
      toast.success(`Consultation requested with ${selectedDoctor.name || "your doctor"}`);
      setBookingComposerOpen(false);
      const consultations = await api.myConsultations();
      setAppointments(consultations || []);
    } catch (error) {
      toast.error(error.message || "Unable to book this consultation");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const openRecordComposer = () => {
    const patientUsername = appointments.find((item) => item.patientUsername)?.patientUsername || "";
    setRecordForm({ patientUsername, diagnosis: "", notes: "", patientConsent: false });
    setRecordComposerOpen(true);
  };

  const openPrescriptionComposer = () => {
    const patientUsername = appointments.find((item) => item.patientUsername)?.patientUsername || "";
    setPrescriptionForm({ patientUsername, medicineName: "", dosage: "", frequency: "", durationDays: 7, instructions: "" });
    setPrescriptionComposerOpen(true);
  };

  const submitClinicalRecord = async (event) => {
    event.preventDefault();
    setSubmittingRecord(true);
    try {
      await api.createClinicalRecord({ ...recordForm, attachmentUrls: [] });
      toast.success("Clinical record saved");
      setRecordComposerOpen(false);
      const records = await api.clinicalRecords();
      setClinicalRecords(records || []);
    } catch (error) { toast.error(error.message || "Unable to save clinical record"); }
    finally { setSubmittingRecord(false); }
  };

  const submitPrescription = async (event) => {
    event.preventDefault();
    setSubmittingPrescription(true);
    try {
      await api.createPrescription({
        patientUsername: prescriptionForm.patientUsername,
        consultationId: null,
        instructions: prescriptionForm.instructions,
        items: [{ medicineName: prescriptionForm.medicineName, dosage: prescriptionForm.dosage, frequency: prescriptionForm.frequency, durationDays: Number(prescriptionForm.durationDays) }],
      });
      toast.success("Prescription issued");
      setPrescriptionComposerOpen(false);
      const prescriptions = await api.prescriptions();
      setPrescriptions(prescriptions || []);
    } catch (error) { toast.error(error.message || "Unable to issue prescription"); }
    finally { setSubmittingPrescription(false); }
  };

  const submitDoctorRegistration = async (event) => {
    event.preventDefault();
    setSubmittingDoctor(true);
    try {
      await api.registerDoctor({ ...doctorForm, consultationFee: Number(doctorForm.consultationFee) });
      toast.success("Doctor added and marked available");
      setDoctorComposerOpen(false);
      setDoctorForm({ username: "", name: "", specialization: "", licenseNumber: "", consultationFee: "", bio: "" });
    } catch (error) {
      toast.error(error.message || "Unable to add doctor");
    } finally {
      setSubmittingDoctor(false);
    }
  };

  const completeReminder = async (reminder) => {
    if (!user) return onOpenAuth("login");
    if (!reminder.id || String(reminder.id).startsWith("demo")) return toast.success("Reminder marked complete");
    try {
      await api.completeReminder(reminder.id);
      setReminders((items) => items.map((item) => item.id === reminder.id ? { ...item, completed: true } : item));
      toast.success("Reminder marked complete");
    } catch (error) { toast.error(error.message || "Unable to update reminder"); }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("overview")} aria-label="healthcare-telemedicine home">
          <span className="brand-icon"><img src="/assets/healthcare-telemedicine-logo-clean.png" alt="" /></span>
          <span>healthcare<span>-telemedicine</span></span>
        </button>
        <nav className={mobileOpen ? "main-nav is-open" : "main-nav"}>
          {["overview", "consultations", "pharmacy", "preventive"].map((item) => (
            <button key={item} className={activeSection === item ? "nav-link active" : "nav-link"} onClick={() => scrollTo(item)}>{item}</button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="circle-action" onClick={() => setSearchOpen((value) => !value)} aria-label="Search"><Search size={17} /></button>
          <button className="circle-action notification" onClick={notify} aria-label="Notifications"><Bell size={17} /><i /></button>
          {user ? (
            <>
              {canManageDoctors && <button className="create-account" onClick={() => setDoctorComposerOpen(true)}>Add doctor</button>}
              <div className="mode-switcher">
              <button className="profile-button" onClick={() => setModeOpen((value) => !value)}><span className="avatar">{initials}</span><span className="profile-copy"><b>{user.username}</b><small>{modeLabels[mode]}</small></span><ChevronDown size={14} /></button>
              {modeOpen && <div className="mode-menu"><button className="profile-menu-item" onClick={() => { setProfileOpen(true); setModeOpen(false); }}><UserRound size={14} /> {profileLabel}</button>{availableModes.map((value) => <button key={value} onClick={() => { onModeChange(value); setModeOpen(false); }}>{modeLabels[value]}</button>)}<button className="logout-item" onClick={onLogout}><LogOut size={14} /> Sign out</button></div>}
              </div>
            </>
          ) : <><button className="create-account" onClick={() => onOpenAuth("register")}>Create account</button><button className="sign-in" onClick={() => onOpenAuth("login")}>Sign in <ArrowRight size={15} /></button></>}
          <button className="mobile-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      {searchOpen && <div className="search-panel"><Search size={17} /><input autoFocus placeholder="Search doctors, programs, or orders" onKeyDown={(event) => event.key === "Enter" && toast("Search is ready to connect to your care network")} /><button onClick={() => setSearchOpen(false)}><X size={16} /></button></div>}
      {profileOpen && <div className="profile-backdrop" onClick={() => setProfileOpen(false)}><aside className="profile-drawer" onClick={(event) => event.stopPropagation()}><div className="profile-drawer-top"><div><span className="eyebrow"><span />MY CARE SPACE</span><h2>{isClinician ? "Clinician profile" : "Patient profile"}</h2></div><button className="drawer-close" onClick={() => setProfileOpen(false)} aria-label="Close profile"><X size={18} /></button></div><div className="profile-identity"><span className="profile-large-avatar">{initials}</span><div><h3>{user?.username || (isClinician ? "Your clinician profile" : "Your profile")}</h3><p>{user?.email || (isClinician ? "Doctor account" : "Patient account")}</p><span className="verified-pill"><ShieldCheck size={12} /> Secure account</span></div></div><div className="profile-summary"><div><small>{isClinician ? "WORKSPACE STATUS" : "CARE STATUS"}</small><b>{isClinician ? "Clinician active" : "Active patient"}</b></div><div><small>{isClinician ? "TODAY'S QUEUE" : "CARE ITEMS"}</small><b>{isClinician ? "08 consultations" : "04 in progress"}</b></div><div><small>MEMBER SINCE</small><b>2026</b></div></div><div className="profile-details"><div className="profile-detail-row"><span><CalendarDays size={16} /> {isClinician ? "Next consultation" : "Next appointment"}</span><b>{isClinician ? "Today, 11:00 AM" : "Thu, 10:30 AM"}</b></div><div className="profile-detail-row"><span><HeartPulse size={16} /> {isClinician ? "Patients today" : "Care rhythm"}</span><b>{isClinician ? "08 scheduled" : "3 healthy habits"}</b></div><div className="profile-detail-row"><span><Package size={16} /> {isClinician ? "Care network" : "Pharmacy order"}</span><b>{isClinician ? "Connected" : "Arriving tomorrow"}</b></div></div>{!isClinician && <div className="profile-records"><section><div className="record-heading"><b>Medical history</b><span>{clinicalRecords.length || fallbackClinicalRecords.length} records</span></div>{(clinicalRecords.length ? clinicalRecords : fallbackClinicalRecords).slice(0, 2).map((record, index) => <div className="record-row" key={record.id || index}><span className="record-icon history">+</span><span><b>{record.condition || record.diagnosis || record.title || "Care record"}</b><small>{record.date || record.createdAt || record.recordedAt || "Recent"} · {record.clinician || record.doctorName || record.doctorUsername || "Care team"}</small></span></div>)}</section><section><div className="record-heading"><b>Upcoming appointments</b><span>{appointments.length || fallbackAppointments.length} scheduled</span></div>{(appointments.length ? appointments : fallbackAppointments).slice(0, 2).map((appointment, index) => <div className="record-row" key={appointment.id || index}><span className="record-icon appointment"><CalendarDays size={14} /></span><span><b>{appointment.title || appointment.type || "Consultation"}</b><small>{appointment.scheduledAt || appointment.startAt || appointment.date || "Upcoming"} · {appointment.doctorName || appointment.doctor?.name || appointment.doctorId || "Care team"}</small></span></div>)}</section><section><div className="record-heading"><b>Prescriptions</b><span>{prescriptions.length || fallbackPrescriptions.length} active</span></div>{(prescriptions.length ? prescriptions : fallbackPrescriptions).slice(0, 2).map((prescription, index) => <div className="record-row" key={prescription.id || index}><span className="record-icon prescription"><Pill size={14} /></span><span><b>{prescription.medicineName || prescription.name || prescription.medication || prescription.items?.[0]?.medicineName || prescription.items?.[0]?.name || "Prescription"}</b><small>{prescription.dosage || prescription.instructions || prescription.items?.[0]?.dosage || "As directed"} · {prescription.status || "Active"}</small></span></div>)}</section></div>}<button className="profile-settings" onClick={() => toast(`${isClinician ? "Clinician" : "Profile"} settings are ready to connect to your care API`)}><Settings2 size={15} /> Manage {isClinician ? "workspace" : "profile"} settings <ArrowRight size={15} /></button><button className="profile-signout" onClick={onLogout}><LogOut size={15} /> Sign out</button></aside></div>}
      {doctorDirectoryOpen && <div className="directory-backdrop" onClick={() => setDoctorDirectoryOpen(false)}><section className="directory-modal" onClick={(event) => event.stopPropagation()}><div className="directory-header"><div><span className="eyebrow"><span />CARE DIRECTORY</span><h2>Find your doctor</h2><p>Search by name or specialty, then choose a care professional to request a video consultation.</p></div><button className="drawer-close" onClick={() => setDoctorDirectoryOpen(false)} aria-label="Close doctor directory"><X size={18} /></button></div><label className="directory-search"><Search size={17} /><input autoFocus value={doctorQuery} onChange={(event) => setDoctorQuery(event.target.value)} placeholder="Search doctors or specialties" /><kbd>⌘ K</kbd></label><div className="directory-filters"><label><span>Rating</span><select value={filterRating} onChange={(event) => setFilterRating(event.target.value)}><option value="any">Any rating</option><option value="4.8">4.8+ stars</option><option value="4.5">4.5+ stars</option></select></label><label><span>Language</span><select value={filterLanguage} onChange={(event) => setFilterLanguage(event.target.value)}><option value="any">Any language</option><option>English</option><option>Hindi</option><option>Mandarin</option><option>Spanish</option></select></label><label><span>Available day</span><select value={filterDay} onChange={(event) => setFilterDay(event.target.value)}><option value="any">Any day</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></label><label><span>Availability</span><select value={filterAvailability} onChange={(event) => setFilterAvailability(event.target.value)}><option value="any">Any status</option><option value="now">Available now</option><option value="later">Available later</option></select></label></div><div className="directory-results"><div className="directory-results-top"><b>{filteredDoctors.length} available doctors</b><span>{loading ? "Refreshing care network…" : doctorError ? "Connection unavailable" : user && !doctors.length ? "No live availability" : "Available now"}</span></div>{filteredDoctors.length ? filteredDoctors.map((doctor, index) => { const name = doctor.name || doctor.fullName || doctor.username || "Care specialist"; const specialty = doctor.specialty || doctor.specialization || "General care"; const fee = Number(doctor.fee || doctor.consultationFee || 3500); return <button className="directory-doctor" key={doctor.id || name} onClick={() => { setDoctorDirectoryOpen(false); bookDoctor(doctor); }}><span className={`doctor-avatar ${doctor.color || ["lavender", "mint", "peach"][index % 3]}`}>{doctor.initials || name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="directory-doctor-copy"><b>{name}</b><small>{specialty}</small><em><i /> {doctor.wait || `${8 + index * 8} min wait`} · ★ {doctor.rating || doctor.averageRating || "4.8"}</em></span><span className="directory-fee">From ₹{fee.toLocaleString("en-IN")} <ArrowRight size={15} /></span></button>}) : <div className="empty-directory"><Search size={24} /><b>{doctorError ? "Unable to load doctors" : user ? "No available doctors yet" : "No doctors found"}</b><span>{doctorError || (user ? "A certified doctor must be registered and marked available before they appear here." : "Try a different name or specialty.")}</span></div>}</div></section></div>}

      {bookingComposerOpen && <div className="composer-backdrop" onClick={() => setBookingComposerOpen(false)}><form className="care-composer" onClick={(event) => event.stopPropagation()} onSubmit={submitBooking}><div className="composer-head"><div><span className="eyebrow"><span />CONSULTATION REQUEST</span><h2>Book with {selectedDoctor?.name || "your doctor"}</h2></div><button type="button" className="drawer-close" onClick={() => setBookingComposerOpen(false)} aria-label="Close booking form"><X size={18} /></button></div><label>Consultation type<select value={bookingForm.type} onChange={(event) => setBookingForm({ ...bookingForm, type: event.target.value })}><option value="VIDEO">Video consultation</option><option value="AUDIO">Audio consultation</option></select></label><label>Date and time<input required type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={bookingForm.scheduledAt} onChange={(event) => setBookingForm({ ...bookingForm, scheduledAt: event.target.value })} /></label><button className="button primary" type="submit" disabled={submittingBooking}>{submittingBooking ? "Requesting…" : "Request consultation"}</button></form></div>}

      {doctorComposerOpen && <div className="composer-backdrop" onClick={() => setDoctorComposerOpen(false)}><form className="care-composer" onClick={(event) => event.stopPropagation()} onSubmit={submitDoctorRegistration}><div className="composer-head"><div><span className="eyebrow"><span />DOCTOR NETWORK</span><h2>Add a doctor</h2></div><button type="button" className="drawer-close" onClick={() => setDoctorComposerOpen(false)} aria-label="Close add doctor form"><X size={18} /></button></div><label>Doctor username<input required value={doctorForm.username} onChange={(event) => setDoctorForm({ ...doctorForm, username: event.target.value })} placeholder="Existing doctor username" /></label><label>Full name<input required value={doctorForm.name} onChange={(event) => setDoctorForm({ ...doctorForm, name: event.target.value })} placeholder="Doctor full name" /></label><div className="composer-two-col"><label>Specialization<input required value={doctorForm.specialization} onChange={(event) => setDoctorForm({ ...doctorForm, specialization: event.target.value })} placeholder="e.g. Family medicine" /></label><label>License number<input required value={doctorForm.licenseNumber} onChange={(event) => setDoctorForm({ ...doctorForm, licenseNumber: event.target.value })} placeholder="Medical license" /></label></div><div className="composer-two-col"><label>Consultation fee<input required min="0" step="0.01" type="number" value={doctorForm.consultationFee} onChange={(event) => setDoctorForm({ ...doctorForm, consultationFee: event.target.value })} placeholder="3500" /></label><label>Availability<input value="Available now" disabled /></label></div><label>Bio<textarea value={doctorForm.bio} onChange={(event) => setDoctorForm({ ...doctorForm, bio: event.target.value })} placeholder="Short professional bio" rows="3" /></label><button className="button primary" type="submit" disabled={submittingDoctor}>{submittingDoctor ? "Adding…" : "Add available doctor"}</button></form></div>}

      {recordComposerOpen && <div className="composer-backdrop" onClick={() => setRecordComposerOpen(false)}><form className="care-composer" onClick={(event) => event.stopPropagation()} onSubmit={submitClinicalRecord}><div className="composer-head"><div><span className="eyebrow"><span />CLINICAL RECORD</span><h2>Add medical history</h2></div><button type="button" className="drawer-close" onClick={() => setRecordComposerOpen(false)} aria-label="Close medical history form"><X size={18} /></button></div><label>Patient username<input required value={recordForm.patientUsername} onChange={(event) => setRecordForm({ ...recordForm, patientUsername: event.target.value })} placeholder="patient username" /></label><label>Diagnosis<input required value={recordForm.diagnosis} onChange={(event) => setRecordForm({ ...recordForm, diagnosis: event.target.value })} placeholder="Diagnosis or condition" /></label><label>Clinical notes<textarea value={recordForm.notes} onChange={(event) => setRecordForm({ ...recordForm, notes: event.target.value })} placeholder="Add visit notes" rows="4" /></label><label className="check-field"><input type="checkbox" checked={recordForm.patientConsent} onChange={(event) => setRecordForm({ ...recordForm, patientConsent: event.target.checked })} /> Patient consent confirmed</label><button className="button primary" type="submit" disabled={submittingRecord}>{submittingRecord ? "Saving…" : "Save clinical record"}</button></form></div>}
      {prescriptionComposerOpen && <div className="composer-backdrop" onClick={() => setPrescriptionComposerOpen(false)}><form className="care-composer" onClick={(event) => event.stopPropagation()} onSubmit={submitPrescription}><div className="composer-head"><div><span className="eyebrow"><span />PRESCRIPTION</span><h2>Issue medication</h2></div><button type="button" className="drawer-close" onClick={() => setPrescriptionComposerOpen(false)} aria-label="Close prescription form"><X size={18} /></button></div><label>Patient username<input required value={prescriptionForm.patientUsername} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, patientUsername: event.target.value })} placeholder="patient username" /></label><label>Medicine name<input required value={prescriptionForm.medicineName} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, medicineName: event.target.value })} placeholder="Medicine name" /></label><div className="composer-two-col"><label>Dosage<input required value={prescriptionForm.dosage} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, dosage: event.target.value })} placeholder="e.g. 10 mg" /></label><label>Frequency<input required value={prescriptionForm.frequency} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, frequency: event.target.value })} placeholder="e.g. Once daily" /></label></div><label>Duration (days)<input required min="1" type="number" value={prescriptionForm.durationDays} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, durationDays: event.target.value })} /></label><label>Instructions<textarea value={prescriptionForm.instructions} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, instructions: event.target.value })} placeholder="Patient instructions" rows="3" /></label><button className="button primary" type="submit" disabled={submittingPrescription}>{submittingPrescription ? "Issuing…" : "Issue prescription"}</button></form></div>}
      <main className={isClinician ? "doctor-main" : ""}>
        {isClinician && <section className="doctor-dashboard page-section"><div className="doctor-dashboard-head"><div><div className="eyebrow"><span />CLINICIAN WORKSPACE</div><p className="greeting">Good morning, {firstName}<span className="greeting-dot">.</span></p><h1>Make every<br /><em>visit count.</em></h1><p>Everything you need for today's consultations, patient follow-ups, and clinical notes.</p></div><div className="doctor-profile-card"><span className="profile-large-avatar">{initials}</span><div><b>{user?.username || "Doctor account"}</b><small>Verified care professional</small><span><ShieldCheck size={13} /> Secure workspace</span></div></div></div><div className="doctor-stat-grid"><div><CalendarDays size={18} /><small>Today's consultations</small><b>08</b><span>2 awaiting confirmation</span></div><div><Clock3 size={18} /><small>Next patient</small><b>11:00 AM</b><span>Video consultation</span></div><div><ClipboardList size={18} /><small>Pending notes</small><b>03</b><span>Ready to review</span></div><div><MessageCircle size={18} /><small>Unread messages</small><b>05</b><span>From your care team</span></div></div><div className="doctor-quick-grid"><button onClick={() => toast(`${appointments.length} appointment${appointments.length === 1 ? "" : "s"} loaded from your care queue`)}><Video size={17} /><span><b>Today's queue</b><small>Review upcoming patients and join a visit</small></span><ArrowRight size={15} /></button><button onClick={openRecordComposer}><ClipboardList size={17} /><span><b>Patient records</b><small>Review histories, prescriptions, and notes</small></span><ArrowRight size={15} /></button><button onClick={openPrescriptionComposer}><Clock3 size={17} /><span><b>Issue prescription</b><small>Create a prescription for a patient</small></span><ArrowRight size={15} /></button></div></section>}
        <section id="overview" className="hero-section page-section">
          <div className="hero-content">
            <div className="eyebrow"><span />YOUR HEALTH, IN RHYTHM</div>
            <p className="greeting">Good morning, {firstName}<span className="greeting-dot">.</span></p>
            <h1>Care that feels<br /><em>closer.</em></h1>
            <p className="hero-intro">Your doctors, medicines, and everyday health habits in one calm, connected place.</p>
            <div className="hero-actions"><button className="button primary" onClick={openDoctorDirectory}><Video size={16} /> Find a doctor</button><button className="button text-button" onClick={() => scrollTo("preventive")}>View my care plan <ArrowRight size={15} /></button></div>
            <div className="trust-line"><span className="trust-stack"><i>AM</i><i>RK</i><i>LS</i></span><span><b>12,000+</b> people cared for this week</span><span className="trust-divider" /><ShieldCheck size={15} /> Private by design
            </div>
          </div>
          <div className="hero-art"><img src={heroImage} alt="Doctor listening to a patient" /><div className="hero-floating-card"><span className="status-dot" /> <b>Care team online</b><small>Ready when you are</small></div><div className="hero-badge"><Sparkles size={15} /><span>01<br /><b>CARE<br />FIRST</b></span></div></div>
        </section>

        <section className="metrics-row">
          <div><span className="metric-icon lavender"><CalendarDays size={18} /></span><span><small>NEXT CONSULTATION</small><b>Thursday, 10:30 AM</b></span></div>
          <div><span className="metric-icon mint"><Package size={18} /></span><span><small>PHARMACY ORDER</small><b>Arriving tomorrow</b></span></div>
          <div><span className="metric-icon peach"><Activity size={18} /></span><span><small>YOUR CARE RHYTHM</small><b>3 healthy habits this week</b></span></div>
          <button onClick={() => toast("Your care summary is up to date")}>View summary <ArrowRight size={15} /></button>
        </section>

        <section id="consultations" className="page-section content-section">
          <div className="section-header"><div><div className="eyebrow"><span />02 / CONNECT</div><h2>Your care team,<br /><em>on call.</em></h2></div><p>Thoughtful care from people who have time to listen. Start a video consultation from wherever you are.</p></div>
          <div className="consultation-grid"><div className="feature-image"><img src={consultationImage} alt="Telemedicine consultation" /><div className="image-overlay"><span className="live-label"><i /> AVAILABLE NOW</span><div><h3>Let's take<br />care of it.</h3><button className="round-button" onClick={() => !user ? onOpenAuth("login") : toast("Opening your care directory")}><ArrowRight size={22} /></button></div></div></div>
            <div className="doctor-panel"><div className="panel-heading"><div><span className="section-label">DOCTORS NEAR YOU</span><h3>Find your match</h3></div><button className="text-link" onClick={openDoctorDirectory}>See all <ArrowRight size={14} /></button></div><div className="doctor-list">{liveDoctors.map((doctor, index) => { const name = doctor.name || doctor.fullName || doctor.username || "Care specialist"; const specialty = doctor.specialty || doctor.specialization || "General care"; const fee = Number(doctor.fee || doctor.consultationFee || 3500); return <button className={selectedDoctor === (doctor.id || name) ? "doctor-row selected" : "doctor-row"} key={doctor.id || name} onClick={() => bookDoctor(doctor)}><span className={`doctor-avatar ${doctor.color || ["lavender", "mint", "peach"][index % 3]}`}>{doctor.initials || name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="doctor-info"><b>{name}</b><small>{specialty}</small></span><span className="doctor-meta"><b><i /> {doctor.wait || `${8 + index * 8} min`}</b><small>from ₹{fee.toLocaleString("en-IN")}</small></span><ArrowRight className="row-arrow" size={15} /></button>})}</div><div className="privacy-note"><ShieldCheck size={16} /><span><b>Your visit, your space.</b> End-to-end encrypted video consultations.</span></div></div>
          </div>
        </section>

        <section id="pharmacy" className="page-section content-section care-section"><div className="section-header compact"><div><div className="eyebrow"><span />03 / EVERYDAY CARE</div><h2>The little things<br /><em>matter too.</em></h2></div><p>Good health is built between appointments. Keep your essentials close and your next step clear.</p></div><div className="care-grid"><article className="care-card"><img src={pharmacyImage} alt="Pharmacy essentials" /><div className="care-card-body"><span className="card-label"><Pill size={14} /> PHARMACY DELIVERY</span><h3>Medicine,<br /><em>without the detour.</em></h3><p>Prescriptions and everyday essentials, delivered with care.</p><button className="button dark" onClick={() => toast("Opening medicine delivery")}><Package size={15} /> Browse pharmacy</button></div></article><article id="preventive" className="care-card reminder-card"><img src={preventiveImage} alt="Preventive care" /><div className="care-card-body"><span className="card-label green"><HeartPulse size={14} /> PREVENTIVE CARE</span><h3>Small reminders.<br /><em>Better rhythm.</em></h3><p>Simple nudges that make looking after yourself feel natural.</p><div className="reminder-list">{liveReminders.slice(0, 2).map((reminder) => <button className="reminder-row" key={reminder.id} onClick={() => completeReminder(reminder)}><span className={reminder.completed ? "check done" : "check"}>{reminder.completed && <Check size={12} />}</span><span><b>{reminder.title}</b><small>{reminder.dueDate || "Coming up"}</small></span><ArrowRight size={14} /></button>)}</div></div></article></div></section>

        <section className="program-section"><div className="program-lead"><div className="eyebrow light"><span />04 / CARE AWARENESS</div><h2>Better health<br /><em>starts small.</em></h2><p>Practical programs, gentle guidance, and a little more confidence in your next decision.</p><button className="button light" onClick={() => toast("Explore all care programs")}>Explore programs <ArrowRight size={15} /></button></div><div className="program-list">{liveCampaigns.slice(0, 3).map((campaign, index) => <button className="program-row" key={campaign.id || campaign.title} onClick={() => toast(`${campaign.title} opened`)}><span className={`program-number ${index % 2 ? "blue" : "green"}`}>0{index + 1}</span><span><small>{campaign.tag || "HEALTH PROGRAM"}</small><b>{campaign.title}</b><em>{campaign.description || "A practical program from your care network."}</em></span><ArrowRight size={17} /></button>)}<div className="sponsor-note"><Sparkles size={15} /> <span>Built with health organizations that believe care should be easier to reach.</span></div></div></section>

        <section className="ledger-section"><div><div className="eyebrow"><span />A CLEARER VIEW</div><h2>Everything in<br /><em>one place.</em></h2><p>From your next appointment to the habits that keep you well, healthcare-telemedicine helps you see the whole picture.</p></div><div className="ledger-card"><WalletCards size={19} /><small>CARE SPEND THIS MONTH</small><b>₹3,500</b><span>Consultation · 1 visit</span></div><div className="ledger-card pale"><ClipboardList size={19} /><small>ACTIVE CARE ITEMS</small><b>04</b><span>1 order · 2 reminders · 1 plan</span></div></section>
      </main>
      <footer className="footer"><div className="brand footer-brand"><span className="brand-icon"><img src="/assets/healthcare-telemedicine-logo-clean.png" alt="" /></span><span>healthcare<span>-telemedicine</span></span></div><p>Care, made more human.</p><div><button onClick={() => toast("Privacy information")}>Privacy</button><button onClick={() => toast("Support is here for you")}>Support</button></div></footer>
    </div>
  );
}
