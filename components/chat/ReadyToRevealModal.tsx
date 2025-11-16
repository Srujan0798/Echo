import React from 'react';
import Button from '../Button';
import { X } from '../icons';

interface ReadyToRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ReadyToRevealModal: React.FC<ReadyToRevealModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Ready to Reveal?</h2>
        <p className="text-sm text-[#B3B3B3] mb-6">This will let your match know you're ready to see each other's full profiles. This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="secondary">Not Yet</Button>
          <Button onClick={onConfirm}>Yes, I'm Ready</Button>
        </div>
      </div>
    </div>
  );
};

export default ReadyToRevealModal;