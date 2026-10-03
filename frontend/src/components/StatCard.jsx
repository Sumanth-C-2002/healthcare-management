import { Link } from 'react-router-dom';

export default function StatCard({ icon, label, value, tone = 'primary', to }) {
  const body = (
    <>
      <div className={`stat-icon ${tone}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </>
  );
  return to ? (
    <Link to={to} className="stat">
      {body}
    </Link>
  ) : (
    <div className="stat">{body}</div>
  );
}