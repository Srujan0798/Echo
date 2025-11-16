
import React from 'react';
import Button from '../Button';
import { MicOff, X } from '../icons';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl relative text-center animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <MicOff className="h-12 w-12 text-[#FF6B6B] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">Microphone Access Denied</h2>
        <p className="text-sm text-[#B3B3B3] mb-6">
          ECHO needs microphone access to record your voice. Please enable it in your browser's site settings to continue.
        </p>
        <Button onClick={onClose} variant="secondary">Got It</Button>
      </div>
    </div>
  );
};

export default PermissionModal;