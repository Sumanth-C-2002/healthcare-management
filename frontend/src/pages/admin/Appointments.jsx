import { useMemo, useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { adminApi } from '../../api/services.js';
import Field from '../../components/Field.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, formatTime, initials, statusLabel } from '../../utils/format.js';

const loadAppointments = () => adminApi.getAppointments().then((res) => res.data);
const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'];

const REVIEW_COPY = {
  APPROVED: { title: 'Approve appointment', button: 'Approve', hint: 'Optional note for the patient, for example: Please arrive 10 minutes early.' },
  REJECTED: { title: 'Reject appointment', button: 'Reject', hint: 'Tell the patient why (optional, but recommended).' },
  COMPLETED: { title: 'Mark as completed', button: 'Mark completed', hint: 'Optional note about the visit.' },
};

export default function AdminAppointments() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadAppointments);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [review, setReview] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

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

  const q = query.trim().toLowerCase();
  const visible = appointments.filter(
    (a) =>
      (filter === 'ALL' || a.status === filter) &&
      (!q ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        (a.reason || '').toLowerCase().includes(q))
  );

  const openReview = (appt, status) => {
    setRemarks('');
    setReview({ appt, status });
  };

  const submitReview = async () => {
    setSaving(true);
    try {
      const res = await adminApi.updateAppointmentStatus(review.appt.id, {
        status: review.status,
        adminRemarks: remarks.trim() || null,
      });
      toast.success(res.data.message);
      setReview(null);
      reload();
    } catch (err) {
      toast.error(getErrorInfo(err).message);
    } finally {
      setSaving(false);
    }
  };

  const copy = review ? REVIEW_COPY[review.status] : null;

  return (
    <>
      <PageHeader title="Appointments" subtitle="Review requests, approve visits and mark them completed." />

      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search" />
            <input className="input" placeholder="Search patient, doctor or reason" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search appointments" />
          </div>
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={`filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'ALL' ? 'All' : statusLabel(f)} ({counts[f] || 0})
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="bi-calendar" title="No appointments found" text="Try another filter or search term." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>When</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="cell-person">
                        <div className="avatar">{initials(a.patientName)}</div>
                        <div>
                          <div className="fw-semibold">{a.patientName}</div>
                          <div className="appt-sub">Patient #{a.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold">{a.doctorName}</div>
                      <div className="appt-sub">{a.specialization}</div>
                    </td>
                    <td>
                      <div>{formatDate(a.appointmentDate)}</div>
                      <div className="appt-sub">{formatTime(a.appointmentTime)}</div>
                    </td>
                    <td>
                      <div className="truncate" title={a.reason}>{a.reason}</div>
                    </td>
                    <td>
                      <StatusChip status={a.status} />
                      {a.adminRemarks && (
                        <div className="appt-sub truncate" title={a.adminRemarks}>{a.adminRemarks}</div>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        {a.status === 'PENDING' && (
                          <>
                            <button className="button soft sm" onClick={() => openReview(a, 'APPROVED')}>
                              <i className="bi bi-check-lg" /> Approve
                            </button>
                            <button className="button danger sm" onClick={() => openReview(a, 'REJECTED')}>
                              Reject
                            </button>
                          </>
                        )}
                        {a.status === 'APPROVED' && (
                          <button className="button ghost sm" onClick={() => openReview(a, 'COMPLETED')}>
                            Mark completed
                          </button>
                        )}
                        {!['PENDING', 'APPROVED'].includes(a.status) && <span className="muted">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(review)}
        title={copy?.title ?? ''}
        onClose={() => setReview(null)}
        footer={
          <>
            <button className="button ghost" onClick={() => setReview(null)} disabled={saving}>
              Cancel
            </button>
            <button className={`button ${review?.status === 'REJECTED' ? 'danger-solid' : 'primary'}`} onClick={submitReview} disabled={saving}>
              {saving ? <span className="spinner" /> : null}
              {copy?.button}
            </button>
          </>
        }
      >
        {review && (
          <>
            <div className="dialog-doctor">
              <div className="avatar">{initials(review.appt.patientName)}</div>
              <div>
                <div className="fw-bold">{review.appt.patientName}</div>
                <div className="small muted">
                  {review.appt.doctorName} · {formatDate(review.appt.appointmentDate)}, {formatTime(review.appt.appointmentTime)}
                </div>
              </div>
            </div>
            <Field label="Note to patient (optional)" hint={copy.hint}>
              <textarea className="textarea" maxLength={255} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </Field>
          </>
        )}
      </Modal>
    </>
  );
}