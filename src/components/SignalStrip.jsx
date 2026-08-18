import { ArrowUpRight, HeartPulse, PackageCheck, Video } from "lucide-react";

export default function SignalStrip() {
  return (
    <section className="signal-strip" aria-label="Care signals">
      <div className="signal-item"><span className="signal-icon green"><HeartPulse size={18} /></span><span><small>Health rhythm</small><strong>On track this week</strong></span></div>
      <div className="signal-item"><span className="signal-icon blue"><Video size={18} /></span><span><small>Next consultation</small><strong>Today · 4:30 PM</strong></span></div>
      <div className="signal-item"><span className="signal-icon coral"><PackageCheck size={18} /></span><span><small>Pharmacy order</small><strong>Arriving tomorrow</strong></span></div>
      <div className="signal-action"><span>3 minutes to a calmer dashboard</span><ArrowUpRight size={16} /></div>
    </section>
  );
}
