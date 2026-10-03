import { useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { patientApi } from '../../api/services.js';
import Field from '../../components/Field.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorState, PageLoader } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useLoad from '../../hooks/useLoad.js';
import { emptyToNull, formatDate, initials, todayISO, toISODate } from '../../utils/format.js';

const loadProfile = () => patientApi.getProfile().then((res) => res.data);

function ProfileForm({ profile }) {
  const { updateName } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    fullName: profile.fullName ?? '',
    phone: profile.phone ?? '',
    gender: profile.gender ?? '',
    dateOfBirth: toISODate(profile.dateOfBirth),
    address: profile.address ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cls = (name) => `input ${fieldErrors[name] ? 'invalid' : ''}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const res = await patientApi.updateProfile(emptyToNull({ ...form, fullName: form.fullName.trim() }));
      updateName(form.fullName.trim());
      toast.success(res.data.message);
    } catch (err) {
      const info = getErrorInfo(err);
      setError(info.message);
      setFieldErrors(info.fields);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel panel-pad">
      <h3 className="h6 mb-3">Personal information</h3>
      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="row gx-3">
          <div className="col-md-6">
            <Field label="Full name" error={fieldErrors.fullName}>
              <input className={cls('fullName')} name="fullName" value={form.fullName} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Email address" hint="Your email is your login and cannot be changed">
              <input className="input" value={profile.email} disabled />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Phone" error={fieldErrors.phone} hint="10 digits">
              <input className={cls('phone')} name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Gender" error={fieldErrors.gender}>
              <select className="select" name="gender" value={form.gender} onChange={onChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Date of birth" error={fieldErrors.dateOfBirth}>
              <input className={cls('dateOfBirth')} type="date" name="dateOfBirth" max={todayISO(-1)} value={form.dateOfBirth} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Address" error={fieldErrors.address}>
              <input className={cls('address')} name="address" value={form.address} onChange={onChange} />
            </Field>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Profile() {
  const { data, loading, error, reload } = useLoad(loadProfile);

  if (loading) return <PageLoader rows={0} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader title="My profile" subtitle="Keep your details up to date." />
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="panel profile-card">
            <div className="avatar lg mx-auto mb-3">{initials(data.fullName)}</div>
            <h3 className="h5 mb-1">{data.fullName}</h3>
            <div className="muted small mb-2">{data.email}</div>
            <span className="chip tint plain">Patient</span>
            <div className="detail-list">
              <div><i className="bi bi-telephone" />{data.phone || 'No phone added'}</div>
              <div><i className="bi bi-calendar-event" />{data.dateOfBirth ? formatDate(data.dateOfBirth) : 'No date of birth added'}</div>
              <div><i className="bi bi-geo-alt" />{data.address || 'No address added'}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <ProfileForm profile={data} />
        </div>
      </div>
    </>
  );
}