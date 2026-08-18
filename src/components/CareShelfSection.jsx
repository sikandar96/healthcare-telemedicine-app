import { ArrowUpRight, CalendarDays, Check, Pill } from "lucide-react";

export default function CareShelfSection({ pharmacyImage, preventiveImage, reminders, reminderDone, onCompleteReminder, onToggleDemoReminder, onOpenPharmacy }) {
  const reminder = reminders[0];
  const completed = reminder?.completed || reminderDone;

  return (
    <section className="section-block care-grid-section" id="pharmacy">
      <div className="section-heading compact"><div><div className="eyebrow"><span className="eyebrow-line" /> The care shelf</div><h2>Good care is <em>also practical.</em></h2></div><p>From local pharmacy partners to simple health prompts, keep the everyday close.</p></div>
      <div className="care-grid">
        <article className="care-card pharmacy-card"><img src={pharmacyImage} alt="Pharmacy delivery parcel" /><div className="card-body"><div className="card-kicker"><Pill size={15} /> PHARMACY DELIVERY</div><h3>Your essentials,<br /><em>at your door.</em></h3><p>Local partners. Clear pricing. One less errand on your list.</p><button className="button button-dark" onClick={onOpenPharmacy}>Browse pharmacy <ArrowUpRight size={16} /></button></div></article>
        <article className="care-card preventive-card" id="preventive"><img src={preventiveImage} alt="Preventive care reminder materials" /><div className="card-body"><div className="card-kicker green-text"><CalendarDays size={15} /> PREVENTIVE CARE</div><h3>Small prompts.<br /><em>Better rhythm.</em></h3><p>Vaccination reminders and care moments that fit your life.</p><div className="reminder-line"><span className={completed ? "check-circle done" : "check-circle"}>{completed ? <Check size={13} /> : null}</span><span><strong>{reminder?.title || (reminderDone ? "Reminder complete" : "Flu vaccine check")}</strong><small>{reminder?.dueDate ? `Due ${reminder.dueDate}` : "Due in 6 days"}</small></span><button onClick={() => reminder ? onCompleteReminder(reminder) : onToggleDemoReminder()} aria-label="Complete reminder"><ArrowUpRight size={16} /></button></div></div></article>
      </div>
    </section>
  );
}
