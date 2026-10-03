import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../api/services.js';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyState, ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { formatCurrency, initials } from '../../utils/format.js';
import BookAppointmentModal from './BookAppointmentModal.jsx';

const loadDoctors = () => doctorApi.list().then((res) => res.data);

export default function Doctors() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(loadDoctors);
  const [query, setQuery] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [selected, setSelected] = useState(null);

  const doctors = useMemo(() => data ?? [], [data]);
  const specializations = useMemo(() => ['All', ...new Set(doctors.map((d) => d.specialization))], [doctors]);

  if (loading) return <PageLoader rows={3} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const q = query.trim().toLowerCase();
  const filtered = doctors.filter(
    (d) =>
      (specialization === 'All' || d.specialization === specialization) &&
      (!q || d.fullName.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q))
  );

  const onBooked = () => {
    setSelected(null);
    toast.success('Appointment request submitted. It will be confirmed once approved.');
    navigate('/patient/appointments');
  };

  return (
    <>
      <PageHeader title="Find a doctor" subtitle="Choose a specialist and book your visit in a few steps." />

      <div className="panel panel-pad mb-4">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="search">
            <i className="bi bi-search" />
            <input className="input" placeholder="Search by name or specialization" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search doctors" />
          </div>
          <div className="filters">
            {specializations.map((s) => (
              <button key={s} className={`filter ${specialization === s ? 'active' : ''}`} onClick={() => setSpecialization(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="bi-person-x"
          title="No doctors found"
          text={doctors.length === 0 ? 'No doctors are available right now. Please check back soon.' : 'Try a different search or filter.'}
        />
      ) : (
        <div className="row g-3">
          {filtered.map((d) => (
            <div className="col-md-6 col-xl-4" key={d.id}>
              <article className="panel doctor-card">
                <div className="d-flex gap-3 align-items-center">
                  <div className="avatar">{initials(d.fullName)}</div>
                  <div>
                    <h3 className="doctor-name">{d.fullName}</h3>
                    <span className="chip tint plain">{d.specialization}</span>
                  </div>
                </div>
                <div className="meta-row">
                  {d.qualification && (
                    <span>
                      <i className="bi bi-mortarboard" />
                      {d.qualification}
                    </span>
                  )}
                  {d.experienceYears != null && (
                    <span>
                      <i className="bi bi-briefcase" />
                      {d.experienceYears} yrs experience
                    </span>
                  )}
                </div>
                <div className="doctor-foot">
                  <div>
                    <div className="fee">{formatCurrency(d.consultationFee)}</div>
                    <div className="stat-label">per consultation</div>
                  </div>
                  <button className="button primary" onClick={() => setSelected(d)}>
                    Book appointment
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {selected && <BookAppointmentModal doctor={selected} onClose={() => setSelected(null)} onBooked={onBooked} />}
    </>
  );
}