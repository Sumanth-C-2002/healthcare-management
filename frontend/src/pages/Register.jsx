import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorInfo } from '../api/client.js';
import { authApi } from '../api/services.js';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import { emptyToNull, todayISO } from '../utils/format.js';

const EMPTY = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  address: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cls = (name) => `input ${fieldErrors[name] ? 'invalid' : ''}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...rest } = form;
      await authApi.register(emptyToNull({ ...rest, fullName: rest.fullName.trim(), email: rest.email.trim() }));
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const info = getErrorInfo(err);
      setError(info.message);
      setFieldErrors(info.fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      title="Create your account"
      subtitle="It takes less than a minute to get started."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="row gx-3">
          <div className="col-md-6">
            <Field label="Full name" error={fieldErrors.fullName}>
              <input className={cls('fullName')} name="fullName" placeholder="Ravi Kumar" value={form.fullName} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Email address" error={fieldErrors.email}>
              <input className={cls('email')} type="email" name="email" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Password" error={fieldErrors.password} hint="6 to 50 characters">
              <input className={cls('password')} type="password" name="password" autoComplete="new-password" value={form.password} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Confirm password" error={fieldErrors.confirmPassword}>
              <input className={cls('confirmPassword')} type="password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Phone (optional)" error={fieldErrors.phone} hint="10 digits">
              <input className={cls('phone')} name="phone" inputMode="numeric" maxLength={10} placeholder="9876543210" value={form.phone} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Gender (optional)" error={fieldErrors.gender}>
              <select className="select" name="gender" value={form.gender} onChange={onChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Date of birth (optional)" error={fieldErrors.dateOfBirth}>
              <input className={cls('dateOfBirth')} type="date" name="dateOfBirth" max={todayISO(-1)} value={form.dateOfBirth} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Address (optional)" error={fieldErrors.address}>
              <input className={cls('address')} name="address" placeholder="City, State" value={form.address} onChange={onChange} />
            </Field>
          </div>
        </div>

        <button className="button primary block" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}