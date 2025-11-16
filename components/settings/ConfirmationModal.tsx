import React from 'react';
import Button from '../Button';
import { X } from '../icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-sm mb-6">{children}</div>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={onConfirm} className="!bg-red-600 focus:!ring-red-500">{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;