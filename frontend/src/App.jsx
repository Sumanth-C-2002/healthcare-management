import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PatientDashboard from './pages/patient/Dashboard.jsx';
import Doctors from './pages/patient/Doctors.jsx';
import Appointments from './pages/patient/Appointments.jsx';
import Records from './pages/patient/Records.jsx';
import Profile from './pages/patient/Profile.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminAppointments from './pages/admin/Appointments.jsx';
import AdminDoctors from './pages/admin/Doctors.jsx';
import AdminPatients from './pages/admin/Patients.jsx';
import AdminRecords from './pages/admin/Records.jsx';

const homePath = (role) => (role === 'ADMIN' ? '/admin/dashboard' : '/patient/dashboard');

function PublicOnly({ children }) {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated ? <Navigate to={homePath(role)} replace /> : children;
}

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth();
  return <Navigate to={isAuthenticated ? homePath(role) : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route element={<ProtectedRoute role="PATIENT" />}>
        <Route element={<AppLayout />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/doctors" element={<Doctors />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/records" element={<Records />} />
          <Route path="/patient/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/records" element={<AdminRecords />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}