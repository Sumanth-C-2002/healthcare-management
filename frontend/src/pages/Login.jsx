import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorInfo } from '../api/client.js';
import { authApi } from '../api/services.js';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const { data } = await authApi.login({ email: form.email.trim(), password: form.password });
      login(data);
      toast.success(`Welcome back, ${data.fullName}`);
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/patient/dashboard', { replace: true });
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
      title="Welcome back"
      subtitle="Sign in to manage your appointments and records."
      footer={
        <>
          New to Sanora? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {location.state?.registered && (
        <div className="notice success">
          <i className="bi bi-check-circle-fill" />
          <span>Account created successfully. Please sign in.</span>
        </div>
      )}
      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <Field label="Email address" error={fieldErrors.email}>
          <input
            className={`input ${fieldErrors.email ? 'invalid' : ''}`}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </Field>

        <Field label="Password" error={fieldErrors.password}>
          <div className="input-wrap">
            <input
              className={`input ${fieldErrors.password ? 'invalid' : ''}`}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
        </Field>

        <button className="button primary block" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}