import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-card" id="overview">
      <div>
        <h2>Trusted healthcare services, built for convenience.</h2>
        <p>
          Access certified doctors, medication delivery support, and preventive
          wellness reminders from one modern platform.
        </p>
      </div>
      <div className="revenue-pill">
        Revenue: Consultation fees, pharmacy commissions, sponsored health
        programs.
      </div>
    </section>
  );
}

export default HeroSection;
