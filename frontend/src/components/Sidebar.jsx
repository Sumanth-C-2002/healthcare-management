import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

const NAV = {
  PATIENT: [
    { to: '/patient/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/patient/doctors', label: 'Find a doctor', icon: 'bi-search' },
    { to: '/patient/appointments', label: 'My appointments', icon: 'bi-calendar-check' },
    { to: '/patient/records', label: 'Medical records', icon: 'bi-journal-medical' },
    { to: '/patient/profile', label: 'My profile', icon: 'bi-person-circle' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/admin/appointments', label: 'Appointments', icon: 'bi-calendar-check' },
    { to: '/admin/doctors', label: 'Doctors', icon: 'bi-person-badge' },
    { to: '/admin/patients', label: 'Patients', icon: 'bi-people' },
    { to: '/admin/records', label: 'Medical records', icon: 'bi-journal-medical' },
  ],
};

export default function Sidebar({ open, onNavigate }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-brand">
        <Logo light />
      </div>
      <div className="side-label">{role === 'ADMIN' ? 'Administration' : 'Patient portal'}</div>
      <nav className="side-nav">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="side-link" onClick={onNavigate}>
            <i className={`bi ${item.icon}`} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="side-foot">
        <button className="side-link" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right" />
          Sign out
        </button>
      </div>
    </aside>
  );
}