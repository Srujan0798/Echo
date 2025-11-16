import React, { useRef, useState, useEffect } from 'react';
import { DiscoveryProfile } from '../../types';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import AudioWaveform from './AudioWaveform';
import { Heart, X, Info } from '../icons';

interface ProfileCardProps {
  profile: DiscoveryProfile;
  onLike: (profile: DiscoveryProfile) => void;
  onPass: (profile: DiscoveryProfile) => void;
  onViewProfile: (profile: DiscoveryProfile) => void;
  onCardDoubleTap: (profile: DiscoveryProfile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike, onPass, onViewProfile, onCardDoubleTap }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(isVisible);
  }, [isVisible]);
  
  // Double tap detection
  const lastTap = useRef(0);
  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { // 300ms threshold for double tap
      onCardDoubleTap(profile);
    }
    lastTap.current = now;
  };

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      className={`relative h-full w-full flex-shrink-0 snap-center overflow-hidden ${profile.vibeGraphic}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
        
        <button 
          onClick={() => onViewProfile(profile)} 
          className="absolute top-4 right-4 bg-black/30 rounded-full p-2.5 backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="View full profile"
        >
          <Info size={24} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold drop-shadow-lg">{profile.name}, {profile.age}</h1>
          <p className="text-lg font-medium text-gray-200 drop-shadow-md mb-4">{profile.distance} miles away</p>
          
          <div className="flex items-center gap-3 w-full">
            <button onClick={() => setIsPlaying(!isPlaying)} className="flex-shrink-0">
               <AudioWaveform isPlaying={isPlaying} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-6 flex justify-between items-center">
          <button 
            onClick={() => onPass(profile)}
            className="bg-white/20 border-2 border-white rounded-full p-5 shadow-lg backdrop-blur-sm transform transition-transform hover:scale-110"
            aria-label="Pass on profile"
          >
            <X size={40} className="text-white" />
          </button>
          <button 
            onClick={() => onLike(profile)}
            className="bg-[#FF6B6B] rounded-full p-5 shadow-lg transform transition-transform hover:scale-110"
            aria-label="Like profile"
          >
            <Heart size={40} className="text-white" fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
