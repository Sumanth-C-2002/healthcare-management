import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const TITLES = {
  '/patient/dashboard': 'Dashboard',
  '/patient/doctors': 'Find a doctor',
  '/patient/appointments': 'My appointments',
  '/patient/records': 'Medical records',
  '/patient/profile': 'My profile',
  '/admin/dashboard': 'Admin dashboard',
  '/admin/appointments': 'Appointments',
  '/admin/doctors': 'Doctors',
  '/admin/patients': 'Patients',
  '/admin/records': 'Medical records',
};

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = `${TITLES[location.pathname] || 'Portal'} · Sanora`;
  }, [location.pathname]);

  return (
    <div className="layout">
      <a href="#main" className="skip-link">Skip to content</a>
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="layout-main">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="content" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}