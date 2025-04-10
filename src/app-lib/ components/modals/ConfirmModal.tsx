const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-background p-8 rounded-xl shadow-2xl w-full max-w-md relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text hover:text-primary transition-colors duration-200 text-2xl font-light"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-text">{title || "Confirmar"}</h2>
        <p className="mb-6 text-text/80">{message || "¿Estás seguro de continuar?"}</p>
        <div className="flex gap-4 justify-end">
          <button
            className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-text font-medium transition-colors duration-200"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-background font-medium transition-colors duration-200"
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