import { useMemo, useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { adminApi } from '../../api/services.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { initials } from '../../utils/format.js';

const loadPatients = () => adminApi.getUsers().then((res) => res.data);

export default function AdminPatients() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadPatients);
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState(null);
  const [changing, setChanging] = useState(false);

  const patients = useMemo(() => data ?? [], [data]);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const q = query.trim().toLowerCase();
  const visible = patients.filter(
    (p) => !q || p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
  );

  const confirmChange = async () => {
    setChanging(true);
    try {
      const res = await adminApi.updateUserStatus(target.user.id, target.next);
      toast.success(res.data.message);
      reload();
    } catch (err) {
      toast.error(getErrorInfo(err).message);
    } finally {
      setChanging(false);
      setTarget(null);
    }
  };

  const blocking = target?.next === 'BLOCKED';

  return (
    <>
      <PageHeader title="Patients" subtitle="View registered patients and manage their access." />

      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search" />
            <input className="input" placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search patients" />
          </div>
          <span className="muted small">{visible.length} of {patients.length} patients</span>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="bi-people" title="No patients found" text={patients.length === 0 ? 'Patients will appear here after they register.' : 'Try a different search.'} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="cell-person">
                        <div className="avatar">{initials(p.fullName)}</div>
                        <div>
                          <div className="fw-semibold">{p.fullName}</div>
                          <div className="appt-sub">Patient #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.email}</td>
                    <td>{p.phone || '—'}</td>
                    <td><StatusChip status={p.status} /></td>
                    <td>
                      <div className="row-actions">
                        {p.status === 'ACTIVE' ? (
                          <button className="button danger sm" onClick={() => setTarget({ user: p, next: 'BLOCKED' })}>
                            <i className="bi bi-slash-circle" /> Block
                          </button>
                        ) : (
                          <button className="button soft sm" onClick={() => setTarget({ user: p, next: 'ACTIVE' })}>
                            Unblock
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

      <ConfirmDialog
        open={Boolean(target)}
        title={blocking ? 'Block this patient?' : 'Unblock this patient?'}
        message={
          target
            ? blocking
              ? `${target.user.fullName} will not be able to sign in until you unblock the account. Their data is kept safe.`
              : `${target.user.fullName} will be able to sign in again.`
            : ''
        }
        confirmLabel={blocking ? 'Block patient' : 'Unblock'}
        danger={blocking}
        loading={changing}
        onConfirm={confirmChange}
        onClose={() => setTarget(null)}
      />
    </>
  );
}