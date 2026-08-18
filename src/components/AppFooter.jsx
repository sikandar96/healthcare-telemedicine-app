export default function AppFooter({ logoImage, user, onLogout, onOpenAuth, onAnnounce }) {
  return (
    <footer className="site-footer"><div className="footer-brand"><span className="brand-mark-frame"><img src={logoImage} alt="" className="brand-mark" /></span><span className="brand-wordmark">healthcare<span>-telemedicine</span></span></div><span>Connected care, wherever you are.</span><div className="footer-links"><button onClick={() => onAnnounce("Privacy information")}>Privacy</button><button onClick={() => onAnnounce("Support is opening")}>Support</button>{user ? <button onClick={onLogout}>Sign out</button> : <button onClick={() => onOpenAuth("login")}>Sign in</button>}</div></footer>
  );
}
