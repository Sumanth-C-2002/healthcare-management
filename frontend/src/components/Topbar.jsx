import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../utils/format.js';

export default function Topbar({ onMenu }) {
  const { user, role } = useAuth();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-2">
        <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu">
          <i className="bi bi-list" />
        </button>
        <span className="topbar-date">{today}</span>
      </div>
      <div className="topbar-user">
        <div className="text-end d-none d-sm-block">
          <div className="topbar-name">{user.fullName}</div>
          <div className="topbar-role">{role === 'ADMIN' ? 'Administrator' : 'Patient'}</div>
        </div>
        <div className="avatar round">{initials(user.fullName)}</div>
      </div>
    </header>
  );
}