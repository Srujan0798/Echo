
import React from 'react';
import { Play, Mic } from '../icons';

interface VoiceMessagePlayerProps {
  isUser: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ isUser }) => {
  const bars = Array.from({ length: 15 });

  return (
    <div className="flex items-center gap-2">
      <button className={`p-2 rounded-full ${isUser ? 'bg-white/25' : 'bg-[#FF6B6B]'}`}>
        <Play size={16} className="text-white" />
      </button>
      <div className="flex items-center h-6 w-24">
        {bars.map((_, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full mx-px ${isUser ? 'bg-white/70' : 'bg-gray-400'}`}
            style={{ height: `${Math.random() * 70 + 30}%` }}
          />
        ))}
      </div>
      <span className="text-xs text-white/80">0:07</span>
    </div>
  );
};

export default VoiceMessagePlayer;