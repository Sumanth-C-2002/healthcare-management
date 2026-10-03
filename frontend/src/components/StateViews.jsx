export function PageLoader({ rows = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="skeleton" style={{ height: 30, width: 240, marginBottom: 22 }} />
      <div className="row g-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="col-md-6 col-xl-3" key={i}>
            <div className="skeleton" style={{ height: 96 }} />
          </div>
        ))}
      </div>
      <div className="skeleton" style={{ height: 220, marginTop: 20 }} />
    </div>
  );
}

export function EmptyState({ icon = 'bi-inbox', title, text, action }) {
  return (
    <div className="panel empty">
      <div className="empty-icon">
        <i className={`bi ${icon}`} />
      </div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="panel empty">
      <div className="empty-icon danger">
        <i className="bi bi-exclamation-triangle" />
      </div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="button primary" onClick={onRetry}>
          <i className="bi bi-arrow-repeat" /> Try again
        </button>
      )}
    </div>
  );
}