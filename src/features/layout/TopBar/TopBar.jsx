import { useState } from "react";
import ConsultationSection from "../../dashboard/ConsultationSection/ConsultationSection";
import "./TopBar.css";

function TopBar({ user, onOpenAuth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Healthcare & Telemedicine</p>
          <h1>Connected care for every patient journey.</h1>
          {user ? <p className="user-badge">Welcome, {user.name}</p> : null}
        </div>
        {user ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Book a consultation
          </button>
        ) : (
          <button
            type="button"
            className="primary-btn"
            onClick={() => onOpenAuth("login")}
          >
            Login to continue
          </button>
        )}
      </header>

      {isModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="section-label">Book a consultation</p>
                <h3>Schedule care in minutes</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <ConsultationSection compact />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TopBar;
