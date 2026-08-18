import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";

const modeLabels = {
  patient: "Patient view",
  doctor: "Doctor view",
  pharmacy: "Pharmacy view",
  manager: "Program view",
};

export default function Header({
  mode,
  availableModes,
  onModeChange,
  activeSection,
  onNavigate,
  mobileNavOpen,
  onMobileNavToggle,
  searchOpen,
  onSearchToggle,
  onSearch,
  onNotify,
  user,
  logoImage,
}) {
  const sections = ["overview", "consultations", "pharmacy", "preventive"];

  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => onNavigate("overview")} aria-label="healthcare-telemedicine home">
          <span className="brand-mark-frame"><img src={logoImage} alt="" className="brand-mark" /></span>
          <span className="brand-wordmark">healthcare<span>-telemedicine</span></span>
        </button>
        <button className="mobile-menu-button" onClick={onMobileNavToggle} aria-label="Toggle navigation">
          {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={mobileNavOpen ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
          {sections.map((item) => (
            <button key={item} className={activeSection === item ? "nav-item active" : "nav-item"} onClick={() => onNavigate(item)}>
              {item === "overview" ? "Overview" : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={onSearchToggle}><Search size={18} /></button>
          <button className="notification-button" aria-label="Notifications" onClick={onNotify}><Bell size={18} /><span /></button>
          <div className="mode-switcher">
            <button className="mode-button" onClick={onModeChange.toggle}>
              <span className="avatar">{mode === "patient" ? "AM" : mode.slice(0, 2).toUpperCase()}</span>
              <span className="mode-name">{user?.username || modeLabels[mode]}</span><ChevronDown size={15} />
            </button>
            {onModeChange.open && <div className="mode-menu">{availableModes.map((item) => <button key={item} onClick={() => onModeChange.select(item)}>{modeLabels[item]}</button>)}</div>}
          </div>
        </div>
      </header>
      {searchOpen && <div className="search-strip"><Search size={18} /><input autoFocus placeholder="Search doctors, programs, or orders" onKeyDown={onSearch} /><button onClick={onSearchToggle}><X size={16} /></button></div>}
    </>
  );
}
