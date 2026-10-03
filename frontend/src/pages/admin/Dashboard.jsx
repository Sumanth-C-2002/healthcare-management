import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services.js';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, formatTime, initials, statusLabel } from '../../utils/format.js';

const loadAdminDashboard = () =>
  Promise.all([
    adminApi.getAppointments(),
    adminApi.getDoctors(),
    adminApi.getUsers(),
    adminApi.getRecords(),
  ]).then(([appts, docs, users, recs]) => ({
    appointments: appts.data,
    doctors: docs.data,
    users: users.data,
    records: recs.data,
  }));

const STATUS_ORDER = [
  { key: 'PENDING', tone: 'warning' },
  { key: 'APPROVED', tone: 'info' },
  { key: 'COMPLETED', tone: 'success' },
  { key: 'REJECTED', tone: 'danger' },
  { key: 'CANCELLED', tone: 'neutral' },
];

export default function AdminDashboard() {
  const { data, loading, error, reload } = useLoad(loadAdminDashboard);

  if (loading) return <PageLoader rows={5} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { appointments, doctors, users, records } = data;
  const pending = appointments.filter((a) => a.status === 'PENDING');
  const activeDoctors = doctors.filter((d) => d.status === 'ACTIVE').length;
  const total = appointments.length;

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="A live overview of appointments, doctors and patients." />

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl">
          <StatCard icon="bi-hourglass-split" label="Pending approvals" value={pending.length} tone="warning" to="/admin/appointments" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard icon="bi-calendar-check" label="Total appointments" value={total} to="/admin/appointments" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard icon="bi-person-badge" label={`Active doctors (of ${doctors.length})`} value={activeDoctors} tone="success" to="/admin/doctors" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard icon="bi-people" label="Patients" value={users.length} tone="info" to="/admin/patients" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard icon="bi-journal-medical" label="Medical records" value={records.length} to="/admin/records" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="panel">
            <div className="panel-head">
              <h3>Needs your attention</h3>
              <Link to="/admin/appointments" className="small fw-semibold">
                View all
              </Link>
            </div>
            {pending.length === 0 ? (
              <EmptyState icon="bi-check2-circle" title="All caught up" text="There are no appointments waiting for approval." />
            ) : (
              pending.slice(0, 5).map((a) => (
                <div className="list-row" key={a.id}>
                  <div className="avatar round">{initials(a.patientName)}</div>
                  <div className="list-main">
                    <div className="fw-semibold">{a.patientName}</div>
                    <div className="appt-sub">
                      {a.doctorName} · {formatDate(a.appointmentDate)}, {formatTime(a.appointmentTime)}
                    </div>
                  </div>
                  <Link to="/admin/appointments" className="button soft sm">
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="panel">
            <div className="panel-head">
              <h3>Appointments by status</h3>
            </div>
            <div className="panel-pad">
              {total === 0 ? (
                <p className="muted mb-0">No appointments yet. The breakdown will appear here.</p>
              ) : (
                STATUS_ORDER.map(({ key, tone }) => {
                  const count = appointments.filter((a) => a.status === key).length;
                  const percent = Math.round((count / total) * 100);
                  return (
                    <div className="bar-row" key={key}>
                      <span>{statusLabel(key)}</span>
                      <div className="bar-track">
                        <div className={`bar-fill ${tone}`} style={{ width: `${percent}%` }} />
                      </div>
                      <strong>{count}</strong>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}