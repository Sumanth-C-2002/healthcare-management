import { useState } from 'react';
import { getErrorInfo } from '../../api/client.js';
import { adminApi } from '../../api/services.js';
import Field from '../../components/Field.jsx';
import Modal from '../../components/Modal.jsx';
import { formatDate } from '../../utils/format.js';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['pdf', 'png', 'jpg', 'jpeg'];

export default function AddRecordModal({ eligible, onClose, onSaved }) {
  const [form, setForm] = useState({ appointmentId: '', diagnosis: '', prescription: '' });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    const picked = e.target.files[0] || null;
    setFileError('');
    if (picked) {
      const extension = picked.name.split('.').pop().toLowerCase();
      if (!ALLOWED.includes(extension)) {
        setFileError('Only PDF, PNG, JPG and JPEG files are allowed');
        e.target.value = '';
        setFile(null);
        return;
      }
      if (picked.size > MAX_BYTES) {
        setFileError('File is too large. Maximum size is 5 MB');
        e.target.value = '';
        setFile(null);
        return;
      }
    }
    setFile(picked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = new FormData();
      body.append('appointmentId', form.appointmentId);
      body.append('diagnosis', form.diagnosis.trim());
      if (form.prescription.trim()) body.append('prescription', form.prescription.trim());
      if (file) body.append('file', file);
      const res = await adminApi.addRecord(body);
      onSaved(res.data.message);
    } catch (err) {
      setError(getErrorInfo(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      wide
      title="Add medical record"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="record-form" className="button primary" disabled={saving || eligible.length === 0}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Saving...' : 'Save record'}
          </button>
        </>
      }
    >
      {eligible.length === 0 && (
        <div className="notice info">
          <i className="bi bi-info-circle-fill" />
          <span>No appointments are ready for a record. Approve an appointment first, or all approved ones already have a record.</span>
        </div>
      )}
      {error && (
        <div className="notice danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}

      <form id="record-form" onSubmit={onSubmit}>
        <Field label="Appointment">
          <select className="select" name="appointmentId" value={form.appointmentId} onChange={onChange} required>
            <option value="">Select an appointment</option>
            {eligible.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} · {a.patientName} with {a.doctorName} · {formatDate(a.appointmentDate)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Diagnosis">
          <input className="input" name="diagnosis" maxLength={255} placeholder="For example: Viral fever" value={form.diagnosis} onChange={onChange} required />
        </Field>
        <Field label="Prescription and advice (optional)">
          <textarea className="textarea" name="prescription" placeholder="Medicines, dosage and advice" value={form.prescription} onChange={onChange} />
        </Field>
        <Field label="Report file (optional)" error={fileError} hint="PDF, PNG, JPG or JPEG, up to 5 MB">
          <input className={`input ${fileError ? 'invalid' : ''}`} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onFileChange} />
        </Field>
      </form>
    </Modal>
  );
}