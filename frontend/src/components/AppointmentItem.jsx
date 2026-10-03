import StatusChip from './StatusChip.jsx';
import { dayAndMonth, formatTime } from '../utils/format.js';

export default function AppointmentItem({ appt, onCancel }) {
  const { day, month } = dayAndMonth(appt.appointmentDate);
  const cancellable = ['PENDING', 'APPROVED'].includes(appt.status);

  return (
    <div className="panel appt">
      <div className="date-block">
        <div className="day">{day}</div>
        <div className="mon">{month}</div>
      </div>
      <div className="appt-main">
        <div className="appt-title">{appt.doctorName}</div>
        <div className="appt-sub">
          {appt.specialization} · {formatTime(appt.appointmentTime)}
        </div>
        {appt.reason && <div className="appt-sub">Reason: {appt.reason}</div>}
        {appt.adminRemarks && (
          <div className="remark">
            <strong>Note from clinic:</strong> {appt.adminRemarks}
          </div>
        )}
      </div>
      <div className="appt-side">
        <StatusChip status={appt.status} />
        {onCancel && cancellable && (
          <button className="button danger sm" onClick={() => onCancel(appt)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}