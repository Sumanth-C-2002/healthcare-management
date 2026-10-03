import { useMemo, useState } from 'react';
import { adminApi } from '../../api/services.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatDate, initials } from '../../utils/format.js';
import AddRecordModal from './AddRecordModal.jsx';

const loadRecords = () =>
  Promise.all([adminApi.getRecords(), adminApi.getAppointments()]).then(([recs, appts]) => ({
    records: recs.data,
    appointments: appts.data,
  }));

export default function AdminRecords() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadRecords);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(null);

  const records = useMemo(() => data?.records ?? [], [data]);
  const eligible = useMemo(() => {
    const recorded = new Set(records.map((r) => r.appointmentId));
    return (data?.appointments ?? []).filter(
      (a) => ['APPROVED', 'COMPLETED'].includes(a.status) && !recorded.has(a.id)
    );
  }, [data, records]);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const q = query.trim().toLowerCase();
  const visible = records.filter(
    (r) =>
      !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.doctorName.toLowerCase().includes(q) ||
      (r.diagnosis || '').toLowerCase().includes(q)
  );

  const onSaved = (message) => {
    setAdding(false);
    toast.success(message);
    reload();
  };

  return (
    <>
      <PageHeader
        title="Medical records"
        subtitle="View every patient record and add new ones after a visit."
        actions={
          <button className="button primary" onClick={() => setAdding(true)}>
            <i className="bi bi-plus-lg" /> Add record
          </button>
        }
      />

      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search" />
            <input className="input" placeholder="Search patient, doctor or diagnosis" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search records" />
          </div>
          <span className="muted small">{visible.length} of {records.length} records</span>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="bi-journal-medical" title="No records found" text={records.length === 0 ? 'Add a record after an approved appointment.' : 'Try a different search.'} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Visit date</th>
                  <th>Diagnosis</th>
                  <th>File</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="cell-person">
                        <div className="avatar">{initials(r.patientName)}</div>
                        <div>
                          <div className="fw-semibold">{r.patientName}</div>
                          <div className="appt-sub">Appointment #{r.appointmentId}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.doctorName}</td>
                    <td>{formatDate(r.recordDate)}</td>
                    <td><div className="truncate" title={r.diagnosis}>{r.diagnosis}</div></td>
                    <td>
                      {r.fileName ? (
                        <span className="chip tint plain"><i className="bi bi-paperclip" />{r.fileName.length > 18 ? `${r.fileName.slice(0, 15)}...` : r.fileName}</span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="button ghost sm" onClick={() => setSelected(r)}>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {adding && <AddRecordModal eligible={eligible} onClose={() => setAdding(false)} onSaved={onSaved} />}

      <Modal open={Boolean(selected)} wide title="Medical record details" onClose={() => setSelected(null)}>
        {selected && (
          <dl className="detail-grid">
            <dt>Patient</dt>
            <dd>{selected.patientName} (#{selected.patientId})</dd>
            <dt>Doctor</dt>
            <dd>{selected.doctorName}</dd>
            <dt>Appointment</dt>
            <dd>#{selected.appointmentId}</dd>
            <dt>Visit date</dt>
            <dd>{formatDate(selected.recordDate)}</dd>
            <dt>Diagnosis</dt>
            <dd>{selected.diagnosis}</dd>
            <dt>Prescription</dt>
            <dd>{selected.prescription || '—'}</dd>
            <dt>Attached file</dt>
            <dd>{selected.fileName || 'No file attached'}</dd>
          </dl>
        )}
      </Modal>
    </>
  );
}