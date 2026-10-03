import { Link } from 'react-router-dom';
import { patientApi } from '../../api/services.js';
import AppointmentItem from '../../components/AppointmentItem.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, formatTime, sortKey, toISODate, todayISO } from '../../utils/format.js';

const loadDashboard = () =>
  Promise.all([patientApi.getAppointments(), patientApi.getRecords()]).then(([appts, recs]) => ({
    appointments: appts.data,
    records: recs.data,
  }));

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useLoad(loadDashboard);

  if (loading) return <PageLoader rows={4} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { appointments, records } = data;
  const today = todayISO();
  const upcoming = appointments
    .filter((a) => ['PENDING', 'APPROVED'].includes(a.status) && toISODate(a.appointmentDate) >= today)
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const next = upcoming[0];
  const pending = appointments.filter((a) => a.status === 'PENDING').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const recent = appointments.slice(0, 4);

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.fullName.split(' ')[0]}`}
        subtitle="Here is a quick overview of your care."
        actions={
          <Link to="/patient/doctors" className="button primary">
            <i className="bi bi-plus-lg" /> Book appointment
          </Link>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-calendar-check" label="Upcoming" value={upcoming.length} to="/patient/appointments" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-hourglass-split" label="Awaiting approval" value={pending} tone="warning" to="/patient/appointments" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-check-circle" label="Completed visits" value={completed} tone="success" to="/patient/appointments" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-journal-medical" label="Medical records" value={records.length} tone="info" to="/patient/records" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4 order-lg-2">
          {next ? (
            <div className="highlight">
              <div className="eyebrow">Next appointment</div>
              <h3>{next.doctorName}</h3>
              <p>{next.specialization}</p>
              <p>
                <i className="bi bi-calendar-event me-2" />
                {formatDate(next.appointmentDate)}
              </p>
              <p>
                <i className="bi bi-clock me-2" />
                {formatTime(next.appointmentTime)}
              </p>
              <div className="mt-3">
                <StatusChip status={next.status} />
              </div>
            </div>
          ) : (
            <EmptyState
              icon="bi-calendar-plus"
              title="No upcoming appointments"
              text="Find a doctor and book your next visit in a few clicks."
              action={
                <Link to="/patient/doctors" className="button primary">
                  Find a doctor
                </Link>
              }
            />
          )}
        </div>

        <div className="col-lg-8 order-lg-1">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="h6 mb-0">Recent appointments</h3>
            <Link to="/patient/appointments" className="small fw-semibold">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon="bi-calendar" title="No appointments yet" text="Your appointment history will appear here." />
          ) : (
            <div className="stack">
              {recent.map((appt) => (
                <AppointmentItem key={appt.id} appt={appt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}