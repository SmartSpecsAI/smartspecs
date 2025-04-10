const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded shadow-md w-3/4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{title || "Confirmar"}</h2>
        <p className="mb-4">{message || "¿Estás seguro de continuar?"}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="bg-gray-300 text-text px-4 py-2 rounded"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="bg-primary text-background px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
            }}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 