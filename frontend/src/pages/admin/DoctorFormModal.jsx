import { useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { adminApi } from '../../api/services.js';
import Field from '../../components/Field.jsx';
import Modal from '../../components/Modal.jsx';
import { emptyToNull } from '../../utils/format.js';

const toNumberOrNull = (value) => (String(value).trim() === '' ? null : Number(value));

export default function DoctorFormModal({ doctor, onClose, onSaved }) {
  const editing = Boolean(doctor);
  const [form, setForm] = useState({
    fullName: doctor?.fullName ?? '',
    email: doctor?.email ?? '',
    phone: doctor?.phone ?? '',
    specialization: doctor?.specialization ?? '',
    qualification: doctor?.qualification ?? '',
    experienceYears: doctor?.experienceYears ?? '',
    consultationFee: doctor?.consultationFee ?? '',
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
      const text = emptyToNull({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        specialization: form.specialization.trim(),
        qualification: form.qualification,
      });
      const payload = {
        ...text,
        experienceYears: toNumberOrNull(form.experienceYears),
        consultationFee: toNumberOrNull(form.consultationFee),
      };
      const res = editing ? await adminApi.updateDoctor(doctor.id, payload) : await adminApi.addDoctor(payload);
      onSaved(res.data.message);
    } catch (err) {
      const info = getErrorInfo(err);
      setError(info.message);
      setFieldErrors(info.fields);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      wide
      title={editing ? 'Edit doctor' : 'Add a new doctor'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="doctor-form" className="button primary" disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Add doctor'}
          </button>
        </>
      }
    >
      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}
      <form id="doctor-form" onSubmit={onSubmit} noValidate>
        <div className="row gx-3">
          <div className="col-md-6">
            <Field label="Full name" error={fieldErrors.fullName}>
              <input className={cls('fullName')} name="fullName" placeholder="Dr. Meera Sharma" value={form.fullName} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Email" error={fieldErrors.email}>
              <input className={cls('email')} type="email" name="email" placeholder="doctor@hospital.com" value={form.email} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Phone (optional)" error={fieldErrors.phone} hint="10 digits">
              <input className={cls('phone')} name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Specialization" error={fieldErrors.specialization}>
              <input className={cls('specialization')} name="specialization" placeholder="Cardiologist" value={form.specialization} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Qualification (optional)" error={fieldErrors.qualification}>
              <input className={cls('qualification')} name="qualification" placeholder="MBBS, MD" value={form.qualification} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-3">
            <Field label="Experience (years)" error={fieldErrors.experienceYears}>
              <input className={cls('experienceYears')} type="number" min="0" max="70" name="experienceYears" value={form.experienceYears} onChange={onChange} />
            </Field>
          </div>
          <div className="col-md-3">
            <Field label="Fee (INR)" error={fieldErrors.consultationFee}>
              <input className={cls('consultationFee')} type="number" min="0" step="0.01" name="consultationFee" value={form.consultationFee} onChange={onChange} />
            </Field>
          </div>
        </div>
      </form>
    </Modal>
  );
}