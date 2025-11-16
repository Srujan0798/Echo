import React from 'react';
import { Mic } from '../icons';

interface PromptPlayerProps {
  prompt: string;
  isVibeHook?: boolean;
  answerText?: string;
}

const PromptPlayer: React.FC<PromptPlayerProps> = ({ prompt, isVibeHook = false, answerText }) => {
  return (
    <div className="bg-[#282828] p-4 rounded-lg">
      <p className="text-[#B3B3B3] text-sm mb-3 font-semibold">{prompt}</p>
      <div className="flex items-center gap-3">
        <button className="bg-[#FF6B6B] rounded-full p-2">
          <Mic className="h-5 w-5 text-white" />
        </button>
        <div className="w-full h-1 bg-gray-600 rounded-full"></div>
        <span className="text-xs text-[#B3B3B3]">{isVibeHook ? '0:15' : '0:30'}</span>
      </div>
      {answerText && (
        <p className="text-white mt-3 pt-3 border-t border-white/10 italic">
          "{answerText}"
        </p>
      )}
    </div>
  );
};

export default PromptPlayer;