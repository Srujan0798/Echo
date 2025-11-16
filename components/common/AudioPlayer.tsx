import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const bars = Array.from({ length: 20 });

    return (
        <div className="bg-[#282828] p-3 rounded-lg">
            <p className="text-sm text-[#B3B3B3] mb-2 font-semibold">{title}</p>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)} 
                    className="flex-shrink-0 bg-[#FF6B6B] text-white rounded-full p-2"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <div className="flex items-center h-8 w-full">
                    {bars.map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-gray-500 rounded-full mx-0.5"
                            style={{
                                height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                                animation: isPlaying ? `wave 1.${i % 5}s ease-in-out infinite alternate` : 'none',
                            }}
                        />
                    ))}
                </div>
                <span className="text-xs text-[#B3B3B3]">0:30</span>
            </div>
        </div>
    );
};

export default AudioPlayer;
