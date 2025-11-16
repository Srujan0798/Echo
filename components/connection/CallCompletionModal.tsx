
import React from 'react';
import Button from '../Button';
import { Heart, X } from '../icons';

interface CallCompletionModalProps {
  isOpen: boolean;
  onDecision: (decision: 'CONTINUE' | 'NO_CONNECTION') => void;
}

const CallCompletionModal: React.FC<CallCompletionModalProps> = ({ isOpen, onDecision }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg w-full max-w-sm p-6 shadow-xl text-center animate-scaleIn">
        <h2 className="text-2xl font-bold text-white mb-2">How was your conversation?</h2>
        <p className="text-sm text-[#B3B3B3] mb-8">Decide if you'd like to continue the connection and unlock chat.</p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => onDecision('CONTINUE')} 
            className="!bg-green-600 focus:!ring-green-500"
            icon={<Heart size={20} />}
          >
            Continue the Vibe
          </Button>
          <Button 
            onClick={() => onDecision('NO_CONNECTION')} 
            variant="secondary"
            icon={<X size={20} />}
          >
            No Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallCompletionModal;