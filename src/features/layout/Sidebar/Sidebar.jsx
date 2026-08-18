import "./Sidebar.css";

const navItems = [
  "Overview",
  "Services",
  "Consultation",
  "Security",
  "Revenue",
  "Contact",
];

function Sidebar({ user, onLogin, onRegister, onLogout }) {
  return (
    <header className="sidebar">
      <div className="brand-block">
        <div className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" role="img" focusable="false">
            <path
              d="M20 12h24a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V20a8 8 0 0 1 8-8Z"
              fill="currentColor"
              opacity="0.16"
            />
            <path
              d="M32 16v32"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M16 32h32"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M24 24l16 16"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M40 24 24 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="brand-copy">
          <h2>Healthcare & Telemedicine</h2>
          <p>Heath & Wellness</p>
        </div>
      </div>

      <nav className="nav-links" aria-label="Header navigation">
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
        {user ? (
          <button type="button" className="nav-link-button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <button type="button" className="nav-link-button" onClick={onLogin}>
              Login
            </button>
            <button
              type="button"
              className="nav-link-button"
              onClick={onRegister}
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Sidebar;
