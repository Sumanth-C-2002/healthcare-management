const pad = (n) => String(n).padStart(2, '0');

export function toISODate(value) {
  if (!value) return '';
  if (Array.isArray(value)) return `${value[0]}-${pad(value[1])}-${pad(value[2])}`;
  return String(value).slice(0, 10);
}

export function toHHMM(value) {
  if (!value) return '';
  if (Array.isArray(value)) return `${pad(value[0])}:${pad(value[1])}`;
  return String(value).slice(0, 5);
}

export function formatDate(value) {
  const iso = toISODate(value);
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(value) {
  const hhmm = toHHMM(value);
  if (!hhmm) return '—';
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function dayAndMonth(value) {
  const iso = toISODate(value);
  if (!iso) return { day: '--', month: '---' };
  const [y, m, d] = iso.split('-').map(Number);
  return { day: pad(d), month: new Date(y, m - 1, d).toLocaleDateString('en-IN', { month: 'short' }) };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function initials(name = '') {
  const parts = name.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function sortKey(appt) {
  return `${toISODate(appt.appointmentDate)}T${toHHMM(appt.appointmentTime)}`;
}

export function statusLabel(status) {
  return status ? status.charAt(0) + status.slice(1).toLowerCase() : '';
}

/** Our backend validates "" as a bad value, so optional empty fields must be sent as null. */
export function emptyToNull(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' && value.trim() === '' ? null : value])
  );
}

export function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}