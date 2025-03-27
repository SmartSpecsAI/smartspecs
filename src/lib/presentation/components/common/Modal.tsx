import React from "react";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/10 bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-background p-6 rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="text-primary absolute top-3 right-3 text-2xl hover:text-primary/80"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 