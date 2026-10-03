import { useEffect } from 'react';
import Logo from './Logo.jsx';

export default function AuthShell({ title, subtitle, wide = false, children, footer }) {
    useEffect(() => {
    document.title = `${title} · Sanora`;
  }, [title]);
  return (
    
    <div className="auth-shell">
      <aside className="auth-aside">
        <Logo light />
        <div>
          <h1>Your health, organised in one place.</h1>
          <p className="auth-lead">
            Book appointments, follow your care and keep every medical record secure and within reach.
          </p>
          <ul className="auth-points">
            <li><i className="bi bi-calendar-check" /> Book a doctor in a few clicks</li>
            <li><i className="bi bi-file-earmark-medical" /> Download reports and prescriptions</li>
            <li><i className="bi bi-shield-lock" /> Private, role-based and secure access</li>
          </ul>
        </div>
        <small className="auth-copy">© {new Date().getFullYear()} Sanora Health</small>
      </aside>
      <main className="auth-main">
        <div className={`auth-card ${wide ? 'wide' : ''}`}>
          <div className="auth-mobile-logo">
            <Logo />
          </div>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
          {footer && <p className="auth-footer">{footer}</p>}
        </div>
      </main>
    </div>
  );
}