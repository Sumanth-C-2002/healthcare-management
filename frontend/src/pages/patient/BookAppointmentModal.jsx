import { useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { patientApi } from '../../api/services.js';
import Field from '../../components/Field.jsx';
import Modal from '../../components/Modal.jsx';
import { formatCurrency, initials, todayISO } from '../../utils/format.js';

export default function BookAppointmentModal({ doctor, onClose, onBooked }) {
  const [form, setForm] = useState({ appointmentDate: '', appointmentTime: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cls = (name) => `input ${fieldErrors[name] ? 'invalid' : ''}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await patientApi.bookAppointment({
        doctorId: doctor.id,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason.trim(),
      });
      onBooked();
    } catch (err) {
      const info = getErrorInfo(err);
      setError(info.message);
      setFieldErrors(info.fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Book an appointment"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="book-form" className="button primary" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Booking...' : 'Confirm booking'}
          </button>
        </>
      }
    >
      <div className="dialog-doctor">
        <div className="avatar">{initials(doctor.fullName)}</div>
        <div>
          <div className="fw-bold">{doctor.fullName}</div>
          <div className="small muted">
            {doctor.specialization} · {formatCurrency(doctor.consultationFee)}
          </div>
        </div>
      </div>

      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}

      <form id="book-form" onSubmit={onSubmit}>
        <div className="row gx-3">
          <div className="col-sm-6">
            <Field label="Date" error={fieldErrors.appointmentDate}>
              <input className={cls('appointmentDate')} type="date" name="appointmentDate" min={todayISO()} value={form.appointmentDate} onChange={onChange} required />
            </Field>
          </div>
          <div className="col-sm-6">
            <Field label="Time" error={fieldErrors.appointmentTime}>
              <input className={cls('appointmentTime')} type="time" name="appointmentTime" value={form.appointmentTime} onChange={onChange} required />
            </Field>
          </div>
        </div>
        <Field label="Reason for visit" error={fieldErrors.reason} hint="A short description helps the doctor prepare">
          <textarea className={`textarea ${fieldErrors.reason ? 'invalid' : ''}`} name="reason" maxLength={255} placeholder="For example: chest pain and tiredness" value={form.reason} onChange={onChange} required />
        </Field>
      </form>
    </Modal>
  );
}