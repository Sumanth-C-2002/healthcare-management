import { useMemo, useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { adminApi } from '../../api/services.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatCurrency, initials } from '../../utils/format.js';
import DoctorFormModal from './DoctorFormModal.jsx';

const loadDoctors = () => adminApi.getDoctors().then((res) => res.data);

export default function AdminDoctors() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadDoctors);
  const [query, setQuery] = useState('');
  const [formState, setFormState] = useState({ open: false, doctor: null });
  const [statusTarget, setStatusTarget] = useState(null);
  const [changing, setChanging] = useState(false);

  const doctors = useMemo(() => data ?? [], [data]);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const q = query.trim().toLowerCase();
  const visible = doctors.filter(
    (d) =>
      !q ||
      d.fullName.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
  );

  const onSaved = (message) => {
    setFormState({ open: false, doctor: null });
    toast.success(message);
    reload();
  };

  const confirmStatus = async () => {
    setChanging(true);
    try {
      const res = await adminApi.updateDoctorStatus(statusTarget.doctor.id, statusTarget.next);
      toast.success(res.data.message);
      reload();
    } catch (err) {
      toast.error(getErrorInfo(err).message);
    } finally {
      setChanging(false);
      setStatusTarget(null);
    }
  };

  const deactivating = statusTarget?.next === 'INACTIVE';

  return (
    <>
      <PageHeader
        title="Doctors"
        subtitle="Add doctors, update their details and control who appears for booking."
        actions={
          <button className="button primary" onClick={() => setFormState({ open: true, doctor: null })}>
            <i className="bi bi-plus-lg" /> Add doctor
          </button>
        }
      />

      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search" />
            <input className="input" placeholder="Search name, specialization or email" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search doctors" />
          </div>
          <span className="muted small">{visible.length} of {doctors.length} doctors</span>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="bi-person-badge" title="No doctors found" text={doctors.length === 0 ? 'Add your first doctor to get started.' : 'Try a different search.'} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="cell-person">
                        <div className="avatar">{initials(d.fullName)}</div>
                        <div>
                          <div className="fw-semibold">{d.fullName}</div>
                          <div className="appt-sub">{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{d.specialization}</div>
                      <div className="appt-sub">{d.qualification || '—'}</div>
                    </td>
                    <td>{d.experienceYears != null ? `${d.experienceYears} yrs` : '—'}</td>
                    <td>{formatCurrency(d.consultationFee)}</td>
                    <td><StatusChip status={d.status} /></td>
                    <td>
                      <div className="row-actions">
                        <button className="button ghost sm" onClick={() => setFormState({ open: true, doctor: d })}>
                          <i className="bi bi-pencil-square" /> Edit
                        </button>
                        {d.status === 'ACTIVE' ? (
                          <button className="button danger sm" onClick={() => setStatusTarget({ doctor: d, next: 'INACTIVE' })}>
                            Deactivate
                          </button>
                        ) : (
                          <button className="button soft sm" onClick={() => setStatusTarget({ doctor: d, next: 'ACTIVE' })}>
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formState.open && (
        <DoctorFormModal
          doctor={formState.doctor}
          onClose={() => setFormState({ open: false, doctor: null })}
          onSaved={onSaved}
        />
      )}

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={deactivating ? 'Deactivate doctor?' : 'Activate doctor?'}
        message={
          statusTarget
            ? deactivating
              ? `${statusTarget.doctor.fullName} will no longer appear in the booking list. Existing appointments and records are kept.`
              : `${statusTarget.doctor.fullName} will appear in the booking list again.`
            : ''
        }
        confirmLabel={deactivating ? 'Deactivate' : 'Activate'}
        danger={deactivating}
        loading={changing}
        onConfirm={confirmStatus}
        onClose={() => setStatusTarget(null)}
      />
    </>
  );
}