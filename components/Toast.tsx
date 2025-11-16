
import React, { useState, useEffect } from 'react';
import { Check } from './icons';

interface ToastProps {
  message: string;
  show: boolean;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div className="flex items-center gap-3 bg-[#282828] text-white px-4 py-2 rounded-full shadow-lg border border-white/20">
        <Check className="h-5 w-5 text-green-400" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;