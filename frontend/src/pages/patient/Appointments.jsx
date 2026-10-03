import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorInfo } from '../../api/client.js';
import { patientApi } from '../../api/services.js';
import AppointmentItem from '../../components/AppointmentItem.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, formatTime, statusLabel } from '../../utils/format.js';

const loadAppointments = () => patientApi.getAppointments().then((res) => res.data);
const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'];

export default function Appointments() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadAppointments);
  const [filter, setFilter] = useState('ALL');
  const [target, setTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const appointments = useMemo(() => data ?? [], [data]);
  const counts = useMemo(() => {
    const result = { ALL: appointments.length };
    appointments.forEach((a) => {
      result[a.status] = (result[a.status] || 0) + 1;
    });
    return result;
  }, [appointments]);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const visible = filter === 'ALL' ? appointments : appointments.filter((a) => a.status === filter);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await patientApi.cancelAppointment(target.id);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(getErrorInfo(err).message);
    } finally {
      setCancelling(false);
      setTarget(null);
      reload();
    }
  };

  return (
    <>
      <PageHeader
        title="My appointments"
        subtitle="Track every visit, from request to completion."
        actions={
          <Link to="/patient/doctors" className="button primary">
            <i className="bi bi-plus-lg" /> Book appointment
          </Link>
        }
      />

      <div className="filters mb-3">
        {FILTERS.map((f) => (
          <button key={f} className={`filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All' : statusLabel(f)} ({counts[f] || 0})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="bi-calendar"
          title={appointments.length === 0 ? 'No appointments yet' : 'Nothing in this view'}
          text={appointments.length === 0 ? 'Book your first appointment with one of our doctors.' : 'Try another status filter.'}
          action={
            appointments.length === 0 ? (
              <Link to="/patient/doctors" className="button primary">
                Find a doctor
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="stack">
          {visible.map((appt) => (
            <AppointmentItem key={appt.id} appt={appt} onCancel={setTarget} />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(target)}
        title="Cancel appointment?"
        onClose={() => setTarget(null)}
        footer={
          <>
            <button className="button ghost" onClick={() => setTarget(null)}>
              Keep appointment
            </button>
            <button className="button primary" onClick={confirmCancel} disabled={cancelling}>
              {cancelling ? <span className="spinner" /> : null}
              Yes, cancel it
            </button>
          </>
        }
      >
        {target && (
          <p className="mb-0">
            You are about to cancel your visit with <strong>{target.doctorName}</strong> on{' '}
            <strong>{formatDate(target.appointmentDate)}</strong> at <strong>{formatTime(target.appointmentTime)}</strong>.
          </p>
        )}
      </Modal>
    </>
  );
}