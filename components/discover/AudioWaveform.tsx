
import React from 'react';
import { Play } from '../icons';

interface AudioWaveformProps {
  isPlaying: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying }) => {
  const bars = Array.from({ length: 15 });

  return (
    <div className="flex items-center gap-2">
       <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
          <Play size={24} className={`text-white transition-opacity ${isPlaying ? 'opacity-50' : 'opacity-100'}`} />
       </div>
       <div className="flex items-center justify-center h-10 w-24">
        {bars.map((_, i) => (
          <div
            key={i}
            className="w-1 bg-[#FF6B6B] rounded-full mx-0.5 transition-all duration-300 ease-in-out"
            style={{
              height: isPlaying ? `${Math.random() * 60 + 25}%` : '20%',
              animation: isPlaying ? `wave 1.${i % 5}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;