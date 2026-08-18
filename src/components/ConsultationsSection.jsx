import { Activity, ArrowUpRight } from "lucide-react";
import { formatInr } from "../utils/currency";

export default function ConsultationsSection({ doctors, selectedDoctor, onSelectDoctor, onOpenDirectory, consultationImage, loading }) {
  return (
    <section className="section-block consultation-section" id="consultations">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Consultations</div><h2>Expert help, <em>when you need it.</em></h2></div><button className="text-link" onClick={onOpenDirectory}>See all doctors <ArrowUpRight size={16} /></button></div>
      <div className="consultation-layout">
        <div className="consultation-feature"><img src={consultationImage} alt="Doctor ready for a video consultation" /><div className="feature-overlay"><span className="live-tag"><span className="live-pulse" /> LIVE CARE</span><h3>Find a doctor who<br /><em>gets your context.</em></h3><button className="circle-button" onClick={onOpenDirectory}><ArrowUpRight size={20} /></button></div></div>
        <div className="doctor-list">
          {doctors.map((doctor) => {
            const doctorKey = doctor.id || doctor.name;
            const initials = doctor.initials || (doctor.name || "DR").split(" ").map((part) => part[0]).join("").slice(0, 2);
            return <button className={selectedDoctor === doctorKey ? "doctor-row selected" : "doctor-row"} key={doctorKey} onClick={() => onSelectDoctor(doctor)}><span className="doctor-avatar" style={{ background: doctor.color || "#d9f3ed" }}>{initials}</span><span className="doctor-info"><strong>{doctor.name}</strong><small>{doctor.specialization || doctor.specialty}</small></span><span className="doctor-meta"><b>{formatInr(doctor.consultationFee ?? doctor.fee)}</b><small><span className="online-dot" /> {doctor.available === false ? "Offline" : doctor.wait || "Now"}</small></span><ArrowUpRight size={17} className="row-arrow" /></button>;
          })}
          {loading && <div className="consult-note"><Activity size={17} /><span>Loading your care network…</span></div>}
          <div className="consult-note"><Activity size={17} /><span><strong>Audio or video, your choice.</strong><br />All visits are private, encrypted, and documented.</span></div>
        </div>
      </div>
    </section>
  );
}
