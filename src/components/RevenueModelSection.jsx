import { ArrowUpRight, CreditCard, Handshake, Megaphone } from "lucide-react";

const revenueStreams = [
  { icon: CreditCard, label: "Consultation fees", detail: "Straightforward pricing for audio and video visits with certified doctors.", amount: "01" },
  { icon: Handshake, label: "Pharmacy commissions", detail: "Local pharmacy partnerships make medicine delivery convenient while supporting the care network.", amount: "02" },
  { icon: Megaphone, label: "Sponsored programs", detail: "Mission-led organizations can sponsor evidence-informed health awareness campaigns.", amount: "03" },
];

export default function RevenueModelSection({ onExplore }) {
  return (
    <section className="revenue-section" id="revenue">
      <div className="revenue-intro"><div className="eyebrow light"><span className="eyebrow-line" /> A sustainable care network</div><h2>Good care should<br /><em>keep moving.</em></h2><p>Our model connects patients, clinicians, pharmacies, and health organizations so the platform can keep investing in accessible care.</p><button className="button button-light" onClick={onExplore}>Explore the model <ArrowUpRight size={17} /></button></div>
      <div className="revenue-streams">
        {revenueStreams.map(({ icon: Icon, label, detail, amount }) => <article className="revenue-stream" key={label}><span className="revenue-number">{amount}</span><span className="revenue-icon"><Icon size={20} /></span><div><h3>{label}</h3><p>{detail}</p></div><ArrowUpRight size={17} /></article>)}
        <div className="revenue-footnote">Revenue is reinvested into reliable technology, clinician access, pharmacy coordination, and preventive-care education.</div>
      </div>
    </section>
  );
}
