import { useState } from "react";
import "./ConsultationSection.css";

const consultationTypes = ["Video Call", "Audio Call", "In-person Visit"];

function ConsultationSection({ compact = false }) {
  const [selectedType, setSelectedType] = useState(consultationTypes[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      className={`consultation-section${compact ? " compact" : ""}`}
      id="consultation"
    >
      {!compact ? (
        <div className="consultation-header">
          <div>
            <p className="section-label">Book a consultation</p>
            <h3>Schedule care in minutes</h3>
          </div>
          <span className="status-badge">Secure booking</span>
        </div>
      ) : null}

      <form className="consultation-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" placeholder="Dr. Maya Chen" required />
        </label>

        <label>
          Email
          <input type="email" placeholder="patient@example.com" required />
        </label>

        <label>
          Preferred consultation type
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            {consultationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Notes
          <textarea placeholder="Describe symptoms or care needs" rows="3" />
        </label>

        <button type="submit" className="primary-btn">
          Confirm booking
        </button>
      </form>

      {submitted ? (
        <p className="success-message">
          Booking request received. Our care team will confirm your appointment
          shortly.
        </p>
      ) : null}
    </section>
  );
}

export default ConsultationSection;
