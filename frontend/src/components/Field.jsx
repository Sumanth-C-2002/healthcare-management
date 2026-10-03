export default function Field({ label, error, hint, children }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && (
        <span className="error-text" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}