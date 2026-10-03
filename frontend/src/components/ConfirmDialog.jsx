import Modal from './Modal.jsx';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="button ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={`button ${danger ? 'danger-solid' : 'primary'}`} onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </Modal>
  );
}