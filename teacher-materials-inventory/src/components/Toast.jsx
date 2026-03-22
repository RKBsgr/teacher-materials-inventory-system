
export default function Toast({ message, type = 'info', onClose }) {
  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <span>{message}</span>
      <span className="toast-close">×</span>
    </div>
  );
}

