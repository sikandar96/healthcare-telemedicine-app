import "./SecuritySection.css";

const securityFeatures = [
  "HIPAA-ready data handling",
  "Encrypted consultations and records",
  "Multi-factor authentication",
  "24/7 monitoring and fraud protection",
];

function SecuritySection() {
  return (
    <section className="security-section" id="security">
      <div className="security-header">
        <div>
          <p className="section-label">Security</p>
          <h3>Protected care experiences</h3>
        </div>
        <span className="status-badge">Trusted platform</span>
      </div>

      <div className="security-grid">
        {securityFeatures.map((feature) => (
          <article key={feature} className="security-card">
            <h4>{feature}</h4>
            <p>
              Patient information remains protected through layered security
              controls and continuous monitoring.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SecuritySection;
