import { CreditCard, ShoppingBag } from "lucide-react";
import { formatInr } from "../utils/currency";

export default function CareLedgerSection() {
  return (
    <section className="bottom-section"><div><div className="eyebrow"><span className="eyebrow-line" /> Your care ledger</div><h2>Clarity feels <em>like care.</em></h2><p>Every consultation, order, reminder, and payment stays in one calm place.</p></div><div className="ledger-card"><div className="ledger-top"><span>APRIL CARE SPEND · INR</span><CreditCard size={18} /></div><strong>{formatInr(3500)}</strong><div className="ledger-bar"><span /></div><div className="ledger-foot"><span>Consultation</span><b>Covered by you</b></div></div><div className="ledger-card pale"><div className="ledger-top"><span>ORDERS IN MOTION</span><ShoppingBag size={18} /></div><strong>02</strong><div className="order-status"><span className="status-dot green-dot" /> One arrives tomorrow</div><div className="order-status"><span className="status-dot blue-dot" /> One being prepared</div></div></section>
  );
}
