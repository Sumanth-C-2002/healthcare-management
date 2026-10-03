import { statusLabel } from '../utils/format.js';

const TONES = {
  PENDING: 'warning',
  APPROVED: 'info',
  COMPLETED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  BLOCKED: 'danger',
};

export default function StatusChip({ status }) {
  return <span className={`chip ${TONES[status] || 'neutral'}`}>{statusLabel(status)}</span>;
}